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

export type BubbleVariant = 'filled' | 'none' | 'bordered'

/**
 * 气泡组件的对齐方式
 * - left: 左对齐
 * - right: 右对齐
 */
export type BubbleAlign = 'left' | 'right'

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
  content: string
  /** 是否显示 loading 态，显示 loading 时其他区域将不会显示 */
  loading: boolean
  /** 气泡对齐方式 */
  align: BubbleAlign
  /** 气泡样式 */
  variant: BubbleVariant
  /** 头像配置对象 */
  avatarConfig: AvatarProps
}
