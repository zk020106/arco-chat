<template>
  <div class="ac-bubble-list" :style="useVirtualScroll ? {} : { maxHeight }">
    <div class="ac-bubble-list-container" ref="containerRef">
      <!-- 加载更多按钮 -->
      <div v-if="showLoadMore && !loadingMore" class="ac-bubble-list-load-more">
        <button class="ac-bubble-list-load-more-btn" @click="handleLoadMore">
          {{ loadMoreText }}
        </button>
      </div>

      <!-- 加载更多状态 -->
      <div v-if="loadingMore" class="ac-bubble-list-loading">
        <div class="ac-bubble-list-loading-spinner"></div>
        <span>加载中...</span>
      </div>

      <!-- 普通消息列表 -->
      <div v-if="!useVirtualScroll" class="ac-bubble-list-messages">
        <template
          v-for="(message, index) in displayMessages"
          :key="message.id || index"
        >
          <Bubble
            :content="message.content"
            :loading="message.loading"
            :align="message.align"
            :variant="message.variant"
            :shape="message.shape"
            :avatar-config="message.avatarConfig"
            :failed="message.failed"
            :timestamp="message.timestamp"
            :max-width="message.maxWidth ?? defaultBubbleMaxWidth"
            :typewriter="message.typewriter"
            :typewriter-config="message.typewriterConfig"
            :markdown="message.markdown"
            :streaming="message.streaming"
            @click="handleMessageClick(message, index)"
            @typewriter-complete="handleTypewriterComplete(message, index)"
            @typewriter-start="handleTypewriterStart(message, index)"
            @typewriter-typing="
              (currentText, progress) =>
                handleTypewriterTyping(message, index, currentText, progress)
            "
          >
            <template v-if="$slots.avatar" #avatar="slotProps">
              <slot
                name="avatar"
                v-bind="slotProps"
                :message="message"
                :index="index"
              ></slot>
            </template>
            <template v-if="$slots.header" #header="slotProps">
              <slot
                name="header"
                v-bind="slotProps"
                :message="message"
                :index="index"
              ></slot>
            </template>
            <template v-if="$slots.content" #content="slotProps">
              <slot
                name="content"
                v-bind="slotProps"
                :message="message"
                :index="index"
              ></slot>
            </template>
            <template v-if="$slots.loading" #loading="slotProps">
              <slot
                name="loading"
                v-bind="slotProps"
                :message="message"
                :index="index"
              ></slot>
            </template>
            <template v-if="$slots.footer" #footer="slotProps">
              <slot
                name="footer"
                v-bind="slotProps"
                :message="message"
                :index="index"
              ></slot>
            </template>
          </Bubble>
        </template>
      </div>

      <!-- 虚拟滚动消息列表 -->
      <List
        v-else
        :data="displayMessages"
        :virtual-list-props="virtualListProps"
        class="ac-bubble-list-virtual"
        @scroll="handleVirtualScroll"
      >
        <template #item="{ item: message, index }">
          <Bubble
            :content="message.content"
            :loading="message.loading"
            :align="message.align"
            :variant="message.variant"
            :shape="message.shape"
            :avatar-config="message.avatarConfig"
            :failed="message.failed"
            :timestamp="message.timestamp"
            :max-width="message.maxWidth ?? defaultBubbleMaxWidth"
            :typewriter="message.typewriter"
            :typewriter-config="message.typewriterConfig"
            :markdown="message.markdown"
            :streaming="message.streaming"
            @click="handleMessageClick(message, index)"
            @typewriter-complete="handleTypewriterComplete(message, index)"
            @typewriter-start="handleTypewriterStart(message, index)"
            @typewriter-typing="
              (currentText, progress) =>
                handleTypewriterTyping(message, index, currentText, progress)
            "
          >
            <template v-if="$slots.avatar" #avatar="slotProps">
              <slot
                name="avatar"
                v-bind="slotProps"
                :message="message"
                :index="index"
              ></slot>
            </template>
            <template v-if="$slots.header" #header="slotProps">
              <slot
                name="header"
                v-bind="slotProps"
                :message="message"
                :index="index"
              ></slot>
            </template>
            <template v-if="$slots.content" #content="slotProps">
              <slot
                name="content"
                v-bind="slotProps"
                :message="message"
                :index="index"
              ></slot>
            </template>
            <template v-if="$slots.loading" #loading="slotProps">
              <slot
                name="loading"
                v-bind="slotProps"
                :message="message"
                :index="index"
              ></slot>
            </template>
            <template v-if="$slots.footer" #footer="slotProps">
              <slot
                name="footer"
                v-bind="slotProps"
                :message="message"
                :index="index"
              ></slot>
            </template>
          </Bubble>
        </template>
      </List>

      <!-- 滚动到底部按钮 -->
      <div
        v-if="showScrollToBottom && !isAtBottom"
        class="ac-bubble-list-scroll-to-bottom"
        @click="scrollToBottom"
      >
        <div class="ac-bubble-list-scroll-btn">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 12L2 6h12l-6 6z" />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from "vue";
