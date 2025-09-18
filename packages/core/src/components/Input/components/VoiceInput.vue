<template>
  <div class="ac-voice-input">
    <!-- 自定义语音按钮 -->
    <slot 
      :state="state" 
      :disabled="disabled"
      :start="startRecording"
      :stop="stopRecording"
      :toggle="toggleRecording"
    >
      <!-- 默认语音按钮 -->
      <button
        :class="voiceButtonClasses"
        :disabled="disabled"
        @click="toggleRecording"
        @mousedown="handleMouseDown"
        @mouseup="handleMouseUp"
        @mouseleave="handleMouseLeave"
      >
        <div class="ac-voice-button-content">
          <svg v-if="state === VoiceInputState.Idle" class="ac-voice-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
          </svg>
          
          <svg v-else-if="state === VoiceInputState.Recording" class="ac-voice-icon recording" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
          </svg>
          
          <svg v-else-if="state === VoiceInputState.Processing" class="ac-voice-icon processing" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          
          <svg v-else-if="state === VoiceInputState.Error" class="ac-voice-icon error" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        
        <!-- 录音动画 -->
        <div v-if="state === VoiceInputState.Recording" class="ac-voice-recording-animation">
          <div class="ac-voice-wave"></div>
          <div class="ac-voice-wave"></div>
          <div class="ac-voice-wave"></div>
        </div>
      </button>
    </slot>
    
    <!-- 语音状态提示 -->
    <div v-if="showStatus && state !== VoiceInputState.Idle" class="ac-voice-status">
      <span v-if="state === VoiceInputState.Recording">正在录音...</span>
      <span v-else-if="state === VoiceInputState.Processing">正在识别...</span>
      <span v-else-if="state === VoiceInputState.Error">识别失败</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { VoiceInputState, inputInjectionKey } from '../input-types'
import type { InputContext, VoiceInputConfig } from '../input-types'

const { inputValue, rootProps, rootEmits } = inject(inputInjectionKey) as InputContext

const props = withDefaults(defineProps<{
  config: VoiceInputConfig
  disabled?: boolean
  showStatus?: boolean
}>(), {
  disabled: false,
  showStatus: true,
})

const state = ref<VoiceInputState>(VoiceInputState.Idle)
const isPressed = ref(false)
const recognition = ref<any>(null)
const recordingTimer = ref<number | null>(null)

// 计算属性
const showButton = computed(() => props.config.showButton !== false)
const disabled = computed(() => props.disabled || !props.config.enabled)

const voiceButtonClasses = computed(() => ({
  'ac-voice-button': true,
  'ac-voice-button-disabled': disabled.value,
  'ac-voice-button-recording': state.value === VoiceInputState.Recording,
  'ac-voice-button-processing': state.value === VoiceInputState.Processing,
  'ac-voice-button-error': state.value === VoiceInputState.Error,
  'ac-voice-button-pressed': isPressed.value,
}))

// 初始化语音识别
const initSpeechRecognition = () => {
  if (typeof window === 'undefined') return
  
  // 如果用户提供了自定义实现，使用自定义实现
  if (props.config.customRecognition) {
    return
  }
  
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
  if (!SpeechRecognition) {
    console.warn('Speech Recognition API not supported')
    return
  }
  
  recognition.value = new SpeechRecognition()
  recognition.value.continuous = false
  recognition.value.interimResults = true
  recognition.value.lang = props.config.language || 'zh-CN'
  
  recognition.value.onstart = () => {
    state.value = VoiceInputState.Recording
    rootEmits('voice-start')
  }
  
  recognition.value.onresult = (event) => {
    let finalTranscript = ''
    let interimTranscript = ''
    
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript
      if (event.results[i].isFinal) {
        finalTranscript += transcript
      } else {
        interimTranscript += transcript
      }
    }
    
    if (finalTranscript) {
      // 将识别结果添加到输入框
      const currentValue = inputValue.value
      const newValue = currentValue + (currentValue ? ' ' : '') + finalTranscript
      inputValue.value = newValue
      rootEmits('voice-result', finalTranscript, newValue)
    }
  }
  
  recognition.value.onend = () => {
    state.value = VoiceInputState.Idle
    rootEmits('voice-end')
  }
  
  recognition.value.onerror = (event) => {
    state.value = VoiceInputState.Error
    rootEmits('voice-error', event.error)
    
    // 3秒后重置状态
    setTimeout(() => {
      state.value = VoiceInputState.Idle
    }, 3000)
  }
}

