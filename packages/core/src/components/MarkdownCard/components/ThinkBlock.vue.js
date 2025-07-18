import { ref } from 'vue';
import { Button as AButton } from '@arco-design/web-vue';
import { IconDown, IconUp, IconBulb } from '@arco-design/web-vue/es/icon';
const folded = ref(false);
function toggleFold() {
    folded.value = !folded.value;
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['ac-think-block']} */ ;
/** @type {__VLS_StyleScopedClasses['ac-think-content']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "ac-think-block" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "ac-think-header" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "ac-think-title" },
});
const __VLS_0 = {}.IconBulb;
/** @type {[typeof __VLS_components.IconBulb, typeof __VLS_components.iconBulb, ]} */ ;
// @ts-ignore
IconBulb;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const __VLS_5 = {}.AButton;
/** @type {[typeof __VLS_components.AButton, typeof __VLS_components.aButton, typeof __VLS_components.AButton, typeof __VLS_components.aButton, ]} */ ;
// @ts-ignore
AButton;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    ...{ 'onClick': {} },
    type: "text",
    size: "small",
}));
const __VLS_7 = __VLS_6({
    ...{ 'onClick': {} },
    type: "text",
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
let __VLS_9;
let __VLS_10;
const __VLS_11 = ({ click: {} },
    { onClick: (__VLS_ctx.toggleFold) });
const { default: __VLS_12 } = __VLS_8.slots;
// @ts-ignore
[toggleFold,];
if (__VLS_ctx.folded) {
    // @ts-ignore
    [folded,];
    const __VLS_13 = {}.IconDown;
    /** @type {[typeof __VLS_components.IconDown, typeof __VLS_components.iconDown, ]} */ ;
    // @ts-ignore
    IconDown;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({}));
    const __VLS_15 = __VLS_14({}, ...__VLS_functionalComponentArgsRest(__VLS_14));
}
else {
    const __VLS_18 = {}.IconUp;
    /** @type {[typeof __VLS_components.IconUp, typeof __VLS_components.iconUp, ]} */ ;
    // @ts-ignore
    IconUp;
    // @ts-ignore
    const __VLS_19 = __VLS_asFunctionalComponent(__VLS_18, new __VLS_18({}));
    const __VLS_20 = __VLS_19({}, ...__VLS_functionalComponentArgsRest(__VLS_19));
}
var __VLS_8;
const __VLS_23 = {}.transition;
/** @type {[typeof __VLS_components.Transition, typeof __VLS_components.transition, typeof __VLS_components.Transition, typeof __VLS_components.transition, ]} */ ;
// @ts-ignore
Transition;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent(__VLS_23, new __VLS_23({
    name: "fade",
    persisted: true,
}));
const __VLS_25 = __VLS_24({
    name: "fade",
    persisted: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
const { default: __VLS_27 } = __VLS_26.slots;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "ac-think-content" },
});
__VLS_asFunctionalDirective(__VLS_directives.vShow)(null, { ...__VLS_directiveBindingRestFields, value: (!__VLS_ctx.folded) }, null, null);
// @ts-ignore
[folded, vShow,];
var __VLS_28 = {};
var __VLS_26;
/** @type {__VLS_StyleScopedClasses['ac-think-block']} */ ;
/** @type {__VLS_StyleScopedClasses['ac-think-header']} */ ;
/** @type {__VLS_StyleScopedClasses['ac-think-title']} */ ;
/** @type {__VLS_StyleScopedClasses['ac-think-content']} */ ;
// @ts-ignore
var __VLS_29 = __VLS_28;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            AButton: AButton,
            IconDown: IconDown,
            IconUp: IconUp,
            IconBulb: IconBulb,
            folded: folded,
            toggleFold: toggleFold,
        };
    },
});
const __VLS_component = (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
export default {};
; /* PartiallyEnd: #4569/main.vue */
