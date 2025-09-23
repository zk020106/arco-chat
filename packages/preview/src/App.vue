<template>
  <div class="app">
    <Layout
      :aside-width="asideWidth"
      :collapsed="asideCollapsed"
      :header-height="headerHeight"
      :content-height="contentHeight"
      :sender-height="senderHeight"
    >
      <!-- 侧边栏 -->
      <template #aside>
        <div class="conversation-sidebar">
          <!-- 新建对话按钮 -->
          <div class="sidebar-header">
            <a-button
              type="primary"
              long
              @click="handleNewConversation"
              class="new-chat-btn"
            >
              <template #icon>
                <icon-plus />
              </template>
              新建对话
            </a-button>
          </div>

          <!-- 对话列表 -->
          <div class="conversation-list">
            <div
              v-for="conversation in conversations"
              :key="conversation.id"
              :class="[
                'conversation-item',
                { active: conversation.id === currentConversationId },
              ]"
              @click="handleSelectConversation(conversation.id)"
            >
              <div class="conversation-content">
                <div class="conversation-title">{{ conversation.title }}</div>
                <div class="conversation-preview">
                  {{ conversation.lastMessage || "暂无消息" }}
                </div>
                <div class="conversation-time">
                  {{ formatTime(conversation.timestamp) }}
                </div>
              </div>
              <div class="conversation-actions">
                <a-button
                  type="text"
                  size="mini"
                  @click.stop="handleDeleteConversation(conversation.id)"
                  class="delete-btn"
                >
                  <template #icon>
                    <icon-delete />
                  </template>
                </a-button>
                <a-badge
                  v-if="conversation.unread > 0"
                  :count="conversation.unread"
                  class="unread-badge"
                />
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- 头部 -->
      <template #header>
        <div class="chat-header">
          <div class="header-left">
            <a-button
              type="text"
              @click="toggleAside"
              class="menu-btn mobile-only"
            >
              <template #icon>
                <icon-menu />
              </template>
            </a-button>
            <div class="conversation-info">
              <h3>{{ currentConversation?.title || "选择对话" }}</h3>
              <span v-if="currentConversation" class="conversation-subtitle">
                {{ currentMessages.length }} 条消息
              </span>
            </div>
          </div>
        </div>
      </template>

      <!-- 主内容区 -->
      <template #content>
        <div class="chat-content">
          <BubbleList
            :list="currentMessages"
            :loading="loading"
            :reverse="false"
            :show-load-more="true"
            :load-more-text="'加载更多消息'"
            @load-more="handleLoadMore"
            @message-click="handleMessageClick"
          >
          </BubbleList>

          <!-- 加载状态 -->
          <div v-if="loading" class="loading-indicator">
            <a-spin :size="16" />
            <span>AI 正在思考中...</span>
          </div>
        </div>
      </template>

      <!-- 输入区 -->
      <template #sender>
        <!-- Markdown 测试工具栏 -->
        <MarkdownTestToolbar
          @add-message="handleAddMessage"
          @clear-all="handleClearAllMessages"
        />

        <div class="input-container">
          <Input
            v-model="inputValue"
            :disabled="loading"
            :placeholder="
              loading ? 'AI 正在回复中...' : '输入消息，按 Enter 发送'
            "
            :allow-speech="true"
            :clearable="true"
            @submit="handleSendMessage"
            @voice-input="handleVoiceInput"
            class="chat-input"
          />
        </div>
      </template>
    </Layout>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { Layout, BubbleList, Input } from "arco-design-x";
import { IconMenu, IconDelete, IconPlus } from "@arco-design/web-vue/es/icon";
import type { BubbleMessage } from "arco-design-x";
import MarkdownTestToolbar from "./components/MarkdownTestToolbar.vue";

// 响应式布局配置
const asideWidth = ref("280px");
const asideCollapsed = ref(false);
const headerHeight = ref("8vh");
const contentHeight = ref("70vh");
const senderHeight = ref("22vh");

