# Arco Chat

一个基于 Vue 3 + TypeScript + Arco Design 的现代化聊天组件库，支持 Markdown 渲染、LaTeX 数学公式、Mermaid 图表等功能。

[![GitHub stars](https://img.shields.io/github/stars/zk020106/arco-design-x?style=social)](https://github.com/zk020106/arco-design-x)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/zk020106/arco-design-x/blob/main/LICENSE)
[![Vue](https://img.shields.io/badge/Vue-3.4.0-4FC08D?logo=vue.js)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript)](https://www.typescriptlang.org/)

## ✨ 特性

- 🎨 **现代化设计** - 基于 Arco Design 的优雅 UI 组件
- 📝 **Markdown 支持** - 完整的 Markdown 渲染能力
- 🧮 **LaTeX 数学公式** - 支持 KaTeX 渲染数学公式
- 📊 **Mermaid 图表** - 支持流程图、时序图等图表渲染
- ⌨️ **打字机效果** - 支持逐字显示的动画效果
- 🎯 **TypeScript** - 完整的类型定义支持
- 📱 **响应式设计** - 适配各种屏幕尺寸
- 🛡️ **安全渲染** - 支持 XSS 防护和内容过滤
- 🎨 **主题定制** - 支持自定义主题和样式
- 🔧 **高度可配置** - 丰富的配置选项

## 📦 安装

```bash
# 使用 pnpm (推荐)
pnpm add arco-design-x

# 使用 npm
npm install arco-design-x

# 使用 yarn
yarn add arco-design-x
```

## 🚀 快速开始

### 基础用法

```vue
<template>
  <div class="chat-container">
    <ArcoChat
      :messages="messages"
      :typing="true"
      :enable-latex="true"
      :enable-mermaid="true"
    />
  </div>
</template>

<script setup lang="ts">
import { ArcoChat } from "arco-design-x";
import "arco-design-x/dist/style.css";

const messages = [
  {
    id: 1,
    content: "Hello! How can I help you today?",
    role: "assistant",
    timestamp: new Date(),
  },
];
</script>
```

### 高级配置

```vue
<template>
  <ArcoChat
    :messages="messages"
    :typing="true"
    :typing-options="{ speed: 50, pause: 1000 }"
    :enable-latex="true"
    :enable-mermaid="true"
    :enable-emoji="true"
    :safe-mode="true"
    :theme="'dark'"
    @send="handleSend"
    @typing-start="handleTypingStart"
    @typing-end="handleTypingEnd"
  />
</template>

<script setup lang="ts">
import { ArcoChat } from "arco-design-x";
import type { ChatMessage, TypingOptions } from "arco-design-x";

const messages = ref<ChatMessage[]>([]);

const handleSend = (content: string) => {
  // 处理发送消息
  console.log("发送消息:", content);
};

const handleTypingStart = () => {
  console.log("开始打字...");
};

const handleTypingEnd = () => {
  console.log("打字结束");
};
</script>
```

## 📚 组件文档

### ArcoChat

主要的聊天组件，提供完整的聊天界面功能。

#### Props

| 属性            | 类型                | 默认值    | 描述                    |
| --------------- | ------------------- | --------- | ----------------------- |
| `messages`      | `ChatMessage[]`     | `[]`      | 聊天消息列表            |
| `typing`        | `boolean`           | `false`   | 是否启用打字机效果      |
| `typingOptions` | `TypingOptions`     | `{}`      | 打字机效果配置          |
| `enableLatex`   | `boolean`           | `true`    | 是否启用 LaTeX 数学公式 |
| `enableMermaid` | `boolean`           | `true`    | 是否启用 Mermaid 图表   |
| `enableEmoji`   | `boolean`           | `true`    | 是否启用 Emoji 支持     |
| `safeMode`      | `boolean`           | `false`   | 是否启用安全模式        |
| `theme`         | `'light' \| 'dark'` | `'light'` | 主题模式                |

#### Events

| 事件名         | 参数                        | 描述           |
| -------------- | --------------------------- | -------------- |
| `send`         | `(content: string) => void` | 发送消息时触发 |
| `typing-start` | `() => void`                | 开始打字时触发 |
| `typing-end`   | `() => void`                | 打字结束时触发 |

### MarkdownRender

Markdown 渲染组件，支持丰富的 Markdown 语法。

```vue
<template>
  <MarkdownRender
    :content="markdownContent"
    :enable-latex="true"
    :enable-mermaid="true"
    :typing="true"
  />
</template>
```

## 🎨 主题定制

### CSS 变量

```css
:root {
  --color-bg: #f7f8fa;
  --color-card: #fff;
  --color-primary: #00b96b;
  --color-text: #222;
  --color-text-secondary: #888;
  --color-border: #e5e6eb;
  --radius-lg: 16px;
  --radius-md: 10px;
  --radius-sm: 6px;
}
```

### 自定义样式

```vue
<style scoped>
.chat-container {
  --color-primary: #1890ff;
  --color-bg: #f0f2f5;
}
</style>
```

## 📝 支持的 Markdown 语法

### 基础语法

- 标题 (H1-H6)
- 段落和换行
- 粗体和斜体
- 链接和图片
- 列表（有序和无序）
- 引用块
- 代码块
- 表格

### 扩展语法

- LaTeX 数学公式：`$inline$` 和 `$$block$$`
- Mermaid 图表：`<mermaid>...</mermaid>`
- Emoji：`:smile:` 和 Unicode 表情
- 代码高亮：支持多种编程语言

### 示例

````markdown
# 数学公式

行内公式：$E = mc^2$

块级公式：

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

# Mermaid 图表

<mermaid>
graph TD
    A[开始] --> B{判断条件}
    B -->|是| C[执行操作]
    B -->|否| D[结束]
    C --> D
</mermaid>

# 代码高亮

```typescript
function hello(name: string): string {
  return `Hello, ${name}!`;
}
```
````

## 🛠️ 开发

### 环境要求

- Node.js >= 18.20.0
- pnpm >= 9.12.0

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
# 启动预览应用
pnpm dev

# 启动核心库开发模式
pnpm dev:core
```

### 构建

```bash
# 构建所有包
pnpm build

# 构建核心库
pnpm build:core

# 构建预览应用
pnpm build:preview
```

### 代码检查

```bash
# 运行 lint 检查
pnpm lint

# 自动修复 lint 问题
pnpm lint:fix

# 格式化代码
pnpm format
```

## 📁 项目结构

```
arco-design-x/
├── packages/
│   ├── core/                 # 核心组件库
│   │   ├── src/
│   │   │   ├── components/   # 组件源码
│   │   │   │   ├── Bubble/   # 消息气泡组件
│   │   │   │   ├── Input/    # 输入框组件
│   │   │   │   ├── Layout/   # 布局组件
│   │   │   │   ├── MarkdownRender/ # Markdown 渲染组件
│   │   │   │   ├── Mention/  # 提及组件
│   │   │   │   ├── Prompt/   # 提示组件
│   │   │   │   └── Typewriter/ # 打字机组件
│   │   │   └── index.ts
│   │   └── dist/             # 构建输出
│   └── preview/              # 预览应用
│       └── src/
├── .husky/                   # Git hooks
├── .changeset/               # 版本管理
└── docs/                     # 文档
```

## 🤝 贡献

欢迎贡献代码！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

### 开发规范

- 使用 TypeScript 编写代码
- 遵循 ESLint 和 Prettier 配置
- 编写单元测试
- 更新相关文档

## 📄 许可证

本项目基于 [MIT 许可证](https://github.com/zk020106/arco-design-x/blob/main/LICENSE) 开源。

## 🙏 致谢

- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Arco Design](https://arco.design/) - 字节跳动企业级设计语言
- [Markdown-it](https://markdown-it.github.io/) - Markdown 解析器
- [KaTeX](https://katex.org/) - 数学公式渲染
- [Mermaid](https://mermaid-js.github.io/) - 图表和流程图

## 📞 联系方式

- GitHub: [@zk020106](https://github.com/zk020106)
- 项目地址: [https://github.com/zk020106/arco-design-x](https://github.com/zk020106/arco-design-x)

---

⭐ 如果这个项目对你有帮助，请给它一个 Star！
