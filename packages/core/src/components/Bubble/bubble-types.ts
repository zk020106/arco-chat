/**
 * 气泡组件的样式类型
 * - filled: 填充卡片
 * - none: 无背景
 * - bordered: 边框卡片
 */
/**
 * 头像配置对象
 */
import type { CSSProperties } from 'vue'
import type { TypewriterConfig, TypewriterCompleteStrategy } from '../Typewriter/typewriter-types'

export type BubbleVariant = 'filled' | 'borderless' | 'outlined' | 'shadow'

/**
 * 气泡组件的对齐方式
 * - start: 左对齐
 * - end: 右对齐
 */
export type BubbleAlign = 'start' | 'end'

/**
 * 气泡组件的形状
 * - round: 圆角
 * - corner: 尖角
 */
export type BubbleShape = 'round' | 'corner'


export type AvatarShape = 'circle' | 'square'
export type AvatarTriggerType = 'mask' | 'button'
export type AvatarObjectFit = 'fill' | 'contain' | 'cover' | 'none' | 'scale-down' // 常见的 object-fit 枚举

export interface AvatarProps {
  /** 头像的形状，有圆形(circle)和正方形(square)两种，默认 'circle' */
  shape?: AvatarShape
  /** 自定义头像图片地址，如果传入该属性，会默认渲染img标签 */
  imageUrl?: string
  /** 头像的尺寸大小，单位是 px。未填写时使用样式中的大小 40px */
  size?: number
  /** 是否自动根据头像尺寸调整字体大小，默认 true */
  autoFixFontSize?: boolean
  /** 可点击的头像交互类型，默认 'button' */
  triggerType?: AvatarTriggerType
  /** 交互图标的样式 */
  triggerIconStyle?: CSSProperties
  /** 图片在容器内的的适应类型 */
  objectFit?: AvatarObjectFit
  /** 头像显示的名字 */
  displayName?: string
}

/**
 * 气泡组件 props 类型
 */
export interface BubblePropsType {
  /** 气泡显示内容 */
  content?: string
  /** 是否显示 loading 态，显示 loading 时其他区域将不会显示 */
  loading?: boolean
  /** 气泡对齐方式 */
  align?: BubbleAlign
  /** 气泡样式变体 */
  variant?: BubbleVariant
  /** 气泡形状 */
  shape?: BubbleShape
  /** 头像配置对象 */
  avatarConfig?: AvatarProps
  /** 是否显示失败状态 */
  failed?: boolean
  /** 消息时间戳 */
  timestamp?: number
  /** 是否显示头像 */
  showAvatar?: boolean
  /** 是否可点击 */
  clickable?: boolean
  /** 最大宽度 */
  maxWidth?: string
  /** 是否启用打字机动画 */
  typewriter?: boolean
  /** 打字机动画配置 */
  typewriterConfig?: TypewriterConfig
  /** 是否支持 Markdown 渲染 */
  markdown?: boolean
  /** 是否启用流式显示 */
  streaming?: boolean
}

/**
 * 消息数据接口
 */
export interface BubbleMessage {
  /** 消息唯一标识 */
  id?: string
  /** 消息内容 */
  content: string
  /** 用户ID */
  userId?: string
  /** 用户名 */
  userName?: string
  /** 是否显示 loading 态 */
  loading?: boolean
  /** 气泡对齐方式 */
  align?: BubbleAlign
  /** 气泡样式变体 */
  variant?: BubbleVariant
  /** 气泡形状 */
  shape?: BubbleShape
  /** 头像配置对象 */
  avatarConfig?: AvatarProps
  /** 是否显示失败状态 */
  failed?: boolean
  /** 消息时间戳 */
  timestamp?: number
  /** 消息类型 */
  type?: 'text' | 'image' | 'file' | 'system'
  /** 额外数据 */
  data?: Record<string, any>
  /** 最大宽度 */
  maxWidth?: string
  /** 是否启用打字机动画 */
  typewriter?: boolean
  /** 打字机动画配置 */
  typewriterConfig?: TypewriterConfig
  /** 是否支持 Markdown 渲染 */
  markdown?: boolean
  /** 是否启用流式显示 */
  streaming?: boolean
}


/**
 * 气泡列表组件 props 类型
 */
export interface BubbleListProps {
  /** 消息列表 */
  list: BubbleMessage[]
  /** 是否自动滚动到底部 */
  autoScroll?: boolean
  /** 是否显示加载更多按钮 */
  showLoadMore?: boolean
  /** 是否显示滚动到底部按钮 */
  showScrollToBottom?: boolean
  /** 加载更多按钮文本 */
  loadMoreText?: string
  /** 是否正在加载更多 */
  loadingMore?: boolean
  /** 列表最大高度 */
  maxHeight?: string
  /** 是否反向显示（最新消息在底部） */
  reverse?: boolean
  /** 滚动到底部按钮显示阈值（像素） */
  scrollToBottomThreshold?: number
  /** 打字完成触发策略 */
  typewriterCompleteStrategy?: TypewriterCompleteStrategy
  /** 是否启用虚拟滚动 */
  virtualScroll?: boolean
  /** 虚拟滚动项高度 */
  itemHeight?: number
  /** 虚拟滚动缓冲区大小 */
  bufferSize?: number
}
