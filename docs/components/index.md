---
title: 组件演示
---

<script setup>
import { ref } from 'vue'
import Input from '../../packages/core/src/components/Input/Input.vue'
import Bubble from '../../packages/core/src/components/Bubble/Bubble.vue'
import MarkdownCard from '../../packages/core/src/components/MarkdownCard/MarkdownCard.vue'

const inputValue = ref('')
const content = `
<think>
嗯，用户让我帮他写一个快速排序。我得先回想一下快速排序的原理。快速排序是分治算法的一种，基本步骤是选一个基准元素，然后把数组分成两部分，一部分比基准小，另一部分比基准大，然后递归地对这两部分排序。

</think>

以下是使用 Python 实现的快速排序算法，包含详细注释：

\`\`\`python
    print("排序后：", sorted_arr)
\`\`\`
`
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

<MarkdownCard content="# 标题\n正文内容" />

<MarkdownCard :content="content" />

<!-- <MarkdownCard content="<think>思考：这是一条提示信息</think>" />  -->