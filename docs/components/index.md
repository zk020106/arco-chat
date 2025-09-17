---
title: 组件库概览
description: Arco Chat 组件库 - 专为聊天应用设计的 Vue 3 组件库
---

# Arco Chat 组件库

欢迎使用 Arco Chat 组件库！这是一个专为聊天应用设计的 Vue 3 组件库，提供了一套完整的聊天界面解决方案。

## 🚀 特性

- **🎨 现代化设计**: 基于 Arco Design 设计语言，提供一致的用户体验
- **📱 响应式布局**: 支持各种屏幕尺寸，移动端友好
- **🎯 高度可定制**: 丰富的插槽系统和配置选项
- **🔧 TypeScript 支持**: 完整的类型定义，提供更好的开发体验
- **⚡ 性能优化**: 基于 Vue 3 Composition API，性能优异
- **🎭 主题支持**: 支持深色/浅色主题切换

## 📦 组件列表

### 核心组件

- **[Bubble](./bubble/index.md)** - 消息气泡组件
- **[BubbleList](./bubble/bubble-list.md)** - 消息列表组件
- **[Input](./input/index.md)** - 输入框组件
- **[Layout](./layout/index.md)** - 布局组件

### 高级组件

- **[Mention](./mention/index.md)** - 提及组件
- **[Prompt](./prompt/index.md)** - 提示组件
- **[MarkdownRenderer](./markdown-renderer/index.md)** - Markdown 渲染器

## 🎯 快速开始

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

## 🎨 设计理念

### 组件化设计
每个组件都是独立的，可以单独使用，也可以组合使用，提供最大的灵活性。

### 插槽系统
通过 Vue 的插槽系统，你可以完全自定义组件的渲染内容，满足各种定制需求。

### 配置驱动
通过 props 配置组件行为，减少代码量，提高开发效率。

## 📖 文档结构

- **[组件概览](./index.md)** - 当前页面，组件库整体介绍
- **[Bubble 组件](./bubble/index.md)** - 消息气泡组件文档
- **[BubbleList 组件](./bubble/bubble-list.md)** - 消息列表组件文档
- **[Input 组件](./input/index.md)** - 输入框组件文档
- **[Layout 组件](./layout/index.md)** - 布局组件文档
- **[Mention 组件](./mention/index.md)** - 提及组件文档
- **[Prompt 组件](./prompt/index.md)** - 提示组件文档
- **[MarkdownRenderer 组件](./markdown-renderer/index.md)** - Markdown 渲染器文档
- **[综合示例](./comprehensive-demo.md)** - 完整应用示例

## 🔗 相关链接

- [Arco Design](https://arco.design/) - 基础设计系统
- [Vue 3](https://vuejs.org/) - 前端框架
- [TypeScript](https://www.typescriptlang.org/) - 类型系统

## 📄 许可证

MIT License