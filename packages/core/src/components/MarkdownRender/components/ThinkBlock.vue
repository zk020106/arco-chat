<template>
  <div 
    class="ac-think-block"
    :class="{ 'ac-think-block-visible': isVisible }"
  >
    <div class="ac-think-header" @click="toggleFold">
      <div class="ac-think-title">
        <div class="ac-think-icon" :class="{ 'ac-think-icon-animate': !folded }">
          <icon-bulb />
        </div>
        <span class="ac-think-label">深度思考</span>
      </div>
      <div class="ac-think-toggle">
        <icon-down v-if="folded" class="ac-toggle-icon" />
        <icon-up v-else class="ac-toggle-icon" />
      </div>
    </div>
    <transition 
      name="think-expand"
      @enter="onEnter"
      @leave="onLeave"
    >
      <div v-show="!folded" class="ac-think-content">
        <div class="ac-think-content-inner">
          <slot />
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Button as AButton } from '@arco-design/web-vue'
import { IconDown, IconUp, IconBulb } from '@arco-design/web-vue/es/icon'

const folded = ref(false)
const isVisible = ref(false)

function toggleFold() {
  folded.value = !folded.value
}

// 组件进入动画
onMounted(() => {
  setTimeout(() => {
    isVisible.value = true
  }, 100)
})

// 动画钩子
function onEnter(el: Element) {
  const element = el as HTMLElement
  element.style.transform = 'translateY(-10px)'
  element.style.opacity = '0'
  
  requestAnimationFrame(() => {
    element.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
    element.style.transform = 'translateY(0)'
    element.style.opacity = '1'
  })
}

function onLeave(el: Element) {
  const element = el as HTMLElement
  element.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  element.style.transform = 'translateY(-10px)'
  element.style.opacity = '0'
}
</script>

<style lang="scss" scoped>
.ac-think-block {
  background: var(--color-bg-2);
  border: 1px solid var(--color-border-2);
  border-radius: 16px;
  margin: 16px 0;
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.08),
    0 1px 3px rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(10px);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  opacity: 0;
  transform: translateY(20px) scale(0.95);
  
  &.ac-think-block-visible {
    opacity: 1;
    transform: translateY(0) scale(1);
    animation: thinkBlockAppear 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: var(--primary-6);
    border-radius: 16px 16px 0 0;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 
      0 8px 30px rgba(0, 0, 0, 0.12),
      0 2px 8px rgba(0, 0, 0, 0.16);
  }
}

.ac-think-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  position: relative;
  
  &:hover {
    background: var(--color-fill-1);
  }
  
  &:active {
    background: var(--color-fill-2);
  }
}

.ac-think-title {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.ac-think-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: var(--primary-6);
  border-radius: 8px;
  color: white;
  font-size: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.ac-think-label {
  font-size: 16px;
  font-weight: 500;
  color: rgb(var(--color-text-3));
  letter-spacing: 0.5px;
  transition: color 0.2s ease;
  animation: thinking-pulse 2s ease-in-out infinite;
}

.ac-think-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: var(--color-fill-1);
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--color-fill-2);
    transform: scale(1.1);
  }
}

.ac-toggle-icon {
  font-size: 14px;
  color: rgb(var(--primary-6));
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.ac-think-content {
  overflow: hidden;
  border-top: 1px solid var(--color-border-1);
}

.ac-think-content-inner {
  padding: 20px;
  font-size: 14px;
  line-height: 1.6;
  color: rgb(var(--color-text-3));
  background: var(--color-bg-1);
  max-height: 500px;
  overflow-y: auto;
  
  /* 自定义滚动条 */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--color-fill-1);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--color-border-2);
    border-radius: 3px;
    
    &:hover {
      background: var(--color-border-3);
    }
  }
}

/* 展开/收起动画 */
.think-expand-enter-active,
.think-expand-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: top;
}

.think-expand-enter-from,
.think-expand-leave-to {
  opacity: 0;
  transform: scaleY(0);
  max-height: 0;
}

.think-expand-enter-to,
.think-expand-leave-from {
  opacity: 1;
  transform: scaleY(1);
  max-height: 500px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .ac-think-block {
    margin: 12px 0;
    border-radius: 12px;
  }
  
  .ac-think-header {
    padding: 12px 16px;
  }
  
  .ac-think-icon {
    width: 28px;
    height: 28px;
    font-size: 14px;
  }
  
  .ac-think-label {
    font-size: 15px;
  }
  
  .ac-think-content-inner {
    padding: 16px;
    font-size: 13px;
  }
}

/* 思考动画效果 - 类似Cursor的思考状态 */
@keyframes thinking-pulse {
  0% {
    color: rgb(var(--color-text-3));
    opacity: 0.6;
  }
  50% {
    color: rgb(var(--color-text-2));
    opacity: 1;
  }
  100% {
    color: rgb(var(--color-text-3));
    opacity: 0.6;
  }
}

/* 组件出现动画 */
@keyframes thinkBlockAppear {
  0% {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  50% {
    opacity: 0.8;
    transform: translateY(-5px) scale(1.02);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 图标呼吸动画 */
@keyframes icon-breathe {
  0% {
    transform: scale(1);
    box-shadow: 0 2px 8px rgba(var(--primary-6), 0.3);
  }
  50% {
    transform: scale(1.02);
    box-shadow: 0 3px 12px rgba(var(--primary-6), 0.4);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 2px 8px rgba(var(--primary-6), 0.3);
  }
}

/* 图标思考动画 */
@keyframes icon-thinking {
  0% {
    transform: scale(1) rotate(0deg);
    filter: brightness(1);
  }
  25% {
    transform: scale(1.05) rotate(2deg);
    filter: brightness(1.1);
  }
  50% {
    transform: scale(1.1) rotate(0deg);
    filter: brightness(1.2);
  }
  75% {
    transform: scale(1.05) rotate(-2deg);
    filter: brightness(1.1);
  }
  100% {
    transform: scale(1) rotate(0deg);
    filter: brightness(1);
  }
}

/* 为图标添加呼吸动画 */
.ac-think-icon {
  animation: icon-breathe 3s ease-in-out infinite;
  
  &.ac-think-icon-animate {
    animation: icon-thinking 2s ease-in-out infinite;
  }
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .ac-think-block {
    background: var(--color-bg-2);
    border-color: var(--color-border-2);
  }
  
  .ac-think-content-inner {
    background: var(--color-bg-1);
  }
  
  /* 深色模式下的思考动画 */
  @keyframes thinking-pulse {
    0% {
      color: rgb(var(--color-text-4));
      opacity: 0.5;
    }
    50% {
      color: rgb(var(--color-text-3));
      opacity: 0.8;
    }
    100% {
      color: rgb(var(--color-text-4));
      opacity: 0.5;
    }
  }
}
</style>
