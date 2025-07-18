<template>
  <div class="ac-content">
    <slot></slot>
  </div>
</template>

<script setup>
// Content component for the main chat content area
</script>

<style scoped lang="scss">
.ac-content {
  height: 100%;
  width: 100%;
  overflow-y: auto;
  padding: 0;
  background-color: var(--color-bg-1);
}
</style>
