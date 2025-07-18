<template>
  <div class="ac-mention-host">
    <slot /> <!-- default 插槽：自定义宿主元素 -->
    <div v-if="props.modelValue" class="ac-mention-menu" :class="[props.menuClass]" :style="menuStyle">
      <slot name="menu">
        <!-- 默认弹出框内容，兼容 items/activeIndex 逻辑 -->
        <div class="ac-mention-list">
          <div
            v-for="(item, index) in items"
            :key="item.name"
            class="ac-mention-item"
            :class="{ 'ac-mention-item-active': index === activeIndex }"
            @click="handleItemClick(item)"
            @mouseenter="activeIndex = index"
          >
            <div v-if="item.avatar" class="ac-mention-item-avatar">
              <img :src="item.avatar" alt="avatar" />
            </div>
            <div class="ac-mention-item-info">
              <div class="ac-mention-item-name">{{ item.name }}</div>
              <div v-if="item.description" class="ac-mention-item-description">{{ item.description }}</div>
            </div>
          </div>
          <div v-if="items.length === 0" class="ac-mention-empty">
            <slot name="empty">暂无匹配项</slot>
          </div>
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { CSSProperties } from 'vue'
import type { MentionItem, Prefix, SearchChangeEvent } from './mention-types'

interface MentionProps {
  /** 控制组件是否显示 */
  modelValue: boolean
  /** 触发组件的前缀符 */
  prefix?: Prefix
  /** 是否和宿主元素宽度保持一致 */
  fitHostWidth?: boolean
  /** 自定义弹出框样式 */
  menuClass?: string
  /** 菜单项列表 */
  items?: MentionItem[]
  /** 搜索文本 */
  searchText?: string
}

const props = defineProps<MentionProps>()
const emit = defineEmits<{
  (e: 'searchChange', event: SearchChangeEvent): void
  (e: 'toggleChange', open: boolean): void
  (e: 'select', item: MentionItem): void
}>()

const activeIndex = ref(0)
const items = computed(() => props.items || [])
const searchText = computed(() => props.searchText || '')
const menuStyle = computed<CSSProperties>(() => {
  // 返回实际样式对象，示例：
  return {}
})

const filteredItems = computed(() => {
  if (!searchText.value) {
    return items.value
  }
  let query = searchText.value.toLowerCase()
  let prefixStr = ''
  if (Array.isArray(props.prefix)) {
    const first = props.prefix[0]
    prefixStr = typeof first === 'string' ? first : (first && typeof first.key === 'string' ? first.key : '')
  } else if (typeof props.prefix === 'string') {
    prefixStr = props.prefix
  } else if (props.prefix && typeof (props.prefix as any).key === 'string') {
    prefixStr = (props.prefix as any).key
  }
  if (prefixStr) {
    query = query.replace(prefixStr, '')
  }
  return items.value.filter((item) =>
    item.name.toLowerCase().includes(query)
    || (item.description && item.description.toLowerCase().includes(query)),
  )
})

watch(filteredItems, () => {
  activeIndex.value = 0
})

const handleItemClick = (item: MentionItem) => {
  emit('select', item)
}

const selectActive = () => {
  if (filteredItems.value.length > 0) {
    emit('select', filteredItems.value[activeIndex.value])
  }
}

const moveSelection = (direction: 'up' | 'down') => {
  if (direction === 'up') {
    activeIndex.value = activeIndex.value <= 0
      ? filteredItems.value.length - 1
      : activeIndex.value - 1
  } else {
    activeIndex.value = activeIndex.value >= filteredItems.value.length - 1
      ? 0
      : activeIndex.value + 1
  }
}

defineExpose({
  selectActive,
  moveSelection,
})
</script>

<style scoped lang="scss">
/* mention 组件外层容器 */
.ac-mention {
  width: 100%;
  border: 1px solid var(--color-border-2); /* 边框 */
  border-radius: var(--border-radius-medium); /* 圆角 */
  background-color: var(--color-bg-2); /* 背景色 */
  box-shadow: var(--shadow-secondary); /* 阴影 */
}

/* mention 列表区域 */
.ac-mention-list {
  max-height: 250px;
  overflow-y: auto;
}

/* mention 列表项 */
.ac-mention-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  cursor: pointer;
}

/* mention 列表项 hover/激活态 */
.ac-mention-item:hover,
.ac-mention-item-active {
  background-color: var(--color-fill-2);
}

/* 头像区域 */
.ac-mention-item-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 8px;
}

.ac-mention-item-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 信息区域 */
.ac-mention-item-info {
  flex: 1;
}

/* 名称 */
.ac-mention-item-name {
  font-size: var(--font-size-body-medium);
  color: var(--color-text-1);
}

/* 描述 */
.ac-mention-item-description {
  font-size: var(--font-size-body-small);
  color: var(--color-text-3);
}

/* 空状态 */
.ac-mention-empty {
  padding: 12px;
  text-align: center;
  color: var(--color-text-3);
}
</style>
