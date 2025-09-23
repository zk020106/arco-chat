# AI 对话应用搭建指南

本指南将展示如何使用 ArcoChat 组件库快速搭建一个完整的 AI 对话应用。

## 组件库概览

ArcoChat 提供了以下核心组件：

- **Layout**: 聊天界面布局组件
- **BubbleList**: 消息列表容器组件
- **Bubble**: 单个消息气泡组件
- **Input**: 智能输入框组件

## 快速开始

### 1. 安装组件库

```bash
npm install @arco-chat/core
# 或
yarn add @arco-chat/core
```

### 2. 基础 AI 对话界面

```vue
<template>
  <div class="ai-chat-app">
    <!-- 聊天布局 -->
    <Layout>
      <!-- 聊天内容区域 -->
      <template #content>
        <BubbleList
          ref="bubbleListRef"
          :list="messages"
          :loading-more="loadingMore"
          :auto-scroll="true"
          @load-more="handleLoadMore"
          @message-click="handleMessageClick"
        />
      </template>

      <!-- 输入区域 -->
      <template #sender>
        <Input
          v-model="userInput"
          :loading="isAIResponding"
          :voice-input="voiceConfig"
          :command-triggers="commandTriggers"
          submit-short-key="enter"
          show-count
          :max-length="1000"
          auto-resize
          :max-rows="4"
          @submit="handleSubmit"
          @voice-result="handleVoiceResult"
          @command-trigger="handleCommandTrigger"
        >
          <!-- 自定义语音按钮 -->
          <template #voice-button="{ state, toggle }">
            <button
              :class="['voice-btn', { recording: state === 'recording' }]"
              @click="toggle"
            >
              {{ state === "recording" ? "🎤" : "🎙️" }}
            </button>
          </template>
        </Input>
      </template>
    </Layout>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { Layout, BubbleList, Input } from "@arco-chat/core";
import type {
  BubbleMessage,
  VoiceInputConfig,
  CommandTrigger,
} from "@arco-chat/core";

// 响应式数据
const userInput = ref("");
const isAIResponding = ref(false);
const loadingMore = ref(false);
const messages = ref<BubbleMessage[]>([]);
const bubbleListRef = ref();

// 语音输入配置
const voiceConfig: VoiceInputConfig = {
  enabled: true,
  buttonPosition: "right",
  customRecognition: {
    start: callbacks => {
      // 集成你的语音识别服务
      // 例如：百度语音、讯飞语音、Azure Speech 等
      console.log("开始语音识别...");

      // 模拟语音识别结果
      setTimeout(() => {
        callbacks.onResult("这是语音识别的结果");
      }, 2000);

      setTimeout(() => {
        callbacks.onEnd();
      }, 3000);
    },
    stop: () => {
      console.log("停止语音识别");
    },
  },
};

// 指令触发配置
const commandTriggers: CommandTrigger[] = [
  {
    trigger: "/",
    showPopup: true,
    popupContent: "AI 指令",
    getSuggestions: (trigger, cursorPosition) => [
      {
        trigger: "/",
        text: "清空对话",
        description: "清空当前对话记录",
        value: "/clear",
      },
      {
        trigger: "/",
        text: "重新生成",
        description: "重新生成最后一条回复",
        value: "/regenerate",
      },
      {
        trigger: "/",
        text: "导出对话",
        description: "导出对话记录",
        value: "/export",
      },
      {
        trigger: "/",
        text: "设置",
        description: "打开设置面板",
        value: "/settings",
      },
    ],
  },
];

// 事件处理
const handleSubmit = async (message: string) => {
  if (!message.trim()) return;

  // 添加用户消息
  const userMessage: BubbleMessage = {
    id: Date.now().toString(),
    content: message,
    align: "end",
    variant: "filled",
    timestamp: Date.now(),
    typewriter: false,
  };

  messages.value.push(userMessage);
  userInput.value = "";

  // 显示 AI 正在思考
  isAIResponding.value = true;
  const aiMessage: BubbleMessage = {
    id: (Date.now() + 1).toString(),
    content: "",
    align: "start",
    variant: "borderless",
    timestamp: Date.now(),
    loading: true,
    typewriter: true,
    markdown: true,
  };

  messages.value.push(aiMessage);

  try {
    // 调用你的 AI API
    const response = await callAIAPI(message);

    // 更新 AI 消息
    const lastMessage = messages.value[messages.value.length - 1];
    lastMessage.loading = false;
    lastMessage.content = response.content;

    // 滚动到底部
    nextTick(() => {
      bubbleListRef.value?.scrollToBottom();
    });
  } catch (error) {
    console.error("AI 响应失败:", error);

    // 显示错误消息
    const lastMessage = messages.value[messages.value.length - 1];
    lastMessage.loading = false;
    lastMessage.content = "抱歉，我遇到了一些问题，请稍后再试。";
    lastMessage.failed = true;
  } finally {
    isAIResponding.value = false;
  }
};

const handleVoiceResult = (result: string, fullText: string) => {
  console.log("语音识别结果:", result);
  // 可以在这里处理语音识别结果
};

const handleCommandTrigger = (
  trigger: CommandTrigger,
  cursorPosition: number
) => {
  console.log("指令触发:", trigger.trigger, cursorPosition);

  // 处理不同的指令
  switch (trigger.trigger) {
    case "/clear":
      messages.value = [];
      break;
    case "/regenerate":
      // 重新生成最后一条 AI 回复
      regenerateLastResponse();
      break;
    case "/export":
      // 导出对话记录
      exportConversation();
      break;
    case "/settings":
      // 打开设置面板
      openSettings();
      break;
  }
};

const handleMessageClick = (message: BubbleMessage, index: number) => {
  console.log("消息点击:", message, index);
  // 可以在这里处理消息点击事件，比如复制、删除等
};

const handleLoadMore = async () => {
  loadingMore.value = true;

  try {
    // 加载历史消息
    const historyMessages = await loadHistoryMessages();
    messages.value.unshift(...historyMessages);
  } catch (error) {
    console.error("加载历史消息失败:", error);
  } finally {
    loadingMore.value = false;
  }
};

// AI API 调用函数（需要根据你的 AI 服务实现）
const callAIAPI = async (message: string) => {
  // 这里集成你的 AI 服务
  // 例如：OpenAI、Claude、文心一言、通义千问等

  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: message,
      history: messages.value.slice(-10), // 只发送最近10条消息作为上下文
    }),
  });

  if (!response.ok) {
    throw new Error("AI API 调用失败");
  }

  return await response.json();
};

// 加载历史消息
const loadHistoryMessages = async () => {
  // 实现历史消息加载逻辑
  return [];
};

// 重新生成最后一条回复
const regenerateLastResponse = () => {
  // 实现重新生成逻辑
};

// 导出对话记录
const exportConversation = () => {
  const conversation = messages.value.map(msg => ({
    role: msg.align === "end" ? "user" : "assistant",
    content: msg.content,
    timestamp: msg.timestamp,
  }));

  const blob = new Blob([JSON.stringify(conversation, null, 2)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `conversation-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