// 打字机效果开关
const typewriterEnabled = ref(true);

// 数据状态
const conversations = ref([
  {
    id: "1",
    title: "新对话",
    lastMessage: "你好，有什么可以帮助你的吗？",
    timestamp: new Date(),
    unread: 0,
  },
  {
    id: "2",
    title: "Vue 3 开发讨论",
    lastMessage: "Vue 3 的 Composition API 真的很好用",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    unread: 2,
  },
  {
    id: "3",
    title: "TypeScript 学习",
    lastMessage: "TypeScript 的类型系统很强大",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    unread: 0,
  },
]);

const currentConversationId = ref("1");
const loading = ref(false);
const inputValue = ref("");

// 模拟消息数据
const messagesData = ref<Record<string, BubbleMessage[]>>({
  "1": [
    {
      id: "1-1",
      content:
        "你好！欢迎使用 Arco Chat 组件库预览。这是一个功能完整的聊天界面演示。",
      align: "start",
      variant: "filled",
      timestamp: Date.now() - 1000 * 60 * 5,
      avatarConfig: {
        imageUrl:
          "https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp",
        displayName: "AI助手",
      },
    },
    {
      id: "1-2",
      content: "你可以尝试发送消息，体验各种功能特性。",
      align: "start",
      variant: "filled",
      timestamp: Date.now() - 1000 * 60 * 4,
      avatarConfig: {
        imageUrl:
          "https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp",
        displayName: "AI助手",
      },
    },
  ],
  "2": [
    {
      id: "2-1",
      content: "Vue 3 的 Composition API 相比 Options API 有什么优势？",
      align: "end",
      variant: "outlined",
      timestamp: Date.now() - 1000 * 60 * 30,
      avatarConfig: {
        imageUrl:
          "https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp",
        displayName: "用户",
      },
    },
    {
      id: "2-2",
      content:
        "Composition API 的主要优势包括：\n\n1. **更好的逻辑复用** - 可以将相关逻辑组织在一起\n2. **更好的类型推导** - TypeScript 支持更完善\n3. **更灵活的代码组织** - 不受组件选项限制\n4. **更好的 tree-shaking** - 未使用的功能不会打包",
      align: "start",
      variant: "filled",
      timestamp: Date.now() - 1000 * 60 * 29,
      avatarConfig: {
        imageUrl:
          "https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp",
        displayName: "AI助手",
      },
      markdown: true,
    },
  ],
  "3": [
    {
      id: "3-1",
      content: "TypeScript 的类型系统有哪些特点？",
      align: "end",
      variant: "outlined",
      timestamp: Date.now() - 1000 * 60 * 60 * 2,
      avatarConfig: {
        imageUrl:
          "https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp",
        displayName: "用户",
      },
    },
    {
      id: "3-2",
      content:
        "TypeScript 的类型系统特点：\n\n- **静态类型检查** - 编译时发现错误\n- **类型推导** - 自动推断变量类型\n- **接口和类型别名** - 定义复杂数据结构\n- **泛型** - 编写可重用的类型安全代码\n- **联合类型和交叉类型** - 灵活的类型组合",
      align: "start",
      variant: "filled",
      timestamp: Date.now() - 1000 * 60 * 60 * 2 + 1000 * 60,
      avatarConfig: {
        imageUrl:
          "https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp",
        displayName: "AI助手",
      },
      markdown: true,
    },
  ],
});

// 计算属性
const currentConversation = computed(() =>
  conversations.value.find(c => c.id === currentConversationId.value)
);

const currentMessages = computed(
  () => messagesData.value[currentConversationId.value] || []
);

// 方法
const toggleAside = () => {
  asideCollapsed.value = !asideCollapsed.value;
  asideWidth.value = asideCollapsed.value ? "0px" : "280px";
};

const handleSelectConversation = (conversationId: string) => {
  currentConversationId.value = conversationId;
  // 清除未读消息
  const conversation = conversations.value.find(c => c.id === conversationId);
  if (conversation) {
    conversation.unread = 0;
  }
};

