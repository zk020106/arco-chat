<template>
  <button
    :disabled="rootProps.disabled || (!rootProps.loading && !inputValue)"
    :class="buttonClasses"
    @click="onConfirm"
    @mousedown="() => (isMouseDown = true)"
    @mouseup="() => (isMouseDown = false)"
  >
    <span class="ac-button-content">
      <LoadingIcon v-if="rootProps.loading" />
      <SendIcon v-else />
      <span v-if="rootProps.sendBtnVariant === SendBtnVariant.Full" class="ac-button-content-text">
        {{ rootProps.loading ? '停止回答' : '发送' }}
      </span>
    </span>
    <div v-if="showWave" :style="waveStyle"></div>
  </button>
</template>

<script setup lang="ts">
import { SendBtnVariant, inputInjectionKey } from '../input-types'
import type { InputContext } from '../input-types'
import LoadingIcon from './LoadingIcon.vue'
import SendIcon from './SendIcon.vue'

const { inputValue, rootProps, rootEmits } = inject(
  inputInjectionKey,
) as InputContext
const isMouseDown = ref(false)
const showWave = ref(false)
const waveStyle = reactive({
  top: '0px',
  left: '0px',
})
const buttonClasses = computed(() => ({
  'ac-button': true,
  'ac-button-loading': rootProps.loading,
  'mousedown': isMouseDown.value,
  'ac-button-simple': rootProps.sendBtnVariant === SendBtnVariant.Simple,
}))

const showClickWave = (e: MouseEvent) => {
  waveStyle.left = `${e.offsetX}px`
  waveStyle.top = `${e.offsetY}px`
  showWave.value = true

  setTimeout(() => {
    showWave.value = false
  }, 300)
}

const onConfirm = (e: MouseEvent) => {
  showClickWave(e)
  if (rootProps.loading) {
    rootEmits('cancel')
  } else {
    rootEmits('submit', inputValue.value)
    inputValue.value = ''
    rootEmits('change', inputValue.value)
  }
}
</script>

<style scoped lang="scss">
/* 按钮组件样式 */
.ac-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  height: 32px;
  width: 70px;
  line-height: 1.5;
  font-size: 14px;
  padding: 5 12px;
  border-radius: 15px;
  background-color: rgb(var(--primary-6));
  overflow: hidden;
  border: none;
  cursor: pointer;
  transition: background-color 300ms  cubic-bezier(0.645, 0.045, 0.355, 1),
    border-color 300ms cubic-bezier(0.645, 0.045, 0.355, 1),
    color 300ms cubic-bezier(0.645, 0.045, 0.355, 1);

    &.ac-button-loading {
    svg {
      animation: rotating 1s linear infinite;
    }
  }
  &.mousedown:not(:disabled) {
    transform: scale(0.95);
  }
  &.ac-button-simple {
    width: 32px;
    padding: 6px;
    flex-shrink: 0;
    border-radius: 100%;

    svg {
      margin-right: 0;
    }
  }

  &:hover {
    background-color: rgb(var(--primary-5));
  }
  &:active {
    background-color: rgb(var(--primary-7));
  }
  &:disabled {
    color: var(--color-text-4, #C9CDD4);
    background-color: rgb(var(--primary-3));
    cursor: not-allowed;
    :deep(svg) {
      path {
        fill: var(--color-text-4, #C9CDD4);
      }
    }
  }
  .ac-button-content {
    display: inline-flex;
    align-items: center;
    font-size: var(--font-size-body-3, 14px);
    color: var(--color-white, #fff);
  }
  .ac-button-water-wave {
    position: absolute;
    background: rgb(var(--primary-6, #165dff));
    border-radius: 50%;
    opacity: 0;
    width: 20px;
    height: 20px;
    transform: translate(-50%, -50%);
    animation: waterWave 300ms cubic-bezier(0, 0, 1, 1);
  }

  svg {
    :deep(path) {
      fill: var(--color-white, #fff);
    }
    margin-right: 4px;
  }
}

@keyframes rotating {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(180deg);
  }
}

@keyframes waterWave {
  0% {
    opacity: 0.2;
    width: 30px;
    height: 30px;
  }

  100% {
    opacity: 0;
    width: 200px;
    height: 200px;
  }
}
</style>
