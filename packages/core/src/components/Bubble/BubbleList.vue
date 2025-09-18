<template>
  <div class="ac-bubble-list" :style="{ maxHeight }">
    <div class="ac-bubble-list-container" ref="containerRef">
      <!-- 加载更多按钮 -->
      <div v-if="showLoadMore && !loadingMore" class="ac-bubble-list-load-more">
        <button 
          class="ac-bubble-list-load-more-btn" 
          @click="handleLoadMore"
        >
          {{ loadMoreText }}
        </button>
      </div>
      
      <!-- 加载更多状态 -->
      <div v-if="loadingMore" class="ac-bubble-list-loading">
        <div class="ac-bubble-list-loading-spinner"></div>
        <span>加载中...</span>
      </div>

      <!-- 消息列表 -->
      <div class="ac-bubble-list-messages" :class="{ 'ac-bubble-list-reverse': reverse }">
        <template v-for="(message, index) in displayMessages" :key="message.id || index">
          <!-- 气泡组件 -->
          <Bubble
            :content="message.content"
            :loading="message.loading"
            :align="message.align"
            :variant="message.variant"
            :shape="message.shape"
            :avatar-config="message.avatarConfig"
            :failed="message.failed"
            :timestamp="message.timestamp"
            :max-width="message.maxWidth"
            :typewriter="message.typewriter"
            :typewriter-config="message.typewriterConfig"
            :markdown="message.markdown"
            :streaming="message.streaming"
            @click="handleMessageClick(message, index)"
            @typewriter-complete="handleTypewriterComplete(message, index)"
            @typewriter-start="handleTypewriterStart(message, index)"
            @typewriter-typing="(currentText, progress) => handleTypewriterTyping(message, index, currentText, progress)"
          >
            <!-- 传递插槽内容 -->
            <template v-if="$slots.avatar" #avatar="slotProps">
              <slot name="avatar" v-bind="slotProps" :message="message" :index="index"></slot>
            </template>
            <template v-if="$slots.header" #header="slotProps">
              <slot name="header" v-bind="slotProps" :message="message" :index="index"></slot>
            </template>
            <template v-if="$slots.content" #content="slotProps">
              <slot name="content" v-bind="slotProps" :message="message" :index="index"></slot>
            </template>
            <template v-if="$slots.loading" #loading="slotProps">
              <slot name="loading" v-bind="slotProps" :message="message" :index="index"></slot>
            </template>
            <template v-if="$slots.footer" #footer="slotProps">
              <slot name="footer" v-bind="slotProps" :message="message" :index="index"></slot>
            </template>
          </Bubble>
        </template>
      </div>

      <!-- 滚动到底部按钮 -->
      <div 
        v-if="showScrollToBottom && !isAtBottom" 
        class="ac-bubble-list-scroll-to-bottom"
        @click="scrollToBottom"
      >
        <div class="ac-bubble-list-scroll-btn">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 12L2 6h12l-6 6z"/>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import Bubble from './Bubble.vue'
import type { BubbleListProps, BubbleMessage } from './bubble-types'

const props = withDefaults(defineProps<BubbleListProps>(), {
  list: () => [],
  autoScroll: true,
  showLoadMore: false,
  showScrollToBottom: true,
  loadMoreText: '加载更多',
  loadingMore: false,
  maxHeight: '400px',
  reverse: true,
  scrollToBottomThreshold: 100,
  typewriterCompleteStrategy: 'only-last',
  virtualScroll: false,
  itemHeight: 60,
  bufferSize: 5,
})

const emit = defineEmits<{
  loadMore: []
  messageClick: [message: BubbleMessage, index: number]
  scrollToBottom: []
  typewriterComplete: [message: BubbleMessage, index: number]
  typewriterStart: [message: BubbleMessage, index: number]
  typewriterTyping: [message: BubbleMessage, index: number, currentText: string, progress: number]
}>()

const containerRef = ref<HTMLElement>()
const isAtBottom = ref(true)
const lastScrollTop = ref(0)

// 计算显示的消息列表
const displayMessages = computed(() => {
  return props.reverse ? [...props.list].reverse() : props.list
})


// 处理加载更多
const handleLoadMore = () => {
  emit('loadMore')
}

// 滚动到底部
const scrollToBottom = () => {
  if (containerRef.value) {
    containerRef.value.scrollTop = containerRef.value.scrollHeight
    emit('scrollToBottom')
  }
}

// 检查是否在底部
const checkIsAtBottom = () => {
  if (!containerRef.value) return
  
  const { scrollTop, scrollHeight, clientHeight } = containerRef.value
  isAtBottom.value = scrollHeight - scrollTop - clientHeight < props.scrollToBottomThreshold
}

// 监听滚动事件
const handleScroll = () => {
  checkIsAtBottom()
  lastScrollTop.value = containerRef.value?.scrollTop || 0
}

// 自动滚动到底部
const autoScrollToBottom = () => {
  if (props.autoScroll && isAtBottom.value) {
    nextTick(() => {
      scrollToBottom()
    })
  }
}

// 处理消息点击
const handleMessageClick = (message: BubbleMessage, index: number) => {
  emit('messageClick', message, index)
}

// 处理打字机完成事件
const handleTypewriterComplete = (message: BubbleMessage, index: number) => {
  const shouldEmit = checkTypewriterCompleteStrategy(index)
  if (shouldEmit) {
    emit('typewriterComplete', message, index)
  }
}

// 处理打字机开始事件
const handleTypewriterStart = (message: BubbleMessage, index: number) => {
  emit('typewriterStart', message, index)
}

// 处理打字机打字事件
const handleTypewriterTyping = (message: BubbleMessage, index: number, currentText: string, progress: number) => {
  emit('typewriterTyping', message, index, currentText, progress)
}

// 检查打字完成触发策略
const checkTypewriterCompleteStrategy = (index: number): boolean => {
  const strategy = props.typewriterCompleteStrategy
  
  if (strategy === 'all') {
    return true
  }
  
  if (strategy === 'only-last') {
    return index === displayMessages.value.length - 1
  }
  
  if (Array.isArray(strategy)) {
    return strategy.includes(index)
  }
  
  return false
}

// 滚动到指定气泡
const scrollToBubble = (index: number) => {
  if (!containerRef.value) return
  
  const messages = containerRef.value.querySelectorAll('.ac-bubble')
  const targetMessage = messages[index]
  
  if (targetMessage) {
    targetMessage.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center' 
    })
  }
}

// 滚动到顶部
const scrollToTop = () => {
  if (containerRef.value) {
    containerRef.value.scrollTop = 0
  }
}

// 监听消息变化，自动滚动
watch(() => props.list.length, () => {
  autoScrollToBottom()
}, { flush: 'post' })

// 监听消息内容变化
watch(() => props.list, () => {
  autoScrollToBottom()
}, { deep: true, flush: 'post' })

// 暴露方法给父组件
defineExpose({
  scrollToTop,
  scrollToBottom,
  scrollToBubble,
  containerRef,
})

onMounted(() => {
  if (containerRef.value) {
    containerRef.value.addEventListener('scroll', handleScroll)
    // 初始滚动到底部
    if (props.reverse) {
      scrollToBottom()
    }
  }
})

onUnmounted(() => {
  if (containerRef.value) {
    containerRef.value.removeEventListener('scroll', handleScroll)
  }
})
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
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;

    // 自定义滚动条样式
    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: var(--color-neutral-3, #c9cdd4);
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: var(--color-neutral-4, #86909c);
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
    gap: 4px;

    &.ac-bubble-list-reverse {
      flex-direction: column-reverse;
    }
  }


  .ac-bubble-list-scroll-to-bottom {
    position: absolute;
    bottom: 20px;
    right: 20px;
    z-index: 10;
    cursor: pointer;

    .ac-bubble-list-scroll-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: var(--color-bg-2, #fff);
      border: 1px solid var(--color-neutral-3, #c9cdd4);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-text-2, #4e5969);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: all 0.2s ease;

      &:hover {
        background-color: var(--color-primary-1, #f2f3ff);
        border-color: var(--color-primary-6, #165dff);
        color: var(--color-primary-6, #165dff);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
    }
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

// 响应式设计
@media (max-width: 600px) {
  .ac-bubble-list {
    .ac-bubble-list-container {
      padding: 8px;
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
</style>