// 打开设置面板
const openSettings = () => {
  // 实现设置面板逻辑
};

onMounted(() => {
  // 初始化聊天应用
  console.log("AI 聊天应用已启动");
});
</script>

<style scoped lang="scss">
.ai-chat-app {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.voice-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background: #f7f8fa;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: all 0.2s ease;

  &:hover {
    background: #e5e6eb;
  }

  &.recording {
    background: #f53f3f;
    color: white;
    animation: pulse 1.5s infinite;
  }
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}
</style>
```

## 高级功能实现

### 1. 流式响应支持

```vue
<script setup>
// 流式响应处理
const handleStreamResponse = async (message: string) => {
  const aiMessage: BubbleMessage = {
    id: Date.now().toString(),
    content: '',
    align: 'start',
    variant: 'borderless',
    timestamp: Date.now(),
    streaming: true,
    typewriter: true,
    markdown: true
  }

  messages.value.push(aiMessage)

  // 使用 Server-Sent Events 或 WebSocket 接收流式数据
  const eventSource = new EventSource(`/api/chat/stream?message=${encodeURIComponent(message)}`)

  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data)
    const lastMessage = messages.value[messages.value.length - 1]

    if (data.type === 'content') {
      lastMessage.content += data.content
    } else if (data.type === 'done') {
      lastMessage.streaming = false
      eventSource.close()
    }
  }

  eventSource.onerror = () => {
    const lastMessage = messages.value[messages.value.length - 1]
    lastMessage.streaming = false
    lastMessage.failed = true
    eventSource.close()
  }
}
</script>
```

### 2. 消息分组显示

```vue
<template>
  <BubbleList :list="messages" @load-more="handleLoadMore">
    <template #default="{ message, index }">
      <!-- 自定义时间分组 -->
      <div v-if="shouldShowTimeGroup(message, index)" class="time-group">
        {{ formatTimeGroup(message.timestamp) }}
      </div>
      <Bubble v-bind="message" />
    </template>
  </BubbleList>
</template>

<script setup>
const shouldShowTimeGroup = (message, index) => {
  if (index === 0) return true;

  const prevMessage = messages.value[index - 1];
  const timeDiff = message.timestamp - prevMessage.timestamp;

  // 5分钟分组
  return timeDiff > 5 * 60 * 1000;
};

const formatTimeGroup = timestamp => {
  const date = new Date(timestamp);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const messageDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  if (messageDate.getTime() === today.getTime()) {
    return `今天 ${date.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}`;
  }

  return date.toLocaleDateString("zh-CN");
};
</script>
```

### 3. 自定义语音识别

```vue
<script setup>
// 集成百度语音识别
const baiduVoiceRecognition = {
  start: callbacks => {
    // 初始化百度语音识别
    const recognition = new BaiduSpeechRecognition({
      appId: "your-app-id",
      apiKey: "your-api-key",
      secretKey: "your-secret-key",
    });

    recognition.onResult = result => {
      callbacks.onResult(result);
    };

    recognition.onEnd = () => {
      callbacks.onEnd();
    };

    recognition.onError = error => {
      callbacks.onError(error.message);
    };

    recognition.start();
  },

  stop: () => {
    // 停止识别
  },
};

// 集成讯飞语音识别
const xunfeiVoiceRecognition = {
  start: callbacks => {
    // 初始化讯飞语音识别
    const recognition = new XunfeiSpeechRecognition({
      appId: "your-app-id",
      apiKey: "your-api-key",
    });

    recognition.onResult = result => {
      callbacks.onResult(result);
    };

    recognition.onEnd = () => {
      callbacks.onEnd();
    };

    recognition.onError = error => {
      callbacks.onError(error.message);
    };

    recognition.start();
  },

  stop: () => {
    // 停止识别
  },
};
</script>
```

## 集成不同的 AI 服务

### OpenAI API

```javascript
const callOpenAI = async message => {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
      stream: true,
    }),
  });

  return response;
};
```

### 文心一言 API

```javascript
const callWenxin = async message => {
  const response = await fetch(
    "https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [{ role: "user", content: message }],
      }),
    }
  );

  return response;
};
```

### 通义千问 API

```javascript
const callQwen = async message => {
  const response = await fetch(
    "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.DASHSCOPE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "qwen-turbo",
        input: {
          messages: [{ role: "user", content: message }],
        },
      }),
    }
  );

  return response;
};
```

## 样式定制

```scss
// 自定义主题
:root {
  --color-primary-6: #165dff;
  --color-bg-1: #ffffff;
  --color-bg-2: #f7f8fa;
  --color-text-1: #1d2129;
  --color-text-2: #4e5969;
  --color-text-3: #86909c;
}

// 深色主题
.dark-theme {
  --color-bg-1: #1d2129;
  --color-bg-2: #2e344e;
  --color-text-1: #ffffff;
  --color-text-2: #c9cdd4;
  --color-text-3: #86909c;
}
```

## 部署建议

1. **前端部署**: 使用 Vercel、Netlify 等静态托管服务
2. **API 代理**: 使用 Next.js API Routes 或 Express.js 代理 AI API 调用
3. **环境变量**: 安全存储 API 密钥
4. **CDN**: 使用 CDN 加速静态资源加载

## 总结

通过 ArcoChat 组件库，你可以快速搭建一个功能完整的 AI 对话应用，包括：

- ✅ 完整的聊天界面布局
- ✅ 智能消息输入（支持语音、指令）
- ✅ 消息列表管理（支持滚动、加载更多）
- ✅ 打字机动画效果
- ✅ Markdown 渲染支持
- ✅ 流式响应支持
- ✅ 高度可定制化

组件库专注于提供优秀的 UI 组件和交互体验，而 AI 服务集成、业务逻辑等由开发者自行实现，确保了最大的灵活性和可扩展性。
