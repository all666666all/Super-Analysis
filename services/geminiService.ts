import { GoogleGenAI, GenerateContentResponse, GenerateImagesResponse } from "@google/genai";
import { GEMINI_MODEL_TEXT } from '../constants';

const GEMINI_IMAGE_MODEL = 'imagen-3.0-generate-002';

let ai: GoogleGenAI | null = null;

const getAI = (): GoogleGenAI => {
  if (!ai) {
    const apiKey = import.meta.env.VITE_GOOGLE_AI_API_KEY;
    if (!apiKey) {
      throw new Error("VITE_GOOGLE_AI_API_KEY environment variable not set. Please set it in your .env file.");
    }
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
};

interface GenerateContentParams {
  prompt: string;
  history?: { role: 'user' | 'model'; text: string }[]; 
}

export const geminiService = {
  generateContent: async ({ prompt, history }: GenerateContentParams): Promise<string> => {
    try {
      const genAI = getAI();
      
      const response: GenerateContentResponse = await genAI.models.generateContent({
        model: GEMINI_MODEL_TEXT,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      let jsonStr = response.text.trim();
      const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
      const match = jsonStr.match(fenceRegex);
      if (match && match[2]) {
        jsonStr = match[2].trim();
      }
      return jsonStr;

    } catch (error) {
      console.error('Error calling Gemini API (text):', error);
      if (error instanceof Error) {
        if (error.message.includes('API_KEY_INVALID')) {
            return JSON.stringify({ error: "错误：API 密钥无效。请检查您的 API_KEY 环境变量。" });
        }
        if (error.message.includes('VITE_GOOGLE_AI_API_KEY environment variable not set')) {
            return JSON.stringify({ error: "错误：未设置 VITE_GOOGLE_AI_API_KEY 环境变量。请在 .env 文件中进行设置。" });
        }
        if (error.message.includes('fetch_error') || error.message.toLowerCase().includes('network')) {
            return JSON.stringify({ error: `错误：网络问题或 Gemini API 不可用。详情： ${error.message}` });
        }
        if (error.message.toLowerCase().includes('response mime type "application/json" is not supported')) {
            return JSON.stringify({ error: `错误：模型不支持 JSON 输出格式。详情： ${error.message}` });
        }
        if (error.message.toLowerCase().includes('failed to parse a valid json object')) {
            return JSON.stringify({ error: `错误：模型未能生成有效的 JSON。详情： ${error.message}` });
        }
        return JSON.stringify({ error: `生成内容时出错： ${error.message}` });
      }
      return JSON.stringify({ error: '联系 AI 模型时发生未知错误。' });
    }
  },

  generateImage: async (prompt: string): Promise<string | null> => {
    try {
      const genAI = getAI();
      const response: GenerateImagesResponse = await genAI.models.generateImages({
        model: GEMINI_IMAGE_MODEL,
        prompt: prompt,
        config: { numberOfImages: 1, outputMimeType: 'image/png' }, // PNG for icons
      });

      if (response.generatedImages && response.generatedImages.length > 0 && response.generatedImages[0].image?.imageBytes) {
        return `data:image/png;base64,${response.generatedImages[0].image.imageBytes}`;
      }
      console.warn('Image generation succeeded but no image bytes found in response:', response);
      return null;
    } catch (error) {
      console.error('Error calling Gemini API (image):', error);
      // We don't return JSON.stringify({error: ...}) here as this function is expected to return a base64 string or null.
      // The caller (App.tsx) will handle the null case as a failed image generation.
      return null;
    }
  },
};