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
 * - shiftEnter: Shift+Enter 提交
 * - ctrlEnter: Ctrl+Enter 提交
 * - altEnter: Alt+Enter 提交
 */
export enum SubmitShortKey {
  Enter = 'enter',
  ShiftEnter = 'shiftEnter',
  CtrlEnter = 'ctrlEnter',
  AltEnter = 'altEnter',
}

/**
 * 语音输入状态
 */
export enum VoiceInputState {
  Idle = 'idle',
  Recording = 'recording',
  Processing = 'processing',
  Error = 'error',
}

/**
 * 指令建议项
 */
export interface CommandSuggestion {
  /** 触发字符 */
  trigger: string
  /** 显示文本 */
  text: string
  /** 描述 */
  description?: string
  /** 插入值 */
  value?: string
  /** 图标 */
  icon?: string
  /** 额外数据 */
  data?: Record<string, any>
}

/**
 * 指令触发类型
 */
export interface CommandTrigger {
  /** 触发字符 */
  trigger: string
  /** 是否显示弹窗 */
  showPopup?: boolean
  /** 弹窗内容 */
  popupContent?: string
  /** 建议列表 */
  suggestions?: CommandSuggestion[]
  /** 获取建议的函数 */
  getSuggestions?: (trigger: string, cursorPosition: number) => CommandSuggestion[]
  /** 自定义处理函数 */
  handler?: (text: string, cursorPosition: number) => void
  /** 自定义渲染函数 */
  render?: (suggestion: CommandSuggestion) => any
}

/**
 * 自定义语音识别接口
 */
export interface CustomVoiceRecognition {
  start: (callbacks: {
    onResult: (result: string) => void
    onEnd: () => void
    onError: (error: string) => void
  }) => void
  stop: () => void
}

/**
 * 语音输入配置
 */
export interface VoiceInputConfig {
  /** 是否启用语音输入 */
  enabled: boolean
  /** 语音识别语言 */
  language?: string
  /** 是否显示语音按钮 */
  showButton?: boolean
  /** 语音按钮位置 */
  buttonPosition?: 'left' | 'right'
  /** 最大录音时长（秒） */
  maxDuration?: number
  /** 自定义语音识别实现 */
  customRecognition?: CustomVoiceRecognition
}

/**
 * 输入框 props 定义
 */
export const inputProps = {
  /** v-model 值（优先级高于 value） */
  modelValue: {
    type: String,
    default: '',
  },
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
  /** 是否只读 */
  readonly: {
    type: Boolean,
    default: false,
  },
  /** 语音输入配置 */
  voiceInput: {
    type: Object as PropType<VoiceInputConfig>,
    default: () => ({ enabled: false }),
  },
  /** 指令触发配置 */
  commandTriggers: {
    type: Array as PropType<CommandTrigger[]>,
    default: () => [],
  },
  /** 是否自动聚焦 */
  autofocus: {
    type: Boolean,
    default: false,
  },
  /** 是否自动调整高度 */
  autoResize: {
    type: Boolean,
    default: true,
  },
  /** 最小行数 */
  minRows: {
    type: Number,
    default: 1,
  },
  /** 最大行数 */
  maxRows: {
    type: Number,
    default: 6,
  },
}

/**
 * Input 组件 props 类型
 */
export interface InputProps {
  /** v-model 值（优先级高于 value） */
  modelValue: string
  /** 输入框内容 */
  value: string
  /** 占位符 */
  placeholder?: string
  /** 是否禁用 */
  disabled: boolean
  /** 是否只读 */
  readonly: boolean
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
  /** 语音输入配置 */
  voiceInput: VoiceInputConfig
  /** 指令触发配置 */
  commandTriggers: CommandTrigger[]
  /** 是否自动聚焦 */
  autofocus: boolean
  /** 是否自动调整高度 */
  autoResize: boolean
  /** 最小行数 */
  minRows: number
  /** 最大行数 */
  maxRows: number
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
export const inputEmits = [
  'change', 
  'submit', 
  'cancel', 
  'focus', 
  'blur',
  'voice-start',
  'voice-end',
  'voice-result',
  'voice-error',
  'command-trigger',
  'keydown',
  'paste',
  'resize'
]

/**
 * Input 组件的 provide/inject key
 */
export const inputInjectionKey = 'acs-input'
