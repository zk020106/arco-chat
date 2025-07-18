import { computed, inject, nextTick } from 'vue';
import { DisplayType, SubmitShortKey, inputInjectionKey } from '../input-types';
const { inputValue, rootProps, rootEmits } = inject(inputInjectionKey);
const placeholder = computed(() => {
    let enterKey = '';
    let shiftEnterKey = '';
    if (rootProps.submitShortKey === SubmitShortKey.Enter) {
        enterKey = 'Enter';
        shiftEnterKey = 'Shift + Enter';
    }
    if (rootProps.submitShortKey === SubmitShortKey.ShiftEnter) {
        enterKey = 'Shift + Enter';
        shiftEnterKey = 'Enter';
    }
    return (rootProps.placeholder
        ?? (enterKey ? `请输入您的问题，并按${enterKey}发送，按${shiftEnterKey}换行` : '请输入您的问题...'));
});
let lock = false;
const emitChange = () => {
    nextTick(() => {
        rootEmits('change', inputValue.value);
    });
};
const onInput = () => {
    if (!lock) {
        emitChange();
    }
};
const onCompositionStart = () => {
    lock = true;
};
const onCompositionEnd = () => {
    lock = false;
    emitChange();
};
const onKeydown = (e) => {
    if (rootProps.submitShortKey === null) {
        return;
    }
    const shiftKey = rootProps.submitShortKey === SubmitShortKey.Enter
        ? !e.shiftKey
        : rootProps.submitShortKey === SubmitShortKey.ShiftEnter
            ? e.shiftKey
            : false;
    if (shiftKey && e.key === 'Enter' && !lock) {
        e.preventDefault();
        rootEmits('submit', inputValue.value);
        inputValue.value = '';
        rootEmits('change', inputValue.value);
    }
};
const onFocus = (e) => {
    rootEmits('focus', e);
};
const onBlur = (e) => {
    rootEmits('blur', e);
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['ac-textarea']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_elements.textarea, __VLS_elements.textarea)({
    ...{ onInput: (__VLS_ctx.onInput) },
    ...{ onCompositionstart: (__VLS_ctx.onCompositionStart) },
    ...{ onCompositionend: (__VLS_ctx.onCompositionEnd) },
    ...{ onKeydown: (__VLS_ctx.onKeydown) },
    ...{ onFocus: (__VLS_ctx.onFocus) },
    ...{ onBlur: (__VLS_ctx.onBlur) },
    value: (__VLS_ctx.inputValue),
    placeholder: (__VLS_ctx.placeholder),
    disabled: (__VLS_ctx.rootProps.disabled),
    maxlength: (__VLS_ctx.rootProps.maxLength),
    ...{ class: "ac-textarea" },
    ...{ class: ([
            { 'ac-textarea-simple': __VLS_ctx.rootProps.displayType === __VLS_ctx.DisplayType.Simple, 'ac-textarea-disabled': __VLS_ctx.rootProps.disabled },
        ]) },
});
// @ts-ignore
[onInput, onCompositionStart, onCompositionEnd, onKeydown, onFocus, onBlur, inputValue, placeholder, rootProps, rootProps, rootProps, rootProps, DisplayType,];
/** @type {__VLS_StyleScopedClasses['ac-textarea']} */ ;
/** @type {__VLS_StyleScopedClasses['ac-textarea-simple']} */ ;
/** @type {__VLS_StyleScopedClasses['ac-textarea-disabled']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            DisplayType: DisplayType,
            inputValue: inputValue,
            rootProps: rootProps,
            placeholder: placeholder,
            onInput: onInput,
            onCompositionStart: onCompositionStart,
            onCompositionEnd: onCompositionEnd,
            onKeydown: onKeydown,
            onFocus: onFocus,
            onBlur: onBlur,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
