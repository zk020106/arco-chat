---
title: 组件演示
---

<script setup>
import { ref } from 'vue'
import Input from '../../packages/core/src/components/Input/Input.vue'
import Bubble from '../../packages/core/src/components/Bubble/Bubble.vue'
import MarkdownCard from '../../packages/core/src/components/MarkdownCard/MarkdownCard.vue'

const inputValue = ref('')
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

<MarkdownCard content="```js\nconsole.log('Hello')\n```" />

<MarkdownCard content="<think>思考：这是一条提示信息</think>" /> 