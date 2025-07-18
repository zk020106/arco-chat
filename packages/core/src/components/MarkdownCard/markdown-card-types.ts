// MarkdownCard 组件类型定义

/**
 * 打字机动效配置类型
 */
export interface TypingOptions {
  /** 每步打字字符数或区间 */
  step?: number | [number, number]
  /** 打字间隔(ms) */
  interval?: number
  /** 打字样式：normal/cursor/gradient/color/stream */
  style?: string
}

/**
 * MarkdownCard 组件 props 类型
 */
export interface MarkdownCardProps {
  /** markdown 内容 */
  content: string
  /** 是否打字机动效 */
  typing?: boolean
  /** 打字机动效配置 */
  typingOptions?: TypingOptions
  /** 是否启用 think 标签 */
  enableThink?: boolean
  /** markdown-it 配置 */
  mdOptions?: object
  /** markdown-it 插件 */
  mdPlugins?: any[]
  /** 是否开启安全模式预览HTML代码 */
  safeMode?: boolean
  /** think 插件配置 */
  thinkOptions?: ThinkPluginOptions
}

/**
 * think 插件配置类型
 */
export interface ThinkPluginOptions {
  /** 自定义类名 */
  customClass?: string
}
