<template>
  <div
    class="ac-bubble"
    :class="bubbleClasses"
    :style="bubbleStyles"
    @click="handleClick"
    :data-animate="isVisible"
  >
    <div class="ac-bubble-avatar" v-if="showAvatar">
      <slot name="avatar">
        <Avatar
          :size="avatarConfig?.size"
          :image-url="avatarConfig?.imageUrl"
          :shape="avatarConfig?.shape"
          :auto-fix-font-size="avatarConfig?.autoFixFontSize"
          :trigger-type="avatarConfig?.triggerType"
          :trigger-icon-style="avatarConfig?.triggerIconStyle"
          :object-fit="avatarConfig?.objectFit"
        >
          {{ avatarConfig?.displayName }}
        </Avatar>
      </slot>
    </div>
    <div class="ac-bubble-content-container">
      <slot v-if="!loading" name="header"></slot>
      <div v-if="loading" class="loading-container" :class="[variant, shape]">
        <slot name="loading">
          <BubbleLoading></BubbleLoading>
        </slot>
      </div>
      <div
        v-if="!loading"
        class="ac-bubble-content"
        :class="[variant, shape]"
        :style="contentStyles"
      >
        <slot name="content">
          <div v-if="markdown" class="ac-bubble-markdown">
            <MarkdownRender
              :content="content"
              :typing="typewriter"
              :typing-options="markdownTypingOptions"
              :enable-mermaid="true"
              :enable-latex="true"
              :enable-emoji="true"
              @typing-start="handleTypewriterStart"
              @typing="() => handleTypewriterTyping('', 0)"
              @typing-end="handleTypewriterComplete"
            />
          </div>
          <div v-else-if="typewriter" class="ac-bubble-typewriter">
            <Typewriter
              :text="content"
              :config="typewriterConfig"
              :immediate="streaming"
              @complete="handleTypewriterComplete"
              @start="handleTypewriterStart"
              @typing="handleTypewriterTyping"
            />
          </div>
          <div v-else class="ac-bubble-text">
            {{ content }}
          </div>
        </slot>
      </div>
      <slot v-if="!loading" name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { Avatar } from "@arco-design/web-vue";
import type { BubblePropsType } from "./bubble-types";
import type { TypingOptions } from "../MarkdownRender/markdown-render-types";
import BubbleLoading from "./BubbleLoading.vue";
import Typewriter from "../Typewriter/Typewriter.vue";
import MarkdownRender from "../MarkdownRender/MarkdownRender.vue";

const props = withDefaults(defineProps<BubblePropsType>(), {
  content: "",
  loading: false,
  align: "start",
  variant: "filled",
  shape: "round",
  avatarConfig: () => ({ size: 36 }),
  failed: false,
  timestamp: undefined,
  showAvatar: true,
  clickable: false,
  maxWidth: "auto",
  typewriter: false,
  typewriterConfig: () => ({
    speed: 50,
    showCursor: true,
    cursorStyle: "|",
    cursorBlinkSpeed: 530,
    autoStart: true,
    delayAfterComplete: 0,
  }),
  markdown: false,
  streaming: false,
});

const emit = defineEmits<{
  click: [event: MouseEvent];
  typewriterComplete: [];
  typewriterStart: [];
  typewriterTyping: [currentText: string, progress: number];
}>();

const isVisible = ref(false);

/**
 * 插槽说明：
 * avatar - 自定义头像
 * header - 气泡顶部区域
 * content - 内容区
 * loading - 自定义 Loading 样式
 * footer - 气泡底部区域
 */

// 计算是否显示头像
const showAvatar = computed(() => {
  return props.showAvatar && props.avatarConfig;
});

// 智能计算气泡宽度
const bubbleStyles = computed(() => {
  const styles: Record<string, string> = {};

  // 样式现在通过 CSS 类来处理，这里只保留必要的动态样式
  // 如果需要其他动态样式，可以在这里添加

  return styles;
});

// 智能计算内容宽度
const contentStyles = computed(() => {
  const styles: Record<string, string> = {};

  // 根据内容类型智能调整宽度
  if (props.maxWidth === "auto") {
    const hasMarkdown = props.markdown;
    const hasCode = props.content.includes("```");
    const hasTable = props.content.includes("|");
    const hasList =
      props.content.includes("- ") || props.content.includes("* ");

    if (hasMarkdown || hasCode || hasTable || hasList) {
      // Markdown 内容（表格、代码块、列表等）完全展开
      styles.width = "100%";
      styles.maxWidth = "100%";
    } else {
      // 普通文本内容，使用 fit-content 保持紧凑
      styles.width = "fit-content";
      styles.maxWidth = "100%";
      // styles.minWidth = '120px'
    }
  } else {
    styles.maxWidth = props.maxWidth;
    // styles.minWidth = '120px'
  }

  return styles;
});

// 将 TypewriterConfig 转换为 MarkdownRender 的 typingOptions 格式
const markdownTypingOptions = computed((): TypingOptions | undefined => {
  if (!props.typewriter || !props.typewriterConfig) return undefined;

  return {
    step: 1, // MarkdownRender 使用 step 参数
    interval: props.typewriterConfig.speed || 50,
    style: "normal",
  };
});

// 计算气泡样式类
const bubbleClasses = computed(() => {
  return [
    `ac-bubble-${props.align}`,
    `ac-bubble-${props.variant}`,
    `ac-bubble-${props.shape}`,
    props.loading ? "ac-bubble-loading" : "",
    props.failed ? "ac-bubble-failed" : "",
    props.clickable ? "ac-bubble-clickable" : "",
    props.typewriter ? "ac-bubble-typewriter-enabled" : "",
    props.markdown ? "ac-bubble-markdown-enabled" : "",
  ];
});

// 处理点击事件
const handleClick = (event: MouseEvent) => {
  if (props.clickable) {
    emit("click", event);
  }
};

// 处理打字机完成事件
const handleTypewriterComplete = () => {
  emit("typewriterComplete");
};

// 处理打字机开始事件
const handleTypewriterStart = () => {
  emit("typewriterStart");
};

// 处理打字机打字事件
const handleTypewriterTyping = (currentText: string, progress: number) => {
  emit("typewriterTyping", currentText, progress);
};

// 组件进入动画
onMounted(() => {
  setTimeout(() => {
    isVisible.value = true;
  }, 200);
});
</script>

