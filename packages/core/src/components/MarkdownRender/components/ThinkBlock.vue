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
  background: var(--color-fill-1);
  border-radius: 12px;
  border: 1px solid var(--color-border-2);
  margin: 16px 0;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.12);
  }
}

.ac-think-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  background: var(--color-fill-2);
  transition: background 0.2s;

  &:hover {
    background: var(--color-fill-3);
  }
}

.ac-think-title {
  display: flex;
  align-items: center;
  gap: 10px;

  .ac-think-icon {
    width: 28px;
    height: 28px;
    border-radius: 6px;
    background: var(--primary-6);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 16px;
    transition: all 0.3s ease;
    animation: icon-breathe 3s ease-in-out infinite;
    
    &.ac-think-icon-animate {
      animation: icon-thinking 2s ease-in-out infinite;
    }
  }

  .ac-think-label {
    font-weight: 500;
    font-size: 15px;
    color: var(--color-text-2);
  }
}

.ac-think-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: var(--color-fill-1);
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }

  .ac-toggle-icon {
    font-size: 14px;
    color: var(--primary-6);
  }
}

.ac-think-content {
  overflow: hidden;
  border-top: 1px solid var(--color-border-2);
  transition: max-height 0.4s ease, opacity 0.4s ease;

  .ac-think-content-inner {
    padding: 16px;
    font-size: 14px;
    line-height: 1.6;
    color: var(--color-text-1);
    background: var(--color-fill-1);
  }
}

/* 折叠展开动画 */
.think-expand-enter-active,
.think-expand-leave-active {
  transition: max-height 0.4s ease, opacity 0.4s ease;
}

.think-expand-enter-from,
.think-expand-leave-to {
  opacity: 0;
  max-height: 0;
}

.think-expand-enter-to,
.think-expand-leave-from {
  opacity: 1;
  max-height: 400px;
}

/* 图标动画 */
@keyframes icon-breathe {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes icon-thinking {
  0%, 100% { transform: scale(1) rotate(0deg); }
  25% { transform: scale(1.05) rotate(2deg); }
  50% { transform: scale(1.1) rotate(0deg); }
  75% { transform: scale(1.05) rotate(-2deg); }
}

/* 响应式 */
@media (max-width: 768px) {
  .ac-think-header {
    padding: 10px 14px;
  }
  .ac-think-label { font-size: 14px; }
  .ac-think-icon, .ac-think-toggle { width: 24px; height: 24px; }
  .ac-think-content-inner { padding: 12px; font-size: 13px; }
}

</style>
