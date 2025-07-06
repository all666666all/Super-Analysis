
import React, { useState } from 'react';
import { Phase, PhaseDetail, Language } from '../types';
import { PHASE_ORDER, PHASE_DETAILS } from '../constants';
import { getTranslation } from '../i18n/translations';

interface PhaseStepperProps {
  currentPhase: Phase;
  selectedLanguage?: Language;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const PhaseStepper: React.FC<PhaseStepperProps> = ({
  currentPhase,
  selectedLanguage = Language.CHINESE,
  isCollapsed = false,
  onToggleCollapse
}) => {
  const currentPhaseIndex = PHASE_ORDER.indexOf(currentPhase);
  const [hoveredPhase, setHoveredPhase] = useState<number | null>(null);
  const t = getTranslation(selectedLanguage);
  const isEnglish = selectedLanguage === Language.ENGLISH;

  const getPhaseIcon = (phaseId: Phase, index: number) => {
    const icons = {
      [Phase.LANGUAGE_SELECTION]: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path>
        </svg>
      ),
      [Phase.PROBLEM_RECEPTION]: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
      ),
      [Phase.DECOMPOSITION]: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      ),
      [Phase.DATA_REQUIREMENTS]: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
        </svg>
      ),
      [Phase.DATA_ASSESSMENT]: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
      ),
      [Phase.EVALUATION_CRITERIA]: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
        </svg>
      ),
      [Phase.ANALYTICAL_APPROACH]: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
        </svg>
      ),
      [Phase.PROGRESS_TRACKING]: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
        </svg>
      ),
      [Phase.SOLUTION_VALIDATION]: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
      [Phase.COMPLETED]: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
        </svg>
      )
    };
    return icons[phaseId] || <span className="text-sm font-bold">{index + 1}</span>;
  };

  const getPhaseTitle = (phaseDetail: PhaseDetail) => {
    if (isEnglish) {
      const englishTitles = {
        'Language Selection / 语言选择': 'Language Selection',
        '阶段一：问题接收与分类': 'Problem Reception',
        '阶段二：层级化问题分解': 'Problem Decomposition',
        '阶段三：数据需求规范': 'Data Requirements',
        '阶段四：数据充分性评估': 'Data Assessment',
        '阶段五：评估标准建立': 'Evaluation Criteria',
        '阶段六：分析方法详述': 'Analytical Approach',
        '阶段七：进度追踪与优化': 'Progress Tracking',
        '阶段八：综合解决方案验证': 'Solution Validation',
        '阶段九：流程已完成': 'Process Completed'
      };
      return englishTitles[phaseDetail.title] || phaseDetail.title.split('：')[1] || phaseDetail.title;
    }

    return (phaseDetail.title.split('：')[1] || phaseDetail.title)
      .replace('阶段', '')
      .replace(/[一二三四五六七八九]/, '')
      .replace('Language Selection / 语言选择', '语言选择')
      .trim();
  };

  const getPhaseDescription = (phaseDetail: PhaseDetail) => {
    if (isEnglish) {
      const englishDescriptions = {
        'Language Selection / 语言选择': 'Choose your preferred language',
        '阶段一：问题接收与分类': 'Receive and classify the problem',
        '阶段二：层级化问题分解': 'Break down problem hierarchically',
        '阶段三：数据需求规范': 'Define data requirements',
        '阶段四：数据充分性评估': 'Assess data sufficiency',
        '阶段五：评估标准建立': 'Establish evaluation criteria',
        '阶段六：分析方法详述': 'Detail analytical methods',
        '阶段七：进度追踪与优化': 'Track progress and optimize',
        '阶段八：综合解决方案验证': 'Validate comprehensive solution',
        '阶段九：流程已完成': 'Process completed successfully'
      };
      return englishDescriptions[phaseDetail.title] || phaseDetail.description;
    }
    return phaseDetail.description;
  };

  const progressPercentage = ((currentPhaseIndex) / (PHASE_ORDER.length - 1)) * 100;

  return (
    <div className={`
      fixed left-0 top-0 h-full bg-white border-r border-gray-200 elevation-3 z-40 sidebar-collapsed
      ${isCollapsed ? 'w-16' : 'w-80'}
    `}>
      {/* Sidebar Header */}
      <div className={`border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 transition-all duration-300 ${isCollapsed ? 'p-2' : 'p-4'}`}>
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isCollapsed && (
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-lg flex items-center justify-center mr-3 elevation-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-sm">
                  {isEnglish ? 'Progress Navigator' : '进度导航'}
                </h3>
                <p className="text-xs text-gray-600">
                  {isEnglish ? 'Analysis Workflow' : '分析工作流'}
                </p>
              </div>
            </div>
          )}

          <button
            onClick={onToggleCollapse}
            className={`
              sidebar-toggle-btn p-2 rounded-lg transition-all duration-200 elevation-1 hover:elevation-2
              ${isCollapsed
                ? 'bg-blue-100 hover:bg-blue-200 text-blue-600'
                : 'hover:bg-gray-100 text-gray-600'
              }
            `}
            aria-label={isCollapsed ? (isEnglish ? 'Expand sidebar' : '展开侧边栏') : (isEnglish ? 'Collapse sidebar' : '收起侧边栏')}
          >
            <svg
              className={`w-4 h-4 transition-transform duration-300 ease-out ${isCollapsed ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
        </div>

        {/* Progress Bar - Enhanced for collapsed state */}
        {!isCollapsed ? (
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
              <span>{isEnglish ? 'Overall Progress' : '总体进度'}</span>
              <span className="font-bold text-blue-600">{Math.round(progressPercentage)}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden elevation-1">
              <div
                className="h-full progress-gradient rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progressPercentage}%` }}
              >
                <div className="h-full w-full bg-white bg-opacity-30 rounded-full"></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-2 sidebar-progress-mini">
            <div className="w-8 h-1 bg-gray-200 rounded-full overflow-hidden mx-auto elevation-1">
              <div
                className="h-full progress-gradient rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="text-xs text-center text-blue-600 font-bold mt-1">
              {Math.round(progressPercentage)}%
            </div>
          </div>
        )}
      </div>

      {/* Phase List */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className={`space-y-2 ${isCollapsed ? 'px-1' : 'px-3'}`}>
          {PHASE_ORDER.map((phaseId, index) => {
            const phaseDetail: PhaseDetail | undefined = PHASE_DETAILS[phaseId];
            if (!phaseDetail) return null;

            const isCompleted = index < currentPhaseIndex;
            const isCurrent = index === currentPhaseIndex;
            const isHovered = hoveredPhase === index;

            return (
              <div
                key={phaseDetail.id}
                className={`
                  relative group cursor-pointer sidebar-item
                  ${isCollapsed
                    ? 'rounded-lg mx-1'
                    : 'rounded-xl'
                  }
                  ${isCurrent
                    ? isCollapsed
                      ? 'bg-blue-500 text-white elevation-2'
                      : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 elevation-2'
                    : isCompleted
                      ? isCollapsed
                        ? 'bg-green-500 text-white hover:bg-green-600 elevation-1 hover:elevation-2'
                        : 'bg-green-50 hover:bg-green-100 border border-green-200 elevation-1 hover:elevation-2'
                      : isCollapsed
                        ? 'bg-gray-100 hover:bg-gray-200 text-gray-600 elevation-1 hover:elevation-2'
                        : 'hover:bg-gray-50 border border-gray-200 elevation-1 hover:elevation-2'
                  }
                `}
                onMouseEnter={() => setHoveredPhase(index)}
                onMouseLeave={() => setHoveredPhase(null)}
              >
                <div className={`${isCollapsed ? 'p-2' : 'p-3'}`}>
                  <div className="flex items-center">
                    {/* Phase Icon */}
                    <div className={`
                      flex-shrink-0 rounded-lg flex items-center justify-center phase-icon
                      ${isCollapsed
                        ? 'w-8 h-8'
                        : 'w-10 h-10'
                      }
                      ${isCurrent
                        ? isCollapsed
                          ? 'bg-white bg-opacity-20 text-white'
                          : 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white elevation-2'
                        : isCompleted
                          ? isCollapsed
                            ? 'bg-white bg-opacity-20 text-white'
                            : 'bg-gradient-to-br from-green-500 to-emerald-600 text-white elevation-1'
                          : isCollapsed
                            ? 'bg-white bg-opacity-50 text-gray-600'
                            : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                      }
                    `}>
                      {isCompleted && !isCurrent ? (
                        <svg className={`${isCollapsed ? 'w-4 h-4' : 'w-5 h-5'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      ) : (
                        <div className={`${isCollapsed ? 'scale-75' : ''}`}>
                          {getPhaseIcon(phaseId, index)}
                        </div>
                      )}
                    </div>

                    {/* Phase Content - Only in expanded state */}
                    {!isCollapsed && (
                      <div className="ml-3 flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className={`
                            text-sm font-semibold truncate
                            ${isCurrent
                              ? 'text-blue-700'
                              : isCompleted
                                ? 'text-green-700'
                                : 'text-gray-700'
                            }
                          `}>
                            {getPhaseTitle(phaseDetail)}
                          </h4>

                          {/* Status Badge */}
                          <div className={`
                            ml-2 px-2 py-1 rounded-full text-xs font-medium elevation-1
                            ${isCurrent
                              ? 'bg-blue-100 text-blue-800'
                              : isCompleted
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-600'
                            }
                          `}>
                            {isCurrent
                              ? (isEnglish ? 'Current' : '当前')
                              : isCompleted
                                ? (isEnglish ? 'Done' : '完成')
                                : (isEnglish ? 'Pending' : '待处理')
                            }
                          </div>
                        </div>

                        <p className="text-xs text-gray-500 mt-1 truncate">
                          {getPhaseDescription(phaseDetail)}
                        </p>

                        {/* Current phase indicator */}
                        {isCurrent && (
                          <div className="flex items-center mt-2">
                            <div className="flex space-x-1">
                              <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"></div>
                              <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                              <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Enhanced Tooltip for collapsed state */}
                {isCollapsed && isHovered && (
                  <div className="absolute left-16 top-1/2 transform -translate-y-1/2 z-50 animate-fadeIn">
                    <div className="sidebar-tooltip text-white text-xs rounded-xl py-3 px-4 whitespace-nowrap elevation-5">
                      <div className="font-semibold text-white">{getPhaseTitle(phaseDetail)}</div>
                      <div className="text-gray-300 text-xs mt-1 max-w-48">
                        {getPhaseDescription(phaseDetail)}
                      </div>
                      <div className="text-gray-400 text-xs mt-2">
                        {isCurrent
                          ? (isEnglish ? 'Current Phase' : '当前阶段')
                          : isCompleted
                            ? (isEnglish ? 'Completed' : '已完成')
                            : (isEnglish ? 'Upcoming' : '即将开始')
                        }
                      </div>
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900"></div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* Enhanced Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-3 font-medium">
              {isEnglish ? 'Analysis Progress Summary' : '分析进度概览'}
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="flex flex-col items-center p-2 bg-white rounded-lg elevation-1">
                <div className="flex items-center mb-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  <span className="text-green-700 font-semibold">
                    {currentPhaseIndex}
                  </span>
                </div>
                <span className="text-gray-600 text-xs">
                  {isEnglish ? 'Completed' : '已完成'}
                </span>
              </div>
              <div className="flex flex-col items-center p-2 bg-white rounded-lg elevation-1">
                <div className="flex items-center mb-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-1 animate-pulse"></div>
                  <span className="text-blue-700 font-semibold">
                    1
                  </span>
                </div>
                <span className="text-gray-600 text-xs">
                  {isEnglish ? 'Current' : '当前'}
                </span>
              </div>
              <div className="flex flex-col items-center p-2 bg-white rounded-lg elevation-1">
                <div className="flex items-center mb-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mr-1"></div>
                  <span className="text-gray-700 font-semibold">
                    {PHASE_ORDER.length - currentPhaseIndex - 1}
                  </span>
                </div>
                <span className="text-gray-600 text-xs">
                  {isEnglish ? 'Remaining' : '剩余'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhaseStepper;