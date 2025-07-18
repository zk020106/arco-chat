<template>
  <textarea
    v-model="inputValue"
    :placeholder="placeholder"
    :disabled="rootProps.disabled"
    :maxlength="rootProps.maxLength"
    class="ac-textarea" :class="[
      { 'ac-textarea-simple': rootProps.displayType === DisplayType.Simple, 'ac-textarea-disabled': rootProps.disabled },
    ]"
    @input="onInput"
    @compositionstart="onCompositionStart"
    @compositionend="onCompositionEnd"
    @keydown="onKeydown"
    @focus="onFocus"
    @blur="onBlur"
  ></textarea>
</template>

<script setup lang="ts">
import { computed, inject, nextTick } from 'vue'
import { DisplayType, SubmitShortKey, inputInjectionKey } from '../input-types'
import type { InputContext } from '../input-types'

const { inputValue, rootProps, rootEmits } = inject(inputInjectionKey) as InputContext
const placeholder = computed(() => {
  let enterKey = ''
  let shiftEnterKey = ''
  if (rootProps.submitShortKey === SubmitShortKey.Enter) {
    enterKey = 'Enter'
    shiftEnterKey = 'Shift + Enter'
  }
  if (rootProps.submitShortKey === SubmitShortKey.ShiftEnter) {
    enterKey = 'Shift + Enter'
    shiftEnterKey = 'Enter'
  }
  return (
    rootProps.placeholder
    ?? (enterKey ? `请输入您的问题，并按${enterKey}发送，按${shiftEnterKey}换行` : '请输入您的问题...')
  )
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
  if (rootProps.submitShortKey === null) {
    return
  }
  const shiftKey
    = rootProps.submitShortKey === SubmitShortKey.Enter
      ? !e.shiftKey
      : rootProps.submitShortKey === SubmitShortKey.ShiftEnter
        ? e.shiftKey
        : false
  if (shiftKey && e.key === 'Enter' && !lock) {
    e.preventDefault()
    rootEmits('submit', inputValue.value)
    inputValue.value = ''
    rootEmits('change', inputValue.value)
  }
}

const onFocus = (e: FocusEvent) => {
  rootEmits('focus', e)
}

const onBlur = (e: FocusEvent) => {
  rootEmits('blur', e)
}
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

.ac-textarea::placeholder {
  color: var(--color-text-3);
}
</style>
