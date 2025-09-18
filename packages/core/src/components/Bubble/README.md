# Bubble 组件

## 概述

Bubble 组件库提供了两个主要组件：
- `Bubble`: 单个消息气泡组件
- `BubbleList`: 消息列表容器组件

## Bubble 组件

### 基本用法

```vue
<template>
  <Bubble 
    content="这是一条消息"
    align="start"
    variant="filled"
    shape="round"
    :avatar-config="{
      size: 36,
      displayName: '用户',
      imageUrl: 'avatar.jpg'
    }"
  />
</template>
```

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| content | string | '' | 消息内容 |
| loading | boolean | false | 是否显示加载状态 |
| align | 'start' \| 'end' | 'start' | 消息对齐方式 |
| variant | 'filled' \| 'borderless' \| 'outlined' \| 'shadow' | 'filled' | 消息样式变体 |
| shape | 'round' \| 'corner' | 'round' | 气泡形状 |
| avatarConfig | AvatarProps | { size: 36 } | 头像配置 |
| failed | boolean | false | 是否显示失败状态 |
| timestamp | number | undefined | 消息时间戳 |
| showAvatar | boolean | true | 是否显示头像 |
| clickable | boolean | false | 是否可点击 |
| maxWidth | string | '70%' | 最大宽度 |
| typewriter | boolean | false | 是否启用打字机动画 |
| typewriterConfig | TypewriterConfig | - | 打字机动画配置 |
| markdown | boolean | false | 是否支持 Markdown 渲染 |
| streaming | boolean | false | 是否启用流式显示 |

### 插槽

- `avatar`: 自定义头像
- `header`: 消息顶部区域
- `content`: 消息内容
- `loading`: 自定义加载模板
- `footer`: 消息底部区域

### 事件

- `click`: 点击事件（需要设置 clickable 为 true）
- `typewriterComplete`: 打字机动画完成事件
- `typewriterStart`: 打字机动画开始事件
- `typewriterTyping`: 打字机动画进行中事件

## BubbleList 组件

### 基本用法

```vue
<template>
  <BubbleList 
    :list="messages"
    :auto-scroll="true"
    :show-scroll-to-bottom="true"
    :typewriter-complete-strategy="'only-last'"
    @load-more="handleLoadMore"
    @typewriter-complete="handleTypewriterComplete"
  />
</template>

<script setup>
import { ref } from 'vue'

const messages = ref([
  {
    id: '1',
    content: '你好！',
    align: 'start',
    variant: 'filled',
    shape: 'round',
    timestamp: Date.now(),
    avatarConfig: {
      size: 36,
      displayName: '用户A'
    }
  },
  {
    id: '2',
    content: '你好，有什么可以帮助你的吗？',
    align: 'end',
    variant: 'filled',
    shape: 'round',
    timestamp: Date.now() + 1000,
    typewriter: true,
    typewriterConfig: {
      speed: 50,
      showCursor: true
    },
    avatarConfig: {
      size: 36,
      displayName: '用户B'
    }
  }
])

const handleLoadMore = () => {
  // 加载更多消息的逻辑
}

const handleTypewriterComplete = (message, index) => {
  console.log('打字完成:', message, index)
}
</script>
```

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| list | BubbleMessage[] | [] | 消息列表 |
| autoScroll | boolean | true | 是否自动滚动到底部 |
| showLoadMore | boolean | false | 是否显示加载更多按钮 |
| showScrollToBottom | boolean | true | 是否显示滚动到底部按钮 |
| loadMoreText | string | '加载更多' | 加载更多按钮文本 |
| loadingMore | boolean | false | 是否正在加载更多 |
| maxHeight | string | '400px' | 列表最大高度 |
| reverse | boolean | true | 是否反向显示（最新消息在底部） |
| scrollToBottomThreshold | number | 100 | 滚动到底部按钮显示阈值（像素） |
| typewriterCompleteStrategy | 'only-last' \| 'all' \| number[] | 'only-last' | 打字完成触发策略 |
| virtualScroll | boolean | false | 是否启用虚拟滚动 |
| itemHeight | number | 60 | 虚拟滚动项高度 |
| bufferSize | number | 5 | 虚拟滚动缓冲区大小 |

### 事件

- `loadMore`: 加载更多事件
- `messageClick`: 消息点击事件
- `scrollToBottom`: 滚动到底部事件
- `typewriterComplete`: 打字机完成事件
- `typewriterStart`: 打字机开始事件
- `typewriterTyping`: 打字机进行中事件

