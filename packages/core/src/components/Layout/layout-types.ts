// Layout 组件类型定义
// 如有需要可在此处补充 Layout 相关类型
/**
 * Layout 组件 props 类型
 */
export interface LayoutProps {}

export interface LayoutProps {
  /** 初始侧边宽度，如 '260px' */
  asideWidth?: string
  /** 是否默认折叠 */
  collapsed?: boolean
  /** 头部区域高度，支持百分比、vh、px等，如 '15vh' 或 '15%' */
  headerHeight?: string
  /** 内容区域高度，支持百分比、vh、px等，如 '70vh' 或 '70%' */
  contentHeight?: string
  /** 底部输入区域高度，支持百分比、vh、px等，如 '15vh' 或 '15%' */
  senderHeight?: string
}