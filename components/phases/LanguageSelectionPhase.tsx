import React from 'react';
import { Language, PhaseProps } from '../../types';

const LanguageSelectionPhase: React.FC<PhaseProps> = ({
  appState,
  updateState,
  advancePhase,
}) => {
  const { selectedLanguage } = appState;

  const handleLanguageSelect = (language: Language) => {
    // Store in localStorage for persistence
    localStorage.setItem('selectedLanguage', language);
    
    updateState({ selectedLanguage: language });
    
    // Auto-advance to next phase after selection
    setTimeout(() => {
      advancePhase();
    }, 500);
  };

  const languages = [
    {
      code: Language.ENGLISH,
      name: 'English',
      nativeName: 'English',
      flag: '🇺🇸',
      description: 'Conduct analysis in English with international academic standards'
    },
    {
      code: Language.CHINESE,
      name: 'Chinese',
      nativeName: '中文',
      flag: '🇨🇳',
      description: '使用中文进行分析，符合中国学术标准'
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full flex items-center justify-center text-4xl mx-auto mb-6 shadow-lg">
            🌐
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Choose Your Language / 选择语言
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Select your preferred language for the doctoral-level problem analysis system.
            <br />
            <span className="text-gray-500">选择您在博士级问题分析系统中的首选语言。</span>
          </p>
        </div>

        {/* Language Options */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageSelect(lang.code)}
              className={`group relative p-8 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
                selectedLanguage === lang.code
                  ? 'border-blue-500 bg-blue-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <span className="text-6xl mr-4">{lang.flag}</span>
                  <div className="text-left">
                    <h3 className="text-2xl font-bold text-gray-800 mb-1">
                      {lang.nativeName}
                    </h3>
                    <p className="text-lg text-gray-600">{lang.name}</p>
                  </div>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 transition-all ${
                  selectedLanguage === lang.code
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300 group-hover:border-blue-400'
                }`}>
                  {selectedLanguage === lang.code && (
                    <svg className="w-4 h-4 text-white m-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
              
              <p className="text-gray-700 leading-relaxed text-left">
                {lang.description}
              </p>
              
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
            </button>
          ))}
        </div>

        {/* Features Preview */}
        <div className="bg-white rounded-xl p-8 shadow-md border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
            System Features / 系统功能
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm mr-2">✓</span>
                English Features
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• 8-stage systematic analysis framework</li>
                <li>• AI-powered problem decomposition</li>
                <li>• Interactive data assessment tools</li>
                <li>• Comprehensive validation reports</li>
                <li>• Mermaid diagram visualization</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm mr-2">✓</span>
                中文功能
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• 8阶段系统化分析框架</li>
                <li>• AI驱动的问题分解</li>
                <li>• 交互式数据评估工具</li>
                <li>• 综合验证报告</li>
                <li>• Mermaid图表可视化</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Your language preference will be saved for future sessions.
            <br />
            您的语言偏好将保存以供将来使用。
          </p>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelectionPhase;
