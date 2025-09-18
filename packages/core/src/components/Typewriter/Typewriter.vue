<template>
  <span class="ac-typewriter">
    <span class="ac-typewriter-content">{{ displayText }}</span>
    <span 
      v-if="showCursor && isTyping" 
      class="ac-typewriter-cursor"
      :class="{ 'ac-typewriter-cursor-blink': cursorBlink }"
      :style="{ animationDuration: `${cursorBlinkSpeed}ms` }"
    >
      {{ cursorStyle }}
    </span>
  </span>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import type { TypewriterProps, TypewriterEmits, TypewriterExpose } from './typewriter-types'

const props = withDefaults(defineProps<TypewriterProps>(), {
  text: '',
  config: () => ({
    speed: 50,
    showCursor: true,
    cursorStyle: '|',
    cursorBlinkSpeed: 530,
    autoStart: true,
    delayAfterComplete: 0,
  }),
  immediate: false,
})

const emit = defineEmits<TypewriterEmits>()

const displayText = ref('')
const isTyping = ref(false)
const isComplete = ref(false)
const cursorBlink = ref(true)
const currentIndex = ref(0)

// 计算属性
const showCursor = computed(() => props.config?.showCursor ?? true)
const cursorStyle = computed(() => props.config?.cursorStyle ?? '|')
const cursorBlinkSpeed = computed(() => props.config?.cursorBlinkSpeed ?? 530)
const speed = computed(() => props.config?.speed ?? 50)
const delayAfterComplete = computed(() => props.config?.delayAfterComplete ?? 0)

let typingTimer: number | null = null
let cursorTimer: number | null = null

// 开始打字动画
const startTyping = async () => {
  if (isTyping.value || !props.text) return
  
  isTyping.value = true
  isComplete.value = false
  currentIndex.value = 0
  displayText.value = ''
  
  emit('start')
  
  await nextTick()
  
  // 开始光标闪烁
  startCursorBlink()
  
  // 开始打字
  typeNextChar()
}

// 停止打字动画
const stopTyping = () => {
  if (typingTimer) {
    clearTimeout(typingTimer)
    typingTimer = null
  }
  if (cursorTimer) {
    clearTimeout(cursorTimer)
    cursorTimer = null
  }
  isTyping.value = false
}

// 重置打字机
const reset = () => {
  stopTyping()
  displayText.value = ''
  currentIndex.value = 0
  isComplete.value = false
}

// 完成打字
const complete = () => {
  displayText.value = props.text
  currentIndex.value = props.text.length
  isTyping.value = false
  isComplete.value = true
  
  // 停止光标闪烁
  if (cursorTimer) {
    clearTimeout(cursorTimer)
    cursorTimer = null
  }
  
  // 延迟后触发完成事件
  if (delayAfterComplete.value > 0) {
    setTimeout(() => {
      emit('complete')
    }, delayAfterComplete.value)
  } else {
    emit('complete')
  }
}

// 打字下一个字符
const typeNextChar = () => {
  if (currentIndex.value >= props.text.length) {
    complete()
    return
  }
  
  displayText.value += props.text[currentIndex.value]
  currentIndex.value++
  
  // 计算进度
  const progress = currentIndex.value / props.text.length
  emit('typing', displayText.value, progress)
  
  // 设置下一个字符的延迟
  typingTimer = setTimeout(() => {
    typeNextChar()
  }, speed.value)
}

// 开始光标闪烁
const startCursorBlink = () => {
  const blink = () => {
    cursorBlink.value = !cursorBlink.value
    cursorTimer = setTimeout(blink, cursorBlinkSpeed.value)
  }
  blink()
}

// 监听文本变化
watch(() => props.text, (newText, oldText) => {
  if (newText !== oldText) {
    reset()
    if (props.config?.autoStart || props.immediate) {
      startTyping()
    }
  }
}, { immediate: true })

// 监听 immediate 变化
watch(() => props.immediate, (newVal) => {
  if (newVal && !isTyping.value && !isComplete.value) {
    startTyping()
  }
})

// 暴露方法
defineExpose<TypewriterExpose>({
  startTyping,
  stopTyping,
  reset,
  complete,
  isTyping: () => isTyping.value,
  isComplete: () => isComplete.value,
  progress: () => currentIndex.value / props.text.length,
})

onMounted(() => {
  if (props.config?.autoStart || props.immediate) {
    startTyping()
  }
})

onUnmounted(() => {
  stopTyping()
})
</script>

<style scoped lang="scss">
.ac-typewriter {
  display: inline;
  position: relative;

  .ac-typewriter-content {
    display: inline;
  }

  .ac-typewriter-cursor {
    display: inline;
    color: var(--color-primary-6, #165dff);
    font-weight: normal;
    margin-left: 1px;

    &.ac-typewriter-cursor-blink {
      animation: blink 1s infinite;
    }
  }
}

@keyframes blink {
  0%, 50% {
    opacity: 1;
  }
  51%, 100% {
    opacity: 0;
  }
}

// 深色主题适配
@media (prefers-color-scheme: dark) {
  .ac-typewriter {
    .ac-typewriter-cursor {
      color: var(--color-primary-5, #4080ff);
    }
  }
}
</style>
