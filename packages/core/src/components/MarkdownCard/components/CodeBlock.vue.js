import { ref, computed } from 'vue';
import hljs from 'highlight.js';
import { Button as AButton, Message } from '@arco-design/web-vue';
import { IconCopy, IconDown, IconUp } from '@arco-design/web-vue/es/icon';
const props = defineProps();
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
    setTimeout(() => (copied.value = false), 1200);
}
// 移除 watch 逻辑，不再根据 props.foldable 自动收起
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "code-block" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "code-block-header" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "code-block-lang" },
});
(__VLS_ctx.lang || 'text');
// @ts-ignore
[lang,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "code-block-actions" },
});
if (__VLS_ctx.showCopy) {
    // @ts-ignore
    [showCopy,];
    const __VLS_0 = {}.AButton;
    /** @type {[typeof __VLS_components.AButton, typeof __VLS_components.aButton, typeof __VLS_components.AButton, typeof __VLS_components.aButton, ]} */ ;
    // @ts-ignore
    AButton;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        ...{ 'onClick': {} },
        ...{ class: "code-block-copy" },
        type: "text",
        size: "small",
    }));
    const __VLS_2 = __VLS_1({
        ...{ 'onClick': {} },
        ...{ class: "code-block-copy" },
        type: "text",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    let __VLS_4;
    let __VLS_5;
    const __VLS_6 = ({ click: {} },
        { onClick: (__VLS_ctx.copyCode) });
    const { default: __VLS_7 } = __VLS_3.slots;
    // @ts-ignore
    [copyCode,];
    const __VLS_8 = {}.IconCopy;
    /** @type {[typeof __VLS_components.IconCopy, typeof __VLS_components.iconCopy, ]} */ ;
    // @ts-ignore
    IconCopy;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({}));
    const __VLS_10 = __VLS_9({}, ...__VLS_functionalComponentArgsRest(__VLS_9));
    var __VLS_3;
}
if (__VLS_ctx.foldable) {
    // @ts-ignore
    [foldable,];
    const __VLS_13 = {}.AButton;
    /** @type {[typeof __VLS_components.AButton, typeof __VLS_components.aButton, typeof __VLS_components.AButton, typeof __VLS_components.aButton, ]} */ ;
    // @ts-ignore
    AButton;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
        ...{ 'onClick': {} },
        ...{ class: "code-block-toggle" },
        type: "text",
        size: "small",
    }));
    const __VLS_15 = __VLS_14({
        ...{ 'onClick': {} },
        ...{ class: "code-block-toggle" },
        type: "text",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    let __VLS_17;
    let __VLS_18;
    const __VLS_19 = ({ click: {} },
        { onClick: (__VLS_ctx.toggleFold) });
    const { default: __VLS_20 } = __VLS_16.slots;
    // @ts-ignore
    [toggleFold,];
    if (__VLS_ctx.folded) {
        // @ts-ignore
        [folded,];
        const __VLS_21 = {}.IconDown;
        /** @type {[typeof __VLS_components.IconDown, typeof __VLS_components.iconDown, ]} */ ;
        // @ts-ignore
        IconDown;
        // @ts-ignore
        const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({}));
        const __VLS_23 = __VLS_22({}, ...__VLS_functionalComponentArgsRest(__VLS_22));
    }
    else {
        const __VLS_26 = {}.IconUp;
        /** @type {[typeof __VLS_components.IconUp, typeof __VLS_components.iconUp, ]} */ ;
        // @ts-ignore
        IconUp;
        // @ts-ignore
        const __VLS_27 = __VLS_asFunctionalComponent(__VLS_26, new __VLS_26({}));
        const __VLS_28 = __VLS_27({}, ...__VLS_functionalComponentArgsRest(__VLS_27));
    }
    var __VLS_16;
}
const __VLS_31 = {}.transition;
/** @type {[typeof __VLS_components.Transition, typeof __VLS_components.transition, typeof __VLS_components.Transition, typeof __VLS_components.transition, ]} */ ;
// @ts-ignore
Transition;
// @ts-ignore
const __VLS_32 = __VLS_asFunctionalComponent(__VLS_31, new __VLS_31({
    name: "fade",
    persisted: true,
}));
const __VLS_33 = __VLS_32({
    name: "fade",
    persisted: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_32));
const { default: __VLS_35 } = __VLS_34.slots;
__VLS_asFunctionalElement(__VLS_elements.pre, __VLS_elements.pre)({});
__VLS_asFunctionalDirective(__VLS_directives.vShow)(null, { ...__VLS_directiveBindingRestFields, value: (!__VLS_ctx.folded) }, null, null);
// @ts-ignore
[folded, vShow,];
__VLS_asFunctionalElement(__VLS_elements.code, __VLS_elements.code)({});
__VLS_asFunctionalDirective(__VLS_directives.vHtml)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.highlighted) }, null, null);
// @ts-ignore
[vHtml, highlighted,];
var __VLS_34;
/** @type {__VLS_StyleScopedClasses['code-block']} */ ;
/** @type {__VLS_StyleScopedClasses['code-block-header']} */ ;
/** @type {__VLS_StyleScopedClasses['code-block-lang']} */ ;
/** @type {__VLS_StyleScopedClasses['code-block-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['code-block-copy']} */ ;
/** @type {__VLS_StyleScopedClasses['code-block-toggle']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            AButton: AButton,
            IconCopy: IconCopy,
            IconDown: IconDown,
            IconUp: IconUp,
            folded: folded,
            highlighted: highlighted,
            toggleFold: toggleFold,
            copyCode: copyCode,
        };
    },
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
