
import React, { useState, useCallback } from 'react';
import { PhaseProps } from '../../types';
import ActionButton from '../ActionButton';
import LoadingSpinner from '../LoadingSpinner';
import AgentResponseBlock from '../AgentResponseBlock';
import { renderReviewSection, readFileAsText } from '../RenderUtils';
import CollapsibleSection from '../CollapsibleSection';

// Enhanced item renderer for component-specific criteria with interactive elements
const renderComponentSpecificCriterionItem = (item: any, index: number) => {
  return (
    <div
      key={item.componentId || index}
      className="group p-5 rounded-xl shadow-md border border-cyan-300 bg-gradient-to-br from-cyan-50 to-cyan-100 hover:shadow-lg hover:border-cyan-400 transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className="flex items-center justify-between mb-3">
        <h5 className="text-lg font-bold text-cyan-800 flex items-center">
          <div className="w-8 h-8 bg-cyan-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 group-hover:bg-cyan-700 transition-colors">
            {item.componentId}
          </div>
          组件特定标准
        </h5>
        <div className="px-3 py-1 bg-cyan-200 text-cyan-800 rounded-full text-xs font-semibold">
          {item.criteria?.length || 0} 项标准
        </div>
      </div>

      {item.criteria && Array.isArray(item.criteria) && item.criteria.length > 0 ? (
        <div className="space-y-3">
          {item.criteria.map((crit: string, idx: number) => (
            <div
              key={idx}
              className="flex items-start p-3 bg-white rounded-lg border border-cyan-200 hover:border-cyan-300 transition-colors group/item"
            >
              <div className="flex-shrink-0 w-6 h-6 bg-cyan-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 group-hover/item:bg-cyan-600 transition-colors">
                {idx + 1}
              </div>
              <p className="text-sm text-cyan-900 leading-relaxed flex-1">{crit}</p>
              <div className="flex-shrink-0 ml-2 opacity-0 group-hover/item:opacity-100 transition-opacity">
                <svg className="w-4 h-4 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center p-6 bg-white rounded-lg border-2 border-dashed border-cyan-300">
          <div className="text-center">
            <svg className="w-12 h-12 text-cyan-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <p className="text-sm text-cyan-600 font-medium">此组件暂无特定标准</p>
          </div>
        </div>
      )}
    </div>
  );
};


const EvaluationCriteriaPhase: React.FC<PhaseProps> = ({
  appState,
  updateState,
  advancePhase,
  getParsedOutput,
  handleRefineEvaluationCriteria, 
}) => {
  const { 
    isLoading, 
    isRefiningCriteria,
    dataAssessmentOutput, 
    evaluationCriteriaOutput,
    userCriteriaFeedbackText,
    userRubricFile,
  } = appState;
  const parsedOutput = getParsedOutput(evaluationCriteriaOutput);

  const handleFeedbackTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateState({ userCriteriaFeedbackText: e.target.value });
  };

  const handleRubricFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    updateState({ userRubricFile: file });
    if (file) {
        if (file.type.startsWith('text/')) {
            const content = await readFileAsText(file);
            updateState({userRubricFileContent: content});
        } else {
            updateState({userRubricFileContent: `Binary file: ${file.name}, type: ${file.type}. Content not displayed/sent directly.`});
        }
    } else {
        updateState({userRubricFileContent: null});
    }
  };

  // Enhanced quality threshold renderer with visual indicators
  const renderQualityThresholds = (thresholds: any) => {
    const thresholdLevels = [
      {
        key: 'exceptional',
        label: '杰出',
        color: 'emerald',
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-300',
        textColor: 'text-emerald-800',
        iconColor: 'text-emerald-600',
        icon: '🏆'
      },
      {
        key: 'doctoralStandard',
        label: '博士标准',
        color: 'blue',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-300',
        textColor: 'text-blue-800',
        iconColor: 'text-blue-600',
        icon: '🎓'
      },
      {
        key: 'needsImprovement',
        label: '有待改进',
        color: 'amber',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-300',
        textColor: 'text-amber-800',
        iconColor: 'text-amber-600',
        icon: '📈'
      }
    ];

    return (
      <div className="space-y-3 mt-4">
        <div className="flex items-center mb-3">
          <svg className="w-5 h-5 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
          <strong className="text-gray-700 font-semibold">质量阈值标准</strong>
        </div>

        <div className="grid gap-3">
          {thresholdLevels.map((level, idx) => {
            const value = thresholds[level.key];
            if (!value) return null;

            return (
              <div
                key={level.key}
                className={`group relative p-4 rounded-lg border-2 ${level.borderColor} ${level.bgColor} hover:shadow-md transition-all duration-200 hover:-translate-y-0.5`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    <div className={`w-10 h-10 rounded-full bg-white border-2 ${level.borderColor} flex items-center justify-center text-lg group-hover:scale-110 transition-transform`}>
                      {level.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className={`font-bold ${level.textColor} text-sm uppercase tracking-wide`}>
                        {level.label}
                      </h4>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium bg-white ${level.textColor} border ${level.borderColor}`}>
                        等级 {idx + 1}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{value}</p>
                  </div>
                </div>

                {/* Progress indicator */}
                <div className="mt-3 flex items-center">
                  <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                    <div
                      className={`h-2 rounded-full bg-gradient-to-r ${
                        level.key === 'exceptional' ? 'from-emerald-400 to-emerald-600' :
                        level.key === 'doctoralStandard' ? 'from-blue-400 to-blue-600' :
                        'from-amber-400 to-amber-600'
                      }`}
                      style={{ width: `${100 - (idx * 25)}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">
                    {100 - (idx * 25)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderPrimaryCriterionItem = (item: any, index: number) => {
    const weightPercentage = item.weight ? parseFloat(item.weight.toString().replace('%', '')) : 0;

    return (
      <CollapsibleSection
        key={item.criterionName || index}
        title={
          <div className="flex items-center justify-between w-full pr-8">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 shadow-md">
                {index + 1}
              </div>
              <span className="font-bold text-gray-800 text-base">{item.criterionName}</span>
            </div>
            <div className="flex items-center space-x-2">
              {weightPercentage > 0 && (
                <div className="flex items-center bg-blue-100 px-3 py-1 rounded-full">
                  <svg className="w-4 h-4 text-blue-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path>
                  </svg>
                  <span className="text-blue-700 font-semibold text-sm">{item.weight}</span>
                </div>
              )}
            </div>
          </div>
        }
        className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md hover:shadow-lg transition-shadow"
        titleClassName="hover:bg-blue-100/50"
        initiallyOpen={index === 0}
      >
        <div className="space-y-4 text-sm">
          {item.description && (
            <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center mb-2">
                <svg className="w-4 h-4 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <strong className="text-gray-700 font-semibold">标准描述</strong>
              </div>
              <p className="text-gray-700 leading-relaxed">{item.description}</p>
            </div>
          )}

          {item.qualityThresholds && renderQualityThresholds(item.qualityThresholds)}
        </div>
      </CollapsibleSection>
    );
  };
  
  const canRefine = userCriteriaFeedbackText.trim() !== '' || userRubricFile !== null;

  // Enhanced summary renderer for evaluation framework
  const renderEvaluationSummary = (evaluationFramework: any) => {
    const primaryCount = evaluationFramework.primaryCriteria?.length || 0;
    const componentCount = evaluationFramework.componentSpecificCriteria?.length || 0;
    const totalWeight = evaluationFramework.primaryCriteria?.reduce((sum: number, item: any) => {
      const weight = parseFloat(item.weight?.toString().replace('%', '') || '0');
      return sum + weight;
    }, 0) || 0;

    return (
      <div className="mb-8 p-6 bg-gradient-to-r from-indigo-50 via-blue-50 to-cyan-50 rounded-xl border border-blue-200 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-blue-800 flex items-center">
            <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            评估框架概览
          </h3>
          <div className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold shadow-md">
            已建立
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-blue-600">{primaryCount}</p>
                <p className="text-sm text-gray-600">主要标准</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-cyan-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-cyan-600">{componentCount}</p>
                <p className="text-sm text-gray-600">组件标准</p>
              </div>
              <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-green-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-600">{totalWeight.toFixed(0)}%</p>
                <p className="text-sm text-gray-600">总权重</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {totalWeight !== 100 && totalWeight > 0 && (
          <div className="flex items-center p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <svg className="w-5 h-5 text-amber-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
            <span className="text-amber-800 text-sm">
              注意：权重总和为 {totalWeight.toFixed(1)}%，建议调整至100%以确保评估完整性
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {renderReviewSection("回顾：数据评估", dataAssessmentOutput, [{ key: 'overallSufficiency', label: '总体充分性' }])}
      
      {(isLoading && !evaluationCriteriaOutput && !isRefiningCriteria) && (
        <div className="mt-6 p-4 flex items-center justify-center text-blue-600 bg-blue-50 rounded-lg shadow">
          <LoadingSpinner />
          <span className="ml-3 text-md">助手正在建立评估标准...</span>
        </div>
      )}

      {evaluationCriteriaOutput && (
        <>
          {parsedOutput && !parsedOutput.parseError && parsedOutput.output && parsedOutput.output.evaluationFramework ? (
            <div className="space-y-8 my-8">
              {/* Enhanced Summary Section */}
              {renderEvaluationSummary(parsedOutput.output.evaluationFramework)}

              {/* Enhanced Primary Criteria Section */}
              {parsedOutput.output.evaluationFramework.primaryCriteria && Array.isArray(parsedOutput.output.evaluationFramework.primaryCriteria) ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold mr-4 shadow-lg">
                        📋
                      </div>
                      主要评估标准
                    </h3>
                    <div className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                      {parsedOutput.output.evaluationFramework.primaryCriteria.length} 项标准
                    </div>
                  </div>
                  <div className="space-y-4">
                    {parsedOutput.output.evaluationFramework.primaryCriteria.map(renderPrimaryCriterionItem)}
                  </div>
                </div>
              ) : (
                <div className="p-8 bg-red-50 border border-red-200 rounded-xl text-center">
                  <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <p className="text-red-700 font-semibold">主要评估标准格式不正确或为空</p>
                </div>
              )}

              {/* Enhanced Component-Specific Criteria Section */}
              {parsedOutput.output.evaluationFramework.componentSpecificCriteria ? (
                Array.isArray(parsedOutput.output.evaluationFramework.componentSpecificCriteria) && parsedOutput.output.evaluationFramework.componentSpecificCriteria.length > 0 ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-cyan-600 text-white rounded-full flex items-center justify-center text-lg font-bold mr-4 shadow-lg">
                          🔧
                        </div>
                        特定组件标准
                      </h3>
                      <div className="px-4 py-2 bg-cyan-100 text-cyan-800 rounded-full text-sm font-semibold">
                        {parsedOutput.output.evaluationFramework.componentSpecificCriteria.length} 个组件
                      </div>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                      {parsedOutput.output.evaluationFramework.componentSpecificCriteria.map(renderComponentSpecificCriterionItem)}
                    </div>
                  </div>
                ) : (
                  <div className="p-8 bg-gray-50 border border-gray-200 rounded-xl text-center">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                    </svg>
                    <p className="text-gray-600 font-medium">
                      {(Array.isArray(parsedOutput.output.evaluationFramework.componentSpecificCriteria) && parsedOutput.output.evaluationFramework.componentSpecificCriteria.length === 0) ? "无特定组件标准" : "特定组件标准格式不正确"}
                    </p>
                  </div>
                )
              ) : null}

              {/* Enhanced Alignment Statement */}
              {parsedOutput.output.evaluationFramework.alignmentStatement && (
                <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl shadow-md">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center mr-3">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                      </svg>
                    </div>
                    <h4 className="text-lg font-bold text-purple-800">对齐声明</h4>
                  </div>
                  <p className="text-purple-700 leading-relaxed italic font-medium">
                    {parsedOutput.output.evaluationFramework.alignmentStatement}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <AgentResponseBlock jsonStringContent={evaluationCriteriaOutput} title="助手评估标准：" />
          )}

          {/* User Feedback Section */}
          <div className="mt-8 p-6 border border-amber-300 bg-amber-50 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-amber-800 mb-4">需要调整标准吗？</h3>
            <p className="text-sm text-amber-700 mb-3">您可以提供反馈或上传您自己的评估规范 (Rubric)，助手将尝试整合您的意见以校对标准。</p>
            
            <div>
              <label htmlFor="criteriaFeedbackText" className="block text-md font-medium text-gray-800 mb-1">您的反馈/修改建议：</label>
              <textarea
                id="criteriaFeedbackText"
                value={userCriteriaFeedbackText}
                onChange={handleFeedbackTextChange}
                className="w-full p-3 border border-gray-300 rounded-lg h-28 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-sm"
                placeholder="例如：我认为“创新性”也应作为一个主要标准，权重为15%。对于组件2.1，应更侧重于方法的复现性..."
              />
            </div>

            <div className="mt-4">
              <label htmlFor="rubricFileUpload" className="block text-md font-medium text-gray-800 mb-1">上传评估规范文件 (可选, .txt, .md)：</label>
              <input
                type="file"
                id="rubricFileUpload"
                accept=".txt,.md,text/plain,text/markdown"
                onChange={handleRubricFileChange}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-100 file:text-amber-700 hover:file:bg-amber-200"
              />
              {userRubricFile && <p className="text-xs text-gray-600 mt-1">已选择：{userRubricFile.name}</p>}
            </div>

            {isRefiningCriteria ? (
              <div className="mt-6 p-4 flex items-center justify-center text-amber-600 bg-amber-100 rounded-lg shadow">
                <LoadingSpinner /> <span className="ml-3 text-md">助手正在校对标准...</span>
              </div>
            ) : (
              handleRefineEvaluationCriteria && (
                <ActionButton
                  onClick={handleRefineEvaluationCriteria}
                  disabled={isLoading || !canRefine}
                  className="mt-6 w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white focus:ring-amber-400"
                  variant="primary"
                >
                  提交反馈并请助手校对
                </ActionButton>
              )
            )}
          </div>
        </>
      )}

      {evaluationCriteriaOutput && (
        <ActionButton
          onClick={advancePhase}
          disabled={isLoading || isRefiningCriteria || !evaluationCriteriaOutput}
          className="mt-8 w-full sm:w-auto"
        >
          {(isLoading || isRefiningCriteria) ? <LoadingSpinner /> : "了解标准并继续"}
        </ActionButton>
      )}
    </>
  );
};

export default EvaluationCriteriaPhase;
