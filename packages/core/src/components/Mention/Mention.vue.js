import { computed, ref, watch } from 'vue';
const props = defineProps();
const emit = defineEmits();
const activeIndex = ref(0);
const items = computed(() => props.items || []);
const searchText = computed(() => props.searchText || '');
const menuStyle = computed(() => {
    // 返回实际样式对象，示例：
    return {};
});
const filteredItems = computed(() => {
    if (!searchText.value) {
        return items.value;
    }
    let query = searchText.value.toLowerCase();
    let prefixStr = '';
    if (Array.isArray(props.prefix)) {
        const first = props.prefix[0];
        prefixStr = typeof first === 'string' ? first : (first && typeof first.key === 'string' ? first.key : '');
    }
    else if (typeof props.prefix === 'string') {
        prefixStr = props.prefix;
    }
    else if (props.prefix && typeof props.prefix.key === 'string') {
        prefixStr = props.prefix.key;
    }
    if (prefixStr) {
        query = query.replace(prefixStr, '');
    }
    return items.value.filter((item) => item.name.toLowerCase().includes(query)
        || (item.description && item.description.toLowerCase().includes(query)));
});
watch(filteredItems, () => {
    activeIndex.value = 0;
});
const handleItemClick = (item) => {
    emit('select', item);
};
const selectActive = () => {
    if (filteredItems.value.length > 0) {
        emit('select', filteredItems.value[activeIndex.value]);
    }
};
const moveSelection = (direction) => {
    if (direction === 'up') {
        activeIndex.value = activeIndex.value <= 0
            ? filteredItems.value.length - 1
            : activeIndex.value - 1;
    }
    else {
        activeIndex.value = activeIndex.value >= filteredItems.value.length - 1
            ? 0
            : activeIndex.value + 1;
    }
};
const __VLS_exposed = {
    selectActive,
    moveSelection,
};
defineExpose(__VLS_exposed);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['ac-mention-item']} */ ;
/** @type {__VLS_StyleScopedClasses['ac-mention-item-avatar']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "ac-mention-host" },
});
var __VLS_0 = {};
if (props.modelValue) {
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "ac-mention-menu" },
        ...{ class: ([props.menuClass]) },
        ...{ style: (__VLS_ctx.menuStyle) },
    });
    // @ts-ignore
    [menuStyle,];
    var __VLS_2 = {};
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "ac-mention-list" },
    });
    for (const [item, index] of __VLS_getVForSourceType((__VLS_ctx.items))) {
        // @ts-ignore
        [items,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ onClick: (...[$event]) => {
                    if (!(props.modelValue))
                        return;
                    __VLS_ctx.handleItemClick(item);
                    // @ts-ignore
                    [handleItemClick,];
                } },
            ...{ onMouseenter: (...[$event]) => {
                    if (!(props.modelValue))
                        return;
                    __VLS_ctx.activeIndex = index;
                    // @ts-ignore
                    [activeIndex,];
                } },
            key: (item.name),
            ...{ class: "ac-mention-item" },
            ...{ class: ({ 'ac-mention-item-active': index === __VLS_ctx.activeIndex }) },
        });
        // @ts-ignore
        [activeIndex,];
        if (item.avatar) {
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
                ...{ class: "ac-mention-item-avatar" },
            });
            __VLS_asFunctionalElement(__VLS_elements.img)({
                src: (item.avatar),
                alt: "avatar",
            });
        }
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "ac-mention-item-info" },
        });
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "ac-mention-item-name" },
        });
        (item.name);
        if (item.description) {
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
                ...{ class: "ac-mention-item-description" },
            });
            (item.description);
        }
    }
    if (__VLS_ctx.items.length === 0) {
        // @ts-ignore
        [items,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "ac-mention-empty" },
        });
        var __VLS_4 = {};
    }
}
/** @type {__VLS_StyleScopedClasses['ac-mention-host']} */ ;
/** @type {__VLS_StyleScopedClasses['ac-mention-menu']} */ ;
/** @type {__VLS_StyleScopedClasses['ac-mention-list']} */ ;
/** @type {__VLS_StyleScopedClasses['ac-mention-item']} */ ;
/** @type {__VLS_StyleScopedClasses['ac-mention-item-active']} */ ;
/** @type {__VLS_StyleScopedClasses['ac-mention-item-avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['ac-mention-item-info']} */ ;
/** @type {__VLS_StyleScopedClasses['ac-mention-item-name']} */ ;
/** @type {__VLS_StyleScopedClasses['ac-mention-item-description']} */ ;
/** @type {__VLS_StyleScopedClasses['ac-mention-empty']} */ ;
// @ts-ignore
var __VLS_1 = __VLS_0, __VLS_3 = __VLS_2, __VLS_5 = __VLS_4;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            activeIndex: activeIndex,
            items: items,
            menuStyle: menuStyle,
            handleItemClick: handleItemClick,
        };
    },
    __typeEmits: {},
    __typeProps: {},
});
const __VLS_component = (await import('vue')).defineComponent({
    setup() {
        return {
            ...__VLS_exposed,
        };
    },
    __typeEmits: {},
    __typeProps: {},
});
export default {};
; /* PartiallyEnd: #4569/main.vue */
