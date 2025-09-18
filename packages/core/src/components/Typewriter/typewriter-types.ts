/**
 * 打字机动画配置
 */
export interface TypewriterConfig {
  /** 打字速度，每个字符的间隔时间（毫秒） */
  speed?: number
  /** 是否显示光标 */
  showCursor?: boolean
  /** 光标样式 */
  cursorStyle?: string
  /** 光标闪烁间隔时间（毫秒） */
  cursorBlinkSpeed?: number
  /** 是否自动开始打字动画 */
  autoStart?: boolean
  /** 打字完成后的延迟时间（毫秒） */
  delayAfterComplete?: number
}

/**
 * 打字完成触发策略
 */
export type TypewriterCompleteStrategy = 'only-last' | 'all' | number[]

/**
 * Typewriter 组件的 Props 类型
 */
export interface TypewriterProps {
  /** 要显示的文本内容 */
  text: string
  /** 打字机配置 */
  config?: TypewriterConfig
  /** 是否立即开始打字动画 */
  immediate?: boolean
}

/**
 * Typewriter 组件的事件类型
 */
export interface TypewriterEmits {
  complete: []
  start: []
  typing: [currentText: string, progress: number]
}

/**
 * Typewriter 组件暴露的方法类型
 */
export interface TypewriterExpose {
  /** 开始打字动画 */
  startTyping: () => Promise<void>
  /** 停止打字动画 */
  stopTyping: () => void
  /** 重置打字机 */
  reset: () => void
  /** 完成打字 */
  complete: () => void
  /** 是否正在打字 */
  isTyping: () => boolean
  /** 是否已完成 */
  isComplete: () => boolean
  /** 当前进度 */
  progress: () => number
}
