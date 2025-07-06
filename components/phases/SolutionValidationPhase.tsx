
import React from 'react';
import { PhaseProps } from '../../types';
import ActionButton from '../ActionButton';
import LoadingSpinner from '../LoadingSpinner';
import AgentResponseBlock from '../AgentResponseBlock';
import { renderSection, renderKeyValue, renderList, renderReviewSection } from '../RenderUtils';

const SolutionValidationPhase: React.FC<PhaseProps> = ({
  appState,
  advancePhase,
  getParsedOutput,
}) => {
  const { isLoading, progressTrackingOutput, finalValidationOutput } = appState;
  const parsedOutput = getParsedOutput(finalValidationOutput);

  return (
    <>
      {renderReviewSection("回顾：进度报告", progressTrackingOutput, [{ key: 'summary', label: '总体摘要' }])}
      {isLoading && !finalValidationOutput && (
        <div className="mt-6 p-4 flex items-center justify-center text-blue-600 bg-blue-50 rounded-lg shadow">
            <LoadingSpinner /> <span className="ml-3 text-md">助手正在执行最终验证...</span>
        </div>
      )}

      {parsedOutput && !parsedOutput.parseError && parsedOutput.output ? (
        <div className="space-y-4">
          {renderKeyValue("验证日期", parsedOutput.output.validationDate)}
          {parsedOutput.output.qualityAssessment && renderSection("质量评估",
            <>
              {renderKeyValue("总体质量", parsedOutput.output.qualityAssessment.overallQuality)}
              {renderKeyValue("主要优势", renderList(parsedOutput.output.qualityAssessment.strengths))}
              {renderKeyValue("待改进区域", renderList(parsedOutput.output.qualityAssessment.areasForImprovement))}
            </>
          )}
          {parsedOutput.output.contributionEvaluation && renderSection("贡献评估",
            <>
              {renderKeyValue("新颖见解", renderList(parsedOutput.output.contributionEvaluation.novelInsights))}
              {renderKeyValue("知识确认", renderList(parsedOutput.output.contributionEvaluation.knowledgeConfirmation))}
            </>
          )}
          {renderSection("局限性说明", renderList(parsedOutput.output.limitations))}
          {renderSection("最终验证声明", <p className="italic font-semibold text-green-700">{parsedOutput.output.finalVerificationStatement}</p>, "bg-green-50 border-green-200")}
        </div>
      ) : (
        finalValidationOutput && <AgentResponseBlock jsonStringContent={finalValidationOutput} title="助手最终解决方案验证：" />
      )}

      {finalValidationOutput && (
        <ActionButton
          onClick={advancePhase}
          disabled={isLoading || !finalValidationOutput}
          className="mt-8 w-full sm:w-auto"
        >
          {isLoading ? <LoadingSpinner /> : "查看验证并完成流程"}
        </ActionButton>
      )}
    </>
  );
};

export default SolutionValidationPhase;