### 方法

通过 ref 可以调用以下方法：
- `scrollToTop()`: 滚动到顶部
- `scrollToBottom()`: 滚动到底部
- `scrollToBubble(index)`: 滚动到指定气泡

## 消息数据结构

```typescript
interface BubbleMessage {
  id?: string
  content: string
  userId?: string
  userName?: string
  loading?: boolean
  align?: 'start' | 'end'
  variant?: 'filled' | 'borderless' | 'outlined' | 'shadow'
  shape?: 'round' | 'corner'
  avatarConfig?: AvatarProps
  failed?: boolean
  timestamp?: number
  type?: 'text' | 'image' | 'file' | 'system'
  data?: Record<string, any>
  maxWidth?: string
  typewriter?: boolean
  typewriterConfig?: TypewriterConfig
  markdown?: boolean
  streaming?: boolean
}

interface TypewriterConfig {
  speed?: number
  showCursor?: boolean
  cursorStyle?: string
  cursorBlinkSpeed?: number
  autoStart?: boolean
  delayAfterComplete?: number
}
```

## 样式定制

组件使用 CSS 变量进行样式定制，支持以下变量：

```css
:root {
  --color-bg-1: #f7f8fa;
  --color-bg-2: #fff;
  --color-text-1: #1d2129;
  --color-text-2: #4e5969;
  --color-text-3: #86909c;
  --color-neutral-2: #e5e6eb;
  --color-neutral-3: #c9cdd4;
  --color-primary-6: #165dff;
  --color-danger-6: #f53f3f;
  --color-danger-1: #ffece8;
}
```

## 高级功能

### 打字机动画

```vue
<template>
  <Bubble 
    content="这是一段会逐字显示的文字"
    :typewriter="true"
    :typewriter-config="{
      speed: 50,
      showCursor: true,
      cursorStyle: '|',
      cursorBlinkSpeed: 530
    }"
    @typewriter-complete="handleComplete"
  />
</template>
```

### Markdown 渲染

```vue
<template>
  <Bubble 
    content="# 标题\n\n这是一段 **粗体** 和 *斜体* 文字"
    :markdown="true"
  />
</template>
```

### Markdown + 打字机动画

```vue
<template>
  <Bubble 
    content="# 标题\n\n这是一段 **粗体** 和 *斜体* 文字"
    :markdown="true"
    :typewriter="true"
    :typewriter-config="{
      speed: 50,
      showCursor: true
    }"
    @typewriter-complete="handleComplete"
  />
</template>
```

### 流式显示

```vue
<template>
  <Bubble 
    :content="streamingContent"
    :streaming="true"
    :typewriter="true"
  />
</template>
```

## 响应式设计

组件内置了响应式设计，在移动端（屏幕宽度 < 600px）会自动调整样式：

- 字体大小调整为 15px
- 内边距调整为 12px
- 滚动按钮尺寸调整为 36px

## 高级功能

### 消息分组显示

BubbleList 组件不内置分组功能，但你可以通过以下方式自行实现：

```vue
<template>
  <BubbleList :list="groupedMessages" @load-more="handleLoadMore">
    <template #default="{ message, index }">
      <!-- 自定义分组逻辑 -->
      <div v-if="shouldShowGroup(message, index)" class="message-group">
        {{ formatGroupTitle(message) }}
      </div>
      <Bubble v-bind="message" />
    </template>
  </BubbleList>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps(['messages'])

// 自定义分组逻辑
const shouldShowGroup = (message, index) => {
  if (index === 0) return true
  
  const prevMessage = props.messages[index - 1]
  const timeDiff = message.timestamp - prevMessage.timestamp
  
  // 5分钟分组
  return timeDiff > 5 * 60 * 1000
}

const formatGroupTitle = (message) => {
  const date = new Date(message.timestamp)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  
  if (messageDate.getTime() === today.getTime()) {
    return `今天 ${date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`
  }
  
  return date.toLocaleDateString('zh-CN')
}

const groupedMessages = computed(() => {
  // 可以在这里预处理消息，添加分组信息
  return props.messages
})
</script>
```

## 使用场景

### 聊天应用
- 支持左右对齐的消息显示
- 打字机动画模拟真实对话
- 自动滚动到最新消息

### AI 对话
- 流式显示 AI 回复
- Markdown 渲染支持代码高亮
- 加载状态显示

### 客服系统
- 消息分组显示
- 失败状态提示
- 自定义头像和样式
