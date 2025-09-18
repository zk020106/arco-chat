/**
 * Input 组件的组合式 API
 * 提供更优雅的 API 设计
 */

import { inputInjectionKey } from '../input-types'
import type { InputProps, InputContext } from '../input-types'

/**
 * 创建 Input 实例
 */
export function useInput(props: InputProps, emit: any) {
  const inputValue = ref('')
  
  // 计算属性
  const isDisabled = computed(() => props.disabled)
  const isReadonly = computed(() => props.readonly)
  const isLoading = computed(() => props.loading)
  
  // 方法
  const clearInput = () => {
    inputValue.value = ''
  }
  
  const getInput = () => inputValue.value
  
  const setInput = (value: string) => {
    inputValue.value = value
  }
  
  const focus = () => {
    // 这个方法会在子组件中实现
  }
  
  const blur = () => {
    // 这个方法会在子组件中实现
  }
  
  // 监听 props 变化
  watch(
    () => [props.modelValue, props.value],
    () => {
      inputValue.value = props.modelValue ?? props.value
    },
    { immediate: true }
  )
  
  // 监听输入值变化
  watch(
    () => inputValue.value,
    (val) => {
      emit('update:modelValue', val)
    }
  )
  
  // 提供上下文
  const context: InputContext = {
    inputValue,
    rootProps: props,
    rootEmits: emit
  }
  
  provide(inputInjectionKey, context)
  
  return {
    inputValue,
    isDisabled,
    isReadonly,
    isLoading,
    clearInput,
    getInput,
    setInput,
    focus,
    blur,
    context
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
export function useVoiceInput(config: any) {
  const isRecording = ref(false)
  const isProcessing = ref(false)
  const error = ref<string | null>(null)
  
  const startRecording = () => {
    if (config.customRecognition) {
      // 使用自定义实现
      isRecording.value = true
      config.customRecognition.start({
        onResult: (result: string) => {
          // 处理结果
        },
        onEnd: () => {
          isRecording.value = false
        },
        onError: (err: string) => {
          error.value = err
          isRecording.value = false
        }
      })
    } else {
      // 使用默认实现
      // 这里可以集成 Web Speech API
    }
  }
  
  const stopRecording = () => {
    if (config.customRecognition) {
      config.customRecognition.stop()
    }
    isRecording.value = false
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
export function useCommandTrigger(triggers: any[]) {
  const activeTrigger = ref<any>(null)
  const suggestions = ref<any[]>([])
  const showPopup = ref(false)
  
  const checkTrigger = (text: string, cursorPosition: number) => {
    const beforeCursor = text.slice(0, cursorPosition)
    const lastSpaceIndex = beforeCursor.lastIndexOf(' ')
    const lastChar = beforeCursor.slice(lastSpaceIndex + 1)
    
    const matchedTrigger = triggers.find(trigger => 
      lastChar.startsWith(trigger.trigger)
    )
    
    if (matchedTrigger) {
      activeTrigger.value = matchedTrigger
      showPopup.value = true
      
      if (matchedTrigger.getSuggestions) {
        suggestions.value = matchedTrigger.getSuggestions(matchedTrigger.trigger, cursorPosition)
      } else if (matchedTrigger.suggestions) {
        suggestions.value = matchedTrigger.suggestions
      }
    } else {
      activeTrigger.value = null
      showPopup.value = false
      suggestions.value = []
    }
  }
  
  const selectSuggestion = (suggestion: any) => {
    showPopup.value = false
    return suggestion
  }
  
  return {
    activeTrigger,
    suggestions,
    showPopup,
    checkTrigger,
    selectSuggestion
  }
}
