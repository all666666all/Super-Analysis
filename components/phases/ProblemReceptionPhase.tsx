import React, { useState, useEffect } from 'react';
import { PhaseProps } from '../../types';
import ActionButton from '../ActionButton';
import LoadingSpinner from '../LoadingSpinner';
import AgentResponseBlock from '../AgentResponseBlock';

const ProblemReceptionPhase: React.FC<PhaseProps> = ({
  appState,
  updateState,
  advancePhase,
  getParsedOutput,
  handleProblemSubmit,
}) => {
  const { problemStatement, isLoading, domainClassificationOutput } = appState;
  const parsedOutput = getParsedOutput(domainClassificationOutput);

  const [editableProblemRestatement, setEditableProblemRestatement] = useState('');
  const [editableIdentifiedDomain, setEditableIdentifiedDomain] = useState('');
  const [editableProblemClassification, setEditableProblemClassification] = useState<string[]>([]);
  const [newClassificationTag, setNewClassificationTag] = useState('');

  useEffect(() => {
    if (parsedOutput && parsedOutput.output) {
      setEditableProblemRestatement(parsedOutput.output.problemRestatement || '');
      setEditableIdentifiedDomain(parsedOutput.output.identifiedDomain || '');
      setEditableProblemClassification(Array.isArray(parsedOutput.output.problemClassification) ? parsedOutput.output.problemClassification : []);
    }
  }, [domainClassificationOutput]);

  const handleConfirmAndProceed = () => {
    const updatedOutputStructure = {
      phase: "PROBLEM_RECEPTION",
      status: "Analysis Complete - User Reviewed",
      output: {
        problemRestatement: editableProblemRestatement,
        identifiedDomain: editableIdentifiedDomain,
        problemClassification: editableProblemClassification,
        confirmationQuery: parsedOutput?.output?.confirmationQuery || "用户已审核并确认。",
      }
    };
    updateState({ domainClassificationOutput: JSON.stringify(updatedOutputStructure, null, 2) });
    advancePhase();
  };
  
  const handleAddClassificationTag = () => {
    if (newClassificationTag.trim() && !editableProblemClassification.includes(newClassificationTag.trim())) {
      setEditableProblemClassification([...editableProblemClassification, newClassificationTag.trim()]);
      setNewClassificationTag('');
    }
  };

  const handleRemoveClassificationTag = (tagToRemove: string) => {
    setEditableProblemClassification(editableProblemClassification.filter(tag => tag !== tagToRemove));
  };

  return (
    <>
      {!domainClassificationOutput ? (
        <div className="space-y-8">
          {/* Enhanced Problem Input Section */}
          <div className="p-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl border border-blue-200 shadow-lg">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full flex items-center justify-center text-2xl mr-4 shadow-md">
                🤔
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">描述您的研究问题</h3>
                <p className="text-gray-600 mt-1">请详细描述您需要分析的复杂学术问题</p>
              </div>
            </div>
            
            <div className="relative">
              <textarea
                id="problemStatement"
                value={problemStatement}
                onChange={(e) => updateState({ problemStatement: e.target.value })}
                className="w-full p-6 border-2 border-blue-200 rounded-xl h-48 bg-white text-gray-900 placeholder-gray-400 focus:ring-4 focus:ring-blue-300 focus:border-blue-400 shadow-sm transition-all duration-200 resize-none"
                placeholder="例如：研究气候变化对东南亚沿海社区的社会经济影响，重点关注政策响应和适应策略的有效性评估..."
                aria-label="复杂学术问题输入框"
              />
              <div className="absolute bottom-4 right-4 text-sm text-gray-400">
                {problemStatement.length} 字符
              </div>
            </div>
            
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                提示：描述越详细，AI分析越准确
              </div>
              <ActionButton 
                onClick={handleProblemSubmit} 
                disabled={isLoading || !problemStatement.trim()} 
                className="px-8 py-3 text-lg font-semibold"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <LoadingSpinner />
                    <span className="ml-2">AI正在分析...</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                    </svg>
                    提交给AI助手
                  </div>
                )}
              </ActionButton>
            </div>
          </div>
          
          {/* Tips Section */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center mb-2">
                <span className="text-green-600 text-lg mr-2">✅</span>
                <h4 className="font-semibold text-green-800">好的问题示例</h4>
              </div>
              <p className="text-sm text-green-700">包含具体研究对象、时间范围、地理范围和研究目标</p>
            </div>
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center mb-2">
                <span className="text-yellow-600 text-lg mr-2">💡</span>
                <h4 className="font-semibold text-yellow-800">建议包含</h4>
              </div>
              <p className="text-sm text-yellow-700">研究背景、预期成果、方法偏好和约束条件</p>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center mb-2">
                <span className="text-blue-600 text-lg mr-2">🎯</span>
                <h4 className="font-semibold text-blue-800">分析深度</h4>
              </div>
              <p className="text-sm text-blue-700">AI将提供博士级别的系统化分析和建议</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {parsedOutput && !parsedOutput.parseError && parsedOutput.output ? (
            <>
              {/* AI Analysis Results Header */}
              <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center mr-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-green-800">AI分析完成</h3>
                      <p className="text-green-600 text-sm">请审核并编辑以下分析结果</p>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                    可编辑
                  </div>
                </div>
              </div>

              {/* Problem Restatement Card */}
              <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mr-3">
                    📝
                  </div>
                  <h4 className="text-lg font-bold text-gray-800">问题重述</h4>
                  <span className="ml-auto text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">可编辑</span>
                </div>
                <textarea
                  id="editableProblemRestatement"
                  value={editableProblemRestatement}
                  onChange={(e) => setEditableProblemRestatement(e.target.value)}
                  className="w-full p-4 border-2 border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-200 resize-none"
                  rows={4}
                  placeholder="AI将为您重新表述问题的核心内容..."
                />
                <div className="mt-2 text-xs text-gray-500 flex justify-between">
                  <span>💡 提示：确保重述准确反映您的研究意图</span>
                  <span>{editableProblemRestatement.length} 字符</span>
                </div>
              </div>

              {/* Domain Identification Card */}
              <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center mr-3">
                    🌍
                  </div>
                  <h4 className="text-lg font-bold text-gray-800">学科领域识别</h4>
                  <span className="ml-auto text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">可编辑</span>
                </div>
                <div className="relative">
                  <input
                    id="editableIdentifiedDomain"
                    type="text"
                    value={editableIdentifiedDomain}
                    onChange={(e) => setEditableIdentifiedDomain(e.target.value)}
                    className="w-full p-4 border-2 border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all duration-200"
                    placeholder="例如：环境科学与社会学交叉研究"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </div>
                </div>
                <p className="mt-2 text-xs text-gray-500">💡 提示：准确的学科定位有助于后续分析的专业性</p>
              </div>

              {/* Enhanced Classification Tags Section */}
              <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center mr-3">
                      🏷️
                    </div>
                    <h4 className="text-lg font-bold text-gray-800">问题分类标签</h4>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {editableProblemClassification.length} 个标签
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">可编辑</span>
                  </div>
                </div>

                {/* Enhanced Tags Display */}
                <div className="mb-4">
                  {editableProblemClassification.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {editableProblemClassification.map((tag, index) => (
                        <div
                          key={index}
                          className="group relative px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 rounded-full border border-indigo-200 hover:from-indigo-200 hover:to-purple-200 transition-all duration-200 flex items-center"
                        >
                          <span className="font-medium">{tag}</span>
                          <button
                            onClick={() => handleRemoveClassificationTag(tag)}
                            className="ml-2 w-5 h-5 bg-indigo-500 text-white rounded-full flex items-center justify-center hover:bg-indigo-600 transition-colors opacity-0 group-hover:opacity-100"
                            aria-label={`移除标签 ${tag}`}
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg text-center">
                      <div className="text-gray-400 mb-2">
                        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                        </svg>
                      </div>
                      <p className="text-gray-500">暂无分类标签，请添加相关标签</p>
                    </div>
                  )}
                </div>

                {/* Enhanced Add Tag Interface */}
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={newClassificationTag}
                      onChange={(e) => setNewClassificationTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddClassificationTag()}
                      placeholder="添加新的分类标签..."
                      className="w-full p-3 border-2 border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all duration-200"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                      </svg>
                    </div>
                  </div>
                  <button
                    onClick={handleAddClassificationTag}
                    disabled={!newClassificationTag.trim() || editableProblemClassification.includes(newClassificationTag.trim())}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                  >
                    添加
                  </button>
                </div>
                <p className="mt-3 text-xs text-gray-500 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  按回车键快速添加标签
                </p>
              </div>

              {/* AI Confirmation Query */}
              {parsedOutput.output.confirmationQuery && (
                <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200 shadow-md">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mr-3">
                      🤖
                    </div>
                    <h4 className="text-lg font-bold text-blue-800">AI助手确认</h4>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-blue-200">
                    <p className="text-blue-800 font-medium leading-relaxed whitespace-pre-line">
                      {parsedOutput.output.confirmationQuery}
                    </p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <AgentResponseBlock jsonStringContent={domainClassificationOutput} title="助手初步评估：" />
          )}

          {/* Enhanced Confirmation Section */}
          <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center mr-4">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-green-800">准备进入下一阶段</h4>
                  <p className="text-green-600 text-sm">确认以上分析结果后，将进入问题分解阶段</p>
                </div>
              </div>
              <ActionButton
                onClick={handleConfirmAndProceed}
                disabled={isLoading || !domainClassificationOutput}
                className="px-8 py-3 text-lg font-semibold bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
              >
                <div className="flex items-center">
                  <span>确认并继续</span>
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                  </svg>
                </div>
              </ActionButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProblemReceptionPhase;
