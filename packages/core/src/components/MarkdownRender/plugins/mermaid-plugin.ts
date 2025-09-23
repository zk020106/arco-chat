import type { PluginSimple } from "markdown-it";

/**
 * Mermaid 插件配置
 */
export interface MermaidPluginOptions {
  /** 是否启用 Mermaid 支持 */
  enabled?: boolean;
  /** 渲染模式 */
  mode?: "inline" | "external" | "lazy";
  /** 外部服务 URL（当 mode 为 'external' 时使用） */
  externalUrl?: string;
  /** 主题配置 */
  theme?: "default" | "dark" | "forest" | "neutral" | "base";
  /** 是否启用安全模式 */
  securityLevel?: "strict" | "loose" | "antiscript" | "sandbox";
  /** 是否启用响应式 */
  responsive?: boolean;
  /** 是否启用动画 */
  animate?: boolean;
}

/**
 * 渲染 Mermaid 组件标签
 */
function renderMermaidBlock(
  content: string,
  options: MermaidPluginOptions
): string {
  const encodedContent = encodeURIComponent(content);
  const theme = options.theme || "default";

  return `<mermaid-block 
    code="${encodedContent}" 
    theme="${theme}"
    show-code-toggle="true"
    show-zoom="true"
    show-export="true"
    show-fullscreen="true"
  ></mermaid-block>`;
}

/**
 * Markdown-it Mermaid 插件
 */
export const mermaidPlugin: PluginSimple = (
  md,
  options: MermaidPluginOptions = {}
) => {
  const defaultOptions: MermaidPluginOptions = {
    enabled: true,
    mode: "inline", // 使用内联模式，渲染为组件
    theme: "default",
    securityLevel: "strict",
    responsive: true,
    animate: true,
    ...options,
  };

  if (!defaultOptions.enabled) return;

  // 添加 Mermaid 代码块渲染规则
  const originalFence = md.renderer.rules.fence;

  md.renderer.rules.fence = function (tokens, idx, options, env, renderer) {
    const token = tokens[idx];
    const info = token.info ? md.utils.unescapeAll(token.info).trim() : "";
    const langName = info ? info.split(/\s+/g)[0] : "";

    // 如果是 mermaid 代码块
    if (langName === "mermaid") {
      const content = token.content.trim();

      // 返回 MermaidBlock 组件标签
      return renderMermaidBlock(content, defaultOptions);
    }

    // 其他代码块使用原始渲染器
    return originalFence
      ? originalFence(tokens, idx, options, env, renderer)
      : "";
  };
};

/**
 * 处理页面中的 Mermaid 图表（现在由组件自己处理）
 */
export async function processMermaidDiagrams(
  _container: HTMLElement
): Promise<void> {
  // 现在 MermaidBlock 组件会自己处理渲染
  // 这个函数保留是为了兼容性，但实际不需要做任何事情
  // 移除 console.log 避免重复输出
}

export default mermaidPlugin;
