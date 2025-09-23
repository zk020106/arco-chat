import katex from "katex";
import type { PluginSimple } from "markdown-it";

/**
 * LaTeX 插件配置
 */
export interface LatexPluginOptions {
  /** 是否启用严格模式 */
  strict?: boolean | "ignore" | "warn" | "error";
  /** 是否启用信任模式 */
  trust?:
    | boolean
    | ((context: {
        command: string;
        url: string;
        protocol: string;
      }) => boolean);
  /** 是否启用宏 */
  macros?: Record<string, string>;
  /** 是否启用颜色扩展 */
  colorIsTextColor?: boolean;
  /** 最大展开次数 */
  maxExpand?: number;
  /** 最大宏数量 */
  maxMacros?: number;
  /** 是否启用全局组 */
  globalGroup?: boolean;
  /** 是否启用 fleqn */
  fleqn?: boolean;
  /** 是否启用 leqno */
  leqno?: boolean;
  /** 是否启用 throwOnError */
  throwOnError?: boolean;
  /** 错误颜色 */
  errorColor?: string;
  /** 最小规则厚度 */
  minRuleThickness?: number;
  /** 颜色模型 */
  colorModel?: "rgb" | "hsl" | "cmyk";
}

/**
 * 渲染内联 LaTeX 公式
 */
function renderInlineLatex(
  latex: string,
  options: LatexPluginOptions = {}
): string {
  try {
    return katex.renderToString(latex, {
      displayMode: false,
      strict: options.strict || "warn",
      trust: options.trust || false,
      macros: options.macros || {},
      colorIsTextColor: options.colorIsTextColor || false,
      maxExpand: options.maxExpand || 1000,
      maxMacros: options.maxMacros || 1000,
      globalGroup: options.globalGroup || false,
      fleqn: options.fleqn || false,
      leqno: options.leqno || false,
      throwOnError: options.throwOnError !== false,
      errorColor: options.errorColor || "#cc0000",
      minRuleThickness: options.minRuleThickness || 0.04,
      colorModel: options.colorModel || "rgb",
    });
  } catch (error) {
    console.error("Inline LaTeX rendering error:", error);
    return `<span class="latex-error" style="color: red; background: #ffe6e6; padding: 2px 4px; border-radius: 2px; font-size: 0.9em;">
      LaTeX 错误: ${error instanceof Error ? error.message : String(error)}
    </span>`;
  }
}

/**
 * 渲染块级 LaTeX 公式
 */
function renderBlockLatex(
  latex: string,
  options: LatexPluginOptions = {}
): string {
  try {
    return katex.renderToString(latex, {
      displayMode: true,
      strict: options.strict || "warn",
      trust: options.trust || false,
      macros: options.macros || {},
      colorIsTextColor: options.colorIsTextColor || false,
      maxExpand: options.maxExpand || 1000,
      maxMacros: options.maxMacros || 1000,
      globalGroup: options.globalGroup || false,
      fleqn: options.fleqn || false,
      leqno: options.leqno || false,
      throwOnError: options.throwOnError !== false,
      errorColor: options.errorColor || "#cc0000",
      minRuleThickness: options.minRuleThickness || 0.04,
      colorModel: options.colorModel || "rgb",
    });
  } catch (error) {
    console.error("Block LaTeX rendering error:", error);
    return `<div class="latex-error" style="color: red; background: #ffe6e6; padding: 10px; border-radius: 4px; margin: 10px 0; border-left: 4px solid red;">
      <strong>LaTeX 渲染错误:</strong> ${error instanceof Error ? error.message : String(error)}
      <pre style="margin-top: 10px; font-size: 12px; color: #666; background: #f5f5f5; padding: 8px; border-radius: 2px;">${latex}</pre>
    </div>`;
  }
}

/**
 * Markdown-it LaTeX 插件
 */
export const latexPlugin: PluginSimple = (
  md,
  options: LatexPluginOptions = {}
) => {
  // 内联 LaTeX 公式：$...$
  const inlineLatexRule = (state: any, silent: boolean) => {
    const start = state.pos;
    const max = state.posMax;

    // 检查是否以 $ 开头
    if (state.src.charCodeAt(start) !== 0x24 /* $ */) {
      return false;
    }

    // 查找结束的 $
    let pos = start + 1;
    let found = false;
    while (pos < max) {
      if (state.src.charCodeAt(pos) === 0x24 /* $ */) {
        found = true;
        break;
      }
      pos++;
    }

    if (!found || pos === start + 1) {
      return false;
    }

    const latex = state.src.slice(start + 1, pos);
    if (silent) {
      return true;
    }

    const token = state.push("latex_inline", "", 0);
    token.content = latex;
    token.markup = "$";

    state.pos = pos + 1;
    return true;
  };

  // 块级 LaTeX 公式：$$...$$
  const blockLatexRule = (
    state: any,
    start: number,
    end: number,
    silent: boolean
  ) => {
    const pos = state.bMarks[start] + state.tShift[start];
    const max = state.eMarks[start];

    // 检查是否以 $$ 开头
    if (pos + 1 >= max || state.src.slice(pos, pos + 2) !== "$$") {
      return false;
    }

    // 查找结束的 $$
    let found = false;
    let posEnd = pos + 2;
    while (posEnd < max - 1) {
      if (state.src.slice(posEnd, posEnd + 2) === "$$") {
        found = true;
        break;
      }
      posEnd++;
    }

    if (!found) {
      return false;
    }

    const latex = state.src.slice(pos + 2, posEnd);
    if (silent) {
      return true;
    }

    const token = state.push("latex_block", "", 0);
    token.content = latex;
    token.markup = "$$";
    token.map = [start, state.line];

    state.line = start + 1;
    return true;
  };

  // 注册内联规则
  md.inline.ruler.before("escape", "latex_inline", inlineLatexRule);

  // 注册块级规则
  md.block.ruler.before("fence", "latex_block", blockLatexRule, {
    alt: ["paragraph", "reference", "blockquote", "list"],
  });

  // 渲染内联 LaTeX
  md.renderer.rules.latex_inline = function (tokens, idx) {
    const token = tokens[idx];
    return renderInlineLatex(token.content, options);
  };

  // 渲染块级 LaTeX
  md.renderer.rules.latex_block = function (tokens, idx) {
    const token = tokens[idx];
    return renderBlockLatex(token.content, options);
  };
};

export default latexPlugin;
