<template>
  <div class="ac-bubble-loading">
    <div class="loading-dot dot-start"></div>
    <div class="loading-dot dot-middle"></div>
    <div class="loading-dot dot-end"></div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.ac-bubble-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  height: 100%;

  .loading-dot {
    width: 8px;
    height: 8px;
    border-radius: 5px;
    background-color: #9880ff;

    &.dot-start {
      animation: dotFlashing 1s infinite linear alternate;
      animation-delay: 0s;
    }

    &.dot-middle {
      animation: dotFlashing 1s infinite linear alternate;
      animation-delay: 0.5s;
    }

    &.dot-end {
      animation: dotFlashing 1s infinite linear alternate;
      animation-delay: 1s;
    }
  }
}

@keyframes dotFlashing {
  0% {
    background-color: #9880ff;
  }
  100% {
    background-color: #ebe6ff;
  }
}
</style>
