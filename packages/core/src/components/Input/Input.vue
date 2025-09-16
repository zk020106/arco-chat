<template>
  <div :class="inputClasses">
    <slot name="head" />
    <div class="ac-input-content">
      <slot name="prefix" />
      <Textarea />
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
import { computed, provide, ref, watch } from 'vue'
import Textarea from './components/textarea.vue'
import Button from './components/button.vue'
import {
  DisplayType,
  InputVariant,
  SendBtnVariant,
  inputEmits,
  inputInjectionKey,
} from './input-types'
import type { InputProps } from './input-types'

const props = withDefaults(defineProps<InputProps>(), {
  modelValue: '',
  value: '',
  placeholder: '',
  disabled: false,
  displayType: DisplayType.Full,
  variant: InputVariant.Bordered,
  sendBtnVariant: SendBtnVariant.Full,
  loading: false,
  showCount: false,
  maxLength: undefined,
  submitShortKey: null,
})
const emits = defineEmits([...inputEmits, 'update:modelValue'])

const inputValue = ref('')
const inputClasses = computed(() => ({
  'ac-input': true,
  'ac-input-disabled': props.disabled,
  'ac-input-simple': props.displayType === DisplayType.Simple,
  'ac-input-borderless': props.variant === InputVariant.BorderLess,
}))

const clearInput = () => {
  inputValue.value = ''
}
const getInput = () => inputValue.value

watch(
  () => [props.modelValue, props.value],
  () => {
    inputValue.value = props.modelValue ?? props.value
  },
  { immediate: true },
)

watch(
  () => inputValue.value,
  (val) => {
    emits('update:modelValue', val)
  },
)
provide(inputInjectionKey, { inputValue, rootProps: props, rootEmits: emits })
defineExpose({ clearInput, getInput })
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