const handleNewConversation = () => {
  const newId = Date.now().toString();
  conversations.value.unshift({
    id: newId,
    title: "新对话",
    lastMessage: "",
    timestamp: new Date(),
    unread: 0,
  });
  messagesData.value[newId] = [];
  currentConversationId.value = newId;
};

const handleDeleteConversation = (conversationId: string) => {
  const index = conversations.value.findIndex(c => c.id === conversationId);
  if (index > -1) {
    conversations.value.splice(index, 1);
    delete messagesData.value[conversationId];
    if (currentConversationId.value === conversationId) {
      currentConversationId.value = conversations.value[0]?.id || "";
    }
  }
};

const handleLoadMore = () => {
  // 模拟加载更多消息
  console.log("加载更多消息...");
};

const handleSendMessage = async (content: string) => {
  const messageContent = content || inputValue.value;
  if (!messageContent.trim()) return;

  // 清空输入框
  inputValue.value = "";

  const userMessage: BubbleMessage = {
    id: `user-${Date.now()}`,
    content: messageContent.trim(),
    align: "end",
    variant: "outlined",
    timestamp: Date.now(),
    avatarConfig: {
      imageUrl:
        "https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp",
      displayName: "用户",
    },
  };

  // 添加用户消息
  messagesData.value[currentConversationId.value].push(userMessage);

  // 更新对话的最后消息
  const conversation = conversations.value.find(
    c => c.id === currentConversationId.value
  );
  if (conversation) {
    conversation.lastMessage = messageContent.trim();
    conversation.timestamp = new Date();
  }

  // 模拟AI回复
  loading.value = true;
  setTimeout(() => {
    // 深度思考内容示例
    const deepThoughtContent = `这是一个深度思考的示例内容：
    
**问题分析**：
- 用户询问了关于 "${messageContent.trim()}" 的问题
- 这个问题涉及多个层面的思考

**解决思路**：
1. 首先需要理解问题的核心要点
2. 然后分析可能的解决方案
3. 最后给出最优建议

**结论**：
通过以上分析，我们可以得出一个全面且深入的解答。`;

    const aiMessage: BubbleMessage = {
      id: `ai-${Date.now()}`,
      content: typewriterEnabled.value
        ? `我收到了你的消息："${messageContent.trim()}"。这是一个模拟的AI回复，展示了聊天界面的各种功能。\n\n${deepThoughtContent}`
        : `我收到了你的消息："${messageContent.trim()}"。这是一个模拟的AI回复，展示了聊天界面的各种功能。`,
      align: "start",
      variant: "filled",
      timestamp: Date.now(),
      avatarConfig: {
        imageUrl:
          "https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp",
        displayName: "AI助手",
      },
      typewriter: typewriterEnabled.value,
      typewriterConfig: {
        speed: 50,
      },
      markdown: typewriterEnabled.value,
    };

    messagesData.value[currentConversationId.value].push(aiMessage);
    loading.value = false;

    // 更新对话的最后消息
    if (conversation) {
      conversation.lastMessage = aiMessage.content;
      conversation.timestamp = new Date();
    }
  }, 1000);
};

const handleVoiceInput = (audioData: any) => {
  console.log("语音输入:", audioData);
  // 这里可以处理语音输入逻辑
};

const handleMessageClick = (message: BubbleMessage, index: number) => {
  console.log("点击消息:", message, index);
};

const handleAddMessage = (message: BubbleMessage) => {
  // 添加消息到当前对话
  messagesData.value[currentConversationId.value].push(message);

  // 更新对话的最后消息
  const conversation = conversations.value.find(
    c => c.id === currentConversationId.value
  );
  if (conversation) {
    conversation.lastMessage = message.content;
    conversation.timestamp = new Date();
  }
};

const handleClearAllMessages = () => {
  // 清空当前对话的所有消息
  messagesData.value[currentConversationId.value] = [];

  // 更新对话的最后消息
  const conversation = conversations.value.find(
    c => c.id === currentConversationId.value
  );
  if (conversation) {
    conversation.lastMessage = "";
    conversation.timestamp = new Date();
  }
};

