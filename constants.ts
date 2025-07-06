
import { Phase, PhaseDetail } from './types';

export const GEMINI_MODEL_TEXT = 'gemini-2.5-flash-preview-04-17';

export const PHASE_ORDER: Phase[] = [
  Phase.LANGUAGE_SELECTION,
  Phase.PROBLEM_RECEPTION,
  Phase.DECOMPOSITION,
  Phase.DATA_REQUIREMENTS,
  Phase.DATA_ASSESSMENT,
  Phase.EVALUATION_CRITERIA,
  Phase.ANALYTICAL_APPROACH,
  Phase.PROGRESS_TRACKING,
  Phase.SOLUTION_VALIDATION,
  Phase.COMPLETED,
];

export const PHASE_DETAILS: Record<Phase, PhaseDetail> = {
  [Phase.LANGUAGE_SELECTION]: {
    id: Phase.LANGUAGE_SELECTION,
    title: 'Language Selection / 语言选择',
    description: 'Choose your preferred language for analysis / 选择您的分析语言偏好'
  },
  [Phase.PROBLEM_RECEPTION]: {
    id: Phase.PROBLEM_RECEPTION,
    title: '阶段一：问题接收与分类',
    description: '助手理解并对您的问题进行分类。'
  },
  [Phase.DECOMPOSITION]: {
    id: Phase.DECOMPOSITION,
    title: '阶段二：层级化问题分解',
    description: '助手将问题分解为可管理的部分。'
  },
  [Phase.DATA_REQUIREMENTS]: {
    id: Phase.DATA_REQUIREMENTS,
    title: '阶段三：数据需求规范',
    description: '助手确定分析所需的数据。'
  },
  [Phase.DATA_ASSESSMENT]: {
    id: Phase.DATA_ASSESSMENT,
    title: '阶段四：数据充分性评估',
    description: '助手评估所提供的数据。'
  },
  [Phase.EVALUATION_CRITERIA]: {
    id: Phase.EVALUATION_CRITERIA,
    title: '阶段五：评估标准建立',
    description: '助手定义如何评判解决方案。'
  },
  [Phase.ANALYTICAL_APPROACH]: {
    id: Phase.ANALYTICAL_APPROACH,
    title: '阶段六：分析方法详述',
    description: '助手提出分析方法论。'
  },
  [Phase.PROGRESS_TRACKING]: {
    id: Phase.PROGRESS_TRACKING,
    title: '阶段七：进度追踪与优化',
    description: '助手提供（模拟的）进度报告。'
  },
  [Phase.SOLUTION_VALIDATION]: {
    id: Phase.SOLUTION_VALIDATION,
    title: '阶段八：综合解决方案验证',
    description: '助手验证整体解决方案。'
  },
  [Phase.COMPLETED]: {
    id: Phase.COMPLETED,
    title: '流程已完成',
    description: '问题分析已完成。'
  }
};

export const AGENT_PERSONA_PROMPT_PREFIX = `
You are a rigorous doctoral-level problem analysis agent designed to systematically decompose complex academic challenges.
Your approach is methodical, exhaustive, and maintains the highest academic standards.
Follow the specific instructions for the current phase. Do NOT add any preamble, conversational filler, or explanations beyond what is explicitly requested in the phase instructions.
Provide responses ONLY in the format specified.
`;