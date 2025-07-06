import React, { useState } from 'react';
import { Phase } from '../types';
import { PHASE_ORDER, PHASE_DETAILS } from '../constants';

interface CheatMenuProps {
  currentPhase: Phase;
  onJumpToPhase: (phase: Phase) => void;
  onGenerateMockData: (phase: Phase) => void;
}

const CheatMenu: React.FC<CheatMenuProps> = ({ currentPhase, onJumpToPhase, onGenerateMockData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsExpanded(false);
    }
  };

  const handleJumpToPhase = (phase: Phase) => {
    onJumpToPhase(phase);
    setIsOpen(false);
    setIsExpanded(false);
  };

  const handleGenerateMockData = (phase: Phase) => {
    onGenerateMockData(phase);
    setIsOpen(false);
    setIsExpanded(false);
  };

  const getPhaseIcon = (phase: Phase) => {
    const icons = {
      [Phase.LANGUAGE_SELECTION]: '🌐',
      [Phase.PROBLEM_RECEPTION]: '📝',
      [Phase.DECOMPOSITION]: '🔍',
      [Phase.DATA_REQUIREMENTS]: '📊',
      [Phase.DATA_ASSESSMENT]: '📈',
      [Phase.EVALUATION_CRITERIA]: '⭐',
      [Phase.ANALYTICAL_APPROACH]: '🧠',
      [Phase.PROGRESS_TRACKING]: '📋',
      [Phase.SOLUTION_VALIDATION]: '✅',
      [Phase.COMPLETED]: '🎉'
    };
    return icons[phase] || '📄';
  };

  const getPhaseColor = (phase: Phase) => {
    const currentIndex = PHASE_ORDER.indexOf(currentPhase);
    const phaseIndex = PHASE_ORDER.indexOf(phase);
    
    if (phaseIndex < currentIndex) return 'text-green-600 bg-green-50 border-green-200';
    if (phaseIndex === currentIndex) return 'text-blue-600 bg-blue-50 border-blue-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Material Design FAB */}
      <button
        onClick={toggleMenu}
        className="fab-material bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 elevation-4 hover:elevation-5 ripple-effect"
        title="开发者作弊菜单"
        aria-label="Developer cheat menu"
      >
        <span className="transform transition-transform duration-300 ease-in-out">
          {isOpen ? '✕' : '🎮'}
        </span>
      </button>

      {/* Material Design Menu Panel */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 bg-white rounded-2xl elevation-5 border border-gray-100 overflow-hidden animate-slideInUp">
          {/* Material Header */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
                  🎮
                </div>
                <h3 className="font-bold text-lg text-material-h6">开发者菜单</h3>
              </div>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all duration-200 ripple-effect"
                aria-label="Toggle expanded view"
              >
                <span className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                  🔽
                </span>
              </button>
            </div>
            <p className="text-purple-100 text-sm mt-2 text-material-body2">快速跳转和测试工具</p>
          </div>

          {/* Quick Actions */}
          <div className="p-4 border-b border-gray-100">
            <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
              <span className="mr-2">⚡</span>
              快速操作
            </h4>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                onClick={() => handleJumpToPhase(Phase.EVALUATION_CRITERIA)}
                className="px-3 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors text-sm font-medium"
              >
                ⭐ 跳到阶段五
              </button>
              <button
                onClick={() => handleGenerateMockData(Phase.EVALUATION_CRITERIA)}
                className="px-3 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
              >
                🎲 生成测试数据
              </button>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => {
                  handleGenerateMockData(Phase.EVALUATION_CRITERIA);
                  setTimeout(() => handleJumpToPhase(Phase.EVALUATION_CRITERIA), 100);
                }}
                className="px-3 py-2 bg-purple-100 text-purple-800 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium"
              >
                🚀 一键到阶段五（含数据）
              </button>
            </div>
          </div>

          {/* Phase List */}
          {isExpanded && (
            <div className="max-h-96 overflow-y-auto">
              <div className="p-4">
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                  <span className="mr-2">🎯</span>
                  所有阶段
                </h4>
                <div className="space-y-2">
                  {PHASE_ORDER.map((phase, index) => {
                    const phaseDetail = PHASE_DETAILS[phase];
                    const isCurrentPhase = phase === currentPhase;
                    
                    return (
                      <div
                        key={phase}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 ${getPhaseColor(phase)} ${
                          isCurrentPhase ? 'ring-2 ring-blue-300' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center flex-1">
                            <span className="text-lg mr-3">{getPhaseIcon(phase)}</span>
                            <div className="flex-1">
                              <div className="font-medium text-sm">
                                阶段 {index + 1}
                                {isCurrentPhase && <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">当前</span>}
                              </div>
                              <div className="text-xs text-gray-600 mt-1">
                                {phaseDetail.title.split('：')[1] || phaseDetail.title}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col gap-1">
                            <button
                              onClick={() => handleJumpToPhase(phase)}
                              className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors"
                              disabled={isCurrentPhase}
                            >
                              跳转
                            </button>
                            <button
                              onClick={() => handleGenerateMockData(phase)}
                              className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600 transition-colors"
                            >
                              模拟
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="p-3 bg-gray-50 text-center">
            <p className="text-xs text-gray-500">
              ⚠️ 仅用于开发测试，生产环境请移除
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheatMenu;
