<template>
  <div class="ac-textarea-container">
    <textarea
      ref="textareaRef"
      v-model="inputValue"
      :placeholder="placeholder"
      :disabled="rootProps.disabled"
      :readonly="rootProps.readonly"
      :maxlength="rootProps.maxLength"
      :autofocus="rootProps.autofocus"
      class="ac-textarea" :class="[
        { 
          'ac-textarea-simple': rootProps.displayType === DisplayType.Simple, 
          'ac-textarea-disabled': rootProps.disabled,
          'ac-textarea-readonly': rootProps.readonly,
        },
      ]"
      :style="textareaStyle"
      @input="onInput"
      @compositionstart="onCompositionStart"
      @compositionend="onCompositionEnd"
      @keydown="onKeydown"
      @focus="onFocus"
      @blur="onBlur"
      @paste="onPaste"
    ></textarea>
    
    <!-- 指令触发弹窗 -->
    <CommandTrigger
      v-if="showCommandPopup"
      :triggers="rootProps.commandTriggers"
      :cursor-position="cursorPosition"
      :show-popup="showCommandPopup"
      @close="closeCommandPopup"
      @select="onCommandSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, inject, nextTick, ref, watch, onMounted, onUnmounted } from 'vue'
import { DisplayType, SubmitShortKey, inputInjectionKey } from '../input-types'
import type { InputContext } from '../input-types'
import CommandTrigger from './CommandTrigger.vue'
import { InputKeyboardHandler } from '../utils/keyboard'

const { inputValue, rootProps, rootEmits } = inject(inputInjectionKey) as InputContext

const textareaRef = ref<HTMLTextAreaElement>()
const showCommandPopup = ref(false)
const cursorPosition = ref(0)
const keyboardHandler = new InputKeyboardHandler()
const placeholder = computed(() => {
  let enterKey = ''
  let shiftEnterKey = ''
  let ctrlEnterKey = ''
  let altEnterKey = ''
  
  if (rootProps.submitShortKey === SubmitShortKey.Enter) {
    enterKey = 'Enter'
    shiftEnterKey = 'Shift + Enter'
  } else if (rootProps.submitShortKey === SubmitShortKey.ShiftEnter) {
    enterKey = 'Shift + Enter'
    shiftEnterKey = 'Enter'
  } else if (rootProps.submitShortKey === SubmitShortKey.CtrlEnter) {
    enterKey = 'Ctrl + Enter'
    shiftEnterKey = 'Enter'
  } else if (rootProps.submitShortKey === SubmitShortKey.AltEnter) {
    enterKey = 'Alt + Enter'
    shiftEnterKey = 'Enter'
  }
  
  return (
    rootProps.placeholder
    ?? (enterKey ? `请输入您的问题，并按${enterKey}发送，按${shiftEnterKey}换行` : '请输入您的问题...')
  )
})

// 计算 textarea 样式
const textareaStyle = computed(() => {
  const style: Record<string, string> = {}
  
  if (rootProps.autoResize) {
    style.resize = 'none'
    style.overflow = 'hidden'
  }
  
  return style
})
let lock = false

const emitChange = () => {
  nextTick(() => {
    rootEmits('change', inputValue.value)
  })
}
const onInput = () => {
  if (!lock) {
    emitChange()
  }
}
const onCompositionStart = () => {
  lock = true
}
const onCompositionEnd = () => {
  lock = false
  emitChange()
}

const onKeydown = (e: KeyboardEvent) => {
  // 更新光标位置
  cursorPosition.value = textareaRef.value?.selectionStart || 0
  
  // 检查指令触发
  checkCommandTrigger(e)
  
  // 使用键盘处理器处理事件
  const handled = keyboardHandler.handle(e as any)
  
  if (!handled) {
    rootEmits('keydown', e)
  }
}

// 检查指令触发
const checkCommandTrigger = (e: KeyboardEvent) => {
  if (rootProps.commandTriggers.length === 0) return
  
  const text = inputValue.value.slice(0, cursorPosition.value)
  const lastSpaceIndex = text.lastIndexOf(' ')
  const lastChar = text.slice(lastSpaceIndex + 1)
  
  // 检查是否匹配任何触发字符
  const matchedTrigger = rootProps.commandTriggers.find(trigger => 
    lastChar.startsWith(trigger.trigger)
  )
  
  if (matchedTrigger && !showCommandPopup.value) {
    showCommandPopup.value = true
    rootEmits('command-trigger', matchedTrigger, cursorPosition.value)
  } else if (!matchedTrigger && showCommandPopup.value) {
    showCommandPopup.value = false
  }
}

