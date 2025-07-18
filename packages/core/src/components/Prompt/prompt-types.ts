// Prompt 组件类型定义

/**
 * 列表排列方向
 */
export enum ListDirection {
  Horizontal = 'horizontal',
  Vertical = 'vertical',
}

/**
 * 列表样式类型
 */
export enum ListVariant {
  Transparent = 'transparent',
  Filled = 'filled',
  Bordered = 'bordered',
  None = 'none',
}

/**
 * 图标配置
 */
export interface IconConfig {
  /** 图标名 */
  name: string
  /** 图标大小 */
  size?: string
  /** 图标颜色 */
  color?: string
  /** 自定义组件 */
  component?: any
}

/**
 * Prompt 列表项类型
 */
export interface PromptItem {
  /** 唯一值 */
  value: string | number
  /** 显示文本 */
  label: string
  /** 图标配置 */
  iconConfig?: IconConfig
  /** 描述 */
  desc?: string
}

/**
 * Prompt 组件 props 类型
 */
export interface PromptProps {
  /** 列表排列方向 */
  direction?: ListDirection
  /** 提示项数组 */
  list: PromptItem[]
  /** 列表样式 */
  variant?: ListVariant
  /** 标题 */
  title?: string
  /** 点击项事件 */
  onItemClick?: (item: PromptItem) => any
}
