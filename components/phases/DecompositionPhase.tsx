
import React from 'react';
import { PhaseProps } from '../../types';
import ActionButton from '../ActionButton';
import LoadingSpinner from '../LoadingSpinner';
import AgentResponseBlock from '../AgentResponseBlock';
import { renderSection, renderDecompositionStructure, renderReviewSection } from '../RenderUtils';
import MermaidDiagram from '../MermaidDiagram'; // Import the new component

const DecompositionPhase: React.FC<PhaseProps> = ({
  appState,
  advancePhase,
  getParsedOutput,
}) => {
  const { isLoading, domainClassificationOutput, decompositionOutput } = appState;
  const parsedOutput = getParsedOutput(decompositionOutput);

  return (
    <>
      {renderReviewSection("回顾：助手初步评估", domainClassificationOutput, [
        { key: 'problemRestatement', label: '问题重述' },
        { key: 'identifiedDomain', label: '识别领域' },
        { key: 'problemClassification', label: '问题分类' }
      ])}
      {isLoading && !decompositionOutput && (
        <div className="mt-6 p-4 flex items-center justify-center text-blue-600 bg-blue-50 rounded-lg shadow">
          <LoadingSpinner />
          <span className="ml-3 text-md">助手正在分解问题...</span>
        </div>
      )}

      {parsedOutput && !parsedOutput.parseError && parsedOutput.output ? (
        <div className="space-y-6">
          {parsedOutput.output.decomposition && (
            <div className="p-4 sm:p-5 rounded-lg shadow border border-gray-200 bg-white">
              <h4 className="text-base sm:text-md font-semibold text-blue-700 mb-3">问题分解结构：</h4>
              {renderDecompositionStructure(parsedOutput.output.decomposition)}
            </div>
          )}
          {parsedOutput.output.dependencyGraphMermaid && typeof parsedOutput.output.dependencyGraphMermaid === 'string' ? (
             renderSection("依赖关系图", 
                <MermaidDiagram 
                    chartData={parsedOutput.output.dependencyGraphMermaid} 
                    idSuffix="decomposition"
                />, 
                "bg-white"
            )
          ) : (
            parsedOutput.output.hasOwnProperty('dependencyGraphMermaid') && // Check if key exists, even if value is not string (e.g. empty or wrong type from AI)
            renderSection("依赖关系图", <p className="text-gray-500 italic">未提供有效的依赖关系图数据。</p>)
          )}
          {parsedOutput.output.verificationQuery && renderSection("助手验证", <p className="text-blue-800 font-medium whitespace-pre-line">{parsedOutput.output.verificationQuery}</p>, "bg-blue-50 border-blue-200")}
        </div>
      ) : (
        decompositionOutput && <AgentResponseBlock jsonStringContent={decompositionOutput} title="助手问题分解：" />
      )}

      {decompositionOutput && (
        <ActionButton
          onClick={advancePhase}
          disabled={isLoading || !decompositionOutput}
          className="mt-8 w-full sm:w-auto"
        >
          {isLoading ? <LoadingSpinner /> : "确认分解并继续"}
        </ActionButton>
      )}
    </>
  );
};

export default DecompositionPhase;