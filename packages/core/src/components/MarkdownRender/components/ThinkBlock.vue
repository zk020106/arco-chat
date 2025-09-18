<template>
  <div class="ac-think-block">
    <div class="ac-think-header">
      <span class="ac-think-title">
        <icon-bulb /> 深度思考
      </span>
      <a-button type="text" size="small" @click="toggleFold">
        <icon-down v-if="folded" />
        <icon-up v-else />
      </a-button>
    </div>
    <transition name="fade">
      <div v-show="!folded" class="ac-think-content">
        <slot />
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { Button as AButton } from '@arco-design/web-vue'
import { IconDown, IconUp, IconBulb } from '@arco-design/web-vue/es/icon'

const folded = ref(false)
function toggleFold() {
  folded.value = !folded.value
}
</script>

<style lang="scss" scoped>
.ac-think-block {
  background: rgb(var(--color-fill-1));
  border-left: 4px solid rgb(var(--primary-6));
  border-radius: var(--border-radius-medium);
  margin: 12px 0;
  color: rgb(var(--color-text-2));
  font-style: italic;
  padding: 0;
}
.ac-think-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px 0 16px;
}
.ac-think-title {
  font-size: 15px;
  color: rgb(var(--primary-6),gray);
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 4px;
}
.ac-think-content {
  padding: 12px 16px 16px 16px;
  font-size: 12px;
  color: rgb(var(--color-text-3));
  font-style: normal;
  max-height: 400px;
  overflow-y: auto;
}

.ac-think-block, .ac-think-content {
  display: block;
  overflow: visible;
  height: auto;
  max-height: none;
  position: static;
  z-index: auto;
  font-size: 12px;
  color: #8b8b8b;
}
</style>
