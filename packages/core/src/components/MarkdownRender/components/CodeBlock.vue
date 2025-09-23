<template>
  <div class="code-block">
    <!-- 工具栏 -->
    <div class="code-toolbar">
      <a-tag size="small" color="blue" class="lang-tag">
        {{ language.toUpperCase() }}
      </a-tag>
      <div class="actions">
        <a-tooltip content="折叠/展开">
          <a-button
            size="mini"
            type="text"
            @click="toggleFold"
            class="action-btn"
          >
            <icon-down v-if="folded" />
            <icon-up v-else />
          </a-button>
        </a-tooltip>
        <a-tooltip :content="copied ? '已复制' : '复制代码'">
          <a-button
            size="mini"
            type="text"
            @click="copyCode"
            class="action-btn"
            :class="{ 'copy-success': copied }"
          >
            <icon-copy v-if="!copied" />
            <icon-check v-else />
          </a-button>
        </a-tooltip>
      </div>
    </div>

    <!-- 代码区 -->
    <div
      v-show="!folded"
      ref="codeContainer"
      class="code-container"
    >
      <pre><code :class="`language-${language}`" ref="codeEl">{{ code }}</code></pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import hljs from "highlight.js";
import "highlight.js/styles/github.css"; // 你可以换成自己喜欢的主题
import { Message } from "@arco-design/web-vue";
import { IconDown, IconUp, IconCopy, IconCheck } from "@arco-design/web-vue/es/icon";

interface Props {
  code: string;
  language?: string;
}

const props = withDefaults(defineProps<Props>(), {
  language: "javascript"
});

const codeEl = ref<HTMLElement | null>(null);
const codeContainer = ref<HTMLElement | null>(null);

const folded = ref(false);
const copied = ref(false);

const highlight = () => {
  if (codeEl.value) {
    hljs.highlightElement(codeEl.value);
  }
};

const toggleFold = () => {
  folded.value = !folded.value;
};

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(String(props.code));
    copied.value = true;
    Message.success("复制成功");
    setTimeout(() => (copied.value = false), 1500);
  } catch (err) {
    Message.error("复制失败");
  }
};

onMounted(highlight);

watch(() => props.code, highlight);
</script>

<style scoped lang="scss">
.code-block {
  margin: 16px 0;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--color-border-2);
  background: var(--color-fill-1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.25s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }
}

.code-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 12px;
  backdrop-filter: blur(8px);
  background: rgba(250, 250, 250, 0.7);
  border-bottom: 1px solid var(--color-border-2);
  font-size: 12px;

  .lang-tag {
    font-size: 11px;
    font-weight: 600;
    background: var(--color-primary-1);
    color: var(--color-primary-6);
    border-radius: 6px;
    padding: 0 6px;
  }
}

.actions {
  display: flex;
  gap: 6px;
  align-items: center;

  .action-btn {
    padding: 4px;
    min-width: 26px;
    height: 26px;
    border-radius: 6px;
    transition: all 0.2s ease;
    color: var(--color-text-2);

    &:hover {
      background: var(--color-fill-2);
      color: var(--color-text-1);
      transform: scale(1.08);
    }

    &:active {
      transform: scale(0.92);
    }

    &.copy-success {
      color: var(--color-success-6);
      background: var(--color-success-1);
      animation: flash 0.4s ease;
    }
  }
}

@keyframes flash {
  from {
    box-shadow: 0 0 0px rgba(0, 255, 120, 0.6);
  }
  to {
    box-shadow: 0 0 10px rgba(0, 255, 120, 0);
  }
}

.code-container {
  padding: 14px 16px;
  background: var(--color-fill-1);

  pre {
    margin: 0;
    font-family: "JetBrains Mono", "Fira Code", monospace;
    font-size: 13px;
    line-height: 1.65;
    color: var(--color-text-1);
    overflow-x: auto;
    white-space: pre-wrap; /* 启用自动换行 */
    word-wrap: break-word; /* 长单词换行 */
    word-break: break-all; /* 强制换行 */

    /* 确保代码块滚动条样式不被全局样式覆盖 */
    &::-webkit-scrollbar {
      height: 6px !important;
      width: 6px !important;
    }

    &::-webkit-scrollbar-track {
      background: var(--color-fill-2) !important;
      border-radius: 3px !important;
    }

    &::-webkit-scrollbar-thumb {
      background: var(--color-border-2) !important;
      border-radius: 3px !important;
      transition: background-color 0.2s ease !important;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: var(--color-border-3) !important;
    }
  }
}

/* 火狐浏览器滚动条样式 - 代码块保持滚动条 */
@supports (scrollbar-color: auto) {
  .code-container pre {
    scrollbar-color: var(--color-border-2) var(--color-fill-2) !important;
    scrollbar-width: thin !important;
  }
}

/* Dark 模式 */
@media (prefers-color-scheme: dark) {
  .code-toolbar {
    background: rgba(30, 30, 30, 0.6);
    border-bottom-color: var(--color-border-3);

    .lang-tag {
      background: var(--color-primary-2);
      color: var(--color-primary-5);
    }
  }

  .code-container {
    background: var(--color-fill-2);
    
    pre {
      &::-webkit-scrollbar-thumb {
        background: var(--color-border-3) !important;
      }
      
      &::-webkit-scrollbar-thumb:hover {
        background: var(--color-border-4) !important;
      }
    }
  }
}

/* 火狐浏览器深色模式 */
@supports (scrollbar-color: auto) {
  @media (prefers-color-scheme: dark) {
    .code-container pre {
      scrollbar-color: var(--color-border-3) var(--color-fill-2) !important;
    }
  }
}

/* 响应式设计 - 移动端优化 */
@media (max-width: 768px) {
  .code-block {
    margin: 12px 0;
    border-radius: 8px;
  }
  
  .code-toolbar {
    padding: 4px 8px;
    font-size: 11px;
    
    .lang-tag {
      font-size: 10px;
      padding: 0 4px;
    }
    
    .actions .action-btn {
      min-width: 24px;
      height: 24px;
      padding: 2px;
    }
  }
  
  .code-container {
    padding: 10px 12px;
    
    pre {
      font-size: 12px;
      line-height: 1.5;
      
      /* 移动端优先使用换行，减少滚动 */
      white-space: pre-wrap;
      word-wrap: break-word;
      word-break: break-all;
      overflow-x: auto;
    }
  }
}

@media (max-width: 480px) {
  .code-block {
    margin: 8px 0;
    border-radius: 6px;
  }
  
  .code-toolbar {
    padding: 3px 6px;
    font-size: 10px;
    
    .actions {
      gap: 4px;
    }
  }
  
  .code-container {
    padding: 8px 10px;
    
    pre {
      font-size: 11px;
      line-height: 1.4;
    }
  }
}

</style>
