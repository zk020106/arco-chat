<template>
    <div class="ac-markdown-renderer">
      <div class="ac-markdown-content" ref="contentEl" v-html="props.typing ? typingContent : renderedMarkdown" v-custom-blocks></div>
    </div>
  </template>

  <script setup lang="ts">
  import DOMPurify from 'dompurify';
  import MarkdownIt from 'markdown-it';
  import {
    computed,
    defineEmits,
    defineProps,
    getCurrentInstance,
    h,
    nextTick,
    onBeforeUnmount,
    onMounted,
    ref,
    render,
    useSlots,
    watch,
  } from 'vue';
  import CodeBlock from './components/CodeBlock.vue';
  import ThinkBlock from './components/ThinkBlock.vue';
  import type {
    MarkdownRendererProps,
    MarkdownRendererSlots,
    SlotInterceptorProps,
    TypingOptions,
  } from './markdown-renderer-types';
  import 'highlight.js/styles/github.css';

  const props = withDefaults(defineProps<MarkdownRendererProps>(), {
    safeMode: false,
    typing: false,
    enableThink: true,
    customRenderers: () => ({}),
    customTags: () => ({}),
    supportedTags: () => [], // 默认为空数组，会追加到默认标签后面
    customBlockTags: () => [], // 默认为空数组，会追加到默认标签后面
    sanitizeOptions: () => ({
      ADD_TAGS: ['code-block', 'think-block'],
      ADD_ATTR: ['code', 'lang', 'foldable', 'showCopy', 'class', 'style'],
      ALLOW_DATA_ATTR: true,
      USE_PROFILES: { html: true },
    }),
  });
  function sanitizeHtml(html: string) {
    // 外部传入优先，未传则使用组件内默认
    const defaultOpts = {
      ADD_TAGS: ['code-block', 'think-block'],
      ADD_ATTR: ['code', 'lang', 'foldable', 'showCopy', 'class', 'style'],
      ALLOW_DATA_ATTR: true,
      USE_PROFILES: { html: true },
    };
    const opts = { ...defaultOpts, ...props.sanitizeOptions };
    return DOMPurify.sanitize(html, opts);
  }

  /**
   * MarkdownCard 组件支持的事件
   * @event after-mdt-init - markdown-it 初始化后
   * @event typingStart - 打字机动效开始
   * @event typing - 打字机动效中
   * @event typingEnd - 打字机动效结束
   */
  const emit = defineEmits<{
    (e: 'after-mdt-init', md: unknown): void;
    (e: 'typing-start'): void;
    (e: 'typing'): void;
    (e: 'typing-end'): void;
  }>();

  const md = ref();
  const typingContent = ref('');
  const slots = useSlots();
  let typingTimer: ReturnType<typeof setTimeout> | null = null;
  const isTyping = ref(false);
  const contentEl = ref<HTMLElement | null>(null);

  /**
   * 是否安全模式预览 html
   * safeMode: true 时，使用 DOMPurify 过滤 html
   * safeMode: false 时，直接渲染原始 html
   */
  // biome-ignore lint/correctness/noUnusedVariables: 在模板中使用
  const renderedMarkdown = computed(() => {
    let content = props.content || '';
    if (props.enableThink) {
      content = parseContentWithThink(content);
    }
    if (!md.value) return content;
    let html = md.value.render(content);
    if (props.safeMode) {
      html = sanitizeHtml(html);
    }
    return html;
  });

  // 移除动态编译 vnode 相关逻辑，直接通过自定义指令挂载子组件

  function normalizeByCustomTags(html: string) {
    const aliases = props.customTags || {};
    // 将自定义标签名归一化到标准标签名
    for (const [from, to] of Object.entries(aliases)) {
      const open = new RegExp(`<${from}>`, 'g');
      const close = new RegExp(`</${from}>`, 'g');
      html = html.replace(open, `<${to}>`).replace(close, `</${to}>`);
    }
    return html;
  }

  function parseContentWithThink(content: string) {
    // 支持 <think> 简写；新增 <agent> 与 <task>
    const normalized = content
      .replace(/<think>/g, `<think-block>`)
      .replace(/<\/think>/g, `</think-block>`)
      .replace(/<agent>/g, `<agent-block>`)
      .replace(/<\/agent>/g, `</agent-block>`)
      .replace(/<task>/g, `<task-block>`)
      .replace(/<\/task>/g, `</task-block>`);
    return normalizeByCustomTags(normalized);
  }

  function createMarkdownIt() {
    const options = {
      html: true,
      highlight(str: string, lang: string) {
        // 返回自定义标签，code内容用encodeURIComponent防止特殊字符冲突
        const encoded = encodeURIComponent(str);
        return `<code-block code="${encoded}" lang="${lang || ''}" foldable showCopy></code-block>`;
      },
      ...props.mdOptions,
    };
    const instance = new MarkdownIt(options);
    // 应用插件
    if (Array.isArray(props.mdPlugins)) {
      for (const pluginObj of props.mdPlugins) {
        if (pluginObj?.plugin) {
          instance.use(pluginObj.plugin, pluginObj.opts || {});
        }
      }
    }
    return instance;
  }

  const splitMarkdownBlocks = (src: string) => {
    const blocks: Array<{ type: 'text' | 'code' | 'think'; value: string; inner?: string }> = [];
    const rest = src;
    const codeBlockRE = /```[\s\S]*?```/g;
    const thinkBlockRE = /<think-block>[\s\S]*?<\/think-block>/g;
    let matchArr: Array<{ type: 'code' | 'think'; value: string; index: number; inner?: string }> =
      [];
    let match: RegExpExecArray | null = codeBlockRE.exec(rest);
    while (match !== null) {
      matchArr.push({
        type: 'code',
        value: match[0],
        index: match.index,
        inner: match[0].replace(/^```[a-zA-Z]*\n?/, '').replace(/```$/, ''),
      });
      match = codeBlockRE.exec(rest);
    }
    match = thinkBlockRE.exec(rest);
    while (match !== null) {
      matchArr.push({
        type: 'think',
        value: match[0],
        index: match.index,
        inner: match[0].replace(/^<think-block>/, '').replace(/<\/think-block>$/, ''),
      });
      match = thinkBlockRE.exec(rest);
    }
    matchArr = matchArr.sort((a, b) => a.index - b.index);
    let lastIndex = 0;
    for (const m of matchArr) {
      if (m.index > lastIndex) {
        blocks.push({ type: 'text', value: rest.slice(lastIndex, m.index) });
      }
      blocks.push({ type: m.type, value: m.value, inner: m.inner });
      lastIndex = m.index + m.value.length;
    }
    if (lastIndex < rest.length) {
      blocks.push({ type: 'text', value: rest.slice(lastIndex) });
    }
    return blocks;
  };

  function startTypingEffect(step: number | [number, number] = 2, interval = 50, _style = 'normal') {
    clearTyping();
    typingContent.value = '';
    isTyping.value = true;
    emit('typing-start');
    const _i = 0;
    const src = props.content || '';
    const processedSrc = props.enableThink ? parseContentWithThink(src) : src;
    const blocks = splitMarkdownBlocks(processedSrc);
    let blockIndex = 0;
    let charIndex = 0;
    let current = '';
    function nextStep() {
      if (blockIndex >= blocks.length) {
        const finalHtml = md.value.render(processedSrc);
        typingContent.value = props.safeMode ? sanitizeHtml(finalHtml) : finalHtml;
        isTyping.value = false;
        emit('typing-end');
        nextTick(() => {
          if (contentEl.value) {
            processCustomBlocks(contentEl.value);
          }
        });
        return;
      }
      const block = blocks[blockIndex];
      if (block.type === 'text') {
        const stepSize = Array.isArray(step)
          ? Math.floor(Math.random() * (step[1] - step[0] + 1)) + step[0]
          : step;
        charIndex += stepSize;
        current =
          blocks
            .slice(0, blockIndex)
            .map((b) => b.value)
            .join('') + block.value.slice(0, charIndex);
        if (charIndex >= block.value.length) {
          blockIndex++;
          charIndex = 0;
        }
      } else if (block.type === 'code') {
        const codeMatch = block.value.match(/^(```[a-zA-Z]*\n?)([\s\S]*)(```)/);
        if (codeMatch) {
          const prefix = codeMatch[1];
          const inner = codeMatch[2];
          const suffix = codeMatch[3];
          charIndex++;
          const partial = prefix + inner.slice(0, charIndex) + suffix;
          current =
            blocks
              .slice(0, blockIndex)
              .map((b) => b.value)
              .join('') + partial;
          if (charIndex >= inner.length) {
            blockIndex++;
            charIndex = 0;
          }
        } else {
          current = blocks
            .slice(0, blockIndex + 1)
            .map((b) => b.value)
            .join('');
          blockIndex++;
          charIndex = 0;
        }
      } else if (block.type === 'think') {
        const thinkMatch = block.value.match(/^(<think-block>)([\s\S]*)(<\/think-block>)$/);
        if (thinkMatch) {
          const prefix = thinkMatch[1];
          const inner = thinkMatch[2];
          const suffix = thinkMatch[3];
          charIndex++;
          const partial = prefix + inner.slice(0, charIndex) + suffix;
          current =
            blocks
              .slice(0, blockIndex)
              .map((b) => b.value)
              .join('') + partial;
          if (charIndex >= inner.length) {
            blockIndex++;
            charIndex = 0;
          }
        } else {
          current = blocks
            .slice(0, blockIndex + 1)
            .map((b) => b.value)
            .join('');
          blockIndex++;
          charIndex = 0;
        }
      }
      const stepHtml = md.value.render(current);
      typingContent.value = props.safeMode ? sanitizeHtml(stepHtml) : stepHtml;
      emit('typing');
      // 在打字过程中也尝试挂载自定义块，保证 code-block/think-block 等可见即生效
      nextTick(() => {
        if (contentEl.value) {
          processCustomBlocks(contentEl.value);
        }
      });
      typingTimer = setTimeout(nextStep, interval);
    }
    nextStep();
  }

  function clearTyping() {
    if (typingTimer) {
      clearTimeout(typingTimer);
      typingTimer = null;
    }
    isTyping.value = false;
  }

  watch(
    () => [props.content, props.typing, props.typingOptions],
    ([content, typing, typingOptions]) => {
      clearTyping();
      if (typing) {
        const step = (typingOptions as TypingOptions)?.step ?? 8;
        const interval = (typingOptions as TypingOptions)?.interval ?? 50;
        nextTick(() => startTypingEffect(step, interval));
      } else if (md.value) {
        const html = md.value.render(content || '');
        typingContent.value = props.safeMode ? sanitizeHtml(html) : html;
      }
    },
    { immediate: true, deep: true }
  );

  onMounted(() => {
    md.value = createMarkdownIt();
    emit('after-mdt-init', md.value);
  });

  onBeforeUnmount(() => {
    clearTyping();
  });

  // 当 mdOptions 或 mdPlugins 变化时，重建 markdown-it 实例并重渲染
  watch(
    () => [props.mdOptions, props.mdPlugins],
    () => {
      md.value = createMarkdownIt();
      const html = md.value.render(props.content || ('' as string));
      typingContent.value = props.safeMode ? sanitizeHtml(html) : html;
      if (!props.typing) {
        nextTick(() => {
          if (contentEl.value) {
            processCustomBlocks(contentEl.value);
          }
        });
      }
    },
    { deep: true }
  );

  // 处理自定义标签的函数
  function processCustomBlocks(el: HTMLElement) {
    // 统一的插槽拦截处理函数
    const processSlotInterception = (tagName: string, nodes: NodeListOf<Element>) => {
      for (const node of nodes) {
        if ((node as HTMLElement).dataset.rendered === 'true') return;

        const slotHandler = slots[tagName as keyof MarkdownRendererSlots];
        const container = document.createElement('div');
        let vnode: unknown;

        // 如果有插槽处理器，使用插槽（用户自定义渲染）
        if (slotHandler) {
          const slotProps: SlotInterceptorProps = {
            html: node.outerHTML,
            key: `${tagName}-${Math.random()}`,
            ...Object.fromEntries(Array.from(node.attributes).map((attr) => [attr.name, attr.value])),
          };

          // 特殊处理某些标签的属性
          if (tagName === 'code-block') {
            slotProps.code = decodeURIComponent(node.getAttribute('code') || '');
            slotProps.lang = node.getAttribute('lang') || '';
            slotProps.foldable = node.hasAttribute('foldable');
            slotProps.showCopy = node.hasAttribute('showCopy');
          }

          vnode = h('div', null, slotHandler(slotProps));
        } else {
          // 使用默认组件，如果没有默认组件就保持原样（正常 markdown 渲染）
          vnode = getDefaultComponent(tagName, node);
        }

        if (vnode) {
          vnode.appContext = (getCurrentInstance() as { appContext?: unknown })?.appContext;
          render(vnode, container);
          node.replaceWith(container.firstElementChild as HTMLElement);
        }
        // 如果没有 vnode，就保持原样，让 markdown 正常渲染
      }
    };

    // 获取默认组件的函数
    const getDefaultComponent = (tagName: string, node: Element) => {
      switch (tagName) {
        case 'code-block': {
          const code = decodeURIComponent(node.getAttribute('code') || '');
          const lang = node.getAttribute('lang') || '';
          const foldable = node.hasAttribute('foldable');
          const showCopy = node.hasAttribute('showCopy');
          return h(CodeBlock, { code, lang, foldable, showCopy });
        }
        case 'think-block': {
          const slotContent = node.innerHTML;
          const customClass = props.thinkOptions?.customClass ? props.thinkOptions.customClass : '';
          return h(
            ThinkBlock,
            { class: customClass },
            { default: () => h('div', { innerHTML: slotContent }) }
          );
        }
        default:
          // 对于其他标签，保持原样（正常 markdown 渲染）
          return null;
      }
    };

    // 获取所有需要处理的标签
    const getAllTags = () => {
      // 默认标签（只包含组件库内置的）
      const defaultSupportedTags = [
        'table',
        'img',
        'a',
        'code',
        'pre',
        'div',
        'span',
        'p',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
      ];
      const defaultCustomBlocks = ['code-block', 'think-block']; // 只保留组件库内置的

      // 默认 + 用户自定义追加，并去重
      const supportedTags = [...defaultSupportedTags, ...(props.supportedTags || [])];
      const customBlockTags = [...defaultCustomBlocks, ...(props.customBlockTags || [])];

      // 合并并去重
      const allTags = [...supportedTags, ...customBlockTags];
      return [...new Set(allTags)];
    };

    // 统一处理所有标签
    const allTags = getAllTags();
    for (const tagName of allTags) {
      const elements = el.querySelectorAll(tagName);
      if (elements.length > 0) {
        processSlotInterception(tagName, elements);
      }
    }
  }

  // 注册自定义指令
  const _vCustomBlocks = {
    mounted(el: HTMLElement) {
      if (isTyping.value) return;
      nextTick(() => {
        processCustomBlocks(el);
      });
    },
    updated(el: HTMLElement) {
      if (isTyping.value) return;
      nextTick(() => {
        processCustomBlocks(el);
      });
    },
  };
  </script>

  <style lang="scss" scoped>
  /* markdown 渲染器外层容器 */
  .ac-markdown-renderer {
    width: 100%;
  }

  /* markdown 内容区域 */
  .ac-markdown-content {
    font-size: var(--font-size-body-medium);
    /* 文字大小 */
    line-height: 1.6;
    color: var(--color-text-2);
    background-color: var(--color-bg-1);
    /* 主文本色 */
  }

  /* 标题样式 */
  .ac-markdown-content :deep(h1),
  .ac-markdown-content :deep(h2),
  .ac-markdown-content :deep(h3),
  .ac-markdown-content :deep(h4),
  .ac-markdown-content :deep(h5),
  .ac-markdown-content :deep(h6) {
    margin-top: 24px;
    margin-bottom: 16px;
    font-weight: 600;
    line-height: 1.25;
  }

  .ac-markdown-content :deep(h1) {
    font-size: 2em;
  }

  .ac-markdown-content :deep(h2) {
    font-size: 1.5em;
  }

  .ac-markdown-content :deep(h3) {
    font-size: 1.25em;
  }

  /* 段落样式 */
  .ac-markdown-content :deep(p) {
    margin-top: 0;
  }

  /* 链接样式 */
  .ac-markdown-content :deep(a) {
    color: rgb(var(--primary-6));
    /* 主色 */
    text-decoration: none;
  }

  .ac-markdown-content :deep(a):hover {
    text-decoration: underline;
  }

  /* 列表样式 */
  .ac-markdown-content :deep(ul),
  .ac-markdown-content :deep(ol) {
    padding-left: 2em;
    margin-top: 0;
    margin-bottom: 16px;
  }

  /* 行内代码样式 */
  .ac-markdown-content :deep(code) {
    font-family: var(--font-family-code), serif;
    /* 代码字体 */
    padding: 0.2em 0.4em;
    margin: 0;
    font-size: 85%;
    background-color: var(--color-fill-2);
    border-radius: var(--border-radius-small);
  }

  /* 代码块样式 */
  .ac-markdown-content :deep(pre) {
    background-color: var(--color-fill-2);
    border-radius: var(--border-radius-medium);
    padding: 16px;
    overflow: auto;
    margin-top: 0;
    margin-bottom: 16px;
  }

  .ac-markdown-content :deep(pre code) {
    background-color: transparent;
    padding: 0;
    margin: 0;
    font-size: 100%;
    word-break: normal;
    white-space: pre;
  }

  /* 引用块样式 */
  .ac-markdown-content :deep(blockquote) {
    margin: 0 0 16px;
    padding: 0 1em;
    color: var(--color-text-3);
    border-left: 0.25em solid var(--color-border-3);
  }

  /* 表格样式 */
  .ac-markdown-content :deep(table) {
    border-collapse: collapse;
    width: 100%;
    margin-bottom: 16px;
  }

  .ac-markdown-content :deep(th),
  .ac-markdown-content :deep(td) {
    padding: 6px 13px;
    border: 1px solid var(--color-border-2);
  }

  .ac-markdown-content :deep(tr:nth-child(2n)) {
    background-color: var(--color-fill-1);
  }

  /* 图片样式 */
  .ac-markdown-content :deep(img) {
    max-width: 100%;
    box-sizing: content-box;
    margin: 8px 0;
  }

  /* 思考提示块样式 */
  .ac-think {
    background: var(--color-fill-1);
    border-left: 4px solid rgb(var(--primary-6));
    padding: 12px 16px;
    margin: 12px 0;
    border-radius: var(--border-radius-medium);
    color: var(--color-text-2);
    font-style: italic;
  }
  </style>
