import { computed, inject, reactive, ref } from 'vue';
import { SendBtnVariant, inputInjectionKey } from '../input-types';
import LoadingIcon from './LoadingIcon.vue';
import SendIcon from './SendIcon.vue';
const { inputValue, rootProps, rootEmits } = inject(inputInjectionKey);
const isMouseDown = ref(false);
const showWave = ref(false);
const waveStyle = reactive({
    top: '0px',
    left: '0px',
});
const buttonClasses = computed(() => ({
    'ac-button': true,
    'ac-button-loading': rootProps.loading,
    'mousedown': isMouseDown.value,
    'ac-button-simple': rootProps.sendBtnVariant === SendBtnVariant.Simple,
}));
const showClickWave = (e) => {
    waveStyle.left = `${e.offsetX}px`;
    waveStyle.top = `${e.offsetY}px`;
    showWave.value = true;
    setTimeout(() => {
        showWave.value = false;
    }, 300);
};
const onConfirm = (e) => {
    showClickWave(e);
    if (rootProps.loading) {
        rootEmits('cancel');
    }
    else {
        rootEmits('submit', inputValue.value);
        inputValue.value = '';
        rootEmits('change', inputValue.value);
    }
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (__VLS_ctx.onConfirm) },
    ...{ onMousedown: (() => (__VLS_ctx.isMouseDown = true)) },
    ...{ onMouseup: (() => (__VLS_ctx.isMouseDown = false)) },
    disabled: (__VLS_ctx.rootProps.disabled || (!__VLS_ctx.rootProps.loading && !__VLS_ctx.inputValue)),
    ...{ class: (__VLS_ctx.buttonClasses) },
});
// @ts-ignore
[onConfirm, isMouseDown, isMouseDown, rootProps, rootProps, inputValue, buttonClasses,];
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "ac-button-content" },
});
if (__VLS_ctx.rootProps.loading) {
    // @ts-ignore
    [rootProps,];
    /** @type {[typeof LoadingIcon, ]} */ ;
    // @ts-ignore
    const __VLS_0 = __VLS_asFunctionalComponent(LoadingIcon, new LoadingIcon({}));
    const __VLS_1 = __VLS_0({}, ...__VLS_functionalComponentArgsRest(__VLS_0));
}
else {
    /** @type {[typeof SendIcon, ]} */ ;
    // @ts-ignore
    const __VLS_4 = __VLS_asFunctionalComponent(SendIcon, new SendIcon({}));
    const __VLS_5 = __VLS_4({}, ...__VLS_functionalComponentArgsRest(__VLS_4));
}
if (__VLS_ctx.rootProps.sendBtnVariant === __VLS_ctx.SendBtnVariant.Full) {
    // @ts-ignore
    [rootProps, SendBtnVariant,];
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "ac-button-content-text" },
    });
    (__VLS_ctx.rootProps.loading ? '停止回答' : '发送');
    // @ts-ignore
    [rootProps,];
}
if (__VLS_ctx.showWave) {
    // @ts-ignore
    [showWave,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ style: (__VLS_ctx.waveStyle) },
    });
    // @ts-ignore
    [waveStyle,];
}
/** @type {__VLS_StyleScopedClasses['ac-button-content']} */ ;
/** @type {__VLS_StyleScopedClasses['ac-button-content-text']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            SendBtnVariant: SendBtnVariant,
            LoadingIcon: LoadingIcon,
            SendIcon: SendIcon,
            inputValue: inputValue,
            rootProps: rootProps,
            isMouseDown: isMouseDown,
            showWave: showWave,
            waveStyle: waveStyle,
            buttonClasses: buttonClasses,
            onConfirm: onConfirm,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
