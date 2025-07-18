// Mention 组件类型定义

/**
 * 前缀符类型
 */
export type Prefix = Array<string | Trigger>

/**
 * 触发器类型
 */
export interface Trigger {
  /** 前缀符 */
  key: string
  /** 是否仅在输入内容首部触发 */
  onlyInputStart?: boolean
}

/**
 * 搜索变更事件类型
 */
export interface SearchChangeEvent {
  /** 触发组件显示的前缀符 */
  trigger: string
  /** 前缀符到光标位置的文本 */
  value: string
  /** 前缀符在整个输入内容中的索引 */
  triggerIndex: number
  /** 光标在整个输入内容中的索引 */
  cursorIndex: number
}

/**
 * MentionItem 类型定义
 */
export interface MentionItem {
  /** 名称 */
  name: string
  /** 头像地址 */
  avatar?: string
  /** 描述 */
  description?: string
}