// 开始录音
const startRecording = () => {
  if (disabled.value) return
  
  // 如果用户提供了自定义实现，调用自定义实现
  if (props.config.customRecognition) {
    state.value = VoiceInputState.Recording
    rootEmits('voice-start')
    
    props.config.customRecognition.start({
      onResult: (result: string) => {
        const currentValue = inputValue.value
        const newValue = currentValue + (currentValue ? ' ' : '') + result
        inputValue.value = newValue
        rootEmits('voice-result', result, newValue)
      },
      onEnd: () => {
        state.value = VoiceInputState.Idle
        rootEmits('voice-end')
      },
      onError: (error: string) => {
        state.value = VoiceInputState.Error
        rootEmits('voice-error', error)
        setTimeout(() => {
          state.value = VoiceInputState.Idle
        }, 3000)
      }
    })
    return
  }
  
  if (!recognition.value) return
  
  try {
    recognition.value.start()
    
    // 设置最大录音时长
    if (props.config.maxDuration) {
      recordingTimer.value = setTimeout(() => {
        stopRecording()
      }, props.config.maxDuration * 1000)
    }
  } catch (error) {
    console.error('Failed to start recording:', error)
    state.value = VoiceInputState.Error
  }
}

// 停止录音
const stopRecording = () => {
  // 如果用户提供了自定义实现，调用自定义实现
  if (props.config.customRecognition && state.value === VoiceInputState.Recording) {
    props.config.customRecognition.stop()
    return
  }
  
  if (recognition.value && state.value === VoiceInputState.Recording) {
    recognition.value.stop()
  }
  
  if (recordingTimer.value) {
    clearTimeout(recordingTimer.value)
    recordingTimer.value = null
  }
}

// 切换录音状态
const toggleRecording = () => {
  if (state.value === VoiceInputState.Recording) {
    stopRecording()
  } else {
    startRecording()
  }
}

// 鼠标事件处理
const handleMouseDown = () => {
  if (disabled.value) return
  isPressed.value = true
  startRecording()
}

const handleMouseUp = () => {
  isPressed.value = false
  stopRecording()
}

const handleMouseLeave = () => {
  isPressed.value = false
  if (state.value === VoiceInputState.Recording) {
    stopRecording()
  }
}

onMounted(() => {
  if (props.config.enabled) {
    initSpeechRecognition()
  }
})

onUnmounted(() => {
  if (recognition.value) {
    recognition.value.stop()
  }
  if (recordingTimer.value) {
    clearTimeout(recordingTimer.value)
  }
})
</script>

<style scoped lang="scss">
.ac-voice-input {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.ac-voice-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background-color: var(--color-bg-2, #f7f8fa);
  color: var(--color-text-2, #4e5969);
  cursor: pointer;
  transition: all 0.2s ease;
  overflow: hidden;

  &:hover:not(.ac-voice-button-disabled) {
    background-color: var(--color-bg-3, #e5e6eb);
    color: var(--color-primary-6, #165dff);
  }

  &.ac-voice-button-pressed {
    transform: scale(0.95);
  }

  &.ac-voice-button-recording {
    background-color: var(--color-danger-6, #f53f3f);
    color: white;
    animation: pulse 1.5s infinite;
  }

  &.ac-voice-button-processing {
    background-color: var(--color-warning-6, #ff7d00);
    color: white;
  }

  &.ac-voice-button-error {
    background-color: var(--color-danger-6, #f53f3f);
    color: white;
  }

  &.ac-voice-button-disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.ac-voice-button-content {
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.ac-voice-icon {
  width: 16px;
  height: 16px;
  transition: all 0.2s ease;

  &.recording {
    animation: shake 0.5s infinite;
  }

  &.processing {
    animation: spin 1s linear infinite;
  }
}

.ac-voice-recording-animation {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
}

.ac-voice-wave {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 32px;
  height: 32px;
  border: 2px solid var(--color-danger-6, #f53f3f);
  border-radius: 50%;
  animation: wave 1.5s infinite;

  &:nth-child(2) {
    animation-delay: 0.5s;
  }

  &:nth-child(3) {
    animation-delay: 1s;
  }
}

.ac-voice-status {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 4px;
  padding: 4px 8px;
  background-color: var(--color-bg-1, #1d2129);
  color: var(--color-text-1, #fff);
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 10;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-1px);
  }
  75% {
    transform: translateX(1px);
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

@keyframes wave {
  0% {
    width: 32px;
    height: 32px;
    opacity: 1;
  }
  100% {
    width: 60px;
    height: 60px;
    opacity: 0;
  }
}

// 响应式设计
@media (max-width: 600px) {
  .ac-voice-button {
    width: 28px;
    height: 28px;
  }

  .ac-voice-icon {
    width: 14px;
    height: 14px;
  }
}
</style>
