<template>
  <div class="ac-layout">
    <a-split
      v-model:size="size"
      class="ac-layout-split"
      min="0px"
      max="600px"
      :disabled="!$slots.aside"
    >
      <template #first>
        <div v-if="$slots.aside" class="ac-layout-aside">
          <slot name="aside" />
        </div>
      </template>
      <template #second>
        <div class="ac-layout-main">
          <div v-if="$slots.header" class="ac-layout-header">
            <slot name="header" />
          </div>
          <div class="ac-layout-content">
            <slot name="content" />
          </div>
          <div v-if="$slots.sender" class="ac-layout-sender">
            <slot name="sender" />
          </div>
        </div>
      </template>
      <template #resize-trigger-icon>
        <SplitButton :collapsed="collapsedNow" @click="toggleCollapse" />
      </template>
    </a-split>
  </div>
  
</template>

<script setup lang="ts">
import type { LayoutProps } from './layout-types'
import SplitButton from './SplitButton.vue'

const props = withDefaults(defineProps<LayoutProps>(), {
  asideWidth: '260px',
  collapsed: false
})

const defaultSize = props.asideWidth
const size = ref(props.collapsed ? '0px' : defaultSize)

const collapsedNow = computed(() => parseInt(size) <= 20)

function toggleCollapse() {
  size.value = collapsedNow.value ? defaultSize : '0px'
}
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

/* 使用 Split 作为主体布局容器 */
.ac-layout-split {
  flex: 1;
}

/* 头部区域 */
.ac-layout-header {
  border-bottom: 1px solid var(--color-border-2);
}

/* 侧边栏区域 */
.ac-layout-aside {
  height: 100%;
  border-right: 1px solid var(--color-border-2);
  overflow-y: auto;
}

/* 主内容区域 */
.ac-layout-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0; /* 关键：允许内容区成为滚动容器 */
}

/* 内容区 */
.ac-layout-content {
  flex: 1 1 auto;
  min-height: 0; /* 关键：使其在flex容器内可收缩并滚动 */
  overflow-y: auto;
  position: relative;
}

/* 底部输入区 */
.ac-layout-sender {
  border-top: 1px solid var(--color-border-2);
  padding: 16px;
  flex: 0 0 auto; /* 锁定底部输入区高度，不被内容挤压 */
}

/* 触发器样式 */
:deep(.arco-split-trigger) {
  position: relative;
}

:deep(.arco-split-trigger-icon-wrapper) {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.ac-layout-trigger {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 32px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-bg-1);
  box-shadow: 0 0 0 1px var(--color-border-2);
  cursor: pointer;
  user-select: none;
}

.ac-layout-trigger-icon {
  color: var(--color-text-2);
  font-weight: 600;
}
</style>
