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
          <!-- 使用 Grid 布局 -->
          <div v-if="$slots.header" class="ac-layout-header">
            <div class="ac-header-content">
              <slot name="header" />
            </div>
          </div>
          <div class="ac-layout-content">
            <div ref="contentWrapperRef" class="ac-content-wrapper">
              <slot name="content" />
            </div>
          </div>
          <div v-if="$slots.sender" class="ac-layout-sender">
            <div class="ac-sender-content">
              <slot name="sender" />
            </div>
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
import { ref, computed, watch } from "vue";
import {
  useMutationObserver,
  useDebounceFn,
  useElementSize,
} from "@vueuse/core";
import type { LayoutProps } from "./layout-types";
import SplitButton from "./SplitButton.vue";

const props = withDefaults(defineProps<LayoutProps>(), {
  asideWidth: "260px",
  collapsed: false,
  headerHeight: "10vh",
  contentHeight: "70vh",
  senderHeight: "20vh",
});

const defaultSize = props.asideWidth;
const size = ref(props.collapsed ? "0px" : defaultSize);
const contentWrapperRef = ref<HTMLElement>();

const collapsedNow = computed(() => parseInt(size.value) <= 20);

function toggleCollapse() {
  size.value = collapsedNow.value ? defaultSize : "0px";
}

// Grid 布局下，滚动区域的计算更简单，只需要简单的防抖处理
const forceReflow = useDebounceFn(() => {
  if (contentWrapperRef.value) {
    contentWrapperRef.value.offsetHeight;
  }
}, 16);

// 监听内容变化，确保滚动区域正确
useMutationObserver(contentWrapperRef, forceReflow, {
  childList: true,
  subtree: true,
});

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
  height: 100%; /* 确保占满父容器高度 */
}

/* 侧边栏区域 */
.ac-layout-aside {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: var(--color-bg-2);
  border-right: 1px solid var(--color-border-2);
  display: flex;
  flex-direction: column;

  /* 隐藏滚动条但保持滚动功能 */
  &::-webkit-scrollbar {
    width: 0;
    background: transparent;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: transparent;
  }
}

/* 主内容区域 - 使用 Grid 布局 */
.ac-layout-main {
  flex: 1;
  height: 100%;
  overflow: hidden;

  /* 定义 Grid 布局 */
  display: grid;
  grid-template-rows: auto 1fr auto; /* header content sender */
  grid-template-areas:
    "header"
    "content"
    "sender";
}

/* 头部区域 */
.ac-layout-header {
  grid-area: header;
  overflow: hidden;
  min-height: 60px;

  .ac-header-content {
    height: 100%;
    width: 100%;
    padding: 0 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: var(--color-bg-2);
    border-bottom: 1px solid var(--color-border-2);
    font-weight: 600;
    font-size: 16px;
    color: var(--color-text-1);
  }
}

/* 内容区 */
.ac-layout-content {
  grid-area: content;
  overflow: hidden;
  position: relative;
  min-height: 0; /* 允许 Grid 项目收缩 */

  .ac-content-wrapper {
    height: 100%;
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 16px;
    background-color: var(--color-bg-1);
    display: flex;
    flex-direction: column;

    /* 隐藏滚动条但保持滚动功能 */
    &::-webkit-scrollbar {
      width: 0;
      background: transparent;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: transparent;
    }

    /* 优化滚动性能 */
    scroll-behavior: smooth;
    will-change: scroll-position;
  }
}

/* 底部输入区 */
.ac-layout-sender {
  grid-area: sender;
  overflow: hidden;
  min-height: fit-content;

  .ac-sender-content {
    width: 100%;
    padding: 16px;
    background-color: var(--color-bg-2);
    border-top: 1px solid var(--color-border-2);
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
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

/* 火狐浏览器滚动条样式 - 隐藏滚动条 */
@supports (scrollbar-color: auto) {
  .ac-layout-aside,
  .ac-content-wrapper {
    scrollbar-color: transparent transparent;
    scrollbar-width: none;
  }
}
</style>
