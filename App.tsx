
import React, { useState, useCallback, useEffect } from 'react';
import { AppState, Phase, PhaseProps, UserProvidedData, Language } from './types';
import { PHASE_ORDER, PHASE_DETAILS, AGENT_PERSONA_PROMPT_PREFIX } from './constants';
import { geminiService } from './services/geminiService';
import PhaseStepper from './components/PhaseStepper';
import LoadingSpinner from './components/LoadingSpinner';
import { getTranslation } from './i18n/translations';

// Import Phase Components
import LanguageSelectionPhase from './components/phases/LanguageSelectionPhase';
import ProblemReceptionPhase from './components/phases/ProblemReceptionPhase';
import DecompositionPhase from './components/phases/DecompositionPhase';
import DataRequirementsPhase from './components/phases/DataRequirementsPhase';
import DataAssessmentPhase from './components/phases/DataAssessmentPhase';
import EvaluationCriteriaPhase from './components/phases/EvaluationCriteriaPhase';
import AnalyticalApproachPhase from './components/phases/AnalyticalApproachPhase';
import ProgressTrackingPhase from './components/phases/ProgressTrackingPhase';
import SolutionValidationPhase from './components/phases/SolutionValidationPhase';
import CompletedPhase from './components/phases/CompletedPhase';
import CheatMenu from './components/CheatMenu';

const App: React.FC = () => {
  // Initialize language from localStorage or default to English
  const getInitialLanguage = (): Language => {
    const saved = localStorage.getItem('selectedLanguage');
    return (saved === Language.CHINESE || saved === Language.ENGLISH) ? saved as Language : Language.ENGLISH;
  };

  const [appState, setAppState] = useState<AppState>({
    currentPhase: Phase.LANGUAGE_SELECTION,
    selectedLanguage: getInitialLanguage(),
    problemStatement: '',
    isLoading: false,
    error: null,
    domainClassificationOutput: '',
    decompositionOutput: '',
    dataRequirementsOutput: '',
    userDataForAssessment: { textInput: '', files: [], youtubeLinks: [] }, // Updated initial state
    dataAssessmentOutput: '',
    evaluationCriteriaOutput: '',
    analyticalApproachOutput: '',
    progressTrackingOutput: '',
    finalValidationOutput: '',
    agentHistory: [],
    isRefiningCriteria: false,
    userCriteriaFeedbackText: '',
    userRubricFile: null,
    userRubricFileContent: null,
  });

  // Sidebar state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const {
    currentPhase,
    problemStatement,
    isLoading,
    error,
    domainClassificationOutput,
    decompositionOutput,
    dataRequirementsOutput,
    userDataForAssessment,
    dataAssessmentOutput,
    evaluationCriteriaOutput,
    analyticalApproachOutput,
    progressTrackingOutput,
    finalValidationOutput,
    isRefiningCriteria,
    userCriteriaFeedbackText,
    userRubricFileContent,
  } = appState;

  const updateState = (updates: Partial<AppState>) => {
    setAppState(prev => ({ ...prev, ...updates }));
  };
  
  const callAgent = useCallback(async (promptContent: string, phaseInstructions: string): Promise<string | null> => {
    // Common loading/error handling logic can be put here for primary calls.
    // Phase-specific loading (like isRefiningCriteria) will be handled separately.
    updateState({ isLoading: true, error: null });

    // Add language instruction to the prompt
    const languageInstruction = appState.selectedLanguage === Language.CHINESE
      ? "\n\nIMPORTANT: Respond in Chinese (中文). All analysis, descriptions, and content should be in Chinese."
      : "\n\nIMPORTANT: Respond in English. All analysis, descriptions, and content should be in English.";

    const fullPrompt = `${AGENT_PERSONA_PROMPT_PREFIX}${languageInstruction}\n\nCURRENT PHASE: ${PHASE_DETAILS[appState.currentPhase].title}\n\n${phaseInstructions}\n\nINPUT DATA:\n${promptContent}\n\nEnsure your entire response is a single, valid JSON object. Do not include any text outside of the JSON structure.`;

    // For very long prompts (e.g. with large file content), consider if Gemini has input limits
    // For now, we assume it's handled or prompts are concise enough.
    const responseText = await geminiService.generateContent({ prompt: fullPrompt });

    try {
      const parsedResponse = JSON.parse(responseText);
      if (parsedResponse.error) {
        updateState({ isLoading: false, error: parsedResponse.error });
        return null;
      }
    } catch (e) {
      const t = getTranslation(appState.selectedLanguage);
      let errorMessage = appState.selectedLanguage === Language.CHINESE
        ? "从助手收到无效的回应格式。"
        : "Invalid response format received from assistant.";
      if (typeof responseText === 'string' && responseText.length < 200) {
          errorMessage += appState.selectedLanguage === Language.CHINESE
            ? ` 原始回应: ${responseText}`
            : ` Raw response: ${responseText}`;
      }
      updateState({ isLoading: false, error: errorMessage });
      return null;
    }
    updateState({ isLoading: false });
    return responseText;
  }, [appState.currentPhase, appState.selectedLanguage]); // Depend on appState.currentPhase and selectedLanguage

  const advancePhase = () => {
    const currentIndex = PHASE_ORDER.indexOf(currentPhase);
    if (currentIndex < PHASE_ORDER.length - 1) {
      updateState({
        currentPhase: PHASE_ORDER[currentIndex + 1],
        error: null,
        // Reset feedback fields when moving from Evaluation Criteria
        ...(currentPhase === Phase.EVALUATION_CRITERIA && {
            userCriteriaFeedbackText: '',
            userRubricFile: null,
            userRubricFileContent: null,
            isRefiningCriteria: false
        })
      });
    } else {
      updateState({ currentPhase: Phase.COMPLETED, error: null });
    }
  };

  // 作弊菜单功能：直接跳转到指定阶段
  const jumpToPhase = (targetPhase: Phase) => {
    updateState({
      currentPhase: targetPhase,
      error: null,
      // 清理相关状态
      userCriteriaFeedbackText: '',
      userRubricFile: null,
      userRubricFileContent: null,
      isRefiningCriteria: false
    });
  };

  // 作弊菜单功能：为指定阶段生成模拟数据
  const generateMockData = (targetPhase: Phase) => {
    const isEnglish = appState.selectedLanguage === Language.ENGLISH;

    const mockData = {
      [Phase.PROBLEM_RECEPTION]: {
        problemStatement: isEnglish
          ? 'How can machine learning technologies improve the accuracy of urban traffic flow prediction and evaluate their actual effectiveness in reducing traffic congestion and environmental pollution?'
          : '如何通过机器学习技术提高城市交通流量预测的准确性，并评估其对减少交通拥堵和环境污染的实际效果？',
        domainClassificationOutput: JSON.stringify({
          "phase": "PROBLEM_RECEPTION",
          "status": "Analysis Complete",
          "output": {
            "problemRestatement": isEnglish
              ? "Research how to apply machine learning algorithms to optimize urban traffic flow prediction models and quantitatively evaluate their practical application effects in alleviating traffic congestion and reducing environmental pollution."
              : "研究如何运用机器学习算法优化城市交通流量预测模型，并量化评估其在缓解交通拥堵和降低环境污染方面的实际应用效果。",
            "identifiedDomain": isEnglish
              ? "Transportation Engineering and Machine Learning Interdisciplinary Field"
              : "交通工程与机器学习交叉学科",
            "problemClassification": isEnglish
              ? ["Predictive Modeling", "Urban Planning", "Environmental Impact Assessment", "Machine Learning Applications"]
              : ["预测建模", "城市规划", "环境影响评估", "机器学习应用"],
            "confirmationQuery": isEnglish
              ? "I have analyzed your problem regarding urban traffic flow prediction. This belongs to the interdisciplinary field of transportation engineering and machine learning, involving predictive modeling, urban planning, and environmental impact assessment. Does this accurately reflect your research problem?"
              : "我已分析您关于城市交通流量预测的问题。这属于交通工程与机器学习的交叉研究领域，涉及预测建模、城市规划和环境影响评估。这是否准确反映了您的研究问题？"
          }
        })
      },
      [Phase.DECOMPOSITION]: {
        decompositionOutput: JSON.stringify({
          "phase": "DECOMPOSITION",
          "status": "Analysis Complete",
          "output": {
            "decomposition": [
              {
                "level": 1,
                "componentId": "1.0",
                "title": isEnglish ? "Machine Learning Prediction Model Development" : "机器学习预测模型开发",
                "description": isEnglish ? "Build and optimize machine learning models for urban traffic flow prediction" : "构建和优化用于城市交通流量预测的机器学习模型",
                "subComponents": [
                  {
                    "level": 2,
                    "componentId": "1.1",
                    "title": isEnglish ? "Data Preprocessing and Feature Engineering" : "数据预处理与特征工程",
                    "description": isEnglish ? "Clean traffic data and extract key features" : "清洗交通数据，提取关键特征"
                  },
                  {
                    "level": 2,
                    "componentId": "1.2",
                    "title": isEnglish ? "Model Selection and Training" : "模型选择与训练",
                    "description": isEnglish ? "Compare different algorithms and train optimal models" : "比较不同算法，训练最优模型"
                  }
                ]
              },
              {
                "level": 1,
                "componentId": "2.0",
                "title": isEnglish ? "Prediction Accuracy Assessment" : "预测准确性评估",
                "description": isEnglish ? "Evaluate model prediction performance and accuracy metrics" : "评估模型预测性能和准确性指标",
                "subComponents": [
                  {
                    "level": 2,
                    "componentId": "2.1",
                    "title": isEnglish ? "Performance Metrics Calculation" : "性能指标计算",
                    "description": isEnglish ? "Calculate evaluation metrics such as RMSE, MAE" : "计算RMSE、MAE等评估指标"
                  },
                  {
                    "level": 2,
                    "componentId": "2.2",
                    "title": isEnglish ? "Baseline Model Comparison" : "基准模型对比",
                    "description": isEnglish ? "Comparative analysis with traditional methods" : "与传统方法进行对比分析"
                  }
                ]
              }
            ],
            "dependencyGraphMermaid": isEnglish
              ? "graph TD; c1_0[\"ML Model Development\"] --> c1_1[\"Data Preprocessing\"] ; c1_0 --> c1_2[\"Model Training\"] ; c2_0[\"Accuracy Assessment\"] ; c1_2 --> c2_0 ; c2_0 --> c2_1[\"Metrics Calculation\"] ; c2_0 --> c2_2[\"Baseline Comparison\"] ;"
              : "graph TD; c1_0[\"机器学习预测模型开发\"] --> c1_1[\"数据预处理与特征工程\"] ; c1_0 --> c1_2[\"模型选择与训练\"] ; c2_0[\"预测准确性评估\"] ; c1_2 --> c2_0 ; c2_0 --> c2_1[\"性能指标计算\"] ; c2_0 --> c2_2[\"基准模型对比\"] ;",
            "verificationQuery": isEnglish
              ? "I have decomposed your problem into 2 primary components and 4 secondary components, following a top-down hierarchical approach. Does this decomposition align with your understanding of the problem scope?"
              : "我已将您的问题分解为2个主要组件和4个子组件，遵循自上而下的层次化方法。这种分解是否符合您对问题范围的理解？"
          }
        })
      }
    };

    // 根据目标阶段设置相应的模拟数据
    const updates: Partial<AppState> = { currentPhase: targetPhase };

    if (mockData[targetPhase]) {
      Object.assign(updates, mockData[targetPhase]);
    }

    // 为阶段五生成完整的模拟数据链
    if (targetPhase === Phase.EVALUATION_CRITERIA) {
      Object.assign(updates, {
        problemStatement: isEnglish
          ? 'How can machine learning technologies improve the accuracy of urban traffic flow prediction and evaluate their actual effectiveness in reducing traffic congestion and environmental pollution?'
          : '如何通过机器学习技术提高城市交通流量预测的准确性，并评估其对减少交通拥堵和环境污染的实际效果？',
        domainClassificationOutput: mockData[Phase.PROBLEM_RECEPTION]?.domainClassificationOutput || '',
        decompositionOutput: mockData[Phase.DECOMPOSITION]?.decompositionOutput || '',
        dataRequirementsOutput: JSON.stringify({
          "phase": "DATA_REQUIREMENTS",
          "status": "Analysis Complete",
          "output": {
            "dataNeeds": [
              {
                "category": "CRITICAL",
                "dataElement": isEnglish ? "Historical Traffic Flow Data" : "历史交通流量数据",
                "parameters": isEnglish ? "Hourly data, at least 3 years of history, covering major road segments" : "每小时数据，至少3年历史，包含主要路段",
                "sourceGuidance": isEnglish ? "Official data from traffic management departments" : "交通管理部门官方数据",
                "mapsToComponent": ["1.1", "1.2"]
              },
              {
                "category": "IMPORTANT",
                "dataElement": isEnglish ? "Weather Data" : "天气数据",
                "parameters": isEnglish ? "Daily weather conditions, temperature, precipitation" : "每日天气状况，温度，降水量",
                "sourceGuidance": isEnglish ? "Meteorological bureau data" : "气象局数据",
                "mapsToComponent": ["1.1"]
              }
            ]
          }
        }),
        dataAssessmentOutput: JSON.stringify({
          "phase": "DATA_ASSESSMENT",
          "status": "Analysis Complete",
          "output": {
            "assessmentReport": [
              {
                "componentId": "1.1",
                "status": "SUFFICIENT",
                "evaluationNotes": isEnglish ? "Good data quality with adequate coverage" : "数据质量良好，覆盖范围充分",
                "remainingNeeds": []
              }
            ],
            "overallSufficiency": isEnglish ? "Data is sufficient for comprehensive analysis" : "数据充分，可以进行全面分析"
          }
        }),
        progressTrackingOutput: JSON.stringify({
          "phase": "PROGRESS_TRACKING",
          "status": "Analysis Complete",
          "output": {
            "reportDate": new Date().toLocaleDateString(),
            "overallCompletionPercentage": 75,
            "componentStatus": [
              {
                "componentId": "1.0",
                "componentName": isEnglish ? "Machine Learning Model Development" : "机器学习模型开发",
                "status": "IN_PROGRESS",
                "completionPercentage": 80,
                "description": isEnglish ? "Building and optimizing ML models for traffic prediction" : "构建和优化交通预测的机器学习模型",
                "tasks": [
                  { "name": isEnglish ? "Data preprocessing completed" : "数据预处理已完成", "completed": true },
                  { "name": isEnglish ? "Feature engineering in progress" : "特征工程进行中", "completed": false },
                  { "name": isEnglish ? "Model training pending" : "模型训练待处理", "completed": false }
                ],
                "issues": [
                  { "description": isEnglish ? "Need more computational resources for training" : "需要更多计算资源进行训练" }
                ],
                "timeline": [
                  { "title": isEnglish ? "Data collection completed" : "数据收集完成", "date": "2024-01-15", "completed": true },
                  { "title": isEnglish ? "Preprocessing phase" : "预处理阶段", "date": "2024-01-20", "completed": true },
                  { "title": isEnglish ? "Model development" : "模型开发", "date": "2024-01-25", "completed": false }
                ]
              },
              {
                "componentId": "2.0",
                "componentName": isEnglish ? "Prediction Accuracy Assessment" : "预测准确性评估",
                "status": "PENDING",
                "completionPercentage": 30,
                "description": isEnglish ? "Evaluating model performance and accuracy metrics" : "评估模型性能和准确性指标",
                "tasks": [
                  { "name": isEnglish ? "Metrics framework design" : "指标框架设计", "completed": true },
                  { "name": isEnglish ? "Baseline comparison setup" : "基准对比设置", "completed": false }
                ],
                "issues": [],
                "timeline": [
                  { "title": isEnglish ? "Framework design" : "框架设计", "date": "2024-01-10", "completed": true },
                  { "title": isEnglish ? "Implementation phase" : "实施阶段", "date": "2024-02-01", "completed": false }
                ]
              }
            ],
            "nextPriorities": isEnglish ? [
              "Complete feature engineering for ML models",
              "Secure additional computational resources",
              "Begin baseline model comparison setup",
              "Prepare validation dataset"
            ] : [
              "完成机器学习模型的特征工程",
              "获取额外的计算资源",
              "开始基准模型对比设置",
              "准备验证数据集"
            ],
            "summary": isEnglish ?
              "Project is progressing well with 75% overall completion. The ML model development is ahead of schedule at 80% completion, while the accuracy assessment component is at 30% and requires attention. Key priorities include completing feature engineering and securing computational resources for model training." :
              "项目进展良好，总体完成度为75%。机器学习模型开发进度超前，完成度达80%，而准确性评估组件完成度为30%，需要关注。关键优先事项包括完成特征工程和获取模型训练所需的计算资源。"
          }
        })
      });
    }

    updateState(updates);
  };

  const getParsedOutput = (jsonString: string): any | null => {
    if (!jsonString) return null;
    try {
      return JSON.parse(jsonString);
    } catch (e) {
      console.warn("App.tsx: Failed to parse JSON string in getParsedOutput:", e, jsonString);
      return { parseError: true, originalString: jsonString };
    }
  };
  
  // Phase 1: Problem Reception
  // Note: handleProblemSubmit now primarily sets problemStatement; actual AI call triggered by useEffect or button in phase component
  const handleProblemSubmit = useCallback(async () => {
    // If problemStatement is empty, this function call might be from the component's button
    // if (!appState.problemStatement.trim()) {
    //   updateState({ error: "请输入问题描述。" });
    //   return;
    // }

    const phaseInstructions = `
Analyze the user's problem statement.
Generate a JSON object with the following structure:
{
  "phase": "PROBLEM_RECEPTION",
  "status": "Analysis Complete",
  "output": {
    "problemRestatement": "A concise restatement of the core problem provided by the user.",
    "identifiedDomain": "Identify the primary academic discipline(s) (e.g., 'Climate Science and Socioeconomics', 'Theoretical Physics').",
    "problemClassification": ["List", "of", "classification", "tags", "or", "phrases", "(e.g., 'Interdisciplinary impact analysis', 'Empirical study design', 'Theoretical model validation'). Provide as an array of strings."],
    "confirmationQuery": "Formulate a question to the user to confirm your understanding. Example: 'I've analyzed your problem concerning [domain]. It appears to be classified as [problemClassification list]. Does this accurately reflect your problem before I proceed to decomposition?'"
  }
}
Provide ONLY the JSON object as your response.`;
    const response = await callAgent(appState.problemStatement, phaseInstructions);
    if (response) updateState({ domainClassificationOutput: response });
  }, [appState.problemStatement, callAgent, updateState]);

  // Phase 2: Decomposition
  const handleDecompositionRequest = useCallback(async () => {
    const phaseInstructions = `
Based on the initial problem statement and its classification (from previous phase output which contains user's potential edits), decompose the problem.
Generate a JSON object with the following structure:
{
  "phase": "DECOMPOSITION",
  "status": "Analysis Complete",
  "inputSummary": {
    "problemRestatement": "The (potentially user-edited) problem restatement from Phase 1.",
    "identifiedDomain": "The (potentially user-edited) identified domain from Phase 1."
  },
  "output": {
    "decomposition": [
      {
        "level": 1,
        "componentId": "1.0",
        "title": "Major Component A Title",
        "description": "Detailed description of this major component and its scope.",
        "subComponents": [
          { "level": 2, "componentId": "1.1", "title": "Sub-component A1 Title", "description": "Description of sub-component A1." },
          { "level": 2, "componentId": "1.2", "title": "Sub-component A2 Title", "description": "Description of sub-component A2." }
        ]
      }
    ],
    "dependencyGraphMermaid": "A single string representing the dependencies as a Mermaid flowchart. Use 'graph TD;' for Top Down orientation. Node IDs MUST be alphanumeric and unique. For a componentId like '1.2', create a node ID like 'c1_2' (replacing '.' with '_'). Node labels MUST be in quotes, containing ONLY the title (e.g., c1_0[\\"Understanding Claim\\"]). Do NOT include prefixes like '1.0 - ' or 'componentId - ' in the node label text. Example: 'graph TD; c1_0[\\"Title One\\"] --> c1_1[\\"Sub Title One\\"]; c1_0 --> c1_2[\\"Sub Title Two\\"]; c2_0[\\"Another Major\\"]; c1_1 --> c2_0;'. If no dependencies, provide a graph with a single node like 'graph TD; no_dependencies[\\"No Direct Dependencies Identified\\"];'. Ensure the entire Mermaid string is valid.",
    "verificationQuery": "Formulate a question to the user to verify this decomposition. Example: 'I have decomposed your problem into [X] primary components and [Y] secondary components, following a top-down hierarchical approach. Does this decomposition align with your understanding of the problem scope?'"
  }
}
Use the 'output' from the provided 'INPUT DATA (Prior Phase Output - Problem Reception)' which reflects the user-confirmed understanding.
Provide ONLY the JSON object as your response.`;
    // domainClassificationOutput now contains the (potentially user-edited) version.
    const phase1Output = getParsedOutput(domainClassificationOutput);
    const inputData = `User Problem (Original): ${problemStatement}\nPrior Phase Output (Problem Reception - User Reviewed):\n${JSON.stringify(phase1Output?.output, null, 2) || domainClassificationOutput}`;
    const response = await callAgent(inputData, phaseInstructions);
    if (response) updateState({ decompositionOutput: response });
  }, [problemStatement, domainClassificationOutput, callAgent, updateState]);

  // Phase 3: Data Requirements
  const handleDataRequirementsRequest = useCallback(async () => {
    const phaseInstructions = `
For EACH atomic question/sub-component identified in the decomposition (from the previous phase), specify data requirements.
Generate a JSON object with the following structure:
{
  "phase": "DATA_REQUIREMENTS",
  "status": "Analysis Complete",
  "inputSummary": {
    "problemDecomposition": "Reference to the problem decomposition structure."
  },
  "output": {
    "dataNeeds": [
      {
        "category": "CRITICAL | IMPORTANT | USEFUL | OPTIONAL", 
        "dataElement": "Specific data element name or description (e.g., 'Historical temperature records', 'Survey responses on policy perception').",
        "parameters": "Required parameters (e.g., 'Monthly average, 1990-2020, 0.5-degree resolution', 'Likert scale 1-5, N > 200 per community').",
        "sourceGuidance": "Preferred or acceptable source types (e.g., 'Peer-reviewed journals', 'Official government statistics', 'Validated climate models').",
        "mapsToComponent": ["List", "of", "componentId(s)", "from decomposition this data addresses (e.g., '1.1', '2.3')."]
      }
    ],
    "requestStatement": "Formulate a concise statement requesting the user to provide this data. Example: 'To proceed with the analysis, I require the following specific information. Please provide these data elements in a clear, itemized format, with source citations if available, categorizing them by the component they address.'"
  }
}
Use 'category' to classify the importance of each data need. Focus on CRITICAL needs, but also identify IMPORTANT, USEFUL, or OPTIONAL data if relevant.
Use the 'inputSummary' (the decomposition) from 'INPUT DATA (Prior Phase Output)' to inform your response.
Provide ONLY the JSON object as your response.`;
    const inputData = `Prior Phase Output (Decomposition):\n${decompositionOutput}`;
    const response = await callAgent(inputData, phaseInstructions);
    if (response) updateState({ dataRequirementsOutput: response });
  }, [decompositionOutput, callAgent, updateState]);
  
  // Phase 4: Data Assessment
  const handleDataAssessmentRequest = useCallback(async () => {
    const phaseInstructions = `
Evaluate the user-provided data against the previously defined data requirements.
Generate a JSON object with the following structure:
{
  "phase": "DATA_ASSESSMENT",
  "status": "Analysis Complete",
  "inputSummary": {
    "dataRequirements": "Reference to the established data requirements.",
    "userProvidedDataSummary": "A brief summary or reference to the data provided by the user."
  },
  "output": {
    "assessmentReport": [
      {
        "componentId": "Component ID from decomposition (e.g., '1.1')",
        "status": "SUFFICIENT | PARTIALLY_ADDRESSABLE | INSUFFICIENT | NOT_APPLICABLE",
        "evaluationNotes": "Detailed evaluation: completeness, quality, relevance. If partially addressable, specify what's missing or limited. If insufficient, explain why. If not applicable (e.g. data for this component was not requested or not provided), state so.",
        "remainingNeeds": ["List any specific data elements still critically needed for this component, if applicable."]
      }
    ],
    "overallSufficiency": "A summary statement on overall data sufficiency (e.g., 'Most critical data provided, some gaps remain in secondary areas.' or 'Significant data gaps prevent comprehensive analysis of components X, Y.').",
    "nextStepsQuery": "A statement about proceeding or requesting more data. Example: 'Based on this assessment, we can proceed with X, Y. To fully address Z, the following is still required: [list critical missing items]. Shall we proceed with the available data or address these gaps first?'"
  }
}
Use 'dataRequirements' and 'userProvidedDataSummary' from 'INPUT DATA' to inform your response.
Provide ONLY the JSON object as your response.`;

    let providedDataSummary = "User Provided Data:\n";
    if (userDataForAssessment.textInput.trim()) {
      providedDataSummary += `Text Input: "${userDataForAssessment.textInput.trim()}"\n`;
    }
    if (userDataForAssessment.youtubeLinks.length > 0) {
      providedDataSummary += "YouTube Links:\n";
      userDataForAssessment.youtubeLinks.forEach(link => {
        providedDataSummary += `  - ${link}\n`;
      });
    }
    if (userDataForAssessment.files.length > 0) {
      providedDataSummary += "Uploaded Files:\n";
      userDataForAssessment.files.forEach(file => {
        providedDataSummary += `  - Name: ${file.name}, Type: ${file.type}, Size: ${file.size} bytes\n`;
      });
    }
    if (providedDataSummary === "User Provided Data:\n") {
        providedDataSummary += "No data explicitly provided by user for this section beyond what might be in text input.\n";
    }

    const inputData = `Data Requirements (Prior Phase Output):\n${dataRequirementsOutput}\n\n${providedDataSummary}`;
    const response = await callAgent(inputData, phaseInstructions);
    if (response) updateState({ dataAssessmentOutput: response });
  }, [dataRequirementsOutput, userDataForAssessment, callAgent, updateState]);

  // Phase 5: Evaluation Criteria
  const handleEvaluationCriteriaRequest = useCallback(async () => {
    const phaseInstructions = `
Establish doctoral-level evaluation criteria for the solution to the original problem.
Generate a JSON object with the following structure:
{
  "phase": "EVALUATION_CRITERIA",
  "status": "Initial Criteria Generated",
  "inputSummary": {
    "problemDomain": "The identified academic domain from Phase 1.",
    "problemDecomposition": "Reference to the problem decomposition structure."
  },
  "output": {
    "evaluationFramework": {
      "primaryCriteria": [
        {
          "criterionName": "e.g., Rigor of Analysis",
          "description": "How this criterion will be assessed. Detailed breakdown of expectations.",
          "weight": "Conceptual weight (e.g., High, Medium, Low, or percentage like 30%)",
          "qualityThresholds": {
            "exceptional": "Descriptor for exceptional performance that exceeds doctoral standards.",
            "doctoralStandard": "Descriptor for meeting expected doctoral standards.",
            "needsImprovement": "Descriptor for performance below doctoral standards."
          }
        }
      ],
      "componentSpecificCriteria": [
        {
          "componentId": "Component ID from decomposition (e.g., '1.1')",
          "criteria": ["Specific criteria relevant to this component, e.g., 'Accuracy of model for sub-component 1.1 predictions exceeding 90% on test data.'"]
        }
      ],
      "alignmentStatement": "A statement affirming alignment with academic standards. Example: 'This evaluation framework aligns with established academic standards for doctoral research in [identified domain] and ensures a comprehensive assessment of the proposed solution.'",
      "refinementPrompt": "A question for the user inviting feedback or their own rubric. Example: 'These are the initial evaluation criteria. Do you have any specific feedback, or an existing rubric you'd like me to consider for refinement?'"
    }
  }
}
Use 'problemDomain' and 'problemDecomposition' from 'INPUT DATA' to inform your response.
Provide ONLY the JSON object as your response.`;
    const parsedPhase1 = getParsedOutput(domainClassificationOutput);
    const domain = parsedPhase1?.output?.identifiedDomain || "已识别的领域";
    const inputData = `Problem Domain: ${domain}\nProblem Decomposition (Prior Phase Output):\n${decompositionOutput}`;
    const response = await callAgent(inputData, phaseInstructions);
    if (response) updateState({ evaluationCriteriaOutput: response });
  }, [domainClassificationOutput, decompositionOutput, callAgent, updateState]);

  // Phase 5: Refine Evaluation Criteria
  const handleRefineEvaluationCriteria = useCallback(async () => {
    if (!evaluationCriteriaOutput) {
        updateState({ error: "没有原始评估标准可供校对。" });
        return;
    }
    updateState({ isRefiningCriteria: true, error: null });

    const phaseInstructions = `
Based on the original evaluation criteria, user feedback, and an optionally provided user rubric, refine the evaluation criteria.
Generate a JSON object with the following structure, mirroring the original but with integrated revisions:
{
  "phase": "EVALUATION_CRITERIA",
  "status": "Criteria Refined Based on User Input",
  "inputSummary": {
    "originalCriteria": "Reference to the initially generated criteria.",
    "userFeedback": "Summary of user's textual feedback.",
    "userRubricSummary": "Summary/reference to user's uploaded rubric content if provided."
  },
  "output": {
    "evaluationFramework": { 
      // Same structure as initial criteria: primaryCriteria, componentSpecificCriteria, alignmentStatement
      // but with content revised based on user input.
    },
    "refinementSummary": "A brief note on how user feedback was integrated. Example: 'User feedback on adding 'Innovation' as a primary criterion and adjusting weights has been incorporated. The provided rubric's emphasis on 'methodological transparency' has also been integrated into relevant criteria descriptions.'"
  }
}
Carefully consider all inputs and produce a coherently revised set of criteria.
Provide ONLY the JSON object as your response.`;

    let userInputSummary = "User Feedback:\n";
    if (userCriteriaFeedbackText.trim()) {
        userInputSummary += `Textual Feedback: "${userCriteriaFeedbackText.trim()}"\n`;
    } else {
        userInputSummary += "No textual feedback provided.\n";
    }
    if (userRubricFileContent) {
        userInputSummary += `User Rubric Content Summary: "${userRubricFileContent.substring(0, 300)}${userRubricFileContent.length > 300 ? '...' : ''}"\n`;
    } else {
        userInputSummary += "No rubric file content provided.\n";
    }

    const inputData = `Original Evaluation Criteria (JSON):\n${evaluationCriteriaOutput}\n\n${userInputSummary}`;
    const response = await callAgent(inputData, phaseInstructions);
    
    if (response) {
        updateState({ evaluationCriteriaOutput: response, isRefiningCriteria: false }); // Update with refined criteria
    } else {
        updateState({ isRefiningCriteria: false }); // Clear loading even if error (error displayed by callAgent)
    }
  }, [evaluationCriteriaOutput, userCriteriaFeedbackText, userRubricFileContent, callAgent, updateState]);


  // Phase 6: Analytical Approach
  const handleAnalyticalApproachRequest = useCallback(async () => {
    const phaseInstructions = `
Detail the analytical approach to address the problem, considering data assessment and evaluation criteria.
Generate a JSON object with the following structure:
{
  "phase": "ANALYTICAL_APPROACH",
  "status": "Analysis Complete",
  "inputSummary": {
    "dataAssessment": "Summary of data sufficiency.",
    "evaluationCriteria": "Reference to the established evaluation criteria."
  },
  "output": {
    "methodology": [
      {
        "methodName": "e.g., Statistical Modeling (Regression Analysis)",
        "description": "Brief description of the method.",
        "applicationToComponents": ["List", "of", "componentId(s)", "this method applies to (e.g., '2.1', '2.2')."],
        "steps": ["Step 1 details", "Step 2 details", "..."]
      }
    ],
    "analyticalSequence": ["Describe the overall sequence of analysis, e.g., '1. Data preprocessing. 2. Exploratory data analysis. 3. Model building for component X...'"],
    "potentialChallenges": [
      {"challenge": "e.g., multicollinearity in data for component X", "mitigation": "e.g., Use VIF and PCA if necessary."}
    ],
    "alternativeApproaches": [
      {"condition": "e.g., If statistical assumptions for regression are not met for component Y", "alternative": "e.g., Pivot to non-parametric methods like Random Forest."}
    ],
    "rationale": "Justification for the chosen approach in relation to problem, data, and criteria. Example: 'This mixed-methods approach is selected to leverage quantitative insights from available data while qualitatively addressing nuanced aspects of the problem, aligning with the multi-faceted evaluation criteria.'"
  }
}
Use 'dataAssessment' and 'evaluationCriteria' from 'INPUT DATA' to inform your response.
Provide ONLY the JSON object as your response.`;
    const inputData = `Data Assessment (Prior Phase Output):\n${dataAssessmentOutput}\nEvaluation Criteria (Prior Phase Output - Potentially Refined):\n${evaluationCriteriaOutput}`;
    const response = await callAgent(inputData, phaseInstructions);
    if (response) updateState({ analyticalApproachOutput: response });
  }, [dataAssessmentOutput, evaluationCriteriaOutput, callAgent, updateState]);

  // Phase 7: Progress Tracking
  const handleProgressTrackingRequest = useCallback(async () => {
    const phaseInstructions = `
Generate a plausible-sounding progress synthesis report for the ongoing analysis, structured as a JSON object.
The report should follow this JSON structure strictly:
{
  "phase": "PROGRESS_TRACKING",
  "status": "Simulated Report Generated",
  "inputSummary": {
    "problemStatement": "Reference to original problem.",
    "analyticalApproach": "Reference to the defined analytical approach."
  },
  "output": {
    "reportDate": "YYYY-MM-DD (use current date or a plausible recent date)",
    "overallCompletionPercentage": "Estimate, e.g., 65",
    "componentStatus": [
      {
        "componentId": "Component ID or Name (e.g., '1.1 Data Collection')",
        "status": "COMPLETED | IN_PROGRESS | BLOCKED | NOT_STARTED",
        "progressNotes": "e.g., 'Meets doctoral standards with robust data validation.' or 'Analysis ongoing, focusing on outlier detection. Expected completion: YYYY-MM-DD.' or 'Awaiting clarification on data source X.'",
        "blockers": ["List any blockers if status is BLOCKED, otherwise empty array."]
      }
    ],
    "nextPriorities": [
      "Priority 1: e.g., Resolve blockage for Component X.",
      "Priority 2: e.g., Complete analysis of In-Progress Component Y."
    ],
    "summary": "A brief overall summary statement."
  }
}
Use 'problemStatement' and 'analyticalApproach' from 'INPUT DATA' to inform your response.
Provide ONLY the JSON object as your response.`;
    const inputData = `Problem Statement: ${problemStatement}\nAnalytical Approach (Prior Phase Output):\n${analyticalApproachOutput}`;
    const response = await callAgent(inputData, phaseInstructions);
    if (response) updateState({ progressTrackingOutput: response });
  }, [problemStatement, analyticalApproachOutput, callAgent, updateState]);
  
  // Phase 8: Solution Validation
  const handleSolutionValidationRequest = useCallback(async () => {
    const phaseInstructions = `
Assume all analytical components have been completed. Generate a comprehensive final validation report as a JSON object.
The report must follow this JSON structure strictly:
{
  "phase": "SOLUTION_VALIDATION",
  "status": "Final Report Generated",
  "inputSummary": {
    "problemStatement": "Original problem.",
    "entireProcessSummary": "Conceptual reference to all prior phases' outputs."
  },
  "output": {
    "validationDate": "YYYY-MM-DD (current or recent date)",
    "qualityAssessment": {
      "overallQuality": "Specific level on doctoral scale (e.g., 'Doctoral-level with distinction', 'Meets doctoral standards', 'Conditionally meets doctoral standards').",
      "strengths": ["List 1-3 strongest components/aspects of the solution and why."],
      "areasForImprovement": ["List 1-2 areas for improvement if any, or state 'All components robustly meet doctoral standards.'"]
    },
    "contributionEvaluation": {
      "novelInsights": ["Describe 1-2 plausible novel insights derived from the analysis."],
      "knowledgeConfirmation": ["Mention 1-2 plausible confirmations of existing knowledge or theories."]
    },
    "limitations": [
      "e.g., Based on data available up to YYYY-MM-DD.",
      "e.g., Methodological constraint due to scope limited to X context."
    ],
    "finalVerificationStatement": "A concluding statement. Example: 'This solution robustly meets doctoral-level standards for the identified domain of [domain], offering significant insights into [problem area].'"
  }
}
Use 'problemStatement' and a conceptual summary of 'entireProcessSummary' from 'INPUT DATA' to inform your response.
Provide ONLY the JSON object as your response.`;
    const inputData = `Problem: ${problemStatement}\nDecomposition (JSON): ${decompositionOutput}\nData Assessment (JSON): ${dataAssessmentOutput}\nEvaluation Criteria (JSON - Potentially Refined): ${evaluationCriteriaOutput}\nAnalytical Approach (JSON): ${analyticalApproachOutput}\nProgress (JSON - Assume Completed): ${progressTrackingOutput}`;
    const response = await callAgent(inputData, phaseInstructions);
    if (response) updateState({ finalValidationOutput: response });
  }, [problemStatement, decompositionOutput, dataAssessmentOutput, evaluationCriteriaOutput, analyticalApproachOutput, progressTrackingOutput, callAgent, updateState]);
  
  useEffect(() => {
    if (isLoading || isRefiningCriteria) return; 
    const checkAndProceed = (condition: boolean, handler?: () => void) => {
        if (condition && handler) handler();
    };

    // Auto-trigger logic for phase progression where user input is not the primary gate
    if (currentPhase === Phase.DECOMPOSITION && domainClassificationOutput && !decompositionOutput) {
      checkAndProceed(true, handleDecompositionRequest);
    } else if (currentPhase === Phase.DATA_REQUIREMENTS && decompositionOutput && !dataRequirementsOutput) {
      checkAndProceed(true, handleDataRequirementsRequest);
    } 
    // Phase 4 (Data Assessment) is gated by user input, so no auto-trigger from here.
    // Phase 5 (Evaluation Criteria) - Initial criteria generation
    else if (currentPhase === Phase.EVALUATION_CRITERIA && dataAssessmentOutput && !evaluationCriteriaOutput && !isRefiningCriteria) {
       checkAndProceed(true, handleEvaluationCriteriaRequest);
    } 
    // Auto-trigger for subsequent phases
    else if (currentPhase === Phase.ANALYTICAL_APPROACH && evaluationCriteriaOutput && !analyticalApproachOutput) {
       checkAndProceed(true, handleAnalyticalApproachRequest);
    } else if (currentPhase === Phase.PROGRESS_TRACKING && analyticalApproachOutput && !progressTrackingOutput) {
      checkAndProceed(true, handleProgressTrackingRequest);
    } else if (currentPhase === Phase.SOLUTION_VALIDATION && progressTrackingOutput && !finalValidationOutput) {
      checkAndProceed(true, handleSolutionValidationRequest);
    }
  }, [
      currentPhase, domainClassificationOutput, decompositionOutput, dataRequirementsOutput, 
      dataAssessmentOutput, evaluationCriteriaOutput, analyticalApproachOutput, progressTrackingOutput, 
      finalValidationOutput, userDataForAssessment, isLoading, isRefiningCriteria,
      handleDecompositionRequest, handleDataRequirementsRequest, handleEvaluationCriteriaRequest, 
      handleAnalyticalApproachRequest, handleProgressTrackingRequest, handleSolutionValidationRequest
  ]);

  // Helper to check if any user data is provided for Phase 4 trigger logic (used in component)
  // const isUserDataProvided = (data: UserProvidedData): boolean => {
  //   return data.textInput.trim() !== '' || data.files.length > 0 || data.youtubeLinks.length > 0;
  // };

  const phaseProps: PhaseProps = {
    appState,
    updateState,
    callAgent,
    advancePhase,
    getParsedOutput,
    handleProblemSubmit,
    handleDecompositionRequest,
    handleDataRequirementsRequest,
    handleDataAssessmentRequest,
    handleEvaluationCriteriaRequest, // For initial generation
    handleRefineEvaluationCriteria,  // For refinement step
    handleAnalyticalApproachRequest,
    handleProgressTrackingRequest,
    handleSolutionValidationRequest,
  };

  const renderCurrentPhaseComponent = () => {
    switch (currentPhase) {
      case Phase.LANGUAGE_SELECTION:
        return <LanguageSelectionPhase {...phaseProps} />;
      case Phase.PROBLEM_RECEPTION:
        return <ProblemReceptionPhase {...phaseProps} />;
      case Phase.DECOMPOSITION:
        return <DecompositionPhase {...phaseProps} />;
      case Phase.DATA_REQUIREMENTS:
        return <DataRequirementsPhase {...phaseProps} />;
      case Phase.DATA_ASSESSMENT:
        return <DataAssessmentPhase {...phaseProps} />;
      case Phase.EVALUATION_CRITERIA:
        return <EvaluationCriteriaPhase {...phaseProps} />;
      case Phase.ANALYTICAL_APPROACH:
        return <AnalyticalApproachPhase {...phaseProps} />;
      case Phase.PROGRESS_TRACKING:
        return <ProgressTrackingPhase {...phaseProps} />;
      case Phase.SOLUTION_VALIDATION:
        return <SolutionValidationPhase {...phaseProps} />;
      case Phase.COMPLETED:
        return <CompletedPhase {...phaseProps} />;
      default:
        const t = getTranslation(appState.selectedLanguage);
        return <p className="text-gray-700">{appState.selectedLanguage === Language.CHINESE ? '未知阶段。' : 'Unknown phase.'}</p>;
    }
  };

  // Special handling for language selection phase (full screen)
  if (currentPhase === Phase.LANGUAGE_SELECTION) {
    return (
      <>
        {renderCurrentPhaseComponent()}
        {/* 开发者作弊菜单 */}
        <CheatMenu
          currentPhase={currentPhase}
          onJumpToPhase={jumpToPhase}
          onGenerateMockData={generateMockData}
        />
      </>
    );
  }

  const t = getTranslation(appState.selectedLanguage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex">
      {/* Sidebar Navigation */}
      <PhaseStepper
        currentPhase={currentPhase}
        selectedLanguage={appState.selectedLanguage}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarCollapsed ? 'ml-16' : 'ml-80'}`}>
        {/* Material Design App Bar */}
        <header className="bg-white elevation-2 sticky top-0 z-30 border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-lg flex items-center justify-center text-lg shadow-md">
                  🔍
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    Super Analysis
                  </h1>
                  <p className="text-sm text-gray-600">
                    {appState.selectedLanguage === Language.CHINESE ? '系统化分解与分析支持' : 'Systematic Analysis & Decomposition Support'}
                  </p>
                </div>
              </div>

              {/* Language Indicator */}
              <div className="flex items-center space-x-3">
                <div className="px-3 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium elevation-1 hover:elevation-2 transition-all duration-200">
                  <span className="mr-2">{appState.selectedLanguage === Language.CHINESE ? '🇨🇳' : '🇺🇸'}</span>
                  {appState.selectedLanguage === Language.CHINESE ? '中文' : 'English'}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            {/* Phase Header Card */}
            <div className="card-material elevation-2 mb-8 animate-slideInUp">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl flex items-center justify-center text-lg font-bold mr-4 shadow-md">
                    {PHASE_ORDER.indexOf(currentPhase) + 1}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {PHASE_DETAILS[currentPhase].title}
                    </h2>
                    <p className="text-gray-600 mt-1">
                      {PHASE_DETAILS[currentPhase].description}
                    </p>
                  </div>
                </div>

                {/* Phase Progress Indicator */}
                <div className="text-right">
                  <div className="text-sm text-gray-500 mb-1">
                    {appState.selectedLanguage === Language.CHINESE ? '阶段进度' : 'Phase Progress'}
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round(((PHASE_ORDER.indexOf(currentPhase)) / (PHASE_ORDER.length - 1)) * 100)}%
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="progress-material">
                <div
                  className="progress-bar"
                  style={{ width: `${((PHASE_ORDER.indexOf(currentPhase)) / (PHASE_ORDER.length - 1)) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Phase Content */}
            <div className="animate-fadeIn">
              {renderCurrentPhaseComponent()}
            </div>

            {/* Error Display */}
            {error && !isLoading && !isRefiningCriteria && (
              <div role="alert" className="mt-8 card-material elevation-3 border-l-4 border-red-500 bg-red-50 animate-slideInUp">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-red-800 mb-2">
                      {appState.selectedLanguage === Language.CHINESE ? '错误' : 'Error'}
                    </h3>
                    <p className="text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Material Design Footer */}
        <footer className="bg-white border-t border-gray-200 elevation-1 mt-auto">
          <div className="px-6 py-4">
            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center text-gray-600 text-sm">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                {appState.selectedLanguage === Language.CHINESE ? '由 Gemini AI 驱动' : 'Powered by Gemini AI'}
              </div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="flex items-center text-gray-600 text-sm">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                {appState.selectedLanguage === Language.CHINESE ? 'React 构建' : 'Built with React'}
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Enhanced Cheat Menu with Material Design */}
      <CheatMenu
        currentPhase={currentPhase}
        onJumpToPhase={jumpToPhase}
        onGenerateMockData={generateMockData}
      />
    </div>
  );
};

export default App;
