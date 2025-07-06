import React from 'react';
import { AppState, Phase, PhaseProps, UserProvidedData } from '../../types';
import ActionButton from '../ActionButton';
import AgentResponseBlock from '../AgentResponseBlock';
import { renderSection, renderKeyValue } from '../RenderUtils';


const CompletedPhase: React.FC<PhaseProps> = ({
  appState,
  updateState,
  getParsedOutput,
}) => {
  const { finalValidationOutput } = appState;
  const parsedOutput = getParsedOutput(finalValidationOutput);
  
  const handleStartNewAnalysis = () => {
    updateState({
        currentPhase: Phase.PROBLEM_RECEPTION,
        problemStatement: '',
        domainClassificationOutput: '',
        decompositionOutput: '',
        dataRequirementsOutput: '',
        userDataForAssessment: { textInput: '', files: [], youtubeLinks: [] }, // Reset to new structure
        dataAssessmentOutput: '',
        evaluationCriteriaOutput: '',
        analyticalApproachOutput: '',
        progressTrackingOutput: '',
        finalValidationOutput: '',
        error: null,
        agentHistory: [],
        isRefiningCriteria: false,
        userCriteriaFeedbackText: '',
        userRubricFile: null,
        userRubricFileContent: null,
    });
  };

  return (
    <div className="text-center py-8">
      <h2 className="text-3xl font-bold text-green-600 mb-6">分析流程已完成！</h2>
      {parsedOutput && !parsedOutput.parseError && parsedOutput.output ? (
        <div className="space-y-4 text-left max-w-2xl mx-auto">
          {renderSection("最终验证总结",
            <>
              {renderKeyValue("最终验证声明", <p className="italic font-semibold">{parsedOutput.output.finalVerificationStatement}</p>)}
              {parsedOutput.output.qualityAssessment && renderKeyValue("总体质量", parsedOutput.output.qualityAssessment.overallQuality)}
            </>
            , "bg-green-50 border-green-200")}
        </div>
      ) : (
        finalValidationOutput && <AgentResponseBlock jsonStringContent={finalValidationOutput} title="最终验证总结：" />
      )}
      <p className="mt-8 text-lg text-gray-700">博士级问题分解与分析流程已成功结束。</p>
      <ActionButton
        onClick={handleStartNewAnalysis}
        className="mt-10 w-full sm:w-auto"
        variant="secondary"
      >
        开始新的分析
      </ActionButton>
    </div>
  );
};

export default CompletedPhase;