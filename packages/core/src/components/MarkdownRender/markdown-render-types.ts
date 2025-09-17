// MarkdownRender 组件类型定义

/**
 * 打字机动效配置类型
 */
export interface TypingOptions {
    /** 每步打字字符数或区间 */
    step?: number | [number, number];
    /** 打字间隔(ms) */
    interval?: number;
    /** 打字样式：normal/cursor/gradient/color/stream */
    style?: string;
  }
  
  /**
   * 插槽拦截器 Props 类型
   * 用于插槽拦截机制，自动传递给插槽的参数
   */
  export interface SlotInterceptorProps {
    /** HTML 内容字符串 */
    html: string;
    /** 唯一标识符 */
    key: string;
    /** 原始 HTML 元素的属性 */
    [key: string]: unknown;
  }
  
  /**
   * 表格插槽 Props 类型
   */
  export interface TableSlotProps extends SlotInterceptorProps {
    /** 表格的 HTML 内容 */
    html: string;
    /** 表格的唯一标识 */
    key: string;
    /** 表格的其他属性 */
    [key: string]: unknown;
  }
  
  /**
   * 图片插槽 Props 类型
   */
  export interface ImageSlotProps extends SlotInterceptorProps {
    /** 图片源地址 */
    src: string;
    /** 图片描述 */
    alt?: string;
    /** 图片宽度 */
    width?: string | number;
    /** 图片高度 */
    height?: string | number;
    /** 图片的其他属性 */
    [key: string]: unknown;
  }
  
  /**
   * 链接插槽 Props 类型
   */
  export interface LinkSlotProps extends SlotInterceptorProps {
    /** 链接地址 */
    href: string;
    /** 链接目标 */
    target?: string;
    /** 链接的其他属性 */
    [key: string]: unknown;
  }
  
  /**
   * 代码块插槽 Props 类型
   */
  export interface CodeSlotProps extends SlotInterceptorProps {
    /** 代码语言 */
    lang?: string;
    /** 代码内容 */
    code?: string;
    /** 是否可折叠 */
    foldable?: boolean;
    /** 是否显示复制按钮 */
    showCopy?: boolean;
    /** 代码块的其他属性 */
    [key: string]: unknown;
  }
  
  /**
   * 自定义渲染器类型
   */
  export type CustomRenderer = {
    /** 渲染器组件 */
    component: unknown;
    /** 渲染器配置 */
    options?: Record<string, unknown>;
  };
  
  /**
   * MarkdownRender 组件 props 类型
   */
  export interface MarkdownRenderProps {
    /** markdown 内容 */
    content: string;
    /** 是否打字机动效 */
    typing?: boolean;
    /** 打字机动效配置 */
    typingOptions?: TypingOptions;
    /** 是否启用 think 标签 */
    enableThink?: boolean;
    /** markdown-it 配置 */
    mdOptions?: object;
    /** markdown-it 插件 */
    mdPlugins?: unknown[];
    /** 是否开启安全模式预览HTML代码 */
    safeMode?: boolean;
    /** DOMPurify 清洗配置（safeMode=true 有效） */
    sanitizeOptions?: Record<string, unknown>;
    /** think 插件配置 */
    thinkOptions?: ThinkPluginOptions;
    /** 自定义标签别名映射：如 { 'my-think': 'think-block', 'grid': 'table' } */
    customTags?: Record<string, string>;
    /** 支持的 HTML 标签列表（用于插槽拦截） */
    supportedTags?: string[];
    /** 自定义块标签列表（如 agent-block, task-block 等） */
    customBlockTags?: string[];
  }
  
  /**
   * think 插件配置类型
   */
  export interface ThinkPluginOptions {
    /** 自定义类名 */
    customClass?: string;
  }
  
  /**
   * 插槽函数类型
   */
  export type SlotFunction = (props: SlotInterceptorProps) => unknown;
  
  /**
   * MarkdownRender 组件插槽类型定义
   */
  export interface MarkdownRenderSlots {
    /** 表格插槽 */
    table?: (props: TableSlotProps) => unknown;
    /** 图片插槽 */
    img?: (props: ImageSlotProps) => unknown;
    /** 链接插槽 */
    a?: (props: LinkSlotProps) => unknown;
    /** 代码块插槽 */
    code?: (props: CodeSlotProps) => unknown;
    /** 代码块插槽 */
    pre?: (props: CodeSlotProps) => unknown;
    /** 思考块插槽 */
    'think-block'?: SlotFunction;
    /** 代码块插槽 */
    'code-block'?: (props: CodeSlotProps) => unknown;
    /** 默认插槽 */
    default?: SlotFunction;
    /** 其他 HTML 标签插槽 */
    [key: string]: unknown;
  }
  
  /**
   * 表格数据解析结果类型
   */
  export interface TableParseResult {
    /** 表格列配置 */
    columns: Array<{
      title: string;
      dataIndex: string;
      key: string;
    }>;
    /** 表格数据 */
    data: Record<string, unknown>[];
  }
  
  /**
   * 表格解析函数类型
   */
  export type TableParser = (html: string) => TableParseResult;
  