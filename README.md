# 🔍 Super Analysis - 博士级问题分析助手

这是一个基于 Google Gemini AI 的系统化问题分析工具，帮助用户进行博士级别的问题分解与分析。

## 功能特点

- 🎯 **8阶段系统化分析**：从问题接收到最终验证的完整流程
- 🤖 **AI驱动**：基于 Google Gemini 2.5 Flash 模型
- 📊 **可视化展示**：Mermaid 图表支持
- 🎮 **开发者工具**：内置作弊菜单用于快速测试
- 📱 **响应式设计**：支持桌面和移动设备

## 快速开始

**前置要求：** Node.js 18+

### 1. 安装依赖
```bash
npm install
```

### 2. 设置环境变量
复制环境变量模板：
```bash
cp .env.example .env
```

编辑 `.env` 文件，设置你的 Google AI API 密钥：
```env
VITE_GOOGLE_AI_API_KEY=your_api_key_here
```

> 💡 **获取 API 密钥**：访问 [Google AI Studio](https://aistudio.google.com/app/apikey) 获取免费的 API 密钥

### 3. 启动开发服务器
```bash
npm run dev
```

应用将在 `http://localhost:5173` 启动

## 开发者功能

### 🎮 作弊菜单
- 点击右下角紫色按钮打开开发者菜单
- 快速跳转到任意阶段
- 生成测试数据
- 一键到阶段五（含完整数据链）

### 🏗️ 项目结构
```
├── components/          # React 组件
│   ├── phases/         # 各阶段组件
│   └── ...
├── services/           # API 服务
├── types.ts           # TypeScript 类型定义
├── constants.ts       # 常量配置
└── .env              # 环境变量（不提交到 git）
```

## 构建部署

```bash
npm run build
npm run preview
```

## 技术栈

- **前端框架**：React 19 + TypeScript
- **构建工具**：Vite 6
- **AI 模型**：Google Gemini 2.5 Flash
- **图表库**：Mermaid
- **样式**：Tailwind CSS

## 注意事项

⚠️ **生产环境部署前请移除作弊菜单组件**

🔒 **API 密钥安全**：
- `.env` 文件已添加到 `.gitignore`
- 不要将 API 密钥提交到版本控制
- 生产环境请使用环境变量管理
