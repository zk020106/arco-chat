<template>
  <div 
    class="ac-bubble" 
    :class="bubbleClasses" 
    :style="{ maxWidth }"
    @click="handleClick"
  >
    <div class="ac-bubble-avatar" v-if="showAvatar">
      <slot name="avatar">
        <Avatar 
          :size="avatarConfig?.size"
          :image-url="avatarConfig?.imageUrl"
          :shape="avatarConfig?.shape"
          :auto-fix-font-size="avatarConfig?.autoFixFontSize"
          :trigger-type="avatarConfig?.triggerType"
          :trigger-icon-style="avatarConfig?.triggerIconStyle"
          :object-fit="avatarConfig?.objectFit"
        >
          {{ avatarConfig?.displayName }}
        </Avatar>
      </slot>
    </div>
    <div class="ac-bubble-content-container">
      <slot v-if="!loading" name="header"></slot>
      <div v-if="loading" class="loading-container" :class="[variant, shape]">
        <slot name="loading">
          <BubbleLoading></BubbleLoading>
        </slot>
      </div>
      <div v-if="!loading" class="ac-bubble-content" :class="[variant, shape]">
        <slot name="content">
          <div v-if="markdown" class="ac-bubble-markdown">
            <MarkdownRender 
              :content="content" 
              :typing="typewriter"
              :typing-options="markdownTypingOptions"
              @typing-start="handleTypewriterStart"
              @typing="() => handleTypewriterTyping('', 0)"
              @typing-end="handleTypewriterComplete"
            />
          </div>
          <div v-else-if="typewriter" class="ac-bubble-typewriter">
            <Typewriter 
              :text="content" 
              :config="typewriterConfig"
              :immediate="streaming"
              @complete="handleTypewriterComplete"
              @start="handleTypewriterStart"
              @typing="handleTypewriterTyping"
            />
          </div>
          <div v-else class="ac-bubble-text">
            {{ content }}
          </div>
        </slot>
      </div>
      <slot v-if="!loading" name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Avatar } from '@arco-design/web-vue'
import type { BubblePropsType } from './bubble-types'
import type { TypingOptions } from '../MarkdownRender/markdown-render-types'
import BubbleLoading from './BubbleLoading.vue'
import Typewriter from './Typewriter.vue'
import MarkdownRender from '../MarkdownRender/MarkdownRender.vue'

const props = withDefaults(defineProps<BubblePropsType>(), {
  content: '',
  loading: false,
  align: 'start',
  variant: 'filled',
  shape: 'round',
  avatarConfig: () => ({ size: 36 }),
  failed: false,
  timestamp: undefined,
  showAvatar: true,
  clickable: false,
  maxWidth: '70%',
  typewriter: false,
  typewriterConfig: () => ({
    speed: 50,
    showCursor: true,
    cursorStyle: '|',
    cursorBlinkSpeed: 530,
    autoStart: true,
    delayAfterComplete: 0,
  }),
  markdown: false,
  streaming: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
  typewriterComplete: []
  typewriterStart: []
  typewriterTyping: [currentText: string, progress: number]
}>()

/**
 * 插槽说明：
 * avatar - 自定义头像
 * header - 气泡顶部区域
 * content - 内容区
 * loading - 自定义 Loading 样式
 * footer - 气泡底部区域
 */

// 计算是否显示头像
const showAvatar = computed(() => {
  return props.showAvatar && props.avatarConfig
})

// 将 TypewriterConfig 转换为 MarkdownRender 的 typingOptions 格式
const markdownTypingOptions = computed((): TypingOptions | undefined => {
  if (!props.typewriter || !props.typewriterConfig) return undefined
  
  return {
    step: 1, // MarkdownRender 使用 step 参数
    interval: props.typewriterConfig.speed || 50,
    style: 'normal'
  }
})

// 计算气泡样式类
const bubbleClasses = computed(() => {
  return [
    `ac-bubble-${props.align}`,
    `ac-bubble-${props.variant}`,
    `ac-bubble-${props.shape}`,
    props.loading ? 'ac-bubble-loading' : '',
    props.failed ? 'ac-bubble-failed' : '',
    props.clickable ? 'ac-bubble-clickable' : '',
    props.typewriter ? 'ac-bubble-typewriter-enabled' : '',
    props.markdown ? 'ac-bubble-markdown-enabled' : '',
  ]
})

// 处理点击事件
const handleClick = (event: MouseEvent) => {
  if (props.clickable) {
    emit('click', event)
  }
}

// 处理打字机完成事件
const handleTypewriterComplete = () => {
  emit('typewriterComplete')
}

// 处理打字机开始事件
const handleTypewriterStart = () => {
  emit('typewriterStart')
}

// 处理打字机打字事件
const handleTypewriterTyping = (currentText: string, progress: number) => {
  emit('typewriterTyping', currentText, progress)
}
</script>

<style scoped lang="scss">
.ac-bubble {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 14px;
  margin-bottom: 8px;

  &.ac-bubble-start {
    flex-direction: row;
  }
  &.ac-bubble-end {
    flex-direction: row-reverse;
  }
  
  &.ac-bubble-failed {
    .ac-bubble-content {
      border: 1px solid var(--color-danger-6, #f53f3f);
      background-color: var(--color-danger-1, #ffece8);
    }
  }

  &.ac-bubble-clickable {
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    &:active {
      transform: translateY(0);
    }
  }

  .ac-bubble-avatar {
    flex-shrink: 0;
    display: flex;
    align-items: flex-start;
  }
  .ac-bubble-content-container {
    max-width: 100%;
  }
  .loading-container {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    max-width: 100%;
    
    // 变体样式
    &.filled {
      padding: 12px 16px;
      background-color: var(--color-bg-2, #fff);
      border-radius: 12px;
    }
    &.borderless {
      padding: 12px 16px;
      background-color: transparent;
    }
    &.outlined {
      padding: 12px 16px;
      border: 1px solid var(--color-neutral-3, #c9cdd4);
      background-color: transparent;
      border-radius: 12px;
    }
    &.shadow {
      padding: 12px 16px;
      background-color: var(--color-bg-2, #fff);
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    // 形状样式
    &.round {
      border-radius: 12px;
    }
    &.corner {
      border-radius: 4px;
    }
  }
  
  .ac-bubble-content {
    word-wrap: break-word;
    
    // 变体样式
    &.filled {
      padding: 12px 16px;
      background-color: var(--color-bg-2, #fff);
      border-radius: 12px;
    }
    &.borderless {
      padding: 12px 16px;
      background-color: transparent;
    }
    &.outlined {
      padding: 12px 16px;
      border: 1px solid var(--color-neutral-3, #c9cdd4);
      background-color: transparent;
      border-radius: 12px;
    }
    &.shadow {
      padding: 12px 16px;
      background-color: var(--color-bg-2, #fff);
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    // 形状样式
    &.round {
      border-radius: 12px;
    }
    &.corner {
      border-radius: 4px;
    }
    
    // 特殊内容样式
    .ac-bubble-markdown {
      line-height: 1.6;
    }
    
    .ac-bubble-typewriter {
      line-height: 1.6;
    }
    
    .ac-bubble-text {
      line-height: 1.6;
    }
  }
}
// 响应式
@media (max-width: 600px) {
  .ac-bubble-content {
    font-size: 15px;
    padding: 12px 12px;
    max-width: 95vw;
  }
}
</style>
