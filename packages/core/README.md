# ArcoDesign-X

基于 Vue3 + TypeScript 的高质量聊天组件库，专为 AI 对话应用设计。

## ✨ 特性

- 🎨 **现代化设计** - 基于 Arco Design 设计语言
- 🚀 **Vue 3 支持** - 使用 Composition API 和 `<script setup>`
- 📱 **响应式设计** - 完美适配桌面端和移动端
- 🎯 **TypeScript** - 完整的类型定义支持
- 🔧 **高度可定制** - 通过插槽、配置和样式变量实现灵活定制
- 📦 **按需引入** - 支持 Tree Shaking，减少打包体积
- 🎭 **丰富功能** - 打字机动画、语音输入、指令触发、Markdown 渲染等

## 📦 安装

```bash
npm install arco-design-x
# 或
yarn add arco-design-x
# 或
pnpm add arco-design-x
```

## 🚀 快速开始

### 基础用法

```vue
<template>
  <div class="chat-app">
    <!-- 聊天布局 -->
    <Layout>
      <!-- 消息列表 -->
      <template #content>
        <BubbleList
          :list="messages"
          :auto-scroll="true"
          @load-more="loadMore"
        />
      </template>
      
      <!-- 输入框 -->
      <template #sender>
        <Input
          v-model="input"
          :loading="loading"
          @submit="sendMessage"
        />
      </template>
    </Layout>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Layout, BubbleList, Input } from 'arco-design-x'

const input = ref('')
const loading = ref(false)
const messages = ref([
  {
    id: '1',
    content: '你好！有什么可以帮助你的吗？',
    align: 'start',
    timestamp: Date.now()
  }
])

const sendMessage = async (message) => {
  // 添加用户消息
  messages.value.push({
    id: Date.now().toString(),
    content: message,
    align: 'end',
    timestamp: Date.now()
  })
  
  // 显示 AI 回复
  loading.value = true
  const aiMessage = {
    id: (Date.now() + 1).toString(),
    content: '这是 AI 的回复...',
    align: 'start',
    timestamp: Date.now(),
    typewriter: true,
    markdown: true
  }
  messages.value.push(aiMessage)
  loading.value = false
}

const loadMore = () => {
  console.log('加载更多消息')
}
</script>

<style>
.chat-app {
  height: 100vh;
}
</style>
```

### 高级功能

#### 语音输入

```vue
<Input
  v-model="input"
  :voice-input="{
    enabled: true,
    customRecognition: myVoiceRecognition
  }"
  @submit="sendMessage"
>
  <template #voice-button="{ state, toggle }">
    <button @click="toggle">
      {{ state === 'recording' ? '🎤' : '🎙️' }}
    </button>
  </template>
</Input>
```

#### 指令触发

```vue
<Input
  v-model="input"
  :command-triggers="[
    {
      trigger: '/',
      getSuggestions: () => [
        { text: '清空对话', value: '/clear' },
        { text: '导出记录', value: '/export' }
      ]
    }
  ]"
  @command-trigger="handleCommand"
  @submit="sendMessage"
/>
```

## 📚 组件文档

### 核心组件

| 组件 | 描述 | 文档 |
|------|------|------|
| **Layout** | 聊天界面布局组件 | [查看文档](./src/components/Layout/README.md) |
| **BubbleList** | 消息列表容器组件 | [查看文档](./src/components/Bubble/README.md) |
| **Bubble** | 单个消息气泡组件 | [查看文档](./src/components/Bubble/README.md) |
| **Input** | 智能输入框组件 | [查看文档](./src/components/Input/README.md) |

### 辅助组件

| 组件 | 描述 |
|------|------|
| **Typewriter** | 打字机动画组件 |
| **MarkdownRender** | Markdown 渲染组件 |
| **VoiceInput** | 语音输入组件 |
| **CommandTrigger** | 指令触发组件 |

## 🎯 使用场景

- **AI 聊天应用** - 与 ChatGPT、Claude 等 AI 服务集成
- **客服系统** - 在线客服聊天界面
- **社交应用** - 用户间消息交流
- **协作工具** - 团队沟通和协作
- **教育平台** - 在线教学和答疑

## 📖 完整指南

- [快速开始指南](./QUICKSTART.md) - 快速上手
- [AI 对话应用搭建指南](./src/components/AIChatGuide.md) - 完整应用搭建
- [示例项目](./examples/) - 可运行的示例代码

## 🎨 样式定制

组件库使用 CSS 变量进行样式定制：

```css
:root {
  --color-primary-6: #165dff;
  --color-bg-1: #ffffff;
  --color-bg-2: #f7f8fa;
  --color-text-1: #1d2129;
  --color-text-2: #4e5969;
  --color-text-3: #86909c;
}
```

## 🔧 开发

```bash
# 克隆项目
git clone https://github.com/your-org/arco-design-x.git

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建
pnpm build
```

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 支持

如果你在使用过程中遇到问题，请：

1. 查看 [文档](./src/components/)
2. 查看 [示例项目](./examples/)
3. 提交 [Issue](https://github.com/your-org/arco-design-x/issues)