<style scoped lang="scss">
.ac-bubble {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 14px;
  opacity: 0;
  transform: translateY(20px) scale(0.95);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
  box-sizing: border-box;
  max-width: 100%;

  &[data-animate="true"] {
    opacity: 1;
    transform: translateY(0) scale(1);
    animation: bubbleAppear 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }

  &.ac-bubble-start {
    flex-direction: row;
    margin-right: auto !important;
    justify-content: flex-start;
    width: auto !important;
    max-width: calc(100% - 20px); /* 限制最大宽度，留出边距 */
    min-width: 0; /* 允许收缩 */
  }
  &.ac-bubble-end {
    flex-direction: row-reverse;
    margin-left: auto !important;
    justify-content: flex-end;
    width: auto !important;
    max-width: calc(100% - 20px); /* 限制最大宽度，留出边距 */
    min-width: 0; /* 允许收缩 */
  }

  &.ac-bubble-failed {
    .ac-bubble-content {
      border: 1px solid var(--color-danger-6, #f53f3f);
      background-color: var(--color-danger-1, #ffece8);
    }
  }

  &.ac-bubble-clickable {
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    &:active {
      transform: translateY(0);
    }
  }

  .ac-bubble-avatar {
    flex-shrink: 0;
    display: flex;
    align-items: flex-start;
    animation: avatarBounce 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.3s both;
  }
  .ac-bubble-content-container {
    flex: 1;
    min-width: 0; // 允许内容收缩
    display: flex;
    flex-direction: column;
    max-width: calc(100% - 50px); // 确保内容不会挤压头像

    // 对于 Markdown 内容，允许完全展开
    .ac-bubble-markdown {
      width: 100%;
      min-width: 100%;
      padding: auto;
    }
  }
  .loading-container {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    max-width: 100%;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    // 变体样式 - 使用Arco默认颜色
    &.filled {
      padding: 12px 16px;
      background: var(--color-bg-2);
      border: 1px solid var(--color-border-2);
      border-radius: 16px;
      box-shadow:
        0 4px 20px rgba(0, 0, 0, 0.08),
        0 1px 3px rgba(0, 0, 0, 0.12);
      backdrop-filter: blur(10px);
    }
    &.borderless {
      padding: 12px 16px;
      background: var(--color-bg-1);
      backdrop-filter: blur(5px);
    }
    &.outlined {
      padding: 12px 16px;
      border: 1px solid var(--color-border-2);
      background: var(--color-bg-1);
      border-radius: 16px;
      backdrop-filter: blur(8px);
    }
    &.shadow {
      padding: 12px 16px;
      background: var(--color-bg-2);
      border: 1px solid var(--color-border-2);
      border-radius: 16px;
      box-shadow:
        0 6px 25px rgba(0, 0, 0, 0.12),
        0 2px 6px rgba(0, 0, 0, 0.16);
      backdrop-filter: blur(10px);
    }

    // 形状样式
    &.round {
      border-radius: 16px;
    }
    &.corner {
      border-radius: 8px;
    }
  }

  .ac-bubble-content {
    word-wrap: break-word;
    word-break: break-word;
    overflow-wrap: break-word;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    min-width: 0; /* 允许内容收缩 */

    // 对于 Markdown 内容，允许完全展开
    .ac-bubble-markdown {
      width: 100% !important;
      max-width: 100% !important;
      padding: auto;
    }

    // 变体样式 - 使用Arco默认颜色
    &.filled {
      padding: 12px 16px;
      background: var(--color-bg-2);
      border: 1px solid var(--color-border-2);
      border-radius: 16px;
      box-shadow:
        0 4px 20px rgba(0, 0, 0, 0.08),
        0 1px 3px rgba(0, 0, 0, 0.12);
      backdrop-filter: blur(10px);

      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: var(--primary-6);
        border-radius: 16px 16px 0 0;
      }
    }
    &.borderless {
      padding: 12px 16px;
      background: var(--color-bg-1);
      backdrop-filter: blur(5px);
    }
    &.outlined {
      padding: 12px 16px;
      border: 1px solid var(--color-border-2);
      background: var(--color-bg-1);
      border-radius: 16px;
      backdrop-filter: blur(8px);
    }
    &.shadow {
      padding: 12px 16px;
      background: var(--color-bg-2);
      border: 1px solid var(--color-border-2);
      border-radius: 16px;
      box-shadow:
        0 6px 25px rgba(0, 0, 0, 0.12),
        0 2px 6px rgba(0, 0, 0, 0.16);
      backdrop-filter: blur(10px);
    }

    // 形状样式
    &.round {
      border-radius: 16px;
    }
    &.corner {
      border-radius: 8px;
    }

    // 悬停效果
    &:hover {
      transform: translateY(-1px);
      box-shadow:
        0 8px 30px rgba(0, 0, 0, 0.12),
        0 2px 8px rgba(0, 0, 0, 0.16);
    }

    // 特殊内容样式
    .ac-bubble-markdown {
      line-height: 1.6;
      width: 100%;

      :deep(pre) {
        overflow-x: auto;
        white-space: pre-wrap;
        word-break: break-word;
        margin: 0;
        padding: 0;
      }

      // 表格特殊处理
      :deep(table) {
        width: 100%;
        table-layout: auto;
        overflow-x: auto;
        display: block;
        white-space: nowrap;
      }
    }

    .ac-bubble-typewriter {
      line-height: 1.6;
      width: 100%;
    }

    .ac-bubble-text {
      line-height: 1.6;
      width: 100%;

      // 长文本处理
      &:has-text-long {
        white-space: pre-wrap;
        word-break: break-word;
      }
    }
  }
}
// 响应式设计 - 多断点适配
@media (max-width: 1200px) {
  .ac-bubble {
    .ac-bubble-content {
      &.filled,
      &.outlined,
      &.shadow {
        padding: 10px 14px;
      }
    }

    .loading-container {
      &.filled,
      &.outlined,
      &.shadow {
        padding: 10px 14px;
      }
    }
  }
}

@media (max-width: 768px) {
  .ac-bubble {
    gap: 6px;
    padding: 0 8px; // 添加左右边距，防止头像超出屏幕

    &.ac-bubble-start,
    &.ac-bubble-end {
      max-width: calc(100% - 16px); // 减少最大宽度，留出更多边距
    }

    .ac-bubble-avatar {
      flex-shrink: 0;
      // 确保头像在移动端不会超出屏幕
      max-width: 36px;
    }

    .ac-bubble-content-container {
      max-width: calc(100% - 44px); // 调整内容最大宽度
    }

    .ac-bubble-content {
      font-size: 14px;

      &.filled,
      &.outlined,
      &.shadow {
        padding: 10px 12px;
        border-radius: 14px;
      }
    }

    .loading-container {
      &.filled,
      &.outlined,
      &.shadow {
        padding: 10px 12px;
        border-radius: 14px;
      }
    }
  }
}

@media (max-width: 600px) {
  .ac-bubble {
    padding: 0 6px; // 进一步减少边距

    &.ac-bubble-start,
    &.ac-bubble-end {
      max-width: calc(100% - 12px); // 进一步减少最大宽度
    }

    .ac-bubble-avatar {
      max-width: 32px; // 减小头像尺寸
    }

    .ac-bubble-content-container {
      max-width: calc(100% - 38px); // 调整内容最大宽度
    }

    .ac-bubble-content {
      font-size: 15px;

      &.filled,
      &.outlined,
      &.shadow {
        padding: 12px 12px;
        border-radius: 12px;
      }
    }

    .loading-container {
      &.filled,
      &.outlined,
      &.shadow {
        padding: 12px 12px;
        border-radius: 12px;
      }
    }
  }
}

@media (max-width: 480px) {
  .ac-bubble {
    gap: 4px;
    padding: 0 4px; // 最小边距

    &.ac-bubble-start,
    &.ac-bubble-end {
      max-width: calc(100% - 8px); // 最小最大宽度
    }

    .ac-bubble-avatar {
      max-width: 28px; // 最小头像尺寸
    }

    .ac-bubble-content-container {
      max-width: calc(100% - 32px); // 最小内容最大宽度
    }

    .ac-bubble-content {
      font-size: 14px;

      &.filled,
      &.outlined,
      &.shadow {
        padding: 8px 10px;
        border-radius: 10px;
      }
    }

    .loading-container {
      &.filled,
      &.outlined,
      &.shadow {
        padding: 8px 10px;
        border-radius: 10px;
      }
    }
  }
}

// 深色模式适配
@media (prefers-color-scheme: dark) {
  .ac-bubble-content {
    &.filled {
      background: var(--color-bg-2);
      border-color: var(--color-border-2);
    }

    &.outlined {
      background: var(--color-bg-1);
      border-color: var(--color-border-2);
    }

    &.shadow {
      background: var(--color-bg-2);
      border-color: var(--color-border-2);
    }
  }

  .loading-container {
    &.filled {
      background: var(--color-bg-2);
      border-color: var(--color-border-2);
    }

    &.outlined {
      background: var(--color-bg-1);
      border-color: var(--color-border-2);
    }

    &.shadow {
      background: var(--color-bg-2);
      border-color: var(--color-border-2);
    }
  }
}

/* 气泡出现动画 */
@keyframes bubbleAppear {
  0% {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  50% {
    opacity: 0.8;
    transform: translateY(-5px) scale(1.02);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 头像弹跳动画 */
@keyframes avatarBounce {
  0% {
    opacity: 0;
    transform: scale(0.3) rotate(-10deg);
  }
  50% {
    opacity: 1;
    transform: scale(1.1) rotate(5deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}

/* 内容滑入动画 */
@keyframes contentSlideIn {
  0% {
    opacity: 0;
    transform: translateX(-20px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

.ac-bubble-content-container {
  animation: contentSlideIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.4s both;
}

/* 打字机效果增强 - 只在hover时显示 */
.ac-bubble-typewriter-enabled {
  .ac-bubble-content {
    transition: box-shadow 0.3s ease;

    &:hover {
      box-shadow: 0 0 15px rgba(var(--primary-6), 0.3);
    }
  }
}
</style>
