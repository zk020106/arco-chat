import type { PropType, Ref } from "vue";

/**
 * 输入框变体类型
 * - default: 默认样式
 * - updown: 上下布局样式
 */
export enum InputVariant {
  Default = "default",
  Updown = "updown",
}

/**
 * 提交方式类型
 * - enter: 按 Enter 提交
 * - shiftEnter: 按 Shift + Enter 提交
 * - cmdOrCtrlEnter: 按 Command + Enter 或 Ctrl + Enter 提交
 * - altEnter: 按 Alt + Enter 提交
 */
export enum SubmitType {
  Enter = "enter",
  ShiftEnter = "shiftEnter",
  CmdOrCtrlEnter = "cmdOrCtrlEnter",
  AltEnter = "altEnter",
}

/**
 * 语音输入状态
 */
export enum VoiceInputState {
  Idle = "idle",
  Recording = "recording",
  Processing = "processing",
  Error = "error",
}

/**
 * 触发指令事件类型
 */
export interface TriggerEvent {
  oldValue: string;
  newValue: string;
  isOpen: boolean;
}

/**
 * 粘贴文件事件类型
 */
export interface PasteFileEvent {
  firstFile: File;
  fileList: FileList;
}

/**
 * 自动调整大小配置
 */
export interface AutoSizeConfig {
  minRows: number;
  maxRows: number;
}

/**
 * 输入框 props 定义
 */
export const inputProps = {
  /** v-model 值 */
  modelValue: {
    type: String,
    default: "",
  },
  /** 占位符 */
  placeholder: {
    type: String,
    default: "",
  },
  /** 自动调整大小配置 */
  autoSize: {
    type: Object as PropType<AutoSizeConfig>,
    default: () => ({ minRows: 1, maxRows: 6 }),
  },
  /** 是否只读 */
  readOnly: {
    type: Boolean,
    default: false,
  },
  /** 是否禁用 */
  disabled: {
    type: Boolean,
    default: false,
  },
  /** 内置发送按钮禁用状态 */
  submitBtnDisabled: {
    type: Boolean,
    default: undefined,
  },
  /** 是否显示加载状态 */
  loading: {
    type: Boolean,
    default: false,
  },
  /** 是否可清空内容 */
  clearable: {
    type: Boolean,
    default: false,
  },
  /** 是否允许语音输入 */
  allowSpeech: {
    type: Boolean,
    default: false,
  },
  /** 提交方式 */
  submitType: {
    type: String as PropType<SubmitType>,
    default: SubmitType.Enter,
  },
  /** 头部显示时长 */
  headerAnimationTimer: {
    type: Number,
    default: 300,
  },
  /** 输入框宽度 */
  inputWidth: {
    type: String,
    default: "100%",
  },
  /** 输入框变体类型 */
  variant: {
    type: String as PropType<InputVariant>,
    default: InputVariant.Default,
  },
  /** 当变体为 updown 时，是否展示内置样式 */
  showUpdown: {
    type: Boolean,
    default: true,
  },
  /** 输入框样式 */
  inputStyle: {
    type: Object,
    default: () => ({}),
  },
  /** 触发指令的字符串数组 */
  triggerStrings: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  /** 触发指令的弹框是否可见 */
  triggerPopoverVisible: {
    type: Boolean,
    default: false,
  },
  /** 触发指令的弹框宽度 */
  triggerPopoverWidth: {
    type: String,
    default: "fit-content",
  },
  /** 触发指令的弹框左边距 */
  triggerPopoverLeft: {
    type: String,
    default: "0px",
  },
  /** 触发指令的弹框间距 */
  triggerPopoverOffset: {
    type: Number,
    default: 8,
  },
  /** 触发指令的弹框位置 */
  triggerPopoverPlacement: {
    type: String,
    default: "top-start",
  },
};

/**
 * Input 组件 props 类型
 */
export interface InputProps {
  /** v-model 值 */
  modelValue?: string;
  /** 占位符 */
  placeholder?: string;
  /** 自动调整大小配置 */
  autoSize?: AutoSizeConfig;
  /** 是否只读 */
  readOnly?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 内置发送按钮禁用状态 */
  submitBtnDisabled?: boolean | undefined;
  /** 是否显示加载状态 */
  loading?: boolean;
  /** 是否可清空内容 */
  clearable?: boolean;
  /** 是否允许语音输入 */
  allowSpeech?: boolean;
  /** 提交方式 */
  submitType?: SubmitType;
  /** 头部显示时长 */
  headerAnimationTimer?: number;
  /** 输入框宽度 */
  inputWidth?: string;
  /** 输入框变体类型 */
  variant?: InputVariant;
  /** 当变体为 updown 时，是否展示内置样式 */
  showUpdown?: boolean;
  /** 输入框样式 */
  inputStyle?: Record<string, any>;
  /** 触发指令的字符串数组 */
  triggerStrings?: string[];
  /** 触发指令的弹框是否可见 */
  triggerPopoverVisible?: boolean;
  /** 触发指令的弹框宽度 */
  triggerPopoverWidth?: string;
  /** 触发指令的弹框左边距 */
  triggerPopoverLeft?: string;
  /** 触发指令的弹框间距 */
  triggerPopoverOffset?: number;
  /** 触发指令的弹框位置 */
  triggerPopoverPlacement?: string;
}

/**
 * Input 组件上下文类型
 */
export interface InputContext {
  /** 输入框内容的响应式引用 */
  inputValue: Ref<string>;
  /** 组件 props */
  rootProps: InputProps;
  /** 组件 emits 方法 */
  rootEmits: (event: string, ...args: any[]) => void;
}

/**
 * Input 组件支持的事件
 */
export const inputEmits = [
  "submit",
  "cancel",
  "recordingChange",
  "trigger",
  "pasteFile",
  "update:modelValue",
  "update:triggerPopoverVisible",
];

/**
 * Input 组件的 provide/inject key
 */
export const inputInjectionKey = "acs-input";

/**
 * Input 组件 Ref 实例方法类型
 */
export interface InputInstance {
  /** 打开输入框的自定义头部 */
  openHeader: () => void;
  /** 关闭输入框的自定义头部 */
  closeHeader: () => void;
  /** 清空输入框的内容 */
  clear: () => void;
  /** 移除输入框的焦点 */
  blur: () => void;
  /** 聚焦输入框 */
  focus: (position?: "all" | "start" | "end") => void;
  /** 提交输入内容 */
  submit: () => void;
  /** 取消加载状态 */
  cancel: () => void;
  /** 开始语音识别 */
  startRecognition: () => void;
  /** 停止语音识别 */
  stopRecognition: () => void;
  /** 触发指令的弹框可见性 */
  popoverVisible: boolean;
  /** 输入框实例 */
  inputInstance: any;
}