// 关闭指令弹窗
const closeCommandPopup = () => {
  showCommandPopup.value = false
}

// 选择指令
const onCommandSelect = (suggestion: any) => {
  showCommandPopup.value = false
  rootEmits('command-trigger', suggestion, cursorPosition.value)
}

const onFocus = (e: FocusEvent) => {
  rootEmits('focus', e)
}

const onBlur = (e: FocusEvent) => {
  rootEmits('blur', e)
}

const onPaste = (e: ClipboardEvent) => {
  rootEmits('paste', e)
}

// 自动调整高度
const autoResize = () => {
  if (!rootProps.autoResize || !textareaRef.value) return
  
  const textarea = textareaRef.value
  textarea.style.height = 'auto'
  
  const minHeight = rootProps.minRows * 20 // 假设每行20px
  const maxHeight = rootProps.maxRows * 20
  const scrollHeight = textarea.scrollHeight
  
  const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight)
  textarea.style.height = `${newHeight}px`
  
  rootEmits('resize', { height: newHeight })
}

// 监听输入变化，自动调整高度
watch(inputValue, () => {
  nextTick(() => {
    autoResize()
  })
}, { flush: 'post' })

// 设置键盘处理器
onMounted(() => {
  // 设置提交快捷键
  if (rootProps.submitShortKey) {
    const submitType = rootProps.submitShortKey === SubmitShortKey.Enter ? 'enter' :
                      rootProps.submitShortKey === SubmitShortKey.ShiftEnter ? 'shiftEnter' :
                      rootProps.submitShortKey === SubmitShortKey.CtrlEnter ? 'ctrlEnter' :
                      rootProps.submitShortKey === SubmitShortKey.AltEnter ? 'altEnter' : 'enter'
    
    keyboardHandler.setSubmitShortcut(submitType)
  }
  
  // 添加提交处理器
  keyboardHandler.addShortcut('submit', { key: 'Enter', preventDefault: true }, () => {
    if (!lock) {
      rootEmits('submit', inputValue.value)
      inputValue.value = ''
      rootEmits('change', inputValue.value)
    }
  })
  
  keyboardHandler.addShortcut('submitWithShift', { key: 'Enter', shift: true, preventDefault: true }, () => {
    if (!lock) {
      rootEmits('submit', inputValue.value)
      inputValue.value = ''
      rootEmits('change', inputValue.value)
    }
  })
  
  keyboardHandler.addShortcut('submitWithCtrl', { key: 'Enter', ctrl: true, preventDefault: true }, () => {
    if (!lock) {
      rootEmits('submit', inputValue.value)
      inputValue.value = ''
      rootEmits('change', inputValue.value)
    }
  })
  
  keyboardHandler.addShortcut('submitWithAlt', { key: 'Enter', alt: true, preventDefault: true }, () => {
    if (!lock) {
      rootEmits('submit', inputValue.value)
      inputValue.value = ''
      rootEmits('change', inputValue.value)
    }
  })
  
  keyboardHandler.addShortcut('submitWithMeta', { key: 'Enter', meta: true, preventDefault: true }, () => {
    if (!lock) {
      rootEmits('submit', inputValue.value)
      inputValue.value = ''
      rootEmits('change', inputValue.value)
    }
  })
  
  // 添加 ESC 处理器
  keyboardHandler.addShortcut('escape', { key: 'Escape', preventDefault: true }, () => {
    closeCommandPopup()
  })
})

onUnmounted(() => {
  // 清理键盘处理器
  keyboardHandler.removeShortcut('submit')
  keyboardHandler.removeShortcut('submitWithShift')
  keyboardHandler.removeShortcut('submitWithCtrl')
  keyboardHandler.removeShortcut('submitWithAlt')
  keyboardHandler.removeShortcut('submitWithMeta')
  keyboardHandler.removeShortcut('escape')
})
</script>

<style scoped lang="scss">
/* 输入框文本域样式 */
.ac-textarea {
  width: 100%;
  min-height: 32px;
  padding: 8px 12px;
  color: var(--color-text-1);
  font-size: var(--font-size-body-medium);
  background-color: var(--color-bg-2);
  vertical-align: middle;
  outline: none;
  box-sizing: border-box;
  resize: none;
  border: none;
}

.ac-textarea-simple {
  height: 32px;
}

.ac-textarea-disabled {
  color: var(--color-text-4);
  background-color: var(--color-fill-2);
  cursor: not-allowed;
}

.ac-textarea-readonly {
  color: var(--color-text-2);
  background-color: var(--color-fill-1);
  cursor: default;
}

.ac-textarea::placeholder {
  color: var(--color-text-3);
}
</style>
