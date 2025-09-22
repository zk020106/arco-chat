<template>
  <div 
    :class="inputClasses" 
    :style="{ width: inputWidth, ...inputStyle }"
  >
    <!-- 自定义头部 -->
    <transition name="fade">
      <div v-if="headerVisible" class="ac-input-header">
        <slot name="header" />
      </div>
    </transition>
    
    <div class="ac-input-content">
      <!-- 前缀插槽 -->
      <slot name="prefix" />
      
      <!-- 语音输入按钮（左侧） -->
      <VoiceInput
        v-if="allowSpeech"
        :disabled="disabled || readOnly"
        :is-recording="isRecording"
        @start="startRecognition"
        @stop="stopRecognition"
      />
      
      <!-- 文本输入区域 -->
      <a-textarea
        ref="textareaRef"
        v-model="inputValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readOnly"
        :auto-size="autoSize"
        :style="textareaStyle"
        class="ac-input-textarea"
        @keydown="handleKeydown"
        @paste="handlePaste"
      />
      
      <!-- 清空按钮 -->
      <a-button
        v-if="clearable && inputValue"
        type="text"
        size="mini"
        class="ac-clear-button"
        @click="clear"
      >
        <template #icon>
          <icon-close />
        </template>
      </a-button>
      
      <!-- 语音输入按钮（右侧） -->
      <VoiceInput
        v-if="allowSpeech"
        :disabled="disabled || readOnly"
        :is-recording="isRecording"
        position="right"
        @start="startRecognition"
        @stop="stopRecognition"
      />
      
      <!-- 后缀插槽 -->
      <slot name="suffix" />
      
      <!-- 操作列表插槽 -->
      <slot name="action-list" />
      
      <!-- 发送按钮 -->
      <a-button
        type="primary"
        :disabled="submitBtnDisabled ?? (disabled || readOnly || !inputValue.trim())"
        :loading="loading"
        class="ac-submit-button"
        @click="submit"
      >
        <template #icon v-if="!loading">
          <icon-send />
        </template>
      </a-button>
    </div>
    
    <!-- 底部区域 -->
    <div v-if="variant === InputVariant.Updown && showUpdown" class="ac-input-footer">
      <slot name="footer" />
    </div>
    
    <!-- 指令触发弹窗 -->
    <a-popover
      v-model:popup-visible="popoverVisible"
      :width="triggerPopoverWidth"
      :position="triggerPopoverPlacement"
      :offset="triggerPopoverOffset"
      trigger="manual"
    >
      <template #content>
        <div class="ac-trigger-popover-content">
          <div
            v-for="trigger in triggerStrings"
            :key="trigger"
            class="ac-trigger-item"
            @click="selectTrigger(trigger)"
          >
            {{ trigger }}
          </div>
        </div>
      </template>
    </a-popover>
  </div>
</template>

<script setup lang="ts">
import { computed, defineExpose } from 'vue'
import IconClose from '@arco-design/web-vue/es/icon/icon-close'
import IconSend from '@arco-design/web-vue/es/icon/icon-send'
import VoiceInput from './components/VoiceInput.vue'
import {
  InputVariant,
  SubmitType,
  inputEmits,
} from './input-types'
import type { InputProps, TriggerEvent, PasteFileEvent } from './input-types'
import { useInput } from './composables/useInput'

const props = withDefaults(defineProps<InputProps>(), {
  modelValue: '',
  placeholder: '',
  autoSize: () => ({ minRows: 1, maxRows: 6 }),
  readOnly: false,
  disabled: false,
  submitBtnDisabled: undefined,
  loading: false,
  clearable: false,
  allowSpeech: false,
  submitType: SubmitType.Enter,
  headerAnimationTimer: 300,
  inputWidth: '100%',
  variant: InputVariant.Default,
  showUpdown: true,
  inputStyle: () => ({}),
  triggerStrings: () => [],
  triggerPopoverVisible: false,
  triggerPopoverWidth: 'fit-content',
  triggerPopoverLeft: '0px',
  triggerPopoverOffset: 8,
  triggerPopoverPlacement: 'top-start',
})

const emits = defineEmits([...inputEmits])

// 使用组合式 API
const {
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
  instance
} = useInput(props, emits)

// 计算样式类
const inputClasses = computed(() => ({
  'ac-input': true,
  'ac-input-disabled': isDisabled.value,
  'ac-input-readonly': isReadonly.value,
  'ac-input-loading': isLoading.value,
  'ac-input-default': props.variant === InputVariant.Default,
  'ac-input-updown': props.variant === InputVariant.Updown,
  'ac-input-recording': isRecording.value,
}))

// 计算 textarea 样式
const textareaStyle = computed(() => ({
  resize: 'none',
  border: 'none',
  outline: 'none',
  background: 'transparent',
  ...props.inputStyle
}))

// 事件处理
const handleKeydown = (e: KeyboardEvent) => {
  // 处理提交快捷键
  if (e.key === 'Enter') {
    const shouldSubmit = 
      (props.submitType === SubmitType.Enter && !e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey) ||
      (props.submitType === SubmitType.ShiftEnter && e.shiftKey) ||
      (props.submitType === SubmitType.CmdOrCtrlEnter && (e.ctrlKey || e.metaKey)) ||
      (props.submitType === SubmitType.AltEnter && e.altKey)
    
    if (shouldSubmit) {
      e.preventDefault()
      submit()
    }
  }
  
  // 检查指令触发
  checkTrigger(e)
}

const handlePaste = (e: ClipboardEvent) => {
  const files = e.clipboardData?.files
  if (files && files.length > 0) {
    const event: PasteFileEvent = {
      firstFile: files[0],
      fileList: files
    }
    emits('pasteFile', event)
  }
}

// 检查指令触发
const checkTrigger = (e: KeyboardEvent) => {
  if (props.triggerStrings.length === 0) return
  
  const textarea = inputRef.value
  if (!textarea) return
  
  const cursorPosition = textarea.selectionStart || 0
  const text = inputValue.value.slice(0, cursorPosition)
  const lastSpaceIndex = text.lastIndexOf(' ')
  const lastChar = text.slice(lastSpaceIndex + 1)
  
  // 检查是否匹配任何触发字符
  const matchedTrigger = props.triggerStrings.find(trigger => 
    lastChar.startsWith(trigger)
  )
  
  if (matchedTrigger && !popoverVisible.value) {
    popoverVisible.value = true
    const event: TriggerEvent = {
      oldValue: '',
      newValue: matchedTrigger,
      isOpen: true
    }
    emits('trigger', event)
  } else if (!matchedTrigger && popoverVisible.value) {
    popoverVisible.value = false
    const event: TriggerEvent = {
      oldValue: '',
      newValue: '',
      isOpen: false
    }
    emits('trigger', event)
  }
}

// 选择指令
const selectTrigger = (trigger: string) => {
  popoverVisible.value = false
  const event: TriggerEvent = {
    oldValue: '',
    newValue: trigger,
    isOpen: false
  }
  emits('trigger', event)
}

// 暴露实例方法
defineExpose(instance)
</script>

<style lang="scss" scoped>
@use './input.scss';
</style>