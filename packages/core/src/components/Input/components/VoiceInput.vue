<template>
  <div class="ac-voice-input">
    <!-- 语音按钮 -->
    <a-button
      :disabled="disabled"
      :type="isRecording ? 'primary' : 'text'"
      :status="isRecording ? 'danger' : 'normal'"
      size="mini"
      :class="voiceButtonClasses"
      @click="handleClick"
    >
      <template #icon>
        <icon-voice v-if="!isRecording" />
        <icon-record-stop v-else />
      </template>
    </a-button>
    
    <!-- 录音动画 -->
    <div v-if="isRecording" class="ac-voice-recording-animation">
      <div class="ac-voice-wave"></div>
      <div class="ac-voice-wave"></div>
      <div class="ac-voice-wave"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import IconVoice from '@arco-design/web-vue/es/icon/icon-voice'
import IconRecordStop from '@arco-design/web-vue/es/icon/icon-record-stop'

interface Props {
  disabled?: boolean
  isRecording?: boolean
  position?: 'left' | 'right'
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  isRecording: false,
  position: 'left',
})

const emits = defineEmits<{
  start: []
  stop: []
}>()

const voiceButtonClasses = computed(() => ({
  'ac-voice-button': true,
  'ac-voice-button-disabled': props.disabled,
  'ac-voice-button-recording': props.isRecording,
  'ac-voice-button-left': props.position === 'left',
  'ac-voice-button-right': props.position === 'right',
}))

const handleClick = () => {
  if (props.disabled) return
  
  if (props.isRecording) {
    emits('stop')
  } else {
    emits('start')
  }
}
</script>

<style scoped lang="scss">
.ac-voice-input {
  display: inline-flex;
  position: relative;
}

.ac-voice-button {
  &.ac-voice-button-recording {
    .arco-btn-icon {
      animation: pulse 1s ease-in-out infinite;
    }
  }
}

.ac-voice-recording-animation {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  gap: 2px;
  pointer-events: none;
}

.ac-voice-wave {
  width: 3px;
  height: 12px;
  background-color: var(--color-danger-6);
  border-radius: 1.5px;
  animation: wave 1s ease-in-out infinite;
  
  &:nth-child(2) {
    animation-delay: 0.1s;
  }
  
  &:nth-child(3) {
    animation-delay: 0.2s;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

@keyframes wave {
  0%, 100% {
    height: 12px;
  }
  50% {
    height: 20px;
  }
}
</style>