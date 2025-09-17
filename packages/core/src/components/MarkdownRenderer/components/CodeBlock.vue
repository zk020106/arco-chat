<template>
    <div class="code-block">
      <div class="code-block-header">
        <span class="code-block-lang">{{ lang || 'text' }}</span>
        <div class="code-block-actions">
          <a-button v-if="showCopy" class="code-block-copy" type="text" size="small" @click="copyCode">
            <icon-copy />
          </a-button>
          <a-button v-if="foldable" class="code-block-toggle" type="text" size="small" @click="toggleFold">
            <icon-down v-if="folded" />
            <icon-up v-else />
          </a-button>
        </div>
      </div>
      <transition name="fade">
        <pre v-show="!folded"><code v-html="highlighted"></code></pre>
      </transition>
    </div>
  </template>

  <script setup lang="ts">
  import { Message } from '@arco-design/web-vue';
  import hljs from 'highlight.js';
  import { computed, ref } from 'vue';

  const props = defineProps<{
    code: string;
    lang?: string;
    foldable?: boolean;
    showCopy?: boolean;
  }>();

  const folded = ref(false);
  const copied = ref(false);

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
    // 使用 Arco Message 组件提示
    Message.success('复制成功');
    setTimeout(() => {
      copied.value = false;
    }, 1200);
  }

  // 移除 watch 逻辑，不再根据 props.foldable 自动收起
  </script>

  <style lang="scss" scoped>
  .code-block { border-radius: 8px; border: 1px solid var(--color-border-2, #e5e6eb); margin-bottom: 16px; background: var(--color-fill-2, #f7f8fa);}
  .code-block-header { display: flex; align-items: center; justify-content: space-between; padding: 4px 12px; font-size: 13px; background: var(--color-fill-1, #f2f3f5);}
  .code-block-lang { color: var(--color-text-3, #86909c);}
  .code-block-actions { margin-left: auto; display: flex; gap: 4px; }
  .code-block-copy, .code-block-toggle { background: none; border: none; color: var(--primary-6, #165dff); cursor: pointer; margin-left: 0; padding: 0; }
  pre { margin: 0; padding: 12px; background: none; }
  pre, pre code { color: var(--color-text-1, #1d2129); }
  .fade-enter-active, .fade-leave-active { transition: opacity .2s; }
  .fade-enter-from, .fade-leave-to { opacity: 0; }
  </style>
