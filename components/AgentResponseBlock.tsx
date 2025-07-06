
import React from 'react';

interface AgentResponseBlockProps {
  title?: string;
  jsonStringContent: string; 
}

// Helper component to recursively render JSON
export const JsonRenderer: React.FC<{ data: any }> = ({ data }) => {
  if (typeof data === 'string') {
    return (
      <span className="whitespace-pre-line">
        {data.split('\\n').map((line, i, arr) => (
          <React.Fragment key={i}>
            {line}
            {i < arr.length - 1 && <br />}
          </React.Fragment>
        ))}
      </span>
    );
  }
  if (typeof data === 'number' || typeof data === 'boolean' || data === null) {
    return <span className={`${typeof data === 'number' ? 'text-purple-600' : 'text-pink-600'} font-medium`}>{String(data)}</span>;
  }
  if (Array.isArray(data)) {
    if (data.length === 0) return <em className="text-gray-500"> (空列表)</em>;
    return (
      <ul className="list-disc list-inside pl-4 my-1 space-y-1">
        {data.map((item, index) => (
          <li key={index} className="my-0.5">
            <JsonRenderer data={item} />
          </li>
        ))}
      </ul>
    );
  }
  if (typeof data === 'object' && data !== null) {
    if (Object.keys(data).length === 0) return <em className="text-gray-500"> (空对象)</em>;
    return (
      <div className="pl-1 my-1 rounded-md space-y-1.5"> {/* Removed border-l-2 border-gray-300 */}
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="my-1">
            <strong className="text-blue-600 mr-1.5 capitalize">{key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ')}:</strong>
            <JsonRenderer data={value} />
          </div>
        ))}
      </div>
    );
  }
  return <em className="text-gray-500">N/A</em>;
};

const AgentResponseBlock: React.FC<AgentResponseBlockProps> = ({ title = "助手信息：", jsonStringContent }) => {
  if (!jsonStringContent && typeof jsonStringContent !== 'string') return null;

  let parsedContent: any;
  let parseError = false;
  let originalStringForError = jsonStringContent;

  try {
    parsedContent = JSON.parse(jsonStringContent);
    // Check for our custom parseError structure that might come from App.tsx's getParsedOutput
    if (parsedContent && parsedContent.parseError && typeof parsedContent.originalString === 'string') {
        parseError = true;
        originalStringForError = parsedContent.originalString;
        // We'll display the originalStringForError in the pre tag
    } else if (parsedContent && parsedContent.error && Object.keys(parsedContent).length === 1) {
        // This is a structured error from geminiService, typically handled by App.tsx's main error display.
        // We might not want to render this block if App.tsx already shows it.
        // However, if it's passed explicitly, it means App.tsx wants this block to show it.
        // For now, let it render as it might be a specific error for this block's context.
    }

  } catch (e) {
    parseError = true;
    // The jsonStringContent itself is not valid JSON
    originalStringForError = jsonStringContent;
    // console.error("Failed to parse JSON content in AgentResponseBlock:", e, "Content was:", jsonStringContent);
  }
  
  // If it's a structured error like {error: "message"} from geminiService,
  // and App.tsx is already displaying a global error, we might not need this specific block.
  // However, for flexibility, if it's passed, we render it.
  // App.tsx now has better logic to show its own errors, so this specific check might be less critical here.
  if (parsedContent && typeof parsedContent === 'object' && parsedContent !== null && Object.keys(parsedContent).length === 1 && parsedContent.error) {
     // This is likely a structured error from geminiService.
     // Let's display it cleanly if it's the only content.
     return (
        <div className="mt-6 p-4 sm:p-5 border border-red-300 rounded-lg bg-red-50 shadow-sm">
            <h3 className="text-md sm:text-lg font-semibold mb-3 text-red-700">{title} (错误)</h3>
            <div className="text-red-800 text-sm sm:text-base leading-relaxed font-sans">
                <pre className="whitespace-pre-wrap">{parsedContent.error}</pre>
            </div>
        </div>
     )
  }


  return (
    <div className="mt-6 p-4 sm:p-5 border border-blue-200 rounded-lg bg-blue-50 shadow">
      <h3 className="text-md sm:text-lg font-semibold mb-3 text-blue-700">{title}</h3>
      <div className="text-gray-800 text-sm sm:text-base leading-relaxed font-sans">
        {parseError ? (
             <pre className="whitespace-pre-wrap text-red-600 p-3 bg-red-50 border border-red-200 rounded">解析JSON回应失败。原始数据：<br />{originalStringForError}</pre>
        ) : (
            <JsonRenderer data={parsedContent} />
        )}
      </div>
    </div>
  );
};

export default AgentResponseBlock;
      