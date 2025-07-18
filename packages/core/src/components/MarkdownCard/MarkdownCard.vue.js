import { computed, defineEmits, defineProps, getCurrentInstance, h, nextTick, onMounted, ref, watch, render, defineComponent } from 'vue';
import MarkdownIt from 'markdown-it';
import DOMPurify from 'dompurify';
import CodeBlock from './components/CodeBlock.vue';
import ThinkBlock from './components/ThinkBlock.vue';
import { compile } from 'vue';
import 'highlight.js/styles/github.css';
const props = withDefaults(defineProps(), {
    safeMode: false,
    typing: true,
    enableThink: true
});
const emit = defineEmits();
const md = ref();
const typingContent = ref('');
let typingTimer = null;
const isTyping = ref(false);
/**
 * 是否安全模式预览 html
 * safeMode: true 时，使用 DOMPurify 过滤 html
 * safeMode: false 时，直接渲染原始 html
 */
const renderedMarkdown = computed(() => {
    if (!md.value)
        return props.content;
    let content = props.content || '';
    if (props.enableThink) {
        content = parseContentWithThink(content);
    }
    let html = md.value.render(content);
    if (props.safeMode) {
        html = DOMPurify.sanitize(html);
    }
    return html;
});
// 动态渲染 markdown + 组件
const markdownVNode = computed(() => {
    const html = renderedMarkdown.value;
    const Comp = compile(`<div>${html}</div>`);
    return defineComponent({
        components: { CodeBlock, ThinkBlock },
        render() {
            return h(Comp);
        }
    });
});
const __VLS_exposed = { markdownVNode };
defineExpose(__VLS_exposed);
function parseContentWithThink(content) {
    return content
        .replace(/<think>/g, `<think-block>`) // 小写，和 code-block 一致
        .replace(/<\/think>/g, `</think-block>`);
}
function createMarkdownIt() {
    const options = {
        html: true,
        highlight(str, lang) {
            // 返回自定义标签，code内容用encodeURIComponent防止特殊字符冲突
            const encoded = encodeURIComponent(str);
            return `<code-block code="${encoded}" lang="${lang || ''}" foldable showCopy></code-block>`;
        },
        ...props.mdOptions,
    };
    const instance = new MarkdownIt(options);
    // 应用插件
    if (Array.isArray(props.mdPlugins)) {
        props.mdPlugins.forEach((pluginObj) => {
            if (pluginObj && pluginObj.plugin) {
                instance.use(pluginObj.plugin, pluginObj.opts || {});
            }
        });
    }
    return instance;
}
function startTypingEffect(html, step = 2, interval = 50, style = 'normal') {
    clearTyping();
    typingContent.value = '';
    isTyping.value = true;
    emit('typing-start');
    let i = 0;
    const len = html.length;
    function nextStep() {
        if (i >= len) {
            typingContent.value = html;
            isTyping.value = false;
            emit('typing-end');
            return;
        }
        let s = step;
        if (Array.isArray(step)) {
            // 随机步长
            s = Math.floor(Math.random() * (step[1] - step[0] + 1)) + step[0];
        }
        typingContent.value = html.slice(0, i + s);
        i += s;
        emit('typing');
        nextTick(() => {
            const container = document.querySelector('.ac-markdown-content');
            if (container)
                processCustomBlocks(container);
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
watch(() => [props.content, props.typing, props.typingOptions, renderedMarkdown.value], ([, typing, typingOptions, html]) => {
    clearTyping();
    if (typing) {
        // 打字机参数
        const { step = 2, interval = 50, style = 'normal' } = typingOptions || {};
        nextTick(() => startTypingEffect(html, step, interval, style));
    }
    else {
        typingContent.value = html;
    }
}, { immediate: true, deep: true });
onMounted(() => {
    md.value = createMarkdownIt();
    emit('after-mdt-init', md.value);
});
// 处理自定义标签的函数
function processCustomBlocks(el) {
    // 处理 code-block 标签
    const codeBlocks = el.querySelectorAll('code-block');
    codeBlocks.forEach(node => {
        if (node.dataset.rendered === 'true')
            return;
        const code = decodeURIComponent(node.getAttribute('code') || '');
        const lang = node.getAttribute('lang') || '';
        const foldable = node.hasAttribute('foldable');
        const showCopy = node.hasAttribute('showCopy');
        const vnode = h(CodeBlock, { code, lang, foldable, showCopy });
        const container = document.createElement('div');
        // @ts-ignore
        vnode.appContext = getCurrentInstance()?.appContext;
        render(vnode, container);
        node.replaceWith(container.firstElementChild);
    });
    // 处理 think-block 标签
    const thinkBlocks = el.querySelectorAll('think-block');
    thinkBlocks.forEach(node => {
        if (node.dataset.rendered === 'true')
            return;
        const slotContent = node.innerHTML;
        const vnode = h(ThinkBlock, {}, { default: () => h('div', { innerHTML: slotContent }) });
        const container = document.createElement('div');
        // @ts-ignore
        vnode.appContext = getCurrentInstance()?.appContext;
        render(vnode, container);
        node.replaceWith(container.firstElementChild);
    });
}
// 注册自定义指令
const vCustomBlocks = {
    mounted(el) {
        nextTick(() => {
            processCustomBlocks(el);
        });
    },
    updated(el) {
        nextTick(() => {
            processCustomBlocks(el);
        });
    }
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_withDefaultsArg = (function (t) { return t; })({
    safeMode: false,
    typing: true,
    enableThink: true
});
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['ac-markdown-content']} */ ;
/** @type {__VLS_StyleScopedClasses['ac-markdown-content']} */ ;
/** @type {__VLS_StyleScopedClasses['ac-markdown-content']} */ ;
/** @type {__VLS_StyleScopedClasses['ac-markdown-content']} */ ;
/** @type {__VLS_StyleScopedClasses['ac-markdown-content']} */ ;
/** @type {__VLS_StyleScopedClasses['ac-markdown-content']} */ ;
/** @type {__VLS_StyleScopedClasses['ac-markdown-content']} */ ;
/** @type {__VLS_StyleScopedClasses['ac-markdown-content']} */ ;
/** @type {__VLS_StyleScopedClasses['ac-markdown-content']} */ ;
/** @type {__VLS_StyleScopedClasses['ac-markdown-content']} */ ;
/** @type {__VLS_StyleScopedClasses['ac-markdown-content']} */ ;
/** @type {__VLS_StyleScopedClasses['ac-markdown-content']} */ ;
/** @type {__VLS_StyleScopedClasses['ac-markdown-content']} */ ;
/** @type {__VLS_StyleScopedClasses['ac-markdown-content']} */ ;
/** @type {__VLS_StyleScopedClasses['ac-markdown-content']} */ ;
/** @type {__VLS_StyleScopedClasses['ac-markdown-content']} */ ;
/** @type {__VLS_StyleScopedClasses['ac-markdown-content']} */ ;
/** @type {__VLS_StyleScopedClasses['ac-markdown-content']} */ ;
/** @type {__VLS_StyleScopedClasses['ac-markdown-content']} */ ;
/** @type {__VLS_StyleScopedClasses['ac-markdown-content']} */ ;
/** @type {__VLS_StyleScopedClasses['ac-markdown-content']} */ ;
/** @type {__VLS_StyleScopedClasses['ac-markdown-content']} */ ;
/** @type {__VLS_StyleScopedClasses['ac-markdown-content']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "ac-markdown-card" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "ac-markdown-content" },
});
__VLS_asFunctionalDirective(__VLS_directives.vHtml)(null, { ...__VLS_directiveBindingRestFields, value: (props.typing ? __VLS_ctx.typingContent : __VLS_ctx.renderedMarkdown) }, null, null);
__VLS_asFunctionalDirective(__VLS_directives.vCustomBlocks)(null, { ...__VLS_directiveBindingRestFields, }, null, null);
// @ts-ignore
[vHtml, typingContent, renderedMarkdown, vCustomBlocks,];
/** @type {__VLS_StyleScopedClasses['ac-markdown-card']} */ ;
/** @type {__VLS_StyleScopedClasses['ac-markdown-content']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            typingContent: typingContent,
            renderedMarkdown: renderedMarkdown,
            vCustomBlocks: vCustomBlocks,
        };
    },
    __typeEmits: {},
    __typeProps: {},
    props: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {
            ...__VLS_exposed,
        };
    },
    __typeEmits: {},
    __typeProps: {},
    props: {},
});
; /* PartiallyEnd: #4569/main.vue */
