<template>
  <div class="ac-layout">
    <div v-if="$slots.header" class="ac-layout-header">
      <slot name="header" />
    </div>
    <div class="ac-layout-body">
      <div v-if="$slots.aside" class="ac-layout-aside">
        <slot name="aside" />
      </div>
      <div class="ac-layout-main">
        <div class="ac-layout-content">
          <slot name="content" />
        </div>
        <div v-if="$slots.sender" class="ac-layout-sender">
          <slot name="sender" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LayoutProps } from './layout-types'

const _props = withDefaults(defineProps<LayoutProps>(), {})
// Layout component - serves as the main container for the chat interface
</script>

<style scoped lang="scss">
/* 布局组件外层容器 */
.ac-layout {
  display: flex; /* 使用flex布局 */
  flex-direction: column; /* 垂直排列 */
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: var(--color-bg-1); /* 背景色 */
  border-radius: var(--border-radius-large); /* 圆角 */
  box-shadow: var(--shadow-card); /* 阴影 */
}

/* 主体区域 */
.ac-layout-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* 头部区域 */
.ac-layout-header {
  border-bottom: 1px solid var(--color-border-2);
}

/* 侧边栏区域 */
.ac-layout-aside {
  width: 260px;
  border-right: 1px solid var(--color-border-2);
  overflow-y: auto;
}

/* 主内容区域 */
.ac-layout-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 内容区 */
.ac-layout-content {
  flex: 1;
  overflow-y: auto;
  position: relative;
}

/* 底部输入区 */
.ac-layout-sender {
  border-top: 1px solid var(--color-border-2);
  padding: 16px;
}
</style>
