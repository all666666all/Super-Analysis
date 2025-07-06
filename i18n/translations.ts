import { Language } from '../types';

export interface Translations {
  // Common
  loading: string;
  error: string;
  continue: string;
  cancel: string;
  save: string;
  edit: string;
  delete: string;
  add: string;
  confirm: string;
  
  // Navigation
  nextPhase: string;
  previousPhase: string;
  
  // Phase titles
  phases: {
    languageSelection: string;
    problemReception: string;
    decomposition: string;
    dataRequirements: string;
    dataAssessment: string;
    evaluationCriteria: string;
    analyticalApproach: string;
    progressTracking: string;
    solutionValidation: string;
    completed: string;
  };
  
  // Problem Reception Phase
  problemReception: {
    title: string;
    description: string;
    placeholder: string;
    submitButton: string;
    analysisComplete: string;
    problemRestatement: string;
    domainIdentification: string;
    classificationTags: string;
    addTag: string;
    aiConfirmation: string;
    proceedToNext: string;
    tips: {
      goodExample: {
        title: string;
        description: string;
      };
      suggestions: {
        title: string;
        description: string;
      };
      analysisDepth: {
        title: string;
        description: string;
      };
    };
  };
  
  // Evaluation Criteria Phase
  evaluationCriteria: {
    title: string;
    primaryCriteria: string;
    componentSpecific: string;
    qualityThresholds: {
      exceptional: string;
      doctoralStandard: string;
      needsImprovement: string;
    };
    alignmentStatement: string;
  };
  
  // Cheat Menu
  cheatMenu: {
    title: string;
    description: string;
    quickActions: string;
    jumpToPhase: string;
    generateMockData: string;
    oneClickPhase5: string;
    allPhases: string;
    jump: string;
    simulate: string;
    current: string;
    warning: string;
  };
}

export const translations: Record<Language, Translations> = {
  [Language.ENGLISH]: {
    // Common
    loading: 'Loading...',
    error: 'Error',
    continue: 'Continue',
    cancel: 'Cancel',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    add: 'Add',
    confirm: 'Confirm',
    
    // Navigation
    nextPhase: 'Next Phase',
    previousPhase: 'Previous Phase',
    
    // Phase titles
    phases: {
      languageSelection: 'Language Selection',
      problemReception: 'Problem Reception & Classification',
      decomposition: 'Hierarchical Problem Decomposition',
      dataRequirements: 'Data Requirements Specification',
      dataAssessment: 'Data Sufficiency Assessment',
      evaluationCriteria: 'Evaluation Criteria Establishment',
      analyticalApproach: 'Analytical Approach Elaboration',
      progressTracking: 'Progress Tracking & Optimization',
      solutionValidation: 'Comprehensive Solution Validation',
      completed: 'Analysis Complete'
    },
    
    // Problem Reception Phase
    problemReception: {
      title: 'Describe Your Research Problem',
      description: 'Please provide a detailed description of the complex academic problem you need analyzed',
      placeholder: 'For example: Research the socio-economic impacts of climate change on Southeast Asian coastal communities, focusing on policy responses and the effectiveness of adaptation strategies...',
      submitButton: 'Submit to AI Assistant',
      analysisComplete: 'AI Analysis Complete',
      problemRestatement: 'Problem Restatement',
      domainIdentification: 'Domain Identification',
      classificationTags: 'Classification Tags',
      addTag: 'Add Tag',
      aiConfirmation: 'AI Assistant Confirmation',
      proceedToNext: 'Proceed to Next Phase',
      tips: {
        goodExample: {
          title: 'Good Problem Examples',
          description: 'Include specific research subjects, time frame, geographical scope, and research objectives'
        },
        suggestions: {
          title: 'Recommended Content',
          description: 'Research background, expected outcomes, methodological preferences, and constraints'
        },
        analysisDepth: {
          title: 'Analysis Depth',
          description: 'AI will provide doctoral-level systematic analysis and recommendations'
        }
      }
    },
    
    // Evaluation Criteria Phase
    evaluationCriteria: {
      title: 'Evaluation Framework Overview',
      primaryCriteria: 'Primary Evaluation Criteria',
      componentSpecific: 'Component-Specific Standards',
      qualityThresholds: {
        exceptional: 'Exceptional',
        doctoralStandard: 'Doctoral Standard',
        needsImprovement: 'Needs Improvement'
      },
      alignmentStatement: 'Alignment Statement'
    },
    
    // Cheat Menu
    cheatMenu: {
      title: 'Developer Menu',
      description: 'Quick navigation and testing tools',
      quickActions: 'Quick Actions',
      jumpToPhase: 'Jump to Phase 5',
      generateMockData: 'Generate Test Data',
      oneClickPhase5: 'One-Click to Phase 5 (with data)',
      allPhases: 'All Phases',
      jump: 'Jump',
      simulate: 'Simulate',
      current: 'Current',
      warning: 'For development testing only, remove in production'
    }
  },
  
  [Language.CHINESE]: {
    // Common
    loading: '加载中...',
    error: '错误',
    continue: '继续',
    cancel: '取消',
    save: '保存',
    edit: '编辑',
    delete: '删除',
    add: '添加',
    confirm: '确认',
    
    // Navigation
    nextPhase: '下一阶段',
    previousPhase: '上一阶段',
    
    // Phase titles
    phases: {
      languageSelection: '语言选择',
      problemReception: '问题接收与分类',
      decomposition: '层级化问题分解',
      dataRequirements: '数据需求规范',
      dataAssessment: '数据充分性评估',
      evaluationCriteria: '评估标准建立',
      analyticalApproach: '分析方法详述',
      progressTracking: '进度追踪与优化',
      solutionValidation: '综合解决方案验证',
      completed: '分析完成'
    },
    
    // Problem Reception Phase
    problemReception: {
      title: '描述您的研究问题',
      description: '请详细描述您需要分析的复杂学术问题',
      placeholder: '例如：研究气候变化对东南亚沿海社区的社会经济影响，重点关注政策响应和适应策略的有效性评估...',
      submitButton: '提交给AI助手',
      analysisComplete: 'AI分析完成',
      problemRestatement: '问题重述',
      domainIdentification: '学科领域识别',
      classificationTags: '问题分类标签',
      addTag: '添加标签',
      aiConfirmation: 'AI助手确认',
      proceedToNext: '进入下一阶段',
      tips: {
        goodExample: {
          title: '好的问题示例',
          description: '包含具体研究对象、时间范围、地理范围和研究目标'
        },
        suggestions: {
          title: '建议包含',
          description: '研究背景、预期成果、方法偏好和约束条件'
        },
        analysisDepth: {
          title: '分析深度',
          description: 'AI将提供博士级别的系统化分析和建议'
        }
      }
    },
    
    // Evaluation Criteria Phase
    evaluationCriteria: {
      title: '评估框架概览',
      primaryCriteria: '主要评估标准',
      componentSpecific: '特定组件标准',
      qualityThresholds: {
        exceptional: '杰出',
        doctoralStandard: '博士标准',
        needsImprovement: '有待改进'
      },
      alignmentStatement: '对齐声明'
    },
    
    // Cheat Menu
    cheatMenu: {
      title: '开发者菜单',
      description: '快速跳转和测试工具',
      quickActions: '快速操作',
      jumpToPhase: '跳到阶段五',
      generateMockData: '生成测试数据',
      oneClickPhase5: '一键到阶段五（含数据）',
      allPhases: '所有阶段',
      jump: '跳转',
      simulate: '模拟',
      current: '当前',
      warning: '仅用于开发测试，生产环境请移除'
    }
  }
};

export const getTranslation = (language: Language): Translations => {
  return translations[language] || translations[Language.ENGLISH];
};