import { List } from "@arco-design/web-vue";

import Bubble from "./Bubble.vue";
import type { BubbleListProps, BubbleMessage } from "./bubble-types";

const props = withDefaults(defineProps<BubbleListProps>(), {
  list: () => [],
  autoScroll: true,
  showLoadMore: false,
  showScrollToBottom: true,
  loadMoreText: "加载更多",
  loadingMore: false,
  maxHeight: "100%",
  reverse: true,
  scrollToBottomThreshold: 100,
  typewriterCompleteStrategy: "only-last",
  virtualScroll: false,
  virtualListProps: () => ({
    height: "100%",
    threshold: 30, // 降低阈值，更早启用虚拟滚动
    fixedSize: false, // 消息高度不固定
    estimatedSize: 150, // 增加估算高度，适应 Markdown 内容
    buffer: 3, // 减少缓冲区，提升性能
    itemKey: "id", // 使用消息 ID 作为 key
  }),
  defaultBubbleMaxWidth: "auto",
});

const emit = defineEmits<{
  loadMore: [];
  messageClick: [message: BubbleMessage, index: number];
  scrollToBottom: [];
  typewriterComplete: [message: BubbleMessage, index: number];
  typewriterStart: [message: BubbleMessage, index: number];
  typewriterTyping: [
    message: BubbleMessage,
    index: number,
    currentText: string,
    progress: number,
  ];
}>();

const containerRef = ref<HTMLElement>();
const autoVirtualScroll = ref(false);

// 手动管理滚动状态，避免 useScroll 导致的循环
const isAtBottom = ref(true);
const lastScrollTop = ref(0);

// 手动滚动处理
const handleScroll = () => {
  if (props.virtualScroll) return;

  if (containerRef.value) {
    const { scrollTop, scrollHeight, clientHeight } = containerRef.value;
    // 统一使用正常的滚动逻辑，因为现在使用数据处理
    isAtBottom.value = scrollTop + clientHeight >= scrollHeight - 10;
    lastScrollTop.value = scrollTop;
  }
};

// 计算显示的消息列表
const displayMessages = computed(() => {
  // 简化实现，直接返回消息列表，最新消息在底部
  return props.list;
});

// 检查是否需要自动启用虚拟滚动
const checkAutoVirtualScroll = () => {
  // 当消息数量较多时启用虚拟滚动，提升性能
  if (containerRef.value && props.virtualScroll === false) {
    const messageCount = props.list.length;
    const { scrollHeight, clientHeight } = containerRef.value;

    // 消息数量超过 30 条时启用虚拟滚动，适应 Markdown 渲染的性能需求
    autoVirtualScroll.value = messageCount > 30 && scrollHeight > clientHeight;
  } else {
    autoVirtualScroll.value = false;
  }
};

// 虚拟滚动事件处理
const handleVirtualScroll = (event: Event) => {
  // 处理虚拟滚动的滚动事件
  // 注意：对于虚拟滚动，滚动状态由 useScroll 自动处理
};

// 计算是否使用虚拟滚动
const useVirtualScroll = computed(() => {
  // 如果明确设置了 virtualScroll，使用设置的值
  if (props.virtualScroll !== false) {
    return props.virtualScroll;
  }
  // 否则使用自动判断
  return autoVirtualScroll.value;
});

// 处理加载更多
const handleLoadMore = () => {
  emit("loadMore");
};

// 滚动到底部（仅对非虚拟列表容器）
const scrollToBottom = () => {
  if (containerRef.value) {
    // 统一使用正常的滚动逻辑，因为现在使用数据处理
    containerRef.value.scrollTop = containerRef.value.scrollHeight;
    emit("scrollToBottom");
  }
};

// 简化的自动滚动逻辑
const autoScrollToBottom = () => {
  if (props.autoScroll && isAtBottom.value) {
    nextTick(() => {
      scrollToBottom();
    });
  }
};

// 处理消息点击
const handleMessageClick = (message: BubbleMessage, index: number) => {
  emit("messageClick", message, index);
};

// 处理打字机完成事件
const handleTypewriterComplete = (message: BubbleMessage, index: number) => {
  const shouldEmit = checkTypewriterCompleteStrategy(index);
  if (shouldEmit) {
    emit("typewriterComplete", message, index);
  }
};

// 处理打字机开始事件
const handleTypewriterStart = (message: BubbleMessage, index: number) => {
  emit("typewriterStart", message, index);
};

// 处理打字机打字事件
const handleTypewriterTyping = (
  message: BubbleMessage,
  index: number,
  currentText: string,
  progress: number
) => {
  emit("typewriterTyping", message, index, currentText, progress);
};

// 检查打字完成触发策略
const checkTypewriterCompleteStrategy = (index: number): boolean => {
  const strategy = props.typewriterCompleteStrategy;
  if (strategy === "all") return true;
  if (strategy === "only-last")
    return index === displayMessages.value.length - 1;
  if (Array.isArray(strategy)) return strategy.includes(index);
  return false;
};

// 虚拟列表触顶/触底事件 -> 懒加载
function onReachTop() {
  emit("loadMore");
}
function onReachBottom() {
  // 可按需触发
}

// 滚动到指定气泡（仅非虚拟容器）
const scrollToBubble = (index: number) => {
  if (!containerRef.value) return;
  const messages = containerRef.value.querySelectorAll(".ac-bubble");
  const targetMessage = messages[index];
  if (targetMessage) {
    (targetMessage as HTMLElement).scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }
};

// 滚动到顶部（仅非虚拟容器）
const scrollToTop = () => {
  if (containerRef.value) {
    containerRef.value.scrollTop = 0;
  }
};

// 简化的监听逻辑
watch(
  () => props.list.length,
  () => {
    nextTick(() => {
      autoScrollToBottom();
      checkAutoVirtualScroll();
    });
  },
  { flush: "post" }
);

// 暴露方法给父组件
defineExpose({
  scrollToTop,
  scrollToBottom,
  scrollToBubble,
  containerRef,
});

onMounted(() => {
  if (containerRef.value) {
    // 添加滚动事件监听
    containerRef.value.addEventListener("scroll", handleScroll);

    // 初始检查是否需要虚拟滚动
    nextTick(() => {
      checkAutoVirtualScroll();
      // 最新消息在底部，需要滚动到底部
      scrollToBottom();
    });
  }
});

onUnmounted(() => {
  if (containerRef.value) {
    containerRef.value.removeEventListener("scroll", handleScroll);
  }
});
</script>

<style scoped lang="scss">
.ac-bubble-list {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  border-radius: 8px;
  background-color: var(--color-bg-1, #f7f8fa);

  .ac-bubble-list-container {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0;
    width: 100%;
    height: 100%;
    min-height: 0; /* 关键：允许容器收缩 */
    box-sizing: border-box;
    scroll-behavior: smooth;

    /* 强制显示滚动条用于调试 */
    scrollbar-gutter: stable;

    // 默认滚动条样式（透明）
    &::-webkit-scrollbar {
      width: 6px;
      height: 8px;
    }

    &::-webkit-scrollbar-thumb {
      background: transparent;
      background-color: rgba(0, 0, 0, 0.2);
      border-radius: 10px;
      transition: background-color 0.2s ease-in-out;
    }

    &::-webkit-scrollbar-track {
      border-radius: 10px;
      background: transparent;
    }

    // 悬停时显示滚动条
    &:hover {
      &::-webkit-scrollbar-thumb {
        background: #c1c1c1;
      }

      &::-webkit-scrollbar-thumb:hover {
        background: #a8a8a8;
      }
    }
  }

  .ac-bubble-list-load-more {
    display: flex;
    justify-content: center;
    padding: 8px 0;

    .ac-bubble-list-load-more-btn {
      padding: 8px 16px;
      border: 1px solid var(--color-neutral-3, #c9cdd4);
      border-radius: 16px;
      background-color: var(--color-bg-2, #fff);
      color: var(--color-text-1, #1d2129);
      font-size: 12px;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        border-color: var(--color-primary-6, #165dff);
        color: var(--color-primary-6, #165dff);
      }
    }
  }

  .ac-bubble-list-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 0;
    color: var(--color-text-3, #86909c);
    font-size: 12px;

    .ac-bubble-list-loading-spinner {
      width: 16px;
      height: 16px;
      border: 2px solid var(--color-neutral-3, #c9cdd4);
      border-top: 2px solid var(--color-primary-6, #165dff);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
  }

  .ac-bubble-list-messages {
    display: flex;
    flex-direction: column;
    gap: 16px; /* 参考 Element Plus，使用 16px 间隙 */
    width: 100%;
    padding: 16px;
    align-items: flex-start; /* 允许子元素控制自己的对齐 */
  }

  .ac-bubble-list-virtual {
    width: 100%;
    padding: 16px;
    height: 100%;

    // 重置 Arco List 的默认样式
    :deep(.arco-list) {
      background: transparent;
      border: none;
    }

    :deep(.arco-list-item) {
      padding: 0;
      border: none;
      background: transparent;
    }

    :deep(.arco-list-item-content) {
      padding: 0;
    }

    // 虚拟滚动容器样式
    :deep(.arco-virtual-list) {
      height: 100%;
      overflow-y: auto !important; // 强制显示滚动条
    }

    :deep(.arco-virtual-list-scrollbar) {
      // 默认滚动条样式（透明）
      &::-webkit-scrollbar {
        width: 6px;
        background: transparent;
      }

      &::-webkit-scrollbar-track {
        background: transparent;
        border-radius: 10px;
      }

      &::-webkit-scrollbar-thumb {
        background: transparent;
        background-color: rgba(0, 0, 0, 0.2);
        border-radius: 10px;
        transition: background-color 0.2s ease-in-out;
      }

      &:hover {
        &::-webkit-scrollbar-thumb {
          background: #c1c1c1;
        }
      }
    }
  }

  .ac-bubble-list-scroll-to-bottom {
    position: absolute;
    bottom: 20px;
    right: 20px;
    z-index: 100;
    user-select: none;
    cursor: pointer;
    width: fit-content;
    height: fit-content;
    padding: 10px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--color-bg-2, #fff);
    border-radius: 50%;
    box-shadow:
      0 0 4px 0 var(--color-neutral-1, rgba(0, 0, 0, 0.02)),
      0 6px 10px 0 var(--color-neutral-2, rgba(47, 53, 64, 0.1));
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px var(--color-neutral-3, rgba(0, 0, 0, 0.15));
    }

    .ac-bubble-list-scroll-btn {
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-text-2, #4e5969);
    }
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 火狐浏览器滚动条样式 */
@supports (scrollbar-color: auto) {
  .ac-bubble-list-container {
    scrollbar-color: transparent transparent;
    scrollbar-width: thin;

    &:hover {
      scrollbar-color: #c1c1c1 transparent;
    }
  }
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .ac-bubble-list-container {
    &::-webkit-scrollbar-thumb {
      background-color: rgba(255, 255, 255, 0.2);
    }

    &:hover {
      &::-webkit-scrollbar-thumb {
        background: #666;
      }

      &::-webkit-scrollbar-thumb:hover {
        background: #888;
      }
    }
  }

  .ac-bubble-list-scroll-to-bottom {
    background-color: var(--color-bg-2, #2a2a2a);
    box-shadow:
      0 0 4px 0 var(--color-neutral-2, rgba(0, 0, 0, 0.3)),
      0 6px 10px 0 var(--color-neutral-3, rgba(0, 0, 0, 0.2));

    &:hover {
      box-shadow: 0 4px 12px var(--color-neutral-4, rgba(0, 0, 0, 0.3));
    }
  }
}

/* 火狐浏览器深色模式 */
@supports (scrollbar-color: auto) {
  @media (prefers-color-scheme: dark) {
    .ac-bubble-list-container {
      scrollbar-color: rgba(255, 255, 255, 0.2) transparent;

      &:hover {
        scrollbar-color: #666 transparent;
      }
    }
  }
}

// 响应式设计 - 多断点适配
@media (max-width: 1200px) {
  .ac-bubble-list {
    .ac-bubble-list-container {
      padding: 0;
      gap: 0;
    }

    .ac-bubble-list-messages {
      padding: 14px;
      gap: 10px;
    }
  }
}

@media (max-width: 768px) {
  .ac-bubble-list {
    .ac-bubble-list-container {
      padding: 0;
      gap: 0;
    }

    .ac-bubble-list-messages {
      padding: 12px;
      gap: 10px;
    }
  }
}

@media (max-width: 600px) {
  .ac-bubble-list {
    .ac-bubble-list-container {
      padding: 0;
      gap: 0;
    }

    .ac-bubble-list-messages {
      padding: 8px;
      gap: 10px;
    }

    .ac-bubble-list-scroll-to-bottom {
      bottom: 16px;
      right: 16px;

      .ac-bubble-list-scroll-btn {
        width: 36px;
        height: 36px;
      }
    }
  }
}

@media (max-width: 480px) {
  .ac-bubble-list {
    .ac-bubble-list-container {
      padding: 0;
      gap: 0;
    }

    .ac-bubble-list-messages {
      padding: 6px;
      gap: 10px;
    }

    .ac-bubble-list-scroll-to-bottom {
      bottom: 12px;
      right: 12px;

      .ac-bubble-list-scroll-btn {
        width: 32px;
        height: 32px;
      }
    }
  }
}
</style>
