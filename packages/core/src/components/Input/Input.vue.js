import { computed, provide, ref, watch } from 'vue';
import Textarea from './components/textarea.vue';
import Button from './components/button.vue';
import { DisplayType, InputVariant, SendBtnVariant, inputEmits, inputInjectionKey, } from './input-types';
const props = withDefaults(defineProps(), {
    value: '',
    placeholder: '',
    disabled: false,
    displayType: DisplayType.Full,
    variant: InputVariant.Bordered,
    sendBtnVariant: SendBtnVariant.Full,
    loading: false,
    showCount: false,
    maxLength: undefined,
    submitShortKey: null,
});
const emits = defineEmits(inputEmits);
const inputValue = ref('');
const inputClasses = computed(() => ({
    'ac-input': true,
    'ac-input-disabled': props.disabled,
    'ac-input-simple': props.displayType === DisplayType.Simple,
    'ac-input-borderless': props.variant === InputVariant.BorderLess,
}));
const clearInput = () => {
    inputValue.value = '';
};
const getInput = () => inputValue.value;
watch(() => props.value, () => {
    inputValue.value = props.value;
}, { immediate: true });
provide(inputInjectionKey, { inputValue, rootProps: props, rootEmits: emits });
const __VLS_exposed = { clearInput, getInput };
defineExpose(__VLS_exposed);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_withDefaultsArg = (function (t) { return t; })({
    value: '',
    placeholder: '',
    disabled: false,
    displayType: DisplayType.Full,
    variant: InputVariant.Bordered,
    sendBtnVariant: SendBtnVariant.Full,
    loading: false,
    showCount: false,
    maxLength: undefined,
    submitShortKey: null,
});
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: (__VLS_ctx.inputClasses) },
});
// @ts-ignore
[inputClasses,];
var __VLS_0 = {};
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "ac-input-content" },
});
var __VLS_2 = {};
/** @type {[typeof Textarea, ]} */ ;
// @ts-ignore
const __VLS_4 = __VLS_asFunctionalComponent(Textarea, new Textarea({}));
const __VLS_5 = __VLS_4({}, ...__VLS_functionalComponentArgsRest(__VLS_4));
var __VLS_8 = {};
if (__VLS_ctx.displayType === __VLS_ctx.DisplayType.Simple) {
    // @ts-ignore
    [displayType, DisplayType,];
    var __VLS_10 = {};
    /** @type {[typeof Button, ]} */ ;
    // @ts-ignore
    const __VLS_12 = __VLS_asFunctionalComponent(Button, new Button({}));
    const __VLS_13 = __VLS_12({}, ...__VLS_functionalComponentArgsRest(__VLS_12));
}
if (__VLS_ctx.displayType === __VLS_ctx.DisplayType.Full) {
    // @ts-ignore
    [displayType, DisplayType,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "ac-input-foot" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "ac-input-foot-left" },
    });
    var __VLS_16 = {};
    if (__VLS_ctx.showCount) {
        // @ts-ignore
        [showCount,];
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
            ...{ class: "ac-input-foot-count" },
        });
        (__VLS_ctx.inputValue.length);
        (!(__VLS_ctx.maxLength ?? false) ? "" : `/${__VLS_ctx.maxLength}`);
        // @ts-ignore
        [inputValue, maxLength, maxLength,];
    }
    var __VLS_18 = {};
    /** @type {[typeof Button, ]} */ ;
    // @ts-ignore
    const __VLS_20 = __VLS_asFunctionalComponent(Button, new Button({}));
    const __VLS_21 = __VLS_20({}, ...__VLS_functionalComponentArgsRest(__VLS_20));
}
/** @type {__VLS_StyleScopedClasses['ac-input-content']} */ ;
/** @type {__VLS_StyleScopedClasses['ac-input-foot']} */ ;
/** @type {__VLS_StyleScopedClasses['ac-input-foot-left']} */ ;
/** @type {__VLS_StyleScopedClasses['ac-input-foot-count']} */ ;
// @ts-ignore
var __VLS_1 = __VLS_0, __VLS_3 = __VLS_2, __VLS_9 = __VLS_8, __VLS_11 = __VLS_10, __VLS_17 = __VLS_16, __VLS_19 = __VLS_18;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Textarea: Textarea,
            Button: Button,
            DisplayType: DisplayType,
            inputValue: inputValue,
            inputClasses: inputClasses,
        };
    },
    emits: {},
    __typeProps: {},
    props: {},
});
const __VLS_component = (await import('vue')).defineComponent({
    setup() {
        return {
            ...__VLS_exposed,
        };
    },
    emits: {},
    __typeProps: {},
    props: {},
});
export default {};
; /* PartiallyEnd: #4569/main.vue */
