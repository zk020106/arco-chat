<template>
  <div class="ac-aside">
    <slot></slot>
  </div>
</template>

<script setup>
// Aside component for sidebar content
</script>

<style scoped lang="scss">
.ac-aside {
  height: 100%;
  width: 100%;
  overflow-y: auto;
  background-color: var(--color-bg-2);
}
</style>
