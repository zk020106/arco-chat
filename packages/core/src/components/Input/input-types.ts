import type { PropType, Ref } from 'vue'

/**
 * 输入框显示类型
 * - simple: 简洁模式
 * - full: 完整模式
 */
export enum DisplayType {
  Simple = 'simple',
  Full = 'full',
}

/**
 * 输入框样式类型
 * - bordered: 有边框
 * - borderless: 无边框
 */
export enum InputVariant {
  Bordered = 'bordered',
  BorderLess = 'borderless',
}

/**
 * 发送按钮样式类型
 * - full: 全按钮
 * - simple: 简洁按钮
 */
export enum SendBtnVariant {
  Full = 'full',
  Simple = 'simple',
}

/**
 * 快捷提交键类型
 * - enter: 回车提交
 * - shiftEnter: Shift+Enter 换行
 */
export enum SubmitShortKey {
  Enter = 'enter',
  ShiftEnter = 'shiftEnter',
}

/**
 * 输入框 props 定义
 */
export const inputProps = {
  /** 输入框内容 */
  value: {
    type: String,
    default: '',
  },
  /** 占位符 */
  placeholder: {
    type: String,
  },
  /** 是否禁用 */
  disabled: {
    type: Boolean,
    default: false,
  },
  /** 显示类型 */
  displayType: {
    type: String as PropType<DisplayType>,
    default: DisplayType.Full,
  },
  /** 输入框样式类型 */
  variant: {
    type: String as PropType<InputVariant>,
    default: InputVariant.Bordered,
  },
  /** 发送按钮样式类型 */
  sendBtnVariant: {
    type: String as PropType<SendBtnVariant>,
    default: SendBtnVariant.Full,
  },
  /** 是否显示加载动画 */
  loading: {
    type: Boolean,
    default: false,
  },
  /** 是否显示字数统计 */
  showCount: {
    type: Boolean,
    default: false,
  },
  /** 最大输入长度 */
  maxLength: {
    type: Number,
  },
  /** 提交快捷键 */
  submitShortKey: {
    type: [String, null] as PropType<SubmitShortKey | null>,
    default: SubmitShortKey.Enter,
  },
}

/**
 * Input 组件 props 类型
 */
export interface InputProps {
  /** 输入框内容 */
  value: string
  /** 占位符 */
  placeholder?: string
  /** 是否禁用 */
  disabled: boolean
  /** 显示类型 */
  displayType: DisplayType
  /** 输入框样式类型 */
  variant: InputVariant
  /** 发送按钮样式类型 */
  sendBtnVariant: SendBtnVariant
  /** 是否显示加载动画 */
  loading: boolean
  /** 是否显示字数统计 */
  showCount: boolean
  /** 最大输入长度 */
  maxLength?: number
  /** 提交快捷键 */
  submitShortKey: SubmitShortKey | null
}

/**
 * Input 组件上下文类型
 */
export interface InputContext {
  /** 输入框内容的响应式引用 */
  inputValue: Ref<string>
  /** 组件 props */
  rootProps: InputProps
  /** 组件 emits 方法 */
  rootEmits: (event: string, ...args: any[]) => void
}

/**
 * Input 组件支持的事件
 */
export const inputEmits = ['change', 'submit', 'cancel', 'focus', 'blur']

/**
 * Input 组件的 provide/inject key
 */
export const inputInjectionKey = 'acs-input'
