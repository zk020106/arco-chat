<template>
  <div class="ac-markdown-renderer">
    <template v-for="block in renderedBlocks" :key="block.key">
      <Suspense v-if="block.type === 'mermaid'">
        <template #default>
          <component :is="block.vnode" />
        </template>
        <template #fallback>
          <div class="mermaid-suspense-fallback">
            <div class="loading-spinner"></div>
            <div class="loading-text">正在渲染 Mermaid 图表...</div>
          </div>
        </template>
      </Suspense>
      <component v-else :is="block.vnode" />
    </template>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  watch,
  nextTick,
  h,
  VNode,
  getCurrentInstance,
} from "vue";
import MarkdownIt from "markdown-it";
import DOMPurify from "dompurify";
import CodeBlock from "./components/CodeBlock.vue";
import ThinkBlock from "./components/ThinkBlock.vue";
import MermaidBlock from "./components/MermaidBlock.vue";
import "katex/dist/katex.min.css";
import {
  pluginManager,
  processMermaidDiagrams,
  defaultPluginOptions,
} from "./plugins";
import type {
  MarkdownRenderProps,
  TypingOptions,
  SlotInterceptorProps,
} from "./markdown-render-types";

const rawProps = defineProps<MarkdownRenderProps>();

// Handle defaults manually to avoid type issues
const props = computed(() => ({
  safeMode: rawProps.safeMode ?? false,
  typing: rawProps.typing ?? false,
  enableThink: rawProps.enableThink ?? true,
  enableMermaid: rawProps.enableMermaid ?? true,
  enableLatex: rawProps.enableLatex ?? true,
  enableEmoji: rawProps.enableEmoji ?? true,
  mdOptions: rawProps.mdOptions ?? {},
  mdPlugins: rawProps.mdPlugins ?? [],
  pluginConfig: rawProps.pluginConfig ?? defaultPluginOptions,
  supportedTags: rawProps.supportedTags ?? [],
  customBlockTags: rawProps.customBlockTags ?? [],
  customTags: rawProps.customTags ?? {},
  sanitizeOptions: rawProps.sanitizeOptions ?? {
    ADD_TAGS: ["code-block", "think-block"],
    ADD_ATTR: ["code", "lang", "foldable", "showCopy", "class", "style"],
    ALLOW_DATA_ATTR: true,
    USE_PROFILES: { html: true },
  },
  content: rawProps.content,
  typingOptions: rawProps.typingOptions,
  thinkOptions: rawProps.thinkOptions,
}));

const md = ref<MarkdownIt>();
let typingTimer: ReturnType<typeof setTimeout> | null = null;
const renderedBlocks = ref<{ key: string; vnode: VNode; type: string }[]>([]);

function sanitizeHtml(html: string) {
  const opts = { ...props.value.sanitizeOptions };
  return DOMPurify.sanitize(html, opts);
}

function createMarkdownIt() {
  const options = {
    html: true,
    highlight(str: string, lang: string) {
      const encoded = encodeURIComponent(str);
      return `<code-block code="${encoded}" lang="${lang || ""}" foldable showCopy></code-block>`;
    },
    ...props.value.mdOptions,
  };
  const instance = new MarkdownIt(options);

  // 应用插件
  const enabledPlugins: string[] = [];
  if (props.value.enableMermaid) enabledPlugins.push("mermaid");
  if (props.value.enableLatex) enabledPlugins.push("latex");
  if (props.value.enableEmoji) enabledPlugins.push("emoji");
  pluginManager.applyPlugins(instance, enabledPlugins);

  const mdPlugins = props.value.mdPlugins;
  if (Array.isArray(mdPlugins)) {
    for (const item of mdPlugins as any[]) {
      if (item.plugin) instance.use(item.plugin, item.opts || {});
    }
  }
  return instance;
}

function parseContentWithThink(content: string) {
  return content
    .replace(/<think>/g, `<think-block>`)
    .replace(/<\/think>/g, `</think-block>`)
    .replace(/<agent>/g, `<agent-block>`)
    .replace(/<\/agent>/g, `</agent-block>`)
    .replace(/<task>/g, `<task-block>`)
    .replace(/<\/task>/g, `</task-block>`);
}

// 拆分 Markdown 为块
const splitMarkdownBlocks = (src: string) => {
  const blocks: Array<{
    type: string;
    value: string;
    inner?: string;
    tagName?: string;
  }> = [];

  // 使用一个通用的正则表达式来匹配所有自定义块
  // 匹配 <tag>...</tag> 格式的块，包括代码块和 mermaid 标签
  const allBlocksRegex =
    /(```[\s\S]*?```|<(\w+)-block>[\s\S]*?<\/\2-block>|<mermaid>[\s\S]*?<\/mermaid>)/g;

  const matches: {
    type: string;
    value: string;
    index: number;
    inner?: string;
    tagName?: string;
  }[] = [];
  let match: RegExpExecArray | null;

  match = allBlocksRegex.exec(src);
  while (match) {
    const fullMatch = match[0];
    const tagMatch = match[2]; // 捕获的标签名

    let type: string;
    let inner: string;
    let tagName: string;

    if (fullMatch.startsWith("```")) {
      // 代码块
      type = "code";
      tagName = "code-block";
      inner = fullMatch.replace(/^```[a-zA-Z]*\n?/, "").replace(/```$/, "");
    } else if (fullMatch.startsWith("<mermaid>")) {
      // Mermaid 标签
      type = "mermaid";
      tagName = "mermaid-block";
      inner = fullMatch.replace(/^<mermaid>/, "").replace(/<\/mermaid>$/, "");
    } else {
      // 自定义块
      type = tagMatch || "unknown";
      tagName = type;
      inner = fullMatch
        .replace(new RegExp(`^<${type}-block>`), "")
        .replace(new RegExp(`<\\/${type}-block>$`), "");
    }

    matches.push({
      type,
      value: fullMatch,
      index: match.index,
      inner,
      tagName,
    });

    match = allBlocksRegex.exec(src);
  }

  matches.sort((a, b) => a.index - b.index);

  let lastIndex = 0;
  for (const m of matches) {
    if (m.index > lastIndex) {
      blocks.push({ type: "text", value: src.slice(lastIndex, m.index) });
    }
    blocks.push({
      type: m.type,
      value: m.value,
      inner: m.inner,
      tagName: m.tagName,
    });
    lastIndex = m.index + m.value.length;
  }
  if (lastIndex < src.length)
    blocks.push({ type: "text", value: src.slice(lastIndex) });

  return blocks;
};

// 将块转为 VNode
function createVNodeForBlock(block: {
  type: string;
  value: string;
  inner?: string;
  tagName?: string;
}) {
  switch (block.type) {
    case "code":
      const language = block.value.match(/^```(\w*)/)?.[1] || "";
      // 如果是 mermaid 代码块，使用 MermaidBlock 组件
      if (language === "mermaid") {
        return h(MermaidBlock, {
          code: block.inner || "",
          theme: "default",
          showCodeToggle: true,
          showZoom: true,
          showExport: true,
          showFullscreen: true,
        });
      }
      // 其他代码块使用 CodeBlock 组件
      return h(CodeBlock, {
        code: decodeURIComponent(block.inner || ""),
        language: language,
        foldable: true,
        showCopy: true,
      });
    case "mermaid":
      // Mermaid 图表块
      return h(MermaidBlock, {
        code: block.inner || "",
        theme: "default",
        showCodeToggle: true,
        showZoom: true,
        showExport: true,
        showFullscreen: true,
      });
    case "think":
      return h(ThinkBlock, null, {
        default: () => h("div", { innerHTML: block.inner || "" }),
      });
    case "agent":
    case "task":
      // 使用动态组件渲染自定义块
      const tagName = block.tagName || block.type;
      return h(tagName, null, {
        default: () => h("div", { innerHTML: block.inner || "" }),
      });
    case "text":
      // 使用 markdown-it 渲染文本块
      const html = md.value?.render(block.value) || block.value;
      return h("div", {
        innerHTML: props.value.safeMode ? sanitizeHtml(html) : html,
      });
    default:
      // 处理其他自定义块类型
      if (block.tagName) {
        return h(block.tagName, null, {
          default: () => h("div", { innerHTML: block.inner || "" }),
        });
      }
      return h("div", block.value);
  }
}

// 打字机效果
function startTypingEffect(step: number | [number, number] = 2, interval = 50) {
  const src = props.value.enableThink
    ? parseContentWithThink(props.value.content || "")
    : props.value.content || "";
  const blocks = splitMarkdownBlocks(src);

  // 初始化所有块为空白状态
  renderedBlocks.value = blocks.map((block, i) => ({
    key: `block-${i}`,
    vnode: h("div", ""),
    type: block.type,
  }));

  // 对所有块做流式显示
  let blockIndex = 0;
  let charIndex = 0;

  function next() {
    if (blockIndex >= blocks.length) return;

    const block = blocks[blockIndex];
    const stepSize = Array.isArray(step)
      ? Math.floor(Math.random() * (step[1] - step[0] + 1)) + step[0]
      : step;

    charIndex += stepSize;
    const partialContent = block.value.slice(0, charIndex);

    if (block.type === "text") {
      // 文本块：渲染部分markdown内容
      const html = md.value?.render(partialContent) || partialContent;
      renderedBlocks.value[blockIndex].vnode = h("div", {
        innerHTML: props.value.safeMode ? sanitizeHtml(html) : html,
      });
    } else if (block.type === "code") {
      // 代码块：显示部分代码内容
      const language = block.value.match(/^```(\w*)/)?.[1] || "";
      const codeContent = partialContent
        .replace(/^```[a-zA-Z]*\n?/, "")
        .replace(/```$/, "");

      // 如果是 mermaid 代码块，使用 MermaidBlock 组件
      if (language === "mermaid") {
        renderedBlocks.value[blockIndex].vnode = h(MermaidBlock, {
          code: codeContent,
          theme: "default",
          showCodeToggle: true,
          showZoom: true,
          showExport: true,
          showFullscreen: true,
        });
      } else {
        // 其他代码块使用 CodeBlock 组件
        renderedBlocks.value[blockIndex].vnode = h(CodeBlock, {
          code: codeContent,
          language: language,
          foldable: true,
          showCopy: true,
        });
      }
    } else if (block.type === "mermaid") {
      // Mermaid 图表块：逐步显示内容
      const mermaidContent = partialContent
        .replace(/^<mermaid>/, "")
        .replace(/<\/mermaid>$/, "");

      // 始终使用 MermaidBlock 组件，让它处理逐步加载
      renderedBlocks.value[blockIndex].vnode = h(MermaidBlock, {
        code: mermaidContent || "graph TD\n    A[正在加载...] --> B[请稍候]",
        theme: "default",
        showCodeToggle: true,
        showZoom: true,
        showExport: true,
        showFullscreen: true,
      });
    } else if (block.type === "think") {
      // 思考块：显示部分内容
      const thinkContent = partialContent
        .replace(/^<think-block>/, "")
        .replace(/<\/think-block>$/, "");
      renderedBlocks.value[blockIndex].vnode = h(ThinkBlock, null, {
        default: () => h("div", { innerHTML: thinkContent }),
      });
    } else if (block.type === "agent" || block.type === "task") {
      // agent/task块：显示部分内容
      const tagName = block.tagName || block.type;
      const content = partialContent
        .replace(new RegExp(`^<${block.type}>`), "")
        .replace(new RegExp(`<\\/${block.type}>$`), "");
      renderedBlocks.value[blockIndex].vnode = h(tagName, null, {
        default: () => h("div", { innerHTML: content }),
      });
    } else {
      // 其他自定义块：显示部分内容
      const tagName = block.tagName || block.type;
      const content = partialContent
        .replace(new RegExp(`^<${block.type}>`), "")
        .replace(new RegExp(`<\\/${block.type}>$`), "");
      renderedBlocks.value[blockIndex].vnode = h(tagName, null, {
        default: () => h("div", { innerHTML: content }),
      });
    }

    if (charIndex >= block.value.length) {
      blockIndex++;
      charIndex = 0;
    }
    typingTimer = setTimeout(next, interval);
  }

  next();
}

// 初始化
md.value = createMarkdownIt();

watch(
  () => [props.value.content, props.value.typing],
  ([content, typing]) => {
    if (!md.value) return;
    if (typing) startTypingEffect();
    else {
      const src = props.value.enableThink
        ? parseContentWithThink(String(content || ""))
        : String(content || "");
      const blocks = splitMarkdownBlocks(src);
      renderedBlocks.value = blocks.map((block, i) => ({
        key: `block-${i}`,
        vnode: createVNodeForBlock(block),
        type: block.type,
      }));
      nextTick(() => {
        if (props.value.enableMermaid) {
          processMermaidDiagrams(
            document.querySelector(".ac-markdown-renderer")!
          ).catch(console.error);
        }
      });
    }
  },
  { immediate: true }
);
</script>

<style scoped lang="scss">
@use "./markdown-render.scss" as *;
.ac-markdown-renderer {
  .ac-markdown-content {
    width: 100%;
  }
}

.mermaid-suspense-fallback {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 40px 20px;
  margin: 16px 0;
  border: 1px solid var(--color-border-2);
  border-radius: 8px;
  background: var(--color-fill-2);
  min-height: 120px;

  .loading-spinner {
    width: 32px;
    height: 32px;
    border: 3px solid var(--color-border-2);
    border-top: 3px solid var(--color-primary-6);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .loading-text {
    font-size: 14px;
    font-weight: 500;
    color: var(--color-text-2);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
