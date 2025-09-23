# Typewriter 组件

一个打字机动画效果的 Vue 组件，支持自定义打字速度、光标样式等配置。

## 功能特性

- 🎯 打字机动画效果
- ⚡ 可配置的打字速度
- 🎨 自定义光标样式和闪烁效果
- 📱 响应式设计
- 🌙 深色主题适配
- 🎮 完整的事件系统
- 🔧 丰富的 API 接口

## 基本用法

```vue
<template>
  <Typewriter
    :text="message"
    :config="config"
    @complete="handleComplete"
    @start="handleStart"
    @typing="handleTyping"
  />
</template>

<script setup>
import { Typewriter } from "@arco-design/x";

const message = "Hello, World!";
const config = {
  speed: 100,
  showCursor: true,
  cursorStyle: "|",
  cursorBlinkSpeed: 530,
  autoStart: true,
  delayAfterComplete: 0,
};

const handleComplete = () => {
  console.log("打字完成");
};

const handleStart = () => {
  console.log("开始打字");
};

const handleTyping = (currentText, progress) => {
  console.log("当前文本:", currentText, "进度:", progress);
};
</script>
```

## Props

| 参数      | 说明                 | 类型               | 默认值         |
| --------- | -------------------- | ------------------ | -------------- |
| text      | 要显示的文本内容     | `string`           | `''`           |
| config    | 打字机配置           | `TypewriterConfig` | 见下方配置说明 |
| immediate | 是否立即开始打字动画 | `boolean`          | `false`        |

## TypewriterConfig

| 参数               | 说明                                 | 类型      | 默认值 |
| ------------------ | ------------------------------------ | --------- | ------ | --- |
| speed              | 打字速度，每个字符的间隔时间（毫秒） | `number`  | `50`   |
| showCursor         | 是否显示光标                         | `boolean` | `true` |
| cursorStyle        | 光标样式                             | `string`  | `'     | '`  |
| cursorBlinkSpeed   | 光标闪烁间隔时间（毫秒）             | `number`  | `530`  |
| autoStart          | 是否自动开始打字动画                 | `boolean` | `true` |
| delayAfterComplete | 打字完成后的延迟时间（毫秒）         | `number`  | `0`    |

## Events

| 事件名   | 说明           | 回调参数                                  |
| -------- | -------------- | ----------------------------------------- |
| complete | 打字完成时触发 | `()`                                      |
| start    | 开始打字时触发 | `()`                                      |
| typing   | 打字过程中触发 | `(currentText: string, progress: number)` |

## 暴露的方法

通过 ref 可以调用以下方法：

| 方法名      | 说明         | 参数 | 返回值          |
| ----------- | ------------ | ---- | --------------- |
| startTyping | 开始打字动画 | -    | `Promise<void>` |
| stopTyping  | 停止打字动画 | -    | `void`          |
| reset       | 重置打字机   | -    | `void`          |
| complete    | 完成打字     | -    | `void`          |
| isTyping    | 是否正在打字 | -    | `boolean`       |
| isComplete  | 是否已完成   | -    | `boolean`       |
| progress    | 当前进度     | -    | `number`        |

## 使用示例

### 手动控制

```vue
<template>
  <div>
    <Typewriter ref="typewriterRef" :text="text" :immediate="false" />
    <button @click="start">开始</button>
    <button @click="stop">停止</button>
    <button @click="reset">重置</button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { Typewriter } from "@arco-design/x";

const typewriterRef = ref();
const text = "这是一个可以手动控制的打字机效果";

const start = () => {
  typewriterRef.value?.startTyping();
};

const stop = () => {
  typewriterRef.value?.stopTyping();
};

const reset = () => {
  typewriterRef.value?.reset();
};
</script>
```

### 自定义配置

```vue
<template>
  <Typewriter
    :text="text"
    :config="{
      speed: 200,
      showCursor: true,
      cursorStyle: '█',
      cursorBlinkSpeed: 1000,
      autoStart: true,
      delayAfterComplete: 1000,
    }"
  />
</template>

<script setup>
import { Typewriter } from "@arco-design/x";

const text = "自定义配置的打字机效果";
</script>
```

## 样式定制

组件使用 CSS 变量，可以通过以下方式自定义样式：

```css
.ac-typewriter {
  --color-primary-6: #165dff; /* 光标颜色 */
}

/* 深色主题 */
@media (prefers-color-scheme: dark) {
  .ac-typewriter {
    --color-primary-5: #4080ff; /* 深色模式光标颜色 */
  }
}
```
