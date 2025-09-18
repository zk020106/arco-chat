<template>
  <div :class="inputClasses">
    <slot name="head" />
    <div class="ac-input-content">
      <slot name="prefix" />
      
      <!-- 语音输入按钮（左侧） -->
      <VoiceInput
        v-if="voiceInput.enabled && voiceInput.buttonPosition === 'left'"
        :config="voiceInput"
        :disabled="disabled || readonly"
        @voice-start="handleVoiceStart"
        @voice-end="handleVoiceEnd"
        @voice-result="handleVoiceResult"
        @voice-error="handleVoiceError"
      />
      
      <Textarea />
      
      <!-- 语音输入按钮（右侧） -->
      <VoiceInput
        v-if="voiceInput.enabled && voiceInput.buttonPosition === 'right'"
        :config="voiceInput"
        :disabled="disabled || readonly"
        @voice-start="handleVoiceStart"
        @voice-end="handleVoiceEnd"
        @voice-result="handleVoiceResult"
        @voice-error="handleVoiceError"
      />
      
      <slot name="suffix" />
      <slot v-if="displayType === DisplayType.Simple" name="button">
        <Button />
      </slot>
    </div>
    <div v-if="displayType === DisplayType.Full" class="ac-input-foot">
      <div class="ac-input-foot-left">
        <slot name="extra" />
        <span v-if="showCount" class="ac-input-foot-count">
          {{ inputValue.length }}{{ !(maxLength ?? false) ? "" : `/${maxLength}` }}
        </span>
      </div>
      <slot name="button">
        <Button />
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Textarea from './components/textarea.vue'
import Button from './components/button.vue'
import VoiceInput from './components/VoiceInput.vue'
import {
  DisplayType,
  InputVariant,
  SendBtnVariant,
  inputEmits,
} from './input-types'
import type { InputProps } from './input-types'
import { useInput } from './composables/useInput'

const props = withDefaults(defineProps<InputProps>(), {
  modelValue: '',
  value: '',
  placeholder: '',
  disabled: false,
  readonly: false,
  displayType: DisplayType.Full,
  variant: InputVariant.Bordered,
  sendBtnVariant: SendBtnVariant.Full,
  loading: false,
  showCount: false,
  maxLength: undefined,
  submitShortKey: null,
  voiceInput: () => ({ enabled: false }),
  commandTriggers: () => [],
  autofocus: false,
  autoResize: true,
  minRows: 1,
  maxRows: 6,
})

const emits = defineEmits([...inputEmits, 'update:modelValue'])

// 使用组合式 API
const {
  inputValue,
  isDisabled,
  isReadonly,
  isLoading,
  clearInput,
  getInput,
  setInput,
  focus,
  blur
} = useInput(props, emits)

// 计算样式类
const inputClasses = computed(() => ({
  'ac-input': true,
  'ac-input-disabled': isDisabled.value,
  'ac-input-readonly': isReadonly.value,
  'ac-input-simple': props.displayType === DisplayType.Simple,
  'ac-input-borderless': props.variant === InputVariant.BorderLess,
  'ac-input-loading': isLoading.value,
}))

// 语音输入事件处理
const handleVoiceStart = () => {
  emits('voice-start')
}

const handleVoiceEnd = () => {
  emits('voice-end')
}

const handleVoiceResult = (result: string, fullText: string) => {
  emits('voice-result', result, fullText)
}

const handleVoiceError = (error: string) => {
  emits('voice-error', error)
}

// 暴露方法
defineExpose({ 
  clearInput, 
  getInput, 
  setInput, 
  focus, 
  blur,
  inputValue: inputValue.value
})
</script>

<style lang="scss" scoped>
@use './input.scss';
// 响应式
@media (max-width: 600px) {
  .ac-input {
    padding: 10px 6px 8px 6px;
  }
  .ac-input-content {
    padding: 6px 6px;
    font-size: 15px;
  }
}
</style>
