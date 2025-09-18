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
}