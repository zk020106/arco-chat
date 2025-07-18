import { computed, defineEmits, ref } from 'vue';
import { ListDirection, ListVariant } from './prompt-types';
const props = withDefaults(defineProps(), {
    direction: ListDirection.Vertical,
    list: () => [],
    variant: ListVariant.Filled,
    title: '',
    onItemClick: undefined,
});
const emit = defineEmits();
const activeIndex = ref(-1);
const directionClass = computed(() => props.direction ?? 'vertical');
const variantClass = computed(() => props.variant ?? 'filled');
function iconStyle(icon) {
    return {
        fontSize: icon.size || '20px',
        color: icon.color || 'var(--color-primary, #165dff)',
    };
}
const handleItemClick = (item) => {
    emit('item-click', item);
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_withDefaultsArg = (function (t) { return t; })({
    direction: ListDirection.Vertical,
    list: () => [],
    variant: ListVariant.Filled,
    title: '',
    onItemClick: undefined,
});
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['ac-prompt-list']} */ ;
/** @type {__VLS_StyleScopedClasses['ac-prompt-item']} */ ;
/** @type {__VLS_StyleScopedClasses['ac-prompt-item']} */ ;
/** @type {__VLS_StyleScopedClasses['ac-prompt-item']} */ ;
/** @type {__VLS_StyleScopedClasses['ac-prompt-item']} */ ;
/** @type {__VLS_StyleScopedClasses['ac-prompt-item']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "ac-prompt" },
    ...{ class: ([`ac-prompt-${__VLS_ctx.variantClass}`, `ac-prompt-dir-${__VLS_ctx.directionClass}`]) },
});
// @ts-ignore
[variantClass, directionClass,];
if (__VLS_ctx.title || __VLS_ctx.$slots.header) {
    // @ts-ignore
    [title, $slots,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "ac-prompt-header" },
    });
    var __VLS_0 = {};
    (__VLS_ctx.title);
    // @ts-ignore
    [title,];
}
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "ac-prompt-list" },
});
for (const [item, index] of __VLS_getVForSourceType((__VLS_ctx.list))) {
    // @ts-ignore
    [list,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.handleItemClick(item);
                // @ts-ignore
                [handleItemClick,];
            } },
        key: (item.value),
        ...{ class: "ac-prompt-item" },
        ...{ class: ({ 'ac-prompt-item-active': index === __VLS_ctx.activeIndex }) },
    });
    // @ts-ignore
    [activeIndex,];
    if (item.iconConfig) {
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
            ...{ class: "ac-prompt-item-icon" },
        });
        if (item.iconConfig.component) {
            const __VLS_2 = ((item.iconConfig.component));
            // @ts-ignore
            const __VLS_3 = __VLS_asFunctionalComponent(__VLS_2, new __VLS_2({
                ...{ style: (__VLS_ctx.iconStyle(item.iconConfig)) },
            }));
            const __VLS_4 = __VLS_3({
                ...{ style: (__VLS_ctx.iconStyle(item.iconConfig)) },
            }, ...__VLS_functionalComponentArgsRest(__VLS_3));
            // @ts-ignore
            [iconStyle,];
        }
        else {
            __VLS_asFunctionalElement(__VLS_elements.i)({
                ...{ class: (item.iconConfig.name) },
                ...{ style: (__VLS_ctx.iconStyle(item.iconConfig)) },
            });
            // @ts-ignore
            [iconStyle,];
        }
    }
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "ac-prompt-item-content-wrap" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "ac-prompt-item-title" },
    });
    (item.label);
    if (item.desc) {
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "ac-prompt-item-content" },
        });
        (item.desc);
    }
}
if (__VLS_ctx.list.length === 0) {
    // @ts-ignore
    [list,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "ac-prompt-empty" },
    });
    var __VLS_7 = {};
}
/** @type {__VLS_StyleScopedClasses['ac-prompt']} */ ;
/** @type {__VLS_StyleScopedClasses['ac-prompt-header']} */ ;
/** @type {__VLS_StyleScopedClasses['ac-prompt-list']} */ ;
/** @type {__VLS_StyleScopedClasses['ac-prompt-item']} */ ;
/** @type {__VLS_StyleScopedClasses['ac-prompt-item-active']} */ ;
/** @type {__VLS_StyleScopedClasses['ac-prompt-item-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['ac-prompt-item-content-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['ac-prompt-item-title']} */ ;
/** @type {__VLS_StyleScopedClasses['ac-prompt-item-content']} */ ;
/** @type {__VLS_StyleScopedClasses['ac-prompt-empty']} */ ;
// @ts-ignore
var __VLS_1 = __VLS_0, __VLS_8 = __VLS_7;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            activeIndex: activeIndex,
            directionClass: directionClass,
            variantClass: variantClass,
            iconStyle: iconStyle,
            handleItemClick: handleItemClick,
        };
    },
    __typeEmits: {},
    __typeProps: {},
    props: {},
});
const __VLS_component = (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeEmits: {},
    __typeProps: {},
    props: {},
});
export default {};
; /* PartiallyEnd: #4569/main.vue */
