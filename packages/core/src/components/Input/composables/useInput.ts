/**
 * Input 组件的组合式 API
 * 提供更优雅的 API 设计
 */

import { ref, computed, watch, provide } from 'vue'
import { inputInjectionKey } from '../input-types'
import type { InputProps, InputContext, InputInstance } from '../input-types'

/**
 * 创建 Input 实例
 */
export function useInput(props: InputProps, emit: any) {
  const inputValue = ref(props.modelValue)
  const headerVisible = ref(false)
  const popoverVisible = ref(props.triggerPopoverVisible)
  const isRecording = ref(false)
  const inputRef = ref<HTMLTextAreaElement>()
  
  // 计算属性
  const isDisabled = computed(() => props.disabled)
  const isReadonly = computed(() => props.readOnly)
  const isLoading = computed(() => props.loading)
  
  // 方法
  const clear = () => {
    inputValue.value = ''
    emit('update:modelValue', '')
  }
  
  const blur = () => {
    inputRef.value?.blur()
  }
  
  const focus = (position: 'all' | 'start' | 'end' = 'all') => {
    if (!inputRef.value) return
    
    inputRef.value.focus()
    
    if (position === 'all') {
      inputRef.value.select()
    } else if (position === 'start') {
      inputRef.value.setSelectionRange(0, 0)
    } else if (position === 'end') {
      const length = inputRef.value.value.length
      inputRef.value.setSelectionRange(length, length)
    }
  }
  
  const submit = () => {
    if (!isDisabled.value && !isReadonly.value && inputValue.value.trim()) {
      emit('submit')
    }
  }
  
  const cancel = () => {
    emit('cancel')
  }
  
  const startRecognition = () => {
    if (!props.allowSpeech || isRecording.value) return
    
    isRecording.value = true
    emit('recordingChange', true)
    
    // 这里可以集成 Web Speech API 或自定义语音识别
    // 暂时模拟语音识别
    setTimeout(() => {
      stopRecognition()
    }, 3000)
  }
  
  const stopRecognition = () => {
    if (!isRecording.value) return
    
    isRecording.value = false
    emit('recordingChange', false)
  }
  
  const openHeader = () => {
    headerVisible.value = true
    setTimeout(() => {
      closeHeader()
    }, props.headerAnimationTimer)
  }
  
  const closeHeader = () => {
    headerVisible.value = false
  }
  
  // 监听 props 变化
  watch(
    () => props.modelValue,
    (val) => {
      inputValue.value = val
    },
    { immediate: true }
  )
  
  watch(
    () => props.triggerPopoverVisible,
    (val) => {
      popoverVisible.value = val
    }
  )
  
  // 监听输入值变化
  watch(
    () => inputValue.value,
    (val) => {
      emit('update:modelValue', val)
    }
  )
  
  // 监听弹框可见性变化
  watch(
    () => popoverVisible.value,
    (val) => {
      emit('update:triggerPopoverVisible', val)
    }
  )
  
  // 提供上下文
  const context: InputContext = {
    inputValue,
    rootProps: props,
    rootEmits: emit
  }
  
  provide(inputInjectionKey, context)
  
  // 创建实例方法
  const instance: InputInstance = {
    openHeader,
    closeHeader,
    clear,
    blur,
    focus,
    submit,
    cancel,
    startRecognition,
    stopRecognition,
    get popoverVisible() { return popoverVisible.value },
    set popoverVisible(val) { popoverVisible.value = val },
    get inputInstance() { return inputRef.value }
  }
  
  return {
    inputValue,
    headerVisible,
    popoverVisible,
    isRecording,
    inputRef,
    isDisabled,
    isReadonly,
    isLoading,
    clear,
    blur,
    focus,
    submit,
    cancel,
    startRecognition,
    stopRecognition,
    openHeader,
    closeHeader,
    context,
    instance
  }
}

/**
 * 注入 Input 上下文
 */
export function useInputContext() {
  const context = inject<InputContext>(inputInjectionKey)
  if (!context) {
    throw new Error('useInputContext must be used within Input component')
  }
  return context
}

/**
 * 创建语音输入功能
 */
export function useVoiceInput(allowSpeech: boolean) {
  const isRecording = ref(false)
  const isProcessing = ref(false)
  const error = ref<string | null>(null)
  
  const startRecording = () => {
    if (!allowSpeech) return
    
    isRecording.value = true
    isProcessing.value = false
    error.value = null
    
    // 使用 Web Speech API
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'zh-CN'
      
      recognition.onstart = () => {
        isRecording.value = true
      }
      
      recognition.onresult = (event: any) => {
        const result = event.results[0][0].transcript
        isProcessing.value = true
        // 这里可以触发结果事件
      }
      
      recognition.onerror = (event: any) => {
        error.value = event.error
        isRecording.value = false
        isProcessing.value = false
      }
      
      recognition.onend = () => {
        isRecording.value = false
        isProcessing.value = false
      }
      
      recognition.start()
    } else {
      error.value = '浏览器不支持语音识别'
      isRecording.value = false
    }
  }
  
  const stopRecording = () => {
    isRecording.value = false
    isProcessing.value = false
  }
  
  return {
    isRecording,
    isProcessing,
    error,
    startRecording,
    stopRecording
  }
}

/**
 * 创建指令触发功能
 */
export function useCommandTrigger(triggerStrings: string[]) {
  const activeTrigger = ref<string | null>(null)
  const showPopup = ref(false)
  
  const checkTrigger = (text: string, cursorPosition: number) => {
    const beforeCursor = text.slice(0, cursorPosition)
    const lastSpaceIndex = beforeCursor.lastIndexOf(' ')
    const lastChar = beforeCursor.slice(lastSpaceIndex + 1)
    
    const matchedTrigger = triggerStrings.find(trigger => 
      lastChar.startsWith(trigger)
    )
    
    if (matchedTrigger) {
      activeTrigger.value = matchedTrigger
      showPopup.value = true
    } else {
      activeTrigger.value = null
      showPopup.value = false
    }
  }
  
  const selectTrigger = (trigger: string) => {
    showPopup.value = false
    return trigger
  }
  
  return {
    activeTrigger,
    showPopup,
    checkTrigger,
    selectTrigger
  }
}
