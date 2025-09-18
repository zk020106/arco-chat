import type { PluginSimple } from 'markdown-it'
import { full as emojiPlugin } from 'markdown-it-emoji'

/**
 * Emoji 插件配置
 */
export interface EmojiPluginOptions {
  /** 是否启用 emoji 支持 */
  enabled?: boolean
  /** 自定义 emoji 定义 */
  defs?: Record<string, string>
  /** 启用的 emoji 列表（白名单） */
  enabledEmoji?: string[]
  /** 自定义快捷键 */
  shortcuts?: Record<string, string | string[]>
  /** emoji 大小 */
  size?: string | number
  /** 自定义 CSS 类名 */
  className?: string
  /** 渲染模式 */
  renderMode?: 'unicode' | 'span' | 'twemoji'
  /** 自定义渲染函数 */
  customRenderer?: (token: any, idx: number) => string
}

/**
 * 创建自定义 emoji 渲染器
 */
function createEmojiRenderer(options: EmojiPluginOptions = {}) {
  const size = options.size || '1em'
  const className = options.className || 'emoji'
  const renderMode = options.renderMode || 'unicode'

  return function(token: any, idx: number): string {
    // 如果提供了自定义渲染函数，使用它
    if (options.customRenderer) {
      return options.customRenderer(token, idx)
    }

    const emoji = token[idx].content

    switch (renderMode) {
      case 'span':
        return `<span class="${className}" style="font-size: ${typeof size === 'number' ? size + 'px' : size};">${emoji}</span>`
      
      case 'twemoji':
        // 如果使用 twemoji，需要确保 twemoji 库已加载
        if (typeof window !== 'undefined' && (window as any).twemoji) {
          return (window as any).twemoji.parse(emoji)
        }
        // 降级到 span 模式
        return `<span class="${className}" style="font-size: ${typeof size === 'number' ? size + 'px' : size};">${emoji}</span>`
      
      case 'unicode':
      default:
        // 默认返回 unicode emoji
        return emoji
    }
  }
}

/**
 * Markdown-it Emoji 插件包装器
 */
export const emojiPluginWrapper: PluginSimple = (md, options: EmojiPluginOptions = {}) => {
  const defaultOptions: EmojiPluginOptions = {
    enabled: true,
    size: '1em',
    className: 'emoji',
    renderMode: 'unicode',
    ...options,
  }

  if (!defaultOptions.enabled) return

  // 准备 markdown-it-emoji 的选项
  const emojiOptions: any = {}
  
  if (defaultOptions.defs) {
    emojiOptions.defs = defaultOptions.defs
  }
  
  if (defaultOptions.enabledEmoji && Array.isArray(defaultOptions.enabledEmoji)) {
    emojiOptions.enabled = defaultOptions.enabledEmoji
  }
  
  if (defaultOptions.shortcuts) {
    emojiOptions.shortcuts = defaultOptions.shortcuts
  }

  // 使用官方的 markdown-it-emoji 插件
  md.use(emojiPlugin, emojiOptions)

  // 自定义渲染器
  const customRenderer = createEmojiRenderer(defaultOptions)
  md.renderer.rules.emoji = customRenderer
}

// 导出官方插件作为备用
export { emojiPlugin }

export default emojiPluginWrapper
