# Arco-Chat
参考以及复制[MateChat](https://matechat.gitcode.com/) 项目用Arco Design Vue 组件库进行改造 如有侵犯 请联系我

基于 Vue3 + Arco Design 的高质量聊天/输入/气泡等组件库。

## 安装

```bash
npm install arco-chat
# 或
pnpm add arco-chat
```

## 依赖
- vue >= 3.0.0
- @arco-design/web-vue >= 2.0.0

## 使用

### 全局注册
```ts
import { createApp } from 'vue';
import ArcoVue from '@arco-design/web-vue';
import * as AcArcoChat from 'arco-chat';
import 'arco-chat/dist/style.css';

const app = createApp(App);
app.use(ArcoVue);
app.component('ac-bubble', AcArcoChat.AcBubble);
app.component('ac-input', AcArcoChat.AcInput);
// ... 其他组件
```

### 按需引入
```ts
import { AcInput } from 'arco-chat';
```

### 示例
```vue
<template>
  <ac-input v-model="msg" placeholder="请输入..." />
</template>
<script setup>
import { ref } from 'vue';
const msg = ref('');
</script>
```

## 组件列表
- ac-bubble
- ac-input
- ac-mention
- ac-prompt
- ac-layout
- ac-md-card

## License
MIT
