/**
 * 输入框显示类型
 * - simple: 简洁模式
 * - full: 完整模式
 */
export var DisplayType;
(function (DisplayType) {
    DisplayType["Simple"] = "simple";
    DisplayType["Full"] = "full";
})(DisplayType || (DisplayType = {}));
/**
 * 输入框样式类型
 * - bordered: 有边框
 * - borderless: 无边框
 */
export var InputVariant;
(function (InputVariant) {
    InputVariant["Bordered"] = "bordered";
    InputVariant["BorderLess"] = "borderless";
})(InputVariant || (InputVariant = {}));
/**
 * 发送按钮样式类型
 * - full: 全按钮
 * - simple: 简洁按钮
 */
export var SendBtnVariant;
(function (SendBtnVariant) {
    SendBtnVariant["Full"] = "full";
    SendBtnVariant["Simple"] = "simple";
})(SendBtnVariant || (SendBtnVariant = {}));
/**
 * 快捷提交键类型
 * - enter: 回车提交
 * - shiftEnter: Shift+Enter 换行
 */
export var SubmitShortKey;
(function (SubmitShortKey) {
    SubmitShortKey["Enter"] = "enter";
    SubmitShortKey["ShiftEnter"] = "shiftEnter";
})(SubmitShortKey || (SubmitShortKey = {}));
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
        type: String,
        default: DisplayType.Full,
    },
    /** 输入框样式类型 */
    variant: {
        type: String,
        default: InputVariant.Bordered,
    },
    /** 发送按钮样式类型 */
    sendBtnVariant: {
        type: String,
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
        type: [String, null],
        default: SubmitShortKey.Enter,
    },
};
/**
 * Input 组件支持的事件
 */
export const inputEmits = ['change', 'submit', 'cancel', 'focus', 'blur'];
/**
 * Input 组件的 provide/inject key
 */
export const inputInjectionKey = 'acs-input';
