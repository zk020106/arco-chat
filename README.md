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

### 样式导入

组件库支持多种样式导入方式：

```javascript
// 方式1：自动导入（推荐）
import { Bubble, BubbleList } from "arco-design-x";
// 样式会自动包含在组件中

// 方式2：手动导入全局样式
import { Bubble, BubbleList } from "arco-design-x";
import "arco-design-x/styles";

// 方式3：在 HTML 中引入
<link rel="stylesheet" href="node_modules/arco-design-x/dist/styles/index.css">
```

**注意：** 如果你使用方式1（自动导入），样式会自动包含。如果你使用方式2或3，需要确保在组件导入之前先导入样式。

## 🚀 快速开始

### 基础用法

```vue
<template>
  <div class="app">
    <Layout
      :aside-width="asideWidth"
      :collapsed="asideCollapsed"
      :header-height="headerHeight"
      :content-height="contentHeight"
      :sender-height="senderHeight"
    >
      <!-- 侧边栏 -->
      <template #aside>
        <div class="conversation-sidebar">
          <!-- 对话列表内容 -->
        </div>
      </template>

      <!-- 头部 -->
      <template #header>
        <div class="chat-header">
          <h3>聊天标题</h3>
        </div>
      </template>

      <!-- 主内容区 -->
      <template #content>
        <div class="chat-content">
          <BubbleList
            :list="messages"
            :loading="loading"
            :reverse="false"
            :show-load-more="true"
            @load-more="handleLoadMore"
            @message-click="handleMessageClick"
          />
        </div>
      </template>

      <!-- 输入区 -->
      <template #sender>
        <Input
          v-model="inputValue"
          :disabled="loading"
          placeholder="输入消息，按 Enter 发送"
          :allow-speech="true"
          :clearable="true"
          @submit="handleSendMessage"
          @voice-input="handleVoiceInput"
        />
      </template>
    </Layout>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Layout, BubbleList, Input } from "arco-design-x";
import type { BubbleMessage } from "arco-design-x";

// 布局配置
const asideWidth = ref("280px");
const asideCollapsed = ref(false);
const headerHeight = ref("8vh");
const contentHeight = ref("70vh");
const senderHeight = ref("22vh");

// 数据状态
const messages = ref<BubbleMessage[]>([]);
const loading = ref(false);
const inputValue = ref("");

const handleSendMessage = (content: string) => {
  console.log("发送消息:", content);
};

const handleLoadMore = () => {
  console.log("加载更多消息");
};

const handleMessageClick = (message: BubbleMessage) => {
  console.log("点击消息:", message);
};

const handleVoiceInput = (audioData: any) => {
  console.log("语音输入:", audioData);
};
</script>
```

### 高级配置

