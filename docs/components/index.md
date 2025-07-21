---
title: 组件演示
---

<script setup>
import { ref } from 'vue'
import Input from '../../packages/core/src/components/Input/Input.vue'
import Bubble from '../../packages/core/src/components/Bubble/Bubble.vue'
import MarkdownCard from '../../packages/core/src/components/MarkdownCard/MarkdownCard.vue'

const inputValue = ref('')
const content = ref(`
<think>这是深度思考</think>
# 快速排序（Quick Sort）

### 介绍
**快速排序（Quick Sort）**：是一种高效的排序算法，它采用分治法（Divide and Conquer）的思想。它的基本思路是：

1. 选择一个基准值（pivot）
2. 将数组分成两部分：小于基准值的部分和大于等于基准值的部分
3. 递归地对这两部分进行排序

### 代码实现

1. 以下是快速排序的实现方法
\`\`\`ts
function quickSort(arr) {
  function quickSort(arr) {
  if (arr.length < 2) {
    return arr;
  }

  const pivot = arr[0];
  const left = [];
  const right = [];

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < pivot) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }

  return [...quickSort(left), pivot, ...quickSort(right)];
}

// 使用示例
const arr = [3, 6, 8, 10, 1, 2, 1];
console.log(quickSort(arr)); // 输出排序后的数组
}
\`\`\`
`);
</script>

# 组件演示

这里可以直接体验和查看各个组件的实际效果。

## Input 输入框

<Input v-model="inputValue" placeholder="请输入内容" />

当前输入：{{ inputValue }}

---

## Bubble 气泡

<Bubble type="sent" avatar="/avatar.png">你好！</Bubble>

<Bubble type="received" :loading="true">对方正在输入...</Bubble>

<Bubble type="sent" :failed="true">消息发送失败</Bubble>

---

## MarkdownCard

<MarkdownCard content="# 标题<br>正文内容" />

<MarkdownCard :content="content" />

<!-- <MarkdownCard content="<think>思考：这是一条提示信息</think>" />  -->