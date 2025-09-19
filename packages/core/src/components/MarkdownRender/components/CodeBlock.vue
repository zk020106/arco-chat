<template>
  <div 
    class="code-block"
    :class="{ 'code-block-visible': isVisible }"
  >
    <div class="code-block-header">
      <div class="code-block-lang">
        <span class="lang-label">{{ lang || 'text' }}</span>
      </div>
      <div class="code-block-actions">
        <a-button 
          v-if="showCopy" 
          class="code-block-copy" 
          type="text" 
          size="small" 
          @click="copyCode"
          :class="{ 'copy-success': copied }"
        >
          <icon-copy v-if="!copied" />
          <icon-check v-else />
        </a-button>
        <a-button v-if="foldable" class="code-block-toggle" type="text" size="small" @click="toggleFold">
          <icon-down v-if="folded" />
          <icon-up v-else />
        </a-button>
      </div>
    </div>
    <transition 
      name="code-expand"
      @enter="onEnter"
      @leave="onLeave"
    >
      <div v-show="!folded" class="code-block-content">
        <pre><code v-html="highlighted"></code></pre>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { Message } from '@arco-design/web-vue';
import { IconCopy, IconDown, IconUp, IconCheck } from '@arco-design/web-vue/es/icon';
import hljs from 'highlight.js';

const props = withDefaults(defineProps<{
  code: string;
  lang?: string;
  foldable?: boolean;
  showCopy?: boolean;
}>(), {
  lang: '',
  foldable: true,
  showCopy: true,
});

const folded = ref(false);
const copied = ref(false);
const isVisible = ref(false);

const highlighted = computed(() => {
  if (props.lang && hljs.getLanguage(props.lang)) {
    return hljs.highlight(props.code, { language: props.lang }).value;
  }
  return hljs.highlightAuto(props.code).value;
});

function toggleFold() {
  folded.value = !folded.value;
}

function copyCode() {
  navigator.clipboard.writeText(props.code);
  copied.value = true;
  Message.success('复制成功');
  setTimeout(() => {
    copied.value = false;
  }, 1200);
}

// 组件进入动画
onMounted(() => {
  setTimeout(() => {
    isVisible.value = true
  }, 150)
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
.code-block {
  background: var(--color-bg-2);
  border: 1px solid var(--color-border-2);
  border-radius: 12px;
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
  
  &.code-block-visible {
    opacity: 1;
    transform: translateY(0) scale(1);
    animation: codeBlockAppear 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--primary-6);
    border-radius: 12px 12px 0 0;
  }
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 
      0 6px 25px rgba(0, 0, 0, 0.12),
      0 2px 6px rgba(0, 0, 0, 0.16);
  }
}

.code-block-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--color-fill-1);
  border-bottom: 1px solid var(--color-border-1);
  position: relative;
}

.code-block-lang {
  display: flex;
  align-items: center;
  gap: 8px;
}

.lang-label {
  font-size: 13px;
  font-weight: 500;
  color: rgb(var(--color-text-3));
  background: var(--color-fill-2);
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid var(--color-border-2);
  letter-spacing: 0.3px;
  text-transform: uppercase;
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
}

.code-block-actions {
  display: flex;
  gap: 4px;
  align-items: center;
}

.code-block-copy,
.code-block-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: var(--color-fill-1);
  color: var(--primary-6);
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  position: relative;
  overflow: hidden;
  
  &:hover {
    background: var(--color-fill-2);
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  &.copy-success {
    background: var(--color-success-1);
    color: var(--color-success-6);
    animation: copySuccess 0.6s ease-out;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }
  
  &:hover::before {
    left: 100%;
  }
}

.code-block-content {
  overflow: hidden;
  background: var(--color-bg-1);
}

pre {
  margin: 0;
  padding: 16px;
  background: none;
  overflow-x: auto;
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
  font-size: 13px;
  line-height: 1.5;
  
  /* 自定义滚动条 */
  &::-webkit-scrollbar {
    height: 6px;
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

pre,
pre code {
  color: rgb(var(--color-text-1));
  background: none;
}

/* 展开/收起动画 */
.code-expand-enter-active,
.code-expand-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: top;
}

.code-expand-enter-from,
.code-expand-leave-to {
  opacity: 0;
  transform: scaleY(0);
  max-height: 0;
}

.code-expand-enter-to,
.code-expand-leave-from {
  opacity: 1;
  transform: scaleY(1);
  max-height: 500px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .code-block {
    margin: 12px 0;
    border-radius: 10px;
  }
  
  .code-block-header {
    padding: 10px 12px;
  }
  
  .lang-label {
    font-size: 12px;
    padding: 3px 6px;
  }
  
  pre {
    padding: 12px;
    font-size: 12px;
  }
  
  .code-block-copy,
  .code-block-toggle {
    width: 24px;
    height: 24px;
    font-size: 12px;
  }
}

/* 组件出现动画 */
@keyframes codeBlockAppear {
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

/* 复制成功动画 */
@keyframes copySuccess {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

/* 语言标签动画 */
@keyframes langLabelPulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.1);
  }
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 0 4px rgba(0, 0, 0, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
  }
}

.lang-label {
  animation: langLabelPulse 2s infinite;
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .code-block {
    background: var(--color-bg-2);
    border-color: var(--color-border-2);
  }
  
  .code-block-content {
    background: var(--color-bg-1);
  }
  
  .lang-label {
    background: var(--color-fill-2);
    border-color: var(--color-border-2);
  }
}
</style>
