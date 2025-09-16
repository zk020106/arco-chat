<template>
  <div class="ac-bubble" :class="bubbleClasses">
    <div class="ac-bubble-avatar">
      <Avatar v-bind="avatarConfig">
        {{ avatarConfig?.displayName }}
      </Avatar>
    </div>
    <div class="ac-bubble-content-container">
      <slot v-if="!loading" name="top"></slot>
      <div v-if="loading" class="loading-container" :class="[variant]">
        <slot name="loadingTpl">
          <BubbleLoading></BubbleLoading>
        </slot>
      </div>
      <div v-if="!loading" class="ac-bubble-content" :class="[variant]">
        <slot>{{ content }}</slot>
      </div>
      <slot v-if="!loading" name="bottom"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Avatar } from '@arco-design/web-vue'
import type { BubblePropsType } from './bubble-types'
import BubbleLoading from './BubbleLoading.vue'

const props = withDefaults(defineProps<BubblePropsType>(), {
  content: '',
  loading: false,
  align: 'left',
  variant: 'filled',
  avatarConfig: () => ({ size: 36 }),
})
/**
 * top - 气泡顶部区域
 * loadingTpl - 自定义 Loading 样式
 * default - 内容区
 * bottom - 气泡底部区域
 */
const bubbleClasses = computed(() => {
  return [
    `ac-bubble-${props.align}`,
    props.loading ? 'ac-bubble-loading' : '',
  ]
})
</script>

<style scoped lang="scss">
.ac-bubble {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 14px;
  margin-bottom: 8px;

  &.ac-bubble-left {
    flex-direction: row;
  }
  &.ac-bubble-right {
    flex-direction: row-reverse;
  }

  .ac-bubble-avatar {
    flex-shrink: 0;
    display: flex;
    align-items: flex-start;
  }
  .ac-bubble-content-container {
    max-width: 100%;
  }
  .loading-container {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    max-width: 100%;
    &.filled,
    &.bordered {
      padding: 12px 16px;
      border-radius: 12px;
    }
    &.filled {
      background-color: rgb(var(--color-bg-2, #fff));
    }
    &.bordered {
      border: 1px solid var(--color-neutral-2);
      background-color: transparent;
    }
  }
  .ac-bubble-content {
    word-wrap: break-word;
    &.filled,
    &.bordered {
      padding: 12px 16px;
      border-radius: 12px;
    }
    &.filled {
      background-color: var(--color-bg-2, #fff);
    }
    &.bordered {
      border: 1px solid var(--color-neutral-2);
    }
  }
}
// 响应式
@media (max-width: 600px) {
  .ac-bubble-content {
    font-size: 15px;
    padding: 12px 12px;
    max-width: 95vw;
  }
}
</style>