const formatTime = (timestamp: Date) => {
  const now = new Date();
  const diff = now.getTime() - timestamp.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return "刚刚";
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;
  return timestamp.toLocaleDateString();
};

// 监听窗口大小变化
const handleResize = () => {
  if (window.innerWidth < 768) {
    asideCollapsed.value = true;
    asideWidth.value = "0px";
  } else {
    asideCollapsed.value = false;
    asideWidth.value = "280px";
  }
};

// 组件挂载时添加监听器
onMounted(() => {
  handleResize();
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<style scoped lang="scss">
.app {
  height: 100vh;
  width: 100vw;
  background: #f5f5f5;
  overflow: hidden;
}

// 侧边栏样式
.conversation-sidebar {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--color-bg-2);

  .sidebar-header {
    padding: 16px;
    border-bottom: 1px solid var(--color-border-2);

    .new-chat-btn {
      width: 100%;
    }
  }

  .conversation-list {
    flex: 1;
    overflow-y: auto;
    padding: 8px 0;
  }

  .conversation-item {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    cursor: pointer;
    transition: all 0.2s;
    border-bottom: 1px solid var(--color-border-1);

    &:hover {
      background: var(--color-fill-2);
    }

    &.active {
      background: var(--color-primary-light-1);
      border-left: 3px solid var(--color-primary-6);
    }

    .conversation-content {
      flex: 1;
      min-width: 0;

      .conversation-title {
        font-size: 14px;
        font-weight: 500;
        color: var(--color-text-1);
        margin-bottom: 4px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .conversation-preview {
        font-size: 12px;
        color: var(--color-text-3);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-bottom: 4px;
      }

      .conversation-time {
        font-size: 11px;
        color: var(--color-text-4);
      }
    }

    .conversation-actions {
      display: flex;
      align-items: center;
      gap: 8px;

      .delete-btn {
        opacity: 0;
        transition: opacity 0.2s;
      }

      .unread-badge {
        :deep(.arco-badge-count) {
          background: var(--color-danger-6);
        }
      }
    }

    &:hover .conversation-actions .delete-btn {
      opacity: 1;
    }
  }
}

// 头部样式
.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 16px;

  .header-left {
    display: flex;
    align-items: center;
    gap: 12px;

    .menu-btn {
      display: none;

      &.mobile-only {
        @media (max-width: 768px) {
          display: flex;
        }
      }
    }

    .conversation-info {
      h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        color: var(--color-text-1);
      }

      .conversation-subtitle {
        font-size: 12px;
        color: var(--color-text-3);
      }
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 8px;

    .typewriter-switch {
      margin-right: 8px;
    }
  }
}

// 内容区样式
.chat-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;

  .loading-indicator {
    position: absolute;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: var(--color-bg-2);
    border-radius: 20px;
    box-shadow: var(--shadow-2);
    font-size: 12px;
    color: var(--color-text-2);
    z-index: 10;
  }
}

// 输入区样式
.input-container {
  .chat-input {
    width: 100%;
    margin-bottom: 10px;
  }
}

// 消息头像样式
.message-avatar {
  flex-shrink: 0;
}

// 响应式设计
@media (max-width: 768px) {
  .conversation-sidebar {
    .conversation-item {
      padding: 10px 12px;

      .conversation-content {
        .conversation-title {
          font-size: 13px;
        }

        .conversation-preview {
          font-size: 11px;
        }
      }
    }
  }

  .chat-header {
    padding: 0 12px;

    .conversation-info h3 {
      font-size: 14px;
    }
  }

  // 输入区移动端优化
  .input-container {
    padding: 0 8px;

    .chat-input {
      margin-bottom: 8px;
    }
  }
}

@media (max-width: 480px) {
  .input-container {
    padding: 0 4px;

    .chat-input {
      margin-bottom: 6px;
    }
  }
}
</style>
