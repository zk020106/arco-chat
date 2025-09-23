<template>
  <div class="code-block">
    <!-- 工具栏 -->
    <div class="code-toolbar">
      <div class="lang-tag">
        {{ language.toUpperCase() }}
      </div>
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
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid var(--color-border-2);
  background: transparent;
  font-family: Monaco, Consolas, "Courier New", monospace;

  &:hover {
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }
}

.code-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 8px;
  background: var(--color-fill-3);
  border-bottom: 1px solid var(--color-border-2);
  font-size: 12px;

  .lang-tag {
    font-size: 12px;
    font-weight: 500;
    color: var(--color-text-2);
    padding: 0 4px;
  }
}

.actions {
  display: flex;
  gap: 4px;
  align-items: center;

  .action-btn {
    padding: 2px;
    min-width: 24px;
    height: 24px;
    border-radius: 2px;
    transition: all 0.2s ease;
    color: var(--color-text-2);

    &:hover {
      background: var(--color-fill-4);
      color: var(--color-text-1);
    }

    &.copy-success {
      color: var(--color-success-6);
    }
  }
}

.code-container {
  padding: 12px;
  background: var(--color-fill-1);

  pre {
    margin: 0;
    font-family: Monaco, Consolas, "Courier New", monospace;
    font-size: 13px;
    line-height: 1.5;
    color: var(--color-text-1);
    overflow-x: auto;
    white-space: pre;
    word-wrap: normal;

    &::-webkit-scrollbar {
      height: 6px;
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: var(--color-fill-2);
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb {
      background: var(--color-border-2);
      border-radius: 3px;
      transition: background-color 0.2s ease;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: var(--color-border-3);
    }
  }
}

/* Dark 模式 */
@media (prefers-color-scheme: dark) {
  .code-toolbar {
    background: var(--color-fill-3);
    border-bottom-color: var(--color-border-3);

    .lang-tag {
      color: var(--color-text-2);
    }
  }

  .code-container {
    background: var(--color-fill-2);
    
    pre {
      &::-webkit-scrollbar-thumb {
        background: var(--color-border-3);
      }
      
      &::-webkit-scrollbar-thumb:hover {
        background: var(--color-border-4);
      }
    }
  }
}

/* 火狐浏览器深色模式 */
@supports (scrollbar-color: auto) {
  @media (prefers-color-scheme: dark) {
    .code-container pre {
      scrollbar-color: var(--color-border-3) var(--color-fill-2);
    }
  }
}

/* 响应式设计 - 移动端优化 */
@media (max-width: 768px) {
  .code-block {
    margin: 12px 0;
    border-radius: 4px;
  }
  
  .code-toolbar {
    padding: 3px 6px;
    font-size: 11px;
    
    .lang-tag {
      font-size: 11px;
      padding: 0 3px;
    }
    
    .actions .action-btn {
      min-width: 22px;
      height: 22px;
      padding: 1px;
    }
  }
  
  .code-container {
    padding: 10px;
    
    pre {
      font-size: 12px;
      line-height: 1.4;
    }
  }
}

@media (max-width: 480px) {
  .code-block {
    margin: 8px 0;
    border-radius: 4px;
  }
  
  .code-toolbar {
    padding: 2px 4px;
    font-size: 10px;
    
    .actions {
      gap: 2px;
    }
  }
  
  .code-container {
    padding: 8px;
    
    pre {
      font-size: 11px;
      line-height: 1.3;
    }
  }
}
</style>
