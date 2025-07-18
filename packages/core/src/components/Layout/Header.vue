<template>
  <div class="ac-header">
    <slot></slot>
  </div>
</template>

<script setup>
// Header component for the top navigation/title bar
</script>

<style scoped lang="scss">
.ac-header {
  height: 60px;
  width: 100%;
  padding: 0 16px;
  display: flex;
  align-items: center;
  background-color: var(--color-bg-2);
  font-weight: 600;
  font-size: 16px;
}
</style>
