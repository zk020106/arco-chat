---
layout: home

hero:
  name: "Arco Chat"
  text: "专为聊天应用设计的 Vue 3 组件库"
  tagline: "基于 Arco Design 设计语言，提供完整的聊天界面解决方案"
  image:
    src: /logo.svg
    alt: Arco Chat
  actions:
    - theme: brand
      text: 开始使用
      link: /components/
    - theme: alt
      text: 查看 GitHub
      link: https://github.com/your-org/arco-chat

features:
  - icon: 🎨
    title: 现代化设计
    details: 基于 Arco Design 设计语言，提供一致的用户体验
  - icon: 📱
    title: 响应式布局
    details: 支持各种屏幕尺寸，移动端友好
  - icon: 🎯
    title: 高度可定制
    details: 丰富的插槽系统和配置选项
  - icon: 🔧
    title: TypeScript 支持
    details: 完整的类型定义，提供更好的开发体验
  - icon: ⚡
    title: 性能优化
    details: 基于 Vue 3 Composition API，性能优异
  - icon: 🎭
    title: 主题支持
    details: 支持深色/浅色主题切换
---

## 快速开始

### 安装

```bash
npm install @arco-chat/core
```

### 基本使用

```vue
<template>
  <Layout>
    <template #header>
      <Header title="聊天应用" />
    </template>
    <template #content>
      <BubbleList :messages="messages" />
    </template>
    <template #sender>
      <Input @send="handleSend" />
    </template>
  </Layout>
</template>

<script setup>
import { Layout, Header, BubbleList, Input } from '@arco-chat/core'

const messages = ref([
  {
    id: '1',
    content: '你好！',
    align: 'left',
    avatarConfig: { displayName: '用户' }
  }
])

const handleSend = (value) => {
  console.log('发送消息:', value)
}
</script>
```

## 组件列表

### 核心组件

- **Bubble** - 消息气泡组件
- **BubbleList** - 消息列表组件
- **Input** - 输入框组件
- **Layout** - 布局组件

### 高级组件

- **Mention** - 提及组件
- **Prompt** - 提示组件
- **MarkdownRenderer** - Markdown 渲染器

## 设计理念

### 组件化设计
每个组件都是独立的，可以单独使用，也可以组合使用，提供最大的灵活性。

### 插槽系统
通过 Vue 的插槽系统，你可以完全自定义组件的渲染内容，满足各种定制需求。

### 配置驱动
通过 props 配置组件行为，减少代码量，提高开发效率。