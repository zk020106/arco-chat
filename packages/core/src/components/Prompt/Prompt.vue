<template>
  <div class="ac-prompt" :class="[`ac-prompt-${variantClass}`, `ac-prompt-dir-${directionClass}`]">
    <div v-if="title || $slots.header" class="ac-prompt-header">
      <slot name="header">{{ title }}</slot>
    </div>
    <div class="ac-prompt-list">
      <div
        v-for="(item, index) in list"
        :key="item.value"
        class="ac-prompt-item"
        :class="{ 'ac-prompt-item-active': index === activeIndex }"
        @click="handleItemClick(item)"
      >
        <span v-if="item.iconConfig" class="ac-prompt-item-icon">
          <component :is="item.iconConfig.component" v-if="item.iconConfig.component" :style="iconStyle(item.iconConfig)" />
          <i v-else :class="item.iconConfig.name" :style="iconStyle(item.iconConfig)" />
        </span>
        <div class="ac-prompt-item-content-wrap">
          <div class="ac-prompt-item-title">{{ item.label }}</div>
          <div v-if="item.desc" class="ac-prompt-item-content">{{ item.desc }}</div>
        </div>
      </div>
      <div v-if="list.length === 0" class="ac-prompt-empty">
        <slot name="empty">暂无可用提示</slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PromptItem, PromptProps } from './prompt-types'
import { ListDirection, ListVariant } from './prompt-types'

const props = withDefaults(defineProps<PromptProps>(), {
  direction: ListDirection.Vertical,
  list: () => [],
  variant: ListVariant.Filled,
  title: '',
  onItemClick: undefined,
})

/**
 * Prompt 组件支持的事件
 * @event item-click - 点击提示项
 */
const emit = defineEmits<(e: 'item-click', item: PromptItem) => void>()

const activeIndex = ref(-1)

const directionClass = computed(() => props.direction ?? 'vertical')
const variantClass = computed(() => props.variant ?? 'filled')

function iconStyle(icon: any) {
  return {
    fontSize: icon.size || '20px',
    color: icon.color || 'var(--color-primary, #165dff)',
  }
}

const handleItemClick = (item: PromptItem) => {
  emit('item-click', item)
}
</script>

<style scoped lang="scss">
/* prompt 组件外层容器 */
.ac-prompt {
  width: 100%;
  padding: 0;
}

/* 标题区域 */
.ac-prompt-header {
  font-weight: 500;
  padding: 8px 0;
  margin-bottom: 8px;
  color: var(--color-text-1);
  border-bottom: 1px solid var(--color-border-2);
}

/* 列表区域 */
.ac-prompt-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ac-prompt-dir-horizontal .ac-prompt-list {
  flex-direction: row;
  gap: 16px;
}

/* 列表项 */
.ac-prompt-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-radius: var(--border-radius-medium, 10px);
  background-color: var(--color-fill-2, #f7f8fa);
  cursor: pointer;
  transition: background-color 0.2s, box-shadow 0.2s, border 0.2s;
  border: none;
}

.ac-prompt-filled .ac-prompt-item {
  background-color: var(--color-fill-2, #f7f8fa);
}
.ac-prompt-bordered .ac-prompt-item {
  background-color: var(--color-bg-2, #fff);
  border: 1px solid var(--color-border, #e5e6eb);
}
.ac-prompt-transparent .ac-prompt-item {
  background-color: transparent;
  border: none;
  box-shadow: none;
}
.ac-prompt-none .ac-prompt-item {
  background-color: transparent;
  border: none;
  box-shadow: none;
}

/* 列表项 hover */
.ac-prompt-item:hover {
  background-color: var(--color-primary-light-1, #e8f3ff);
}

/* 列表项激活状态 */
.ac-prompt-item-active {
  box-shadow: 0 0 0 2px var(--color-primary-light-2, rgba(22,93,255,0.08));
}

/* 列表项图标 */
.ac-prompt-item-icon {
  margin-right: 12px;
  display: flex;
  align-items: center;
}

/* 列表项内容容器 */
.ac-prompt-item-content-wrap {
  display: flex;
  flex-direction: column;
}

/* 列表项标题 */
.ac-prompt-item-title {
  font-weight: 500;
  margin-bottom: 2px;
  color: var(--color-text-1, #1d2129);
  font-size: 16px;
}

/* 列表项内容 */
.ac-prompt-item-content {
  color: var(--color-text-3, #888);
  font-size: 14px;
}

/* 空状态 */
.ac-prompt-empty {
  color: var(--color-text-3, #888);
  text-align: center;
  padding: 16px 0;
}
</style>