```vue
<template>
  <div class="app">
    <Layout
      :aside-width="asideWidth"
      :collapsed="asideCollapsed"
      :header-height="headerHeight"
      :content-height="contentHeight"
      :sender-height="senderHeight"
    >
      <!-- 侧边栏 -->
      <template #aside>
        <div class="conversation-sidebar">
          <div class="sidebar-header">
            <a-button type="primary" long @click="handleNewConversation">
              新建对话
            </a-button>
          </div>
          <div class="conversation-list">
            <div
              v-for="conversation in conversations"
              :key="conversation.id"
              class="conversation-item"
              @click="handleSelectConversation(conversation.id)"
            >
              {{ conversation.title }}
            </div>
          </div>
        </div>
      </template>

      <!-- 头部 -->
      <template #header>
        <div class="chat-header">
          <div class="header-left">
            <a-button type="text" @click="toggleAside">
              <icon-menu />
            </a-button>
            <h3>{{ currentConversation?.title || "选择对话" }}</h3>
          </div>
        </div>
      </template>

      <!-- 主内容区 -->
      <template #content>
        <div class="chat-content">
          <BubbleList
            :list="currentMessages"
            :loading="loading"
            :reverse="false"
            :show-load-more="true"
            :load-more-text="'加载更多消息'"
            @load-more="handleLoadMore"
            @message-click="handleMessageClick"
          />

          <!-- 加载状态 -->
          <div v-if="loading" class="loading-indicator">
            <a-spin :size="16" />
            <span>AI 正在思考中...</span>
          </div>
        </div>
      </template>

      <!-- 输入区 -->
      <template #sender>
        <!-- Markdown 测试工具栏 -->
        <MarkdownTestToolbar
          @add-message="handleAddMessage"
          @clear-all="handleClearAllMessages"
        />

        <Input
          v-model="inputValue"
          :disabled="loading"
          :placeholder="
            loading ? 'AI 正在回复中...' : '输入消息，按 Enter 发送'
          "
          :allow-speech="true"
          :clearable="true"
          @submit="handleSendMessage"
          @voice-input="handleVoiceInput"
        />
      </template>
    </Layout>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { Layout, BubbleList, Input } from "arco-design-x";
import { IconMenu } from "@arco-design/web-vue/es/icon";
import type { BubbleMessage } from "arco-design-x";
import MarkdownTestToolbar from "./components/MarkdownTestToolbar.vue";

// 布局配置
const asideWidth = ref("280px");
const asideCollapsed = ref(false);
const headerHeight = ref("8vh");
const contentHeight = ref("70vh");
const senderHeight = ref("22vh");

// 对话数据
const conversations = ref([
  {
    id: "1",
    title: "新对话",
    lastMessage: "你好，有什么可以帮助你的吗？",
    timestamp: new Date(),
    unread: 0,
  },
]);

const currentConversationId = ref("1");
const messages = ref<BubbleMessage[]>([]);
const loading = ref(false);
const inputValue = ref("");

const currentConversation = computed(() =>
  conversations.value.find(c => c.id === currentConversationId.value)
);

const currentMessages = computed(() => messages.value);

const toggleAside = () => {
  asideCollapsed.value = !asideCollapsed.value;
  asideWidth.value = asideCollapsed.value ? "0px" : "280px";
};

const handleNewConversation = () => {
  const newId = Date.now().toString();
  conversations.value.unshift({
    id: newId,
    title: "新对话",
    lastMessage: "",
    timestamp: new Date(),
    unread: 0,
  });
  currentConversationId.value = newId;
};

const handleSelectConversation = (conversationId: string) => {
  currentConversationId.value = conversationId;
};

const handleSendMessage = (content: string) => {
  console.log("发送消息:", content);
};

const handleAddMessage = (message: BubbleMessage) => {
  messages.value.push(message);
};

const handleClearAllMessages = () => {
  messages.value = [];
};

const handleLoadMore = () => {
  console.log("加载更多消息");
};

const handleMessageClick = (message: BubbleMessage) => {
  console.log("点击消息:", message);
};

const handleVoiceInput = (audioData: any) => {
  console.log("语音输入:", audioData);
};
</script>
```

## 📚 组件文档

### Layout

布局组件，提供聊天界面的整体布局结构。

#### Props

| 属性            | 类型      | 默认值    | 描述           |
| --------------- | --------- | --------- | -------------- |
| `asideWidth`    | `string`  | `"280px"` | 侧边栏宽度     |
| `collapsed`     | `boolean` | `false`   | 是否折叠侧边栏 |
| `headerHeight`  | `string`  | `"8vh"`   | 头部高度       |
| `contentHeight` | `string`  | `"70vh"`  | 内容区高度     |
| `senderHeight`  | `string`  | `"22vh"`  | 输入区高度     |

#### Slots

| 插槽名    | 描述       |
| --------- | ---------- |
| `aside`   | 侧边栏内容 |
| `header`  | 头部内容   |
| `content` | 主内容区   |
| `sender`  | 输入区内容 |

### BubbleList

消息列表组件，用于显示聊天消息。

#### Props

| 属性           | 类型              | 默认值       | 描述             |
| -------------- | ----------------- | ------------ | ---------------- |
| `list`         | `BubbleMessage[]` | `[]`         | 消息列表         |
| `loading`      | `boolean`         | `false`      | 是否显示加载状态 |
| `reverse`      | `boolean`         | `false`      | 是否反向显示     |
| `showLoadMore` | `boolean`         | `false`      | 是否显示加载更多 |
| `loadMoreText` | `string`          | `"加载更多"` | 加载更多按钮文本 |

#### Events

| 事件名          | 参数                                              | 描述               |
| --------------- | ------------------------------------------------- | ------------------ |
| `load-more`     | `() => void`                                      | 点击加载更多时触发 |
| `message-click` | `(message: BubbleMessage, index: number) => void` | 点击消息时触发     |

### Input

输入组件，用于用户输入消息。

#### Props

| 属性          | 类型      | 默认值  | 描述              |
| ------------- | --------- | ------- | ----------------- |
| `modelValue`  | `string`  | `""`    | 输入值（v-model） |
| `disabled`    | `boolean` | `false` | 是否禁用          |
| `placeholder` | `string`  | `""`    | 占位符文本        |
| `allowSpeech` | `boolean` | `false` | 是否允许语音输入  |
| `clearable`   | `boolean` | `false` | 是否显示清除按钮  |

#### Events

| 事件名        | 参数                        | 描述           |
| ------------- | --------------------------- | -------------- |
| `submit`      | `(content: string) => void` | 提交消息时触发 |
| `voice-input` | `(audioData: any) => void`  | 语音输入时触发 |

### MarkdownRender

Markdown 渲染组件，支持丰富的 Markdown 语法。

#### Props

| 属性            | 类型      | 默认值  | 描述                    |
| --------------- | --------- | ------- | ----------------------- |
| `content`       | `string`  | `""`    | Markdown 内容           |
| `enableLatex`   | `boolean` | `true`  | 是否启用 LaTeX 数学公式 |
| `enableMermaid` | `boolean` | `true`  | 是否启用 Mermaid 图表   |
| `enableEmoji`   | `boolean` | `true`  | 是否启用 Emoji 支持     |
| `typing`        | `boolean` | `false` | 是否启用打字机效果      |
| `safeMode`      | `boolean` | `false` | 是否启用安全模式        |

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
│   │   │   │   │   ├── Bubble.vue
│   │   │   │   │   ├── BubbleList.vue
│   │   │   │   │   ├── BubbleLoading.vue
│   │   │   │   │   └── bubble-types.ts
│   │   │   │   ├── Input/    # 输入框组件
│   │   │   │   │   ├── Input.vue
│   │   │   │   │   ├── components/
│   │   │   │   │   │   ├── VoiceInput.vue
│   │   │   │   │   │   ├── LoadingIcon.vue
│   │   │   │   │   │   └── SendIcon.vue
│   │   │   │   │   └── composables/
│   │   │   │   │       └── useInput.ts
│   │   │   │   ├── Layout/   # 布局组件
│   │   │   │   │   ├── Layout.vue
│   │   │   │   │   ├── Aside.vue
│   │   │   │   │   ├── Content.vue
│   │   │   │   │   ├── Header.vue
│   │   │   │   │   ├── Sender.vue
│   │   │   │   │   └── SplitButton.vue
│   │   │   │   ├── MarkdownRender/ # Markdown 渲染组件
│   │   │   │   │   ├── MarkdownRender.vue
│   │   │   │   │   ├── components/
│   │   │   │   │   │   ├── CodeBlock.vue
│   │   │   │   │   │   ├── MermaidBlock.vue
│   │   │   │   │   │   └── ThinkBlock.vue
│   │   │   │   │   └── plugins/
│   │   │   │   │       ├── latex-plugin.ts
│   │   │   │   │       ├── mermaid-plugin.ts
│   │   │   │   │       ├── emoji-plugin.ts
│   │   │   │   │       └── plugin-manager.ts
│   │   │   │   ├── Mention/  # 提及组件
│   │   │   │   ├── Prompt/   # 提示组件
│   │   │   │   └── Typewriter/ # 打字机组件
│   │   │   └── index.ts
│   │   └── dist/             # 构建输出
│   └── preview/              # 预览应用
│       ├── src/
│       │   ├── App.vue       # 主应用组件
│       │   ├── main.ts       # 入口文件
│       │   └── components/
│       │       └── MarkdownTestToolbar.vue
│       └── index.html
├── .husky/                   # Git hooks
├── .changeset/               # 版本管理
├── .prettierrc               # Prettier 配置
├── .prettierignore           # Prettier 忽略文件
├── oxlint.json               # oxlint 配置
└── README.md                 # 项目文档
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
