# Input 组件

## 概述

Input 是一个智能输入框组件，主要用于聊天和对话场景中的用户输入。这是一个专门为聊天应用设计的输入组件，提供比普通文本框更丰富的功能。

## 主要功能

### 基础功能
- **多行文本输入**：支持自动调整高度的多行文本输入
- **智能提交**：支持多种提交方式（回车、Shift+回车、Ctrl+回车、Alt+回车等）
- **状态管理**：提供加载状态、禁用状态、只读状态等
- **字数统计**：可显示输入字符数和最大长度限制

### 高级功能
- **语音输入**：支持语音识别输入，适合移动端或需要语音交互的场景
- **指令触发**：可以配置特定字符（如@、/）来触发弹窗或特殊功能
- **自动调整高度**：根据内容自动调整输入框高度
- **指令提示**：智能提示和自动完成功能

## 基本用法

### 基础输入框
```vue
<template>
  <Input 
    v-model="message"
    placeholder="请输入您的问题..."
    @submit="handleSubmit"
  />
</template>

<script setup>
import { ref } from 'vue'

const message = ref('')

const handleSubmit = (value) => {
  console.log('提交消息:', value)
}
</script>
```

### 带语音输入的输入框
```vue
<template>
  <Input 
    v-model="message"
    :voice-input="{
      enabled: true,
      buttonPosition: 'right',
      customRecognition: myVoiceRecognition
    }"
    @voice-result="handleVoiceResult"
    @submit="handleSubmit"
  >
    <!-- 自定义语音按钮 -->
    <template #voice-button="{ state, start, stop, toggle }">
      <button 
        :class="['custom-voice-btn', { recording: state === 'recording' }]"
        @click="toggle"
      >
        {{ state === 'recording' ? '🎤' : '🎙️' }}
      </button>
    </template>
  </Input>
</template>

<script setup>
import { ref } from 'vue'

const message = ref('')

// 自定义语音识别实现
const myVoiceRecognition = {
  start: (callbacks) => {
    // 使用第三方语音识别服务
    // 或者自定义实现
    callbacks.onResult('识别结果')
    callbacks.onEnd()
  },
  stop: () => {
    // 停止识别
  }
}

const handleVoiceResult = (result, fullText) => {
  console.log('语音识别结果:', result)
  console.log('完整文本:', fullText)
}

const handleSubmit = (value) => {
  console.log('提交消息:', value)
}
</script>
```

### 带指令触发的输入框
```vue
<template>
  <Input 
    v-model="message"
    :command-triggers="customCommandTriggers"
    @command-trigger="handleCommandTrigger"
    @submit="handleSubmit"
  />
</template>

<script setup>
import { ref } from 'vue'

const message = ref('')

// 自定义指令触发配置
const customCommandTriggers = [
  {
    trigger: '@',
    showPopup: true,
    popupContent: '提及用户',
    getSuggestions: (trigger, cursorPosition) => [
      { trigger: '@', text: '提及用户', description: '提及某个用户', value: '@username ' },
      { trigger: '@', text: '提及所有人', description: '通知所有用户', value: '@all ' },
    ]
  },
  {
    trigger: '/',
    showPopup: true,
    popupContent: '执行指令',
    suggestions: [
      { trigger: '/', text: '帮助', description: '显示帮助信息', value: '/help' },
      { trigger: '/', text: '清空', description: '清空聊天记录', value: '/clear' },
    ]
  }
]

const handleCommandTrigger = (trigger, cursorPosition) => {
  console.log('指令触发:', trigger, cursorPosition)
}

const handleSubmit = (value) => {
  console.log('提交消息:', value)
}
</script>
```

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| modelValue | string | '' | v-model 绑定值 |
| value | string | '' | 输入框内容 |
| placeholder | string | - | 占位符文本 |
| disabled | boolean | false | 是否禁用 |
| readonly | boolean | false | 是否只读 |
| displayType | 'simple' \| 'full' | 'full' | 显示类型 |
| variant | 'bordered' \| 'borderless' | 'bordered' | 输入框样式 |
| sendBtnVariant | 'full' \| 'simple' | 'full' | 发送按钮样式 |
| loading | boolean | false | 是否显示加载状态 |
| showCount | boolean | false | 是否显示字数统计 |
| maxLength | number | - | 最大输入长度 |
| submitShortKey | 'enter' \| 'shiftEnter' \| 'ctrlEnter' \| 'altEnter' \| null | 'enter' | 提交快捷键 |
| voiceInput | VoiceInputConfig | { enabled: false } | 语音输入配置 |
| commandTriggers | CommandTrigger[] | [] | 指令触发配置 |
| autofocus | boolean | false | 是否自动聚焦 |
| autoResize | boolean | true | 是否自动调整高度 |
| minRows | number | 1 | 最小行数 |
| maxRows | number | 6 | 最大行数 |

## 事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| change | (value: string) | 输入内容变化 |
| submit | (value: string) | 提交消息 |
| cancel | - | 取消操作（加载状态下点击按钮） |
| focus | (event: FocusEvent) | 获得焦点 |
| blur | (event: FocusEvent) | 失去焦点 |
| voice-start | - | 语音输入开始 |
| voice-end | - | 语音输入结束 |
| voice-result | (result: string, fullText: string) | 语音识别结果 |
| voice-error | (error: string) | 语音识别错误 |
| command-trigger | (trigger: CommandTrigger, cursorPosition: number) | 指令触发 |
| keydown | (event: KeyboardEvent) | 键盘按下 |
| paste | (event: ClipboardEvent) | 粘贴事件 |
| resize | (size: { height: number }) | 尺寸变化 |

## 插槽

| 插槽名 | 说明 |
|--------|------|
| head | 输入框顶部内容 |
| prefix | 输入框前缀内容 |
| suffix | 输入框后缀内容 |
| extra | 底部左侧额外内容 |
| button | 发送按钮（可自定义） |

## 类型定义

### VoiceInputConfig
```typescript
interface VoiceInputConfig {
  enabled: boolean                    // 是否启用语音输入
  language?: string                   // 语音识别语言
  showButton?: boolean                // 是否显示语音按钮
  buttonPosition?: 'left' | 'right'   // 语音按钮位置
  maxDuration?: number                // 最大录音时长（秒）
  customRecognition?: CustomVoiceRecognition  // 自定义语音识别实现
}

interface CustomVoiceRecognition {
  start: (callbacks: {
    onResult: (result: string) => void
    onEnd: () => void
    onError: (error: string) => void
  }) => void
  stop: () => void
}
```

### CommandTrigger
```typescript
interface CommandTrigger {
  trigger: string                     // 触发字符
  showPopup?: boolean                 // 是否显示弹窗
  popupContent?: string               // 弹窗内容
  suggestions?: CommandSuggestion[]   // 建议列表
  getSuggestions?: (trigger: string, cursorPosition: number) => CommandSuggestion[]  // 获取建议的函数
  handler?: (text: string, cursorPosition: number) => void  // 自定义处理函数
  render?: (suggestion: CommandSuggestion) => any  // 自定义渲染函数
}

interface CommandSuggestion {
  trigger: string                     // 触发字符
  text: string                        // 显示文本
  description?: string                // 描述
  value?: string                      // 插入值
  icon?: string                       // 图标
  data?: Record<string, any>          // 额外数据
}
```

## 使用场景

### AI 聊天应用
```vue
<template>
  <Input 
    v-model="userInput"
    :loading="isAIResponding"
    :voice-input="{ enabled: true, language: 'zh-CN' }"
    :command-triggers="[
      { trigger: '/', showPopup: true, popupContent: 'AI 指令' }
    ]"
    submit-short-key="enter"
    @submit="sendToAI"
    @voice-result="handleVoiceInput"
  />
</template>
```

### 客服系统
```vue
<template>
  <Input 
    v-model="customerMessage"
    :disabled="!isConnected"
    :command-triggers="[
      { trigger: '@', showPopup: true, popupContent: '提及客服' },
      { trigger: '#', showPopup: true, popupContent: '添加标签' }
    ]"
    show-count
    :max-length="500"
    @submit="sendToSupport"
  />
</template>
```

### 社交应用
```vue
<template>
  <Input 
    v-model="socialMessage"
    :voice-input="{ enabled: true, buttonPosition: 'left' }"
    :command-triggers="[
      { trigger: '@', showPopup: true, popupContent: '提及好友' },
      { trigger: '#', showPopup: true, popupContent: '添加话题' }
    ]"
    submit-short-key="ctrlEnter"
    auto-resize
    :max-rows="4"
    @submit="postMessage"
  />
</template>
```

### 协作工具
```vue
<template>
  <Input 
    v-model="teamMessage"
    :command-triggers="[
      { trigger: '/', showPopup: true, popupContent: '团队指令' },
      { trigger: '@', showPopup: true, popupContent: '提及成员' }
    ]"
    submit-short-key="shiftEnter"
    display-type="full"
    show-count
    @submit="sendToTeam"
  />
</template>
```

## 样式定制

组件使用 CSS 变量进行样式定制：

```css
:root {
  --color-bg-1: #f7f8fa;
  --color-bg-2: #fff;
  --color-text-1: #1d2129;
  --color-text-2: #4e5969;
  --color-text-3: #86909c;
  --color-primary-6: #165dff;
  --color-danger-6: #f53f3f;
  --color-warning-6: #ff7d00;
}
```

## 响应式设计

组件内置了响应式设计，在移动端（屏幕宽度 < 600px）会自动调整样式：
- 输入框内边距调整为 6px
- 字体大小调整为 15px
- 语音按钮尺寸调整为 28px

## 浏览器兼容性

- **语音输入**：需要支持 Web Speech API 的现代浏览器
- **基础功能**：支持所有现代浏览器
- **指令触发**：支持所有现代浏览器

## 注意事项

1. **语音输入**：需要用户授权麦克风权限
2. **指令触发**：建议在移动端禁用或简化指令功能
3. **自动调整高度**：在大量文本时可能影响性能
4. **字数限制**：建议设置合理的最大长度限制
