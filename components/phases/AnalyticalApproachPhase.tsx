
import React, { useState } from 'react';
import { PhaseProps, Language } from '../../types';
import ActionButton from '../ActionButton';
import LoadingSpinner from '../LoadingSpinner';
import AgentResponseBlock, { JsonRenderer } from '../AgentResponseBlock';
import { renderReviewSection } from '../RenderUtils';
import { getTranslation } from '../../i18n/translations';

const AnalyticalApproachPhase: React.FC<PhaseProps> = ({
  appState,
  advancePhase,
  getParsedOutput,
}) => {
  const { isLoading, evaluationCriteriaOutput, analyticalApproachOutput, selectedLanguage } = appState;
  const parsedOutput = getParsedOutput(analyticalApproachOutput);
  const t = getTranslation(selectedLanguage);
  const isEnglish = selectedLanguage === Language.ENGLISH;

  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  // Enhanced methodology card renderer
  const renderMethodologyCard = (methodology: any, index: number) => {
    const sectionId = `methodology-${index}`;
    const isExpanded = expandedSections.has(sectionId);

    return (
      <div
        key={index}
        className="card-material elevation-2 hover:elevation-3 overflow-hidden animate-slideInUp"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl flex items-center justify-center text-lg font-bold mr-4 elevation-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-800 text-material-h6">
                  {methodology.name || methodology.title || `${isEnglish ? 'Methodology' : '方法论'} ${index + 1}`}
                </h4>
                <p className="text-sm text-gray-600 text-material-body2 mt-1">
                  {methodology.description || methodology.summary || ''}
                </p>
              </div>
            </div>
            <button
              onClick={() => toggleSection(sectionId)}
              className="btn-material p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 elevation-1 hover:elevation-2"
              aria-label={isExpanded ? (isEnglish ? 'Collapse section' : '收起部分') : (isEnglish ? 'Expand section' : '展开部分')}
            >
              <svg
                className={`w-5 h-5 text-gray-500 transition-transform duration-300 ease-out ${isExpanded ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
          </div>

          {/* Method Type Badge */}
          {methodology.type && (
            <div className="mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200 elevation-1">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a1.994 1.994 0 01-1.414.586H7a1 1 0 01-1-1V3a1 1 0 011-1z"></path>
                </svg>
                {methodology.type}
              </span>
            </div>
          )}
        </div>

        {/* Expandable Content */}
        {isExpanded && (
          <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 animate-fadeIn">
            <div className="space-y-6">
              {/* Steps/Procedures */}
              {methodology.steps && Array.isArray(methodology.steps) && (
                <div className="card-material elevation-1 p-4">
                  <h5 className="font-semibold text-gray-700 mb-4 flex items-center text-material-h6">
                    <div className="w-8 h-8 bg-green-500 text-white rounded-lg flex items-center justify-center mr-3 elevation-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                      </svg>
                    </div>
                    {isEnglish ? 'Implementation Steps' : '实施步骤'}
                  </h5>
                  <div className="space-y-3">
                    {methodology.steps.map((step: any, stepIndex: number) => (
                      <div key={stepIndex} className="flex items-start p-3 bg-white rounded-lg border border-gray-200 elevation-1 hover:elevation-2 transition-all duration-200">
                        <div className="w-6 h-6 bg-green-500 text-white rounded-lg flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0">
                          {stepIndex + 1}
                        </div>
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-900 text-material-body1">
                            {step.title || step.name || step}
                          </span>
                          {step.description && (
                            <p className="text-xs text-gray-600 mt-1">{step.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tools/Techniques */}
              {methodology.tools && Array.isArray(methodology.tools) && (
                <div className="card-material elevation-1 p-4">
                  <h5 className="font-semibold text-gray-700 mb-4 flex items-center text-material-h6">
                    <div className="w-8 h-8 bg-purple-500 text-white rounded-lg flex items-center justify-center mr-3 elevation-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                    </div>
                    {isEnglish ? 'Tools & Techniques' : '工具与技术'}
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {methodology.tools.map((tool: any, toolIndex: number) => (
                      <div key={toolIndex} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 elevation-1 hover:elevation-2 transition-all duration-200">
                        <div className="w-4 h-4 bg-purple-500 rounded-full mr-3 flex-shrink-0"></div>
                        <span className="text-sm font-medium text-gray-900">{tool.name || tool}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Enhanced analytical sequence renderer
  const renderAnalyticalSequence = (sequence: any[]) => {
    if (!Array.isArray(sequence)) return null;

    return (
      <div className="card-material elevation-2 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 animate-slideInUp">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl flex items-center justify-center mr-4 elevation-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800 text-material-h5">
              {isEnglish ? 'Analytical Sequence' : '分析序列'}
            </h3>
            <p className="text-indigo-700 text-sm text-material-body2 mt-1">
              {isEnglish ? 'Step-by-step analytical workflow and execution order' : '逐步分析工作流程和执行顺序'}
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-400 to-purple-400"></div>
          {sequence.map((step: any, index: number) => (
            <div key={index} className="relative flex items-start mb-6 last:mb-0">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl flex items-center justify-center text-sm font-bold z-10 elevation-2">
                {index + 1}
              </div>
              <div className="ml-4 flex-1">
                <div className="card-material elevation-1 hover:elevation-2 p-4 bg-white border border-indigo-200 transition-all duration-200">
                  <h4 className="text-sm font-semibold text-gray-900 text-material-body1 mb-2">
                    {step.title || step.name || step.step || `${isEnglish ? 'Step' : '步骤'} ${index + 1}`}
                  </h4>
                  {step.description && (
                    <p className="text-xs text-gray-600 text-material-body2 mb-3">{step.description}</p>
                  )}
                  {step.duration && (
                    <div className="flex items-center text-xs text-indigo-600">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      {isEnglish ? 'Duration:' : '持续时间:'} {step.duration}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Enhanced challenges renderer
  const renderChallenges = (challenges: any[]) => {
    if (!Array.isArray(challenges) || challenges.length === 0) return null;

    return (
      <div className="card-material elevation-2 p-6 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 animate-slideInUp">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 text-white rounded-xl flex items-center justify-center mr-4 elevation-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800 text-material-h5">
              {isEnglish ? 'Potential Challenges & Mitigation' : '潜在挑战与缓解'}
            </h3>
            <p className="text-red-700 text-sm text-material-body2 mt-1">
              {isEnglish ? 'Identified risks and corresponding mitigation strategies' : '识别的风险和相应的缓解策略'}
            </p>
          </div>
        </div>

        <div className="grid gap-4">
          {challenges.map((challenge: any, index: number) => (
            <div key={index} className="card-material elevation-1 hover:elevation-2 p-4 bg-white border border-red-200 transition-all duration-200">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-red-500 text-white rounded-lg flex items-center justify-center mr-3 flex-shrink-0 elevation-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-red-800 mb-2">
                    {challenge.challenge || challenge.title || challenge.name || `${isEnglish ? 'Challenge' : '挑战'} ${index + 1}`}
                  </h4>
                  {challenge.description && (
                    <p className="text-xs text-red-700 mb-3">{challenge.description}</p>
                  )}
                  {challenge.mitigation && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-start">
                        <svg className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <div>
                          <span className="text-xs font-semibold text-green-800">
                            {isEnglish ? 'Mitigation Strategy:' : '缓解策略：'}
                          </span>
                          <p className="text-xs text-green-700 mt-1">{challenge.mitigation}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Enhanced alternative approaches renderer
  const renderAlternativeApproaches = (alternatives: any[]) => {
    if (!Array.isArray(alternatives) || alternatives.length === 0) return null;

    return (
      <div className="card-material elevation-2 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 animate-slideInUp">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 text-white rounded-xl flex items-center justify-center mr-4 elevation-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800 text-material-h5">
              {isEnglish ? 'Alternative Approaches' : '备选方法'}
            </h3>
            <p className="text-yellow-700 text-sm text-material-body2 mt-1">
              {isEnglish ? 'Additional methodological options and backup strategies' : '额外的方法论选择和备用策略'}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {alternatives.map((alternative: any, index: number) => (
            <div key={index} className="card-material elevation-1 hover:elevation-2 p-4 bg-white border border-yellow-200 transition-all duration-200">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-yellow-500 text-white rounded-lg flex items-center justify-center mr-3 flex-shrink-0 elevation-1">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-yellow-800 mb-2">
                    {alternative.name || alternative.title || alternative.approach || `${isEnglish ? 'Alternative' : '备选方案'} ${index + 1}`}
                  </h4>
                  {alternative.description && (
                    <p className="text-xs text-yellow-700 mb-3">{alternative.description}</p>
                  )}
                  {alternative.advantages && (
                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-green-700">
                        {isEnglish ? 'Advantages:' : '优势：'}
                      </span>
                      <ul className="text-xs text-green-600 ml-3">
                        {Array.isArray(alternative.advantages)
                          ? alternative.advantages.map((adv: string, advIndex: number) => (
                              <li key={advIndex} className="flex items-start">
                                <span className="text-green-500 mr-1">•</span>
                                {adv}
                              </li>
                            ))
                          : <li className="flex items-start"><span className="text-green-500 mr-1">•</span>{alternative.advantages}</li>
                        }
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Review Section */}
      {renderReviewSection(
        isEnglish ? "Review: Evaluation Criteria" : "回顾：评估标准",
        evaluationCriteriaOutput,
        []
      )}

      {/* Enhanced Loading State */}
      {isLoading && !analyticalApproachOutput && (
        <div className="card-material elevation-3 p-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 animate-pulse">
          <div className="flex items-center justify-center">
            <LoadingSpinner />
            <span className="ml-4 text-lg font-semibold text-blue-700 text-material-h6">
              {isEnglish ? 'AI is detailing analytical methods...' : '助手正在详述分析方法...'}
            </span>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-blue-600 text-material-body2">
              {isEnglish ? 'Developing comprehensive analytical framework and methodology...' : '正在制定全面的分析框架和方法论...'}
            </p>
          </div>
        </div>
      )}

      {/* Enhanced Analytical Approach Content */}
      {parsedOutput && !parsedOutput.parseError && parsedOutput.output ? (
        <div className="space-y-8">
          {/* Methodology Overview Header */}
          <div className="card-material elevation-4 p-8 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200 animate-slideInUp">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center text-2xl mr-6 elevation-3">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-800 text-material-h3">
                    {isEnglish ? 'Analytical Methodology' : '分析方法论'}
                  </h3>
                  <p className="text-gray-600 mt-2 text-material-body1">
                    {isEnglish ? 'Comprehensive analytical framework and implementation strategy' : '全面的分析框架和实施策略'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold elevation-1">
                  {isEnglish ? 'Phase 6' : '第六阶段'}
                </div>
              </div>
            </div>
          </div>

          {/* Methodology Cards */}
          {parsedOutput.output.methodology && (
            <div className="space-y-6">
              <div className="card-material elevation-2 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-800 flex items-center text-material-h4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl flex items-center justify-center text-lg font-bold mr-4 elevation-2">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                      </svg>
                    </div>
                    {isEnglish ? 'Adopted Methodology' : '采用方法论'}
                  </h3>
                </div>
                <p className="text-gray-600 mt-2 text-material-body2">
                  {isEnglish ? 'Primary analytical approaches and methodological frameworks selected for this analysis.' : '为此分析选择的主要分析方法和方法论框架。'}
                </p>
              </div>

              <div className="space-y-6">
                {Array.isArray(parsedOutput.output.methodology)
                  ? parsedOutput.output.methodology.map(renderMethodologyCard)
                  : renderMethodologyCard(parsedOutput.output.methodology, 0)
                }
              </div>
            </div>
          )}

          {/* Analytical Sequence */}
          {parsedOutput.output.analyticalSequence && renderAnalyticalSequence(parsedOutput.output.analyticalSequence)}

          {/* Potential Challenges */}
          {parsedOutput.output.potentialChallenges && renderChallenges(parsedOutput.output.potentialChallenges)}

          {/* Alternative Approaches */}
          {parsedOutput.output.alternativeApproaches && renderAlternativeApproaches(parsedOutput.output.alternativeApproaches)}

          {/* Enhanced Rationale Section */}
          {parsedOutput.output.rationale && (
            <div className="card-material elevation-3 p-6 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 animate-slideInUp">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl flex items-center justify-center mr-4 elevation-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-purple-800 text-material-h5">
                    {isEnglish ? 'Methodological Rationale' : '方法论依据'}
                  </h4>
                  <p className="text-purple-700 text-sm text-material-body2 mt-1">
                    {isEnglish ? 'Justification and reasoning behind the selected analytical approach' : '所选分析方法的理由和推理'}
                  </p>
                </div>
              </div>
              <div className="card-material elevation-1 p-6 bg-white border border-purple-200">
                <div className="flex items-start">
                  <div className="w-1 h-full bg-gradient-to-b from-purple-500 to-pink-500 rounded-full mr-4"></div>
                  <div className="flex-1">
                    <p className="text-purple-900 leading-relaxed font-medium text-material-body1 italic">
                      {parsedOutput.output.rationale}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        analyticalApproachOutput && (
          <AgentResponseBlock
            jsonStringContent={analyticalApproachOutput}
            title={isEnglish ? "AI Analytical Method:" : "助手分析方法："}
          />
        )
      )}

      {/* Enhanced Action Button */}
      {analyticalApproachOutput && (
        <div className="card-material elevation-3 p-8 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 animate-slideInUp">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl flex items-center justify-center mr-6 elevation-2">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <h4 className="text-xl font-bold text-green-800 text-material-h5">
                  {isEnglish ? 'Methodology Approved' : '方法论已确认'}
                </h4>
                <p className="text-green-600 text-sm text-material-body2 mt-1">
                  {isEnglish ? 'Analytical framework established, proceed to progress tracking' : '分析框架已建立，进入进度跟踪阶段'}
                </p>
                <div className="flex items-center mt-2 text-xs text-green-700">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  {isEnglish ? 'Analytical methodology review completed' : '分析方法论审查已完成'}
                </div>
              </div>
            </div>
            <ActionButton
              onClick={advancePhase}
              disabled={isLoading || !analyticalApproachOutput}
              variant="success"
              size="large"
              className="px-8 py-4 text-lg font-semibold"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <LoadingSpinner />
                  <span className="ml-2">{isEnglish ? 'Processing...' : '处理中...'}</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <span>{isEnglish ? 'Understand Method & Continue' : '了解方法并继续'}</span>
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                  </svg>
                </div>
              )}
            </ActionButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticalApproachPhase;
