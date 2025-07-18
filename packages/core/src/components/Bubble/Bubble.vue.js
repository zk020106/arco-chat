import { computed, useSlots } from 'vue';
import { Avatar } from '@arco-design/web-vue';
import BubbleLoading from './BubbleLoading.vue';
const props = withDefaults(defineProps(), {
    content: '',
    loading: false,
    align: 'left',
    variant: 'filled',
    avatarConfig: () => ({ size: 36 }),
});
/**
 * top - 气泡顶部区域
 * loadingTpl - 自定义 Loading 样式
 * default - 内容区
 * bottom - 气泡底部区域
 */
const slots = useSlots();
const bubbleClasses = computed(() => {
    return [
        `ac-bubble-${props.align}`,
        props.loading ? 'ac-bubble-loading' : '',
    ];
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_withDefaultsArg = (function (t) { return t; })({
    content: '',
    loading: false,
    align: 'left',
    variant: 'filled',
    avatarConfig: () => ({ size: 36 }),
});
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['filled']} */ ;
/** @type {__VLS_StyleScopedClasses['bordered']} */ ;
/** @type {__VLS_StyleScopedClasses['ac-bubble-content']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "ac-bubble" },
    ...{ class: (['ac-bubble', `ac-bubble-${props.align}`]) },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "ac-bubble-avatar" },
});
const __VLS_0 = {}.Avatar;
/** @type {[typeof __VLS_components.Avatar, typeof __VLS_components.Avatar, ]} */ ;
// @ts-ignore
Avatar;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...(__VLS_ctx.avatarConfig),
}));
const __VLS_2 = __VLS_1({
    ...(__VLS_ctx.avatarConfig),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_4 } = __VLS_3.slots;
// @ts-ignore
[avatarConfig,];
(__VLS_ctx.avatarConfig?.displayName);
// @ts-ignore
[avatarConfig,];
var __VLS_3;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "ac-bubble-content-container" },
});
if (!__VLS_ctx.loading) {
    // @ts-ignore
    [loading,];
    var __VLS_5 = {};
}
if (__VLS_ctx.loading) {
    // @ts-ignore
    [loading,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "loading-container" },
    });
    var __VLS_7 = {};
    /** @type {[typeof BubbleLoading, typeof BubbleLoading, ]} */ ;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(BubbleLoading, new BubbleLoading({}));
    const __VLS_10 = __VLS_9({}, ...__VLS_functionalComponentArgsRest(__VLS_9));
}
if ((__VLS_ctx.slots.default || __VLS_ctx.content) && !__VLS_ctx.loading) {
    // @ts-ignore
    [loading, slots, content,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "ac-bubble-content" },
        ...{ class: ([__VLS_ctx.variant]) },
    });
    // @ts-ignore
    [variant,];
    var __VLS_13 = {};
    (__VLS_ctx.content);
    // @ts-ignore
    [content,];
}
if (!__VLS_ctx.loading) {
    // @ts-ignore
    [loading,];
    var __VLS_15 = {};
}
/** @type {__VLS_StyleScopedClasses['ac-bubble']} */ ;
/** @type {__VLS_StyleScopedClasses['ac-bubble']} */ ;
/** @type {__VLS_StyleScopedClasses['ac-bubble-avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['ac-bubble-content-container']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-container']} */ ;
/** @type {__VLS_StyleScopedClasses['ac-bubble-content']} */ ;
// @ts-ignore
var __VLS_6 = __VLS_5, __VLS_8 = __VLS_7, __VLS_14 = __VLS_13, __VLS_16 = __VLS_15;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Avatar: Avatar,
            BubbleLoading: BubbleLoading,
            slots: slots,
        };
    },
    __typeProps: {},
    props: {},
});
const __VLS_component = (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeProps: {},
    props: {},
});
export default {};
; /* PartiallyEnd: #4569/main.vue */
