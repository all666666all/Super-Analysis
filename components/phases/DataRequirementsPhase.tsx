
import React from 'react';
import { PhaseProps } from '../../types';
import ActionButton from '../ActionButton';
import LoadingSpinner from '../LoadingSpinner';
import AgentResponseBlock from '../AgentResponseBlock';
import { renderSection, renderDataNeedItem, renderDecompositionStructure } from '../RenderUtils';

const DataRequirementsPhase: React.FC<PhaseProps> = ({
  appState,
  advancePhase,
  getParsedOutput,
}) => {
  const { isLoading, decompositionOutput, dataRequirementsOutput } = appState;
  const parsedOutput = getParsedOutput(dataRequirementsOutput);
  const parsedDecompositionReview = getParsedOutput(decompositionOutput);

  return (
    <>
      {parsedDecompositionReview && parsedDecompositionReview.output && parsedDecompositionReview.output.decomposition ? (
        <div className="mb-6 p-4 bg-gray-100 rounded-lg border border-gray-300 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">回顾：问题分解</h3>
          {renderDecompositionStructure(parsedDecompositionReview.output.decomposition)}
        </div>
      ) : decompositionOutput && (
        <AgentResponseBlock jsonStringContent={decompositionOutput} title="回顾：问题分解 (原始JSON)" />
      )}

      {isLoading && !dataRequirementsOutput && (
        <div className="mt-6 p-4 flex items-center justify-center text-blue-600 bg-blue-50 rounded-lg shadow">
          <LoadingSpinner />
          <span className="ml-3 text-md">助手正在明确数据需求...</span>
        </div>
      )}

      {parsedOutput && !parsedOutput.parseError && parsedOutput.output ? (
        <div className="space-y-4">
          {parsedOutput.output.dataNeeds && (
            <div className="p-4 sm:p-5 rounded-lg shadow border border-gray-200 bg-white">
              <h4 className="text-base sm:text-md font-semibold text-blue-700 mb-3">数据需求详情：</h4>
              <div className="space-y-4">
                {Array.isArray(parsedOutput.output.dataNeeds) ?
                  parsedOutput.output.dataNeeds.map((item: any, index: number) => renderDataNeedItem(item, index)) :
                  <p className="text-gray-500 italic">数据需求格式不正确。</p>
                }
              </div>
            </div>
          )}
          {parsedOutput.output.requestStatement && renderSection("助手请求", <p className="text-blue-800 font-medium whitespace-pre-line">{parsedOutput.output.requestStatement}</p>, "bg-blue-50 border-blue-200")}
        </div>
      ) : (
        dataRequirementsOutput && <AgentResponseBlock jsonStringContent={dataRequirementsOutput} title="助手数据需求：" />
      )}

      {dataRequirementsOutput && (
        <ActionButton
          onClick={advancePhase}
          disabled={isLoading || !dataRequirementsOutput}
          className="mt-8 w-full sm:w-auto"
        >
          {isLoading ? <LoadingSpinner /> : "了解数据需求并继续"}
        </ActionButton>
      )}
    </>
  );
};

export default DataRequirementsPhase;
