/**
 * 键盘处理工具类
 * 使用更优雅的方式处理键盘事件，支持跨平台
 */

export interface KeyboardEvent {
  key: string;
  code: string;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  metaKey: boolean;
  preventDefault: () => void;
  stopPropagation: () => void;
}

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  preventDefault?: boolean;
  stopPropagation?: boolean;
}

/**
 * 检查键盘事件是否匹配快捷键
 */
export function matchesShortcut(
  event: KeyboardEvent,
  shortcut: KeyboardShortcut
): boolean {
  const {
    key,
    ctrl = false,
    shift = false,
    alt = false,
    meta = false,
  } = shortcut;

  return (
    event.key.toLowerCase() === key.toLowerCase() &&
    event.ctrlKey === ctrl &&
    event.shiftKey === shift &&
    event.altKey === alt &&
    event.metaKey === meta
  );
}

/**
 * 创建键盘事件处理器
 */
export function createKeyboardHandler(
  shortcuts: Record<string, KeyboardShortcut>
) {
  return (
    event: KeyboardEvent,
    callback: (shortcut: string, event: KeyboardEvent) => void
  ) => {
    for (const [name, shortcut] of Object.entries(shortcuts)) {
      if (matchesShortcut(event, shortcut)) {
        if (shortcut.preventDefault) {
          event.preventDefault();
        }
        if (shortcut.stopPropagation) {
          event.stopPropagation();
        }
        callback(name, event);
        return true;
      }
    }
    return false;
  };
}

/**
 * 常用的键盘快捷键定义
 */
export const COMMON_SHORTCUTS = {
  // 提交相关
  submit: { key: "Enter", preventDefault: true },
  submitWithShift: { key: "Enter", shift: true, preventDefault: true },
  submitWithCtrl: { key: "Enter", ctrl: true, preventDefault: true },
  submitWithAlt: { key: "Enter", alt: true, preventDefault: true },
  submitWithMeta: { key: "Enter", meta: true, preventDefault: true },

  // 换行相关
  newLine: { key: "Enter", preventDefault: true },
  newLineWithShift: { key: "Enter", shift: true, preventDefault: true },

  // 导航相关
  up: { key: "ArrowUp", preventDefault: true },
  down: { key: "ArrowDown", preventDefault: true },
  left: { key: "ArrowLeft" },
  right: { key: "ArrowRight" },

  // 编辑相关
  escape: { key: "Escape", preventDefault: true },
  backspace: { key: "Backspace" },
  delete: { key: "Delete" },

  // 选择相关
  selectAll: { key: "a", ctrl: true, preventDefault: true },
  selectAllMac: { key: "a", meta: true, preventDefault: true },

  // 复制粘贴
  copy: { key: "c", ctrl: true, preventDefault: true },
  copyMac: { key: "c", meta: true, preventDefault: true },
  paste: { key: "v", ctrl: true, preventDefault: true },
  pasteMac: { key: "v", meta: true, preventDefault: true },
  cut: { key: "x", ctrl: true, preventDefault: true },
  cutMac: { key: "x", meta: true, preventDefault: true },

  // 撤销重做
  undo: { key: "z", ctrl: true, preventDefault: true },
  undoMac: { key: "z", meta: true, preventDefault: true },
  redo: { key: "y", ctrl: true, preventDefault: true },
  redoMac: { key: "z", ctrl: true, shift: true, preventDefault: true },
  redoMacAlt: { key: "y", meta: true, preventDefault: true },
} as const;

/**
 * 检测是否为 Mac 系统
 */
export function isMac(): boolean {
  if (typeof window === "undefined") return false;
  return /Mac|iPod|iPhone|iPad/.test(navigator.platform);
}

/**
 * 获取平台相关的修饰键
 */
export function getModifierKey(): "ctrl" | "meta" {
  return isMac() ? "meta" : "ctrl";
}

/**
 * 创建平台相关的快捷键
 */
export function createPlatformShortcut(
  key: string,
  useModifier = true
): KeyboardShortcut {
  const shortcut: KeyboardShortcut = { key };

  if (useModifier) {
    if (isMac()) {
      shortcut.meta = true;
    } else {
      shortcut.ctrl = true;
    }
  }

  return shortcut;
}

/**
 * 输入框专用的键盘处理器
 */
export class InputKeyboardHandler {
  private shortcuts: Record<string, KeyboardShortcut> = {};
  private handlers: Record<string, (event: KeyboardEvent) => void> = {};

  constructor() {
    this.setupDefaultShortcuts();
  }

  private setupDefaultShortcuts() {
    this.shortcuts = {
      submit: { key: "Enter", preventDefault: true },
      submitWithShift: { key: "Enter", shift: true, preventDefault: true },
      submitWithCtrl: { key: "Enter", ctrl: true, preventDefault: true },
      submitWithAlt: { key: "Enter", alt: true, preventDefault: true },
      submitWithMeta: { key: "Enter", meta: true, preventDefault: true },
      escape: { key: "Escape", preventDefault: true },
      up: { key: "ArrowUp", preventDefault: true },
      down: { key: "ArrowDown", preventDefault: true },
    };
  }

  /**
   * 添加快捷键
   */
  addShortcut(
    name: string,
    shortcut: KeyboardShortcut,
    handler: (event: KeyboardEvent) => void
  ) {
    this.shortcuts[name] = shortcut;
    this.handlers[name] = handler;
  }

  /**
   * 移除快捷键
   */
  removeShortcut(name: string) {
    delete this.shortcuts[name];
    delete this.handlers[name];
  }

  /**
   * 处理键盘事件
   */
  handle(event: KeyboardEvent): boolean {
    for (const [name, shortcut] of Object.entries(this.shortcuts)) {
      if (matchesShortcut(event, shortcut)) {
        const handler = this.handlers[name];
        if (handler) {
          handler(event);
          return true;
        }
      }
    }
    return false;
  }

  /**
   * 设置提交快捷键
   */
  setSubmitShortcut(
    type: "enter" | "shiftEnter" | "ctrlEnter" | "altEnter" | "metaEnter"
  ) {
    // 移除现有的提交快捷键
    Object.keys(this.shortcuts).forEach(key => {
      if (key.startsWith("submit")) {
        delete this.shortcuts[key];
        delete this.handlers[key];
      }
    });

    // 添加新的提交快捷键
    switch (type) {
      case "enter":
        this.shortcuts.submit = { key: "Enter", preventDefault: true };
        break;
      case "shiftEnter":
        this.shortcuts.submitWithShift = {
          key: "Enter",
          shift: true,
          preventDefault: true,
        };
        break;
      case "ctrlEnter":
        this.shortcuts.submitWithCtrl = {
          key: "Enter",
          ctrl: true,
          preventDefault: true,
        };
        break;
      case "altEnter":
        this.shortcuts.submitWithAlt = {
          key: "Enter",
          alt: true,
          preventDefault: true,
        };
        break;
      case "metaEnter":
        this.shortcuts.submitWithMeta = {
          key: "Enter",
          meta: true,
          preventDefault: true,
        };
        break;
    }
  }
}
