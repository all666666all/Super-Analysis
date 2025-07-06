
import React, { useState } from 'react';
import { PhaseProps, Language } from '../../types';
import ActionButton from '../ActionButton';
import LoadingSpinner from '../LoadingSpinner';
import AgentResponseBlock, { JsonRenderer } from '../AgentResponseBlock';
import { renderReviewSection } from '../RenderUtils';
import { getTranslation } from '../../i18n/translations';

const ProgressTrackingPhase: React.FC<PhaseProps> = ({
  appState,
  advancePhase,
  getParsedOutput,
}) => {
  const { isLoading, analyticalApproachOutput, progressTrackingOutput, selectedLanguage } = appState;
  const parsedOutput = getParsedOutput(progressTrackingOutput);
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

  // Enhanced progress visualization components with Material Design
  const renderProgressBar = (percentage: number, label: string, color: string = 'blue') => {
    const colorClasses = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      yellow: 'from-yellow-500 to-yellow-600',
      red: 'from-red-500 to-red-600',
      purple: 'from-purple-500 to-purple-600'
    };

    return (
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-700 text-material-body2">{label}</span>
          <div className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-bold elevation-1">
            {percentage}%
          </div>
        </div>
        <div className="progress-material elevation-1">
          <div
            className={`progress-bar bg-gradient-to-r ${colorClasses[color] || colorClasses.blue}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          >
            <div className="h-full w-full bg-white bg-opacity-30 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'COMPLETED': {
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: (
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        ),
        label: isEnglish ? 'Completed' : '已完成'
      },
      'IN_PROGRESS': {
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: (
          <svg className="w-3 h-3 mr-1 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
        ),
        label: isEnglish ? 'In Progress' : '进行中'
      },
      'PENDING': {
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: (
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        ),
        label: isEnglish ? 'Pending' : '待处理'
      },
      'BLOCKED': {
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: (
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"></path>
          </svg>
        ),
        label: isEnglish ? 'Blocked' : '受阻'
      },
      'REVIEW': {
        color: 'bg-purple-100 text-purple-800 border-purple-200',
        icon: (
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
          </svg>
        ),
        label: isEnglish ? 'Under Review' : '审核中'
      }
    };

    const config = statusConfig[status] || statusConfig['PENDING'];

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${config.color} elevation-1 hover:elevation-2 transition-all duration-200`}>
        {config.icon}
        {config.label}
      </span>
    );
  };

  const renderComponentStatusCard = (component: any, index: number) => {
    const percentage = component.completionPercentage || 0;
    const status = component.status || 'PENDING';
    const sectionId = `component-${index}`;
    const isExpanded = expandedSections.has(sectionId);

    return (
      <div
        key={index}
        className="card-material elevation-2 hover:elevation-3 group overflow-hidden animate-slideInUp"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        {/* Card Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl flex items-center justify-center text-lg font-bold mr-4 elevation-2 group-hover:elevation-3 transition-all duration-200">
                {component.componentId || index + 1}
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-800 text-material-h6">{component.componentName || `${isEnglish ? 'Component' : '组件'} ${index + 1}`}</h4>
                <p className="text-sm text-gray-600 text-material-body2 mt-1">{component.description || ''}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {getStatusBadge(status)}
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
          </div>

          {/* Enhanced Progress Bar */}
          {renderProgressBar(
            percentage,
            isEnglish ? 'Completion Progress' : '完成进度',
            percentage >= 80 ? 'green' : percentage >= 50 ? 'blue' : percentage >= 25 ? 'yellow' : 'red'
          )}
        </div>

        {/* Enhanced Expandable Content */}
        {isExpanded && (
          <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 animate-fadeIn">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Enhanced Tasks/Milestones */}
              {component.tasks && component.tasks.length > 0 && (
                <div className="card-material elevation-1 p-4">
                  <h5 className="font-semibold text-gray-700 mb-4 flex items-center text-material-h6">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center mr-3 elevation-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                      </svg>
                    </div>
                    {isEnglish ? 'Tasks & Milestones' : '任务与里程碑'}
                  </h5>
                  <div className="space-y-3">
                    {component.tasks.map((task: any, taskIndex: number) => (
                      <div key={taskIndex} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 elevation-1 hover:elevation-2 transition-all duration-200">
                        <div className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center transition-all duration-200 ${
                          task.completed
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-300 border-2 border-gray-400'
                        }`}>
                          {task.completed && (
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                            </svg>
                          )}
                        </div>
                        <span className={`text-sm font-medium transition-all duration-200 ${
                          task.completed
                            ? 'text-gray-500 line-through'
                            : 'text-gray-900'
                        }`}>
                          {task.name || task}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Enhanced Issues/Blockers */}
              {component.issues && component.issues.length > 0 && (
                <div className="card-material elevation-1 p-4">
                  <h5 className="font-semibold text-gray-700 mb-4 flex items-center text-material-h6">
                    <div className="w-8 h-8 bg-red-500 text-white rounded-lg flex items-center justify-center mr-3 elevation-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    {isEnglish ? 'Issues & Blockers' : '问题与阻碍'}
                  </h5>
                  <div className="space-y-3">
                    {component.issues.map((issue: any, issueIndex: number) => (
                      <div key={issueIndex} className="p-4 bg-red-50 border border-red-200 rounded-lg elevation-1 hover:elevation-2 transition-all duration-200">
                        <div className="flex items-start">
                          <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                            </svg>
                          </div>
                          <span className="text-sm text-red-800 font-medium">{issue.description || issue}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Timeline */}
            {component.timeline && (
              <div className="mt-6 md:col-span-2">
                <div className="card-material elevation-1 p-4">
                  <h5 className="font-semibold text-gray-700 mb-4 flex items-center text-material-h6">
                    <div className="w-8 h-8 bg-purple-500 text-white rounded-lg flex items-center justify-center mr-3 elevation-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    {isEnglish ? 'Project Timeline' : '项目时间线'}
                  </h5>
                  <div className="relative">
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-400 to-gray-300"></div>
                    {component.timeline.map((event: any, eventIndex: number) => (
                      <div key={eventIndex} className="relative flex items-start mb-6 last:mb-0">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-sm font-bold z-10 elevation-2 transition-all duration-200 ${
                          event.completed
                            ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                            : 'bg-gradient-to-br from-gray-400 to-gray-500'
                        }`}>
                          {event.completed ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                          ) : (
                            eventIndex + 1
                          )}
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="bg-white p-4 rounded-lg border border-gray-200 elevation-1 hover:elevation-2 transition-all duration-200">
                            <p className="text-sm font-semibold text-gray-900 text-material-body1">{event.title || event}</p>
                            {event.date && (
                              <div className="flex items-center mt-2">
                                <svg className="w-4 h-4 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                <p className="text-xs text-gray-500 font-medium">{event.date}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Review Section */}
      {renderReviewSection(
        isEnglish ? "Review: Analytical Approach" : "回顾：分析方法",
        analyticalApproachOutput,
        [{ key: 'rationale', label: isEnglish ? 'Methodological Rationale' : '方法论依据' }]
      )}

      {/* Enhanced Loading State */}
      {isLoading && !progressTrackingOutput && (
        <div className="card-material elevation-3 p-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 animate-pulse">
          <div className="flex items-center justify-center">
            <LoadingSpinner />
            <span className="ml-4 text-lg font-semibold text-blue-700 text-material-h6">
              {isEnglish ? 'AI is generating progress report...' : '助手正在生成进度报告...'}
            </span>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-blue-600 text-material-body2">
              {isEnglish ? 'Analyzing project components and tracking progress...' : '正在分析项目组件并跟踪进度...'}
            </p>
          </div>
        </div>
      )}

      {/* Enhanced Progress Dashboard */}
      {parsedOutput && !parsedOutput.parseError && parsedOutput.output ? (
        <div className="space-y-8">
          {/* Enhanced Progress Overview Header */}
          <div className="card-material elevation-4 p-8 bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 border border-gray-200 animate-slideInUp">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 text-white rounded-2xl flex items-center justify-center text-2xl mr-6 elevation-3">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-800 text-material-h3">
                    {isEnglish ? 'Progress Dashboard' : '进度仪表板'}
                  </h3>
                  <p className="text-gray-600 mt-2 text-material-body1">
                    {parsedOutput.output.reportDate && (
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        {isEnglish ? 'Report Date: ' : '报告日期：'}{parsedOutput.output.reportDate}
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-5xl font-bold text-green-600 mb-2">
                  {parsedOutput.output.overallCompletionPercentage || 0}%
                </div>
                <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold elevation-1">
                  {isEnglish ? 'Overall Progress' : '总体进度'}
                </div>
              </div>
            </div>

            {/* Enhanced Overall Progress Bar */}
            <div className="mb-8">
              {renderProgressBar(
                parsedOutput.output.overallCompletionPercentage || 0,
                isEnglish ? 'Project Completion Status' : '项目完成状态',
                'green'
              )}
            </div>

            {/* Enhanced Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="card-material elevation-2 hover:elevation-3 p-6 text-center transition-all duration-200 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
                <div className="w-12 h-12 bg-green-500 text-white rounded-xl flex items-center justify-center mx-auto mb-3 elevation-1">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div className="text-3xl font-bold text-green-600 mb-1">
                  {parsedOutput.output.componentStatus?.filter((c: any) => c.status === 'COMPLETED').length || 0}
                </div>
                <div className="text-sm text-green-700 font-semibold">
                  {isEnglish ? 'Completed' : '已完成'}
                </div>
              </div>
              <div className="card-material elevation-2 hover:elevation-3 p-6 text-center transition-all duration-200 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
                <div className="w-12 h-12 bg-blue-500 text-white rounded-xl flex items-center justify-center mx-auto mb-3 elevation-1">
                  <svg className="w-6 h-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                </div>
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {parsedOutput.output.componentStatus?.filter((c: any) => c.status === 'IN_PROGRESS').length || 0}
                </div>
                <div className="text-sm text-blue-700 font-semibold">
                  {isEnglish ? 'In Progress' : '进行中'}
                </div>
              </div>
              <div className="card-material elevation-2 hover:elevation-3 p-6 text-center transition-all duration-200 bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200">
                <div className="w-12 h-12 bg-yellow-500 text-white rounded-xl flex items-center justify-center mx-auto mb-3 elevation-1">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div className="text-3xl font-bold text-yellow-600 mb-1">
                  {parsedOutput.output.componentStatus?.filter((c: any) => c.status === 'PENDING').length || 0}
                </div>
                <div className="text-sm text-yellow-700 font-semibold">
                  {isEnglish ? 'Pending' : '待处理'}
                </div>
              </div>
              <div className="card-material elevation-2 hover:elevation-3 p-6 text-center transition-all duration-200 bg-gradient-to-br from-red-50 to-pink-50 border border-red-200">
                <div className="w-12 h-12 bg-red-500 text-white rounded-xl flex items-center justify-center mx-auto mb-3 elevation-1">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"></path>
                  </svg>
                </div>
                <div className="text-3xl font-bold text-red-600 mb-1">
                  {parsedOutput.output.componentStatus?.filter((c: any) => c.status === 'BLOCKED').length || 0}
                </div>
                <div className="text-sm text-red-700 font-semibold">
                  {isEnglish ? 'Blocked' : '受阻'}
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Component Status Cards */}
          {parsedOutput.output.componentStatus && Array.isArray(parsedOutput.output.componentStatus) && (
            <div className="space-y-8">
              <div className="card-material elevation-2 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-800 flex items-center text-material-h4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl flex items-center justify-center text-lg font-bold mr-4 elevation-2">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                      </svg>
                    </div>
                    {isEnglish ? 'Component Status Details' : '组件状态详情'}
                  </h3>
                  <div className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-semibold elevation-1">
                    {parsedOutput.output.componentStatus.length} {isEnglish ? 'Components' : '个组件'}
                  </div>
                </div>
                <p className="text-gray-600 mt-2 text-material-body2">
                  {isEnglish ? 'Detailed breakdown of each project component with progress tracking and status monitoring.' : '每个项目组件的详细分解，包含进度跟踪和状态监控。'}
                </p>
              </div>

              <div className="space-y-6">
                {parsedOutput.output.componentStatus.map(renderComponentStatusCard)}
              </div>
            </div>
          )}

          {/* Enhanced Next Priorities Section */}
          {parsedOutput.output.nextPriorities && Array.isArray(parsedOutput.output.nextPriorities) && parsedOutput.output.nextPriorities.length > 0 && (
            <div className="card-material elevation-3 p-6 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-xl flex items-center justify-center mr-4 elevation-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-orange-800 text-material-h5">
                    {isEnglish ? 'Next Priorities' : '后续优先事项'}
                  </h4>
                  <p className="text-orange-700 text-sm text-material-body2 mt-1">
                    {isEnglish ? 'Critical tasks requiring immediate attention' : '需要立即关注的关键任务'}
                  </p>
                </div>
              </div>
              <div className="grid gap-4">
                {parsedOutput.output.nextPriorities.map((priority: string, index: number) => (
                  <div key={index} className="card-material elevation-1 hover:elevation-2 p-4 bg-white border border-orange-200 transition-all duration-200 animate-slideInUp" style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-lg flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0 elevation-1">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <span className="text-orange-900 font-semibold text-material-body1">{priority}</span>
                        <div className="mt-2 flex items-center text-xs text-orange-600">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          {isEnglish ? 'High Priority' : '高优先级'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Enhanced Summary Section */}
          {parsedOutput.output.summary && (
            <div className="card-material elevation-3 p-6 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl flex items-center justify-center mr-4 elevation-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-purple-800 text-material-h5">
                    {isEnglish ? 'Executive Summary' : '总体摘要'}
                  </h4>
                  <p className="text-purple-700 text-sm text-material-body2 mt-1">
                    {isEnglish ? 'Comprehensive overview of project status and key insights' : '项目状态和关键洞察的综合概述'}
                  </p>
                </div>
              </div>
              <div className="card-material elevation-1 p-6 bg-white border border-purple-200">
                <div className="flex items-start">
                  <div className="w-1 h-full bg-gradient-to-b from-purple-500 to-pink-500 rounded-full mr-4"></div>
                  <div className="flex-1">
                    <p className="text-purple-900 leading-relaxed font-medium text-material-body1">
                      {parsedOutput.output.summary}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        progressTrackingOutput && (
          <AgentResponseBlock
            jsonStringContent={progressTrackingOutput}
            title={isEnglish ? "AI Progress Report:" : "助手（模拟）进度报告："}
          />
        )
      )}

      {/* Enhanced Action Button */}
      {progressTrackingOutput && (
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
                  {isEnglish ? 'Ready for Final Validation' : '准备进入最终验证'}
                </h4>
                <p className="text-green-600 text-sm text-material-body2 mt-1">
                  {isEnglish ? 'Progress review complete, proceed to solution validation' : '进度审查完成，进入解决方案验证阶段'}
                </p>
                <div className="flex items-center mt-2 text-xs text-green-700">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  {isEnglish ? 'All progress tracking completed successfully' : '所有进度跟踪已成功完成'}
                </div>
              </div>
            </div>
            <ActionButton
              onClick={advancePhase}
              disabled={isLoading || !progressTrackingOutput}
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
                  <span>{isEnglish ? 'Proceed to Validation' : '进入验证阶段'}</span>
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

export default ProgressTrackingPhase;
