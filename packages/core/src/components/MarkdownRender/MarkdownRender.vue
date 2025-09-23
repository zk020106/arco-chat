<template>
    <div class="ac-markdown-renderer">
      <div class="ac-markdown-content" ref="contentEl" v-html="props.typing ? typingContent : renderedMarkdown" v-custom-blocks></div>
    </div>
  </template>

  <script setup lang="ts">
  import { ref, computed, watch, onMounted,useSlots,onBeforeUnmount,nextTick,h,getCurrentInstance,render  } from 'vue'
  import DOMPurify from 'dompurify';
  import MarkdownIt from 'markdown-it';
  import type { VNode, AppContext } from 'vue';
  import type { PluginSimple, PluginWithOptions } from 'markdown-it';
import CodeBlock from './components/CodeBlock.vue';
import ThinkBlock from './components/ThinkBlock.vue';
import MermaidBlock from './components/MermaidBlock.vue';
  import type {
    MarkdownRenderProps,
    MarkdownRenderSlots,
    SlotInterceptorProps,
    TypingOptions,
  } from './markdown-render-types';
  import { pluginManager, processMermaidDiagrams, defaultPluginOptions } from './plugins';
  import 'highlight.js/styles/github.css';
  import 'katex/dist/katex.min.css';

  const props = withDefaults(defineProps<MarkdownRenderProps>(), {
    safeMode: false,
    typing: false,
    enableThink: true,
    enableMermaid: true,
    enableLatex: true,
    enableEmoji: true,
    customRenderers: () => ({}),
    customTags: () => ({}),
    supportedTags: () => [], // 默认为空数组，会追加到默认标签后面
    customBlockTags: () => [], // 默认为空数组，会追加到默认标签后面
    pluginConfig: () => defaultPluginOptions,
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

  const md = ref<MarkdownIt>();
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
    
    // 更新插件配置
    if (props.pluginConfig) {
      // 更新 mermaid 配置
      if (props.pluginConfig.mermaid) {
        const mermaidPlugin = pluginManager.get('mermaid');
        if (mermaidPlugin) {
          mermaidPlugin.options = { ...mermaidPlugin.options, ...props.pluginConfig.mermaid };
        }
      }
      
      // 更新 latex 配置
      if (props.pluginConfig.latex) {
        const latexPlugin = pluginManager.get('latex');
        if (latexPlugin) {
          latexPlugin.options = { ...latexPlugin.options, ...props.pluginConfig.latex };
        }
      }
      
      // 更新 emoji 配置
      if (props.pluginConfig.emoji) {
        const emojiPlugin = pluginManager.get('emoji');
        if (emojiPlugin) {
          emojiPlugin.options = { ...emojiPlugin.options, ...props.pluginConfig.emoji };
        }
      }
    }
    
    // 根据启用状态控制插件
    const enabledPlugins: string[] = [];
    if (props.enableMermaid) enabledPlugins.push('mermaid');
    if (props.enableLatex) enabledPlugins.push('latex');
    if (props.enableEmoji !== false) enabledPlugins.push('emoji'); // 默认启用 emoji
    
    // 应用插件
    pluginManager.applyPlugins(instance, enabledPlugins);
    
    // 应用用户自定义插件
    if (Array.isArray(props.mdPlugins)) {
      type MdPluginItem = { plugin: PluginSimple | PluginWithOptions<any>; opts?: unknown };
      const plugins = props.mdPlugins as Array<MdPluginItem | unknown>;
      for (const item of plugins) {
        const pluginObj = item as Partial<MdPluginItem>;
        if (pluginObj && pluginObj.plugin) {
          instance.use(pluginObj.plugin as any, (pluginObj.opts as any) || {});
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
        const renderer = md.value ?? (md.value = createMarkdownIt());
        const finalHtml = renderer.render(processedSrc);
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
      const renderer = md.value ?? (md.value = createMarkdownIt());
      const stepHtml = renderer.render(current);
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
      // 重置处理状态，允许重新处理
      if (contentEl.value) {
        contentEl.value.dataset.processed = 'false';
      }
      
      if (typing) {
        const step = (typingOptions as TypingOptions)?.step ?? 8;
        const interval = (typingOptions as TypingOptions)?.interval ?? 50;
        nextTick(() => startTypingEffect(step, interval));
      } else if (md.value) {
        const contentStr = (content as string) || '';
        const html = md.value.render(contentStr);
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

  // 当 mdOptions、mdPlugins 或插件配置变化时，重建 markdown-it 实例并重渲染
  watch(
    () => [props.mdOptions, props.mdPlugins, props.enableMermaid, props.enableLatex, props.enableEmoji, props.pluginConfig],
    () => {
      // 重置处理状态，允许重新处理
      if (contentEl.value) {
        contentEl.value.dataset.processed = 'false';
      }
      
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

  // 处理自定义标签的函数 - 完全简化
  function processCustomBlocks(el: HTMLElement) {
    // 防止重复处理
    if (el.dataset.processed === 'true') return;
    el.dataset.processed = 'true';
    
    // 处理 Mermaid 图表
    if (props.enableMermaid) {
      processMermaidDiagrams(el).catch(console.error);
    }
    
    // 统一的插槽拦截处理函数
    const processSlotInterception = (tagName: string, nodes: NodeListOf<Element>) => {
      for (const node of nodes) {
        if ((node as HTMLElement).dataset.rendered === 'true') return;

        const slotHandler = slots[tagName as keyof MarkdownRenderSlots];
        const container = document.createElement('div');
        let vnode: VNode | null = null;

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
          (vnode as VNode & { appContext?: AppContext | null }).appContext =
            (getCurrentInstance() as { appContext?: AppContext | null } | null)?.appContext ?? null;
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
          return h(CodeBlock, { code, language: lang, foldable, showCopy });
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
        case 'mermaid-block': {
          const code = decodeURIComponent(node.getAttribute('code') || '');
          const theme = node.getAttribute('theme') || 'default';
          const showCodeToggle = node.getAttribute('show-code-toggle') === 'true';
          const showZoom = node.getAttribute('show-zoom') === 'true';
          const showExport = node.getAttribute('show-export') === 'true';
          const showFullscreen = node.getAttribute('show-fullscreen') === 'true';
          return h(MermaidBlock, { 
            code, 
            theme, 
            showCodeToggle, 
            showZoom, 
            showExport, 
            showFullscreen 
          });
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
      const defaultCustomBlocks = ['code-block', 'think-block', 'mermaid-block']; // 只保留组件库内置的

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

  // 注册自定义指令 - 完全简化
  const vCustomBlocks = {
    mounted(el: HTMLElement) {
      if (isTyping.value) return;
      nextTick(() => {
        processCustomBlocks(el);
      });
    },
  };
  </script>

  <style lang="scss" scoped>
 @use './markdown-render.scss'
  </style>
