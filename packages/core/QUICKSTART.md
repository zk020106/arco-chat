# ArcoDesign-X 快速开始

## 安装

```bash
npm install arco-design-x
```

## 基础用法

```vue
<template>
  <div class="chat-app">
    <!-- 聊天布局 -->
    <Layout>
      <!-- 消息列表 -->
      <template #content>
        <BubbleList
          :list="messages"
          :auto-scroll="true"
          @load-more="loadMore"
        />
      </template>

      <!-- 输入框 -->
      <template #sender>
        <Input v-model="input" :loading="loading" @submit="sendMessage" />
      </template>
    </Layout>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { Layout, BubbleList, Input } from "arco-design-x";

const input = ref("");
const loading = ref(false);
const messages = ref([
  {
    id: "1",
    content: "你好！有什么可以帮助你的吗？",
    align: "start",
    timestamp: Date.now(),
  },
]);

const sendMessage = async message => {
  // 添加用户消息
  messages.value.push({
    id: Date.now().toString(),
    content: message,
    align: "end",
    timestamp: Date.now(),
  });

  // 显示 AI 回复
  loading.value = true;
  const aiMessage = {
    id: (Date.now() + 1).toString(),
    content: "这是 AI 的回复...",
    align: "start",
    timestamp: Date.now(),
    typewriter: true,
    markdown: true,
  };
  messages.value.push(aiMessage);
  loading.value = false;
};

const loadMore = () => {
  // 加载历史消息
  console.log("加载更多消息");
};
</script>

<style>
.chat-app {
  height: 100vh;
}
</style>
```

## 高级功能

### 语音输入

```vue
<Input
  v-model="input"
  :voice-input="{
    enabled: true,
    customRecognition: myVoiceRecognition,
  }"
  @submit="sendMessage"
>
  <template #voice-button="{ state, toggle }">
    <button @click="toggle">
      {{ state === 'recording' ? '🎤' : '🎙️' }}
    </button>
  </template>
</Input>
```

### 指令触发

```vue
<Input
  v-model="input"
  :command-triggers="[
    {
      trigger: '/',
      getSuggestions: () => [
        { text: '清空对话', value: '/clear' },
        { text: '导出记录', value: '/export' },
      ],
    },
  ]"
  @command-trigger="handleCommand"
  @submit="sendMessage"
/>
```

### 消息分组

```vue
<BubbleList :list="messages">
  <template #default="{ message, index }">
    <div v-if="shouldShowGroup(message, index)" class="time-group">
      {{ formatTime(message.timestamp) }}
    </div>
    <Bubble v-bind="message" />
  </template>
</BubbleList>
```

## 完整示例

查看 [AIChatGuide.md](./src/components/AIChatGuide.md) 获取完整的 AI 对话应用搭建指南。

## 组件 API

- [Layout 组件](./src/components/Layout/README.md)
- [BubbleList 组件](./src/components/Bubble/README.md)
- [Input 组件](./src/components/Input/README.md)
