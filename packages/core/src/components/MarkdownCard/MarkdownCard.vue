<template>
  <div class="ac-markdown-card">
    <div class="ac-markdown-content" v-html="props.typing ? typingContent : renderedMarkdown" v-custom-blocks></div>
  </div>
</template>

<script setup lang="ts">
import {computed, defineEmits, defineProps, getCurrentInstance, h, nextTick, onMounted, ref, watch, render,defineComponent} from 'vue'
import MarkdownIt from 'markdown-it'
import DOMPurify from 'dompurify'
import type {MarkdownCardProps} from './markdown-card-types'
import CodeBlock from './components/CodeBlock.vue'
import ThinkBlock from './components/ThinkBlock.vue'
import { compile } from 'vue'
import 'highlight.js/styles/github.css'

const props = withDefaults(defineProps<MarkdownCardProps>(),{
  safeMode: false,
  typing: true,
  enableThink: true
})

/**
 * MarkdownCard 组件支持的事件
 * @event after-mdt-init - markdown-it 初始化后
 * @event typingStart - 打字机动效开始
 * @event typing - 打字机动效中
 * @event typingEnd - 打字机动效结束
 */
const emit = defineEmits<{
  (e: 'after-mdt-init', md: any): void
  (e: 'typing-start'): void
  (e: 'typing'): void
  (e: 'typing-end'): void
}>()

const md = ref()
const typingMarkdown=ref('')
const typingContent = ref('')
let typingTimer: ReturnType<typeof setTimeout> | null = null
const isTyping = ref(false)


/**
 * 是否安全模式预览 html
 * safeMode: true 时，使用 DOMPurify 过滤 html
 * safeMode: false 时，直接渲染原始 html
 */
const renderedMarkdown = computed(() => {
  let content = props.content || ''
  if (props.enableThink) {
    content = parseContentWithThink(content)
  }
  if (!md.value) return content
  let html = md.value.render(content)
  if (props.safeMode) {
    html = DOMPurify.sanitize(html)
  }
  return html
})

// 动态渲染 markdown + 组件
const markdownVNode = computed(() => {
  const html = renderedMarkdown.value
  const Comp = compile(`<div>${html}</div>`)
  return defineComponent({
    components: { CodeBlock, ThinkBlock },
    render() {
      return h(Comp)
    }
  })
})

defineExpose({ markdownVNode })

function parseContentWithThink(content: string) {
  return content
      .replace(/<think>/g, `<think-block>`) // 小写，和 code-block 一致
      .replace(/<\/think>/g, `</think-block>`);
}

function createMarkdownIt() {
  const options = {
    html: true,
    highlight(str: string, lang: string) {
      // 返回自定义标签，code内容用encodeURIComponent防止特殊字符冲突
      const encoded = encodeURIComponent(str)
      return `<code-block code="${encoded}" lang="${lang || ''}" foldable showCopy></code-block>`
    },
    ...props.mdOptions,
  }
  const instance = new MarkdownIt(options)
  // 应用插件
  if (Array.isArray(props.mdPlugins)) {
    props.mdPlugins.forEach((pluginObj: any) => {
      if (pluginObj && pluginObj.plugin) {
        instance.use(pluginObj.plugin, pluginObj.opts || {})
      }
    })
  }
  return instance
}

function startTypingEffect( step = 5, interval = 50, style = 'normal') {
  clearTyping()
  typingMarkdown.value=""
  typingContent.value = ''
  isTyping.value = true
  emit('typing-start')
  let i = 0
  const src=props.content||""
  const processedSrc = props.enableThink ? parseContentWithThink(src) : src
  const len=processedSrc.length
  function nextStep() {
    if (i >= len) {
      typingMarkdown.value=processedSrc
      typingContent.value = md.value.render(processedSrc)
      isTyping.value = false
      emit('typing-end')
      return
    }
    let s = step
    if (Array.isArray(step)) {
      // 随机步长
      s = Math.floor(Math.random() * (step[1] - step[0] + 1)) + step[0]
    }
    typingMarkdown.value=processedSrc.slice(0,i+s)
    typingContent.value = md.value.render(typingMarkdown.value)
    i += s
    emit('typing')
    typingTimer = setTimeout(nextStep, interval)
  }
  nextStep()
}

function clearTyping() {
  if (typingTimer) {
    clearTimeout(typingTimer)
    typingTimer = null
  }
  isTyping.value = false
}

watch(
    () => [props.content, props.typing, props.typingOptions],
    ([content, typing, typingOptions]) => {
      clearTyping()
      if (typing) {
        // 打字机参数
        const { step = 5, interval = 50 } = typingOptions || {}
        nextTick(() => startTypingEffect( step, interval))
      } else {
        if(md.value){
          typingContent.value = md.value.render(content)
        }
      }
    },
    { immediate: true, deep: true },
)

onMounted(() => {
  md.value = createMarkdownIt()
  emit('after-mdt-init', md.value)
})

// 处理自定义标签的函数
function processCustomBlocks(el: HTMLElement) {
  // 处理 code-block 标签
  const codeBlocks = el.querySelectorAll('code-block')
  codeBlocks.forEach(node => {
    if ((node as HTMLElement).dataset.rendered === 'true') return

    const code = decodeURIComponent(node.getAttribute('code') || '')
    const lang = node.getAttribute('lang') || ''
    const foldable = node.hasAttribute('foldable')
    const showCopy = node.hasAttribute('showCopy')

    const vnode = h(CodeBlock, { code, lang, foldable, showCopy })
    const container = document.createElement('div')
    // @ts-ignore
    vnode.appContext = (getCurrentInstance() as any)?.appContext
    render(vnode, container)
    node.replaceWith(container.firstElementChild as HTMLElement)
  })

  // 处理 think-block 标签
  const thinkBlocks = el.querySelectorAll('think-block')
  thinkBlocks.forEach(node => {
    if ((node as HTMLElement).dataset.rendered === 'true') return

    const slotContent = node.innerHTML
    const vnode = h(ThinkBlock, {}, { default: () => h('div', { innerHTML: slotContent }) })
    const container = document.createElement('div')
    // @ts-ignore
    vnode.appContext = (getCurrentInstance() as any)?.appContext
    render(vnode, container)
    node.replaceWith(container.firstElementChild as HTMLElement)
  })
}

// 注册自定义指令
const vCustomBlocks = {
  mounted(el: HTMLElement) {
    nextTick(() => {
      processCustomBlocks(el)
    })
  },
  updated(el: HTMLElement) {
    nextTick(() => {
      processCustomBlocks(el)
    })
  }
}
</script>

<style lang="scss" scoped>
/* markdown 卡片外层容器 */
.ac-markdown-card {
  width: 100%;
}

/* markdown 内容区域 */
.ac-markdown-content {
  font-size: var(--font-size-body-medium); /* 文字大小 */
  line-height: 1.6;
  color: var(--color-text-1); /* 主文本色 */
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
  color: rgb(var(--primary-6)); /* 主色 */
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
  font-family: var(--font-family-code),serif; /* 代码字体 */
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
