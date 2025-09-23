# Layout 组件使用指南

## 概述

Layout 组件提供了一套完整的聊天界面布局系统，包含头部、侧边栏、内容区和输入区。所有布局样式都已默认配置，使用者只需要填充内容到对应的 slot 中即可。

## 基本用法

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
        <div class="sidebar-content">
          <h3>对话列表</h3>
          <!-- 对话列表内容 -->
        </div>
      </template>

      <!-- 头部 -->
      <template #header>
        <div class="header-content">
          <h2>聊天标题</h2>
          <div class="header-actions">
            <!-- 头部操作按钮 -->
          </div>
        </div>
      </template>

      <!-- 主内容区 -->
      <template #content>
        <div class="chat-messages">
          <!-- 消息列表 -->
        </div>
      </template>

      <!-- 输入区 -->
      <template #sender>
        <Input v-model="inputValue" @submit="handleSend" />
      </template>
    </Layout>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { Layout, Input } from "arco-design-x";

// 布局配置
const asideWidth = ref("280px");
const asideCollapsed = ref(false);
const headerHeight = ref("8vh");
const contentHeight = ref("70vh");
const senderHeight = ref("22vh");

const inputValue = ref("");

const handleSend = content => {
  console.log("发送消息:", content);
};
</script>

<style scoped>
.app {
  height: 100vh;
  width: 100vw;
}
</style>
```

## 组件特性

### 1. 自动布局

- **头部区域**: 固定高度，不会被挤压
- **内容区域**: 自动占据剩余空间，内容超出时内部滚动
- **输入区域**: 固定高度，始终保持在底部
- **侧边栏**: 可折叠，支持拖拽调整宽度

### 2. 响应式设计

- 支持移动端适配
- 小屏幕时自动折叠侧边栏
- 所有区域都有最小高度保证

### 3. 滚动优化

- 自定义滚动条样式
- 平滑滚动体验
- 防止布局抖动

## Props 配置

| 属性          | 类型    | 默认值  | 说明         |
| ------------- | ------- | ------- | ------------ |
| asideWidth    | string  | '260px' | 侧边栏宽度   |
| collapsed     | boolean | false   | 是否默认折叠 |
| headerHeight  | string  | '10vh'  | 头部区域高度 |
| contentHeight | string  | '70vh'  | 内容区域高度 |
| senderHeight  | string  | '20vh'  | 输入区域高度 |

## 样式定制

所有组件都使用 CSS 变量，可以通过覆盖变量来定制样式：

```scss
:root {
  --color-bg-1: #ffffff;
  --color-bg-2: #f5f5f5;
  --color-border-2: #e5e5e5;
  --color-text-1: #1d2129;
  --color-text-2: #4e5969;
  --color-text-3: #86909c;
  --color-text-4: #c9cdd4;
}
```

## 注意事项

1. **容器高度**: 确保父容器有明确的高度（如 `100vh`）
2. **内容滚动**: 内容区域的滚动由 Content 组件内部处理
3. **响应式**: 建议监听窗口大小变化来调整布局参数
4. **性能**: 大量消息时建议使用虚拟滚动

## 完整示例

参考 `packages/preview/src/App.vue` 中的完整实现示例。
