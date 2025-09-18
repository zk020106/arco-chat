import mermaid from 'mermaid'
import type { PluginSimple } from 'markdown-it'

/**
 * Mermaid 插件配置
 */
export interface MermaidPluginOptions {
  /** 主题配置 */
  theme?: 'default' | 'dark' | 'forest' | 'neutral' | 'base'
  /** 是否启用安全模式 */
  securityLevel?: 'strict' | 'loose' | 'antiscript' | 'sandbox'
  /** 是否启用响应式 */
  responsive?: boolean
  /** 是否启用动画 */
  animate?: boolean
  /** 流程图配置 */
  flowchart?: {
    /** 节点间距 */
    nodeSpacing?: number
    /** 层级间距 */
    rankSpacing?: number
    /** 曲线类型 */
    curve?: 'basis' | 'linear' | 'cardinal' | 'step'
  }
  /** 序列图配置 */
  sequence?: {
    /** 图表宽度 */
    width?: number
    /** 图表高度 */
    height?: number
    /** 框边距 */
    boxMargin?: number
    /** 框文本边距 */
    boxTextMargin?: number
    /** 注释边距 */
    noteMargin?: number
    /** 消息边距 */
    messageMargin?: number
    /** 消息对齐 */
    messageAlign?: 'left' | 'center' | 'right'
  }
  /** Gantt 图配置 */
  gantt?: {
    /** 标题高度 */
    titleHeight?: number
    /** 条形高度 */
    barHeight?: number
    /** 字体大小 */
    fontSize?: number
    /** 网格线开始 */
    gridLineStartPadding?: number
    /** 底部填充 */
    bottomPadding?: number
    /** 左侧填充 */
    leftPadding?: number
    /** 网格线间隔 */
    gridLineInterval?: number
    /** 箭头偏移 */
    arrowMarkerAbsolute?: boolean
  }
}

/**
 * 初始化 Mermaid
 */
function initMermaid(options: MermaidPluginOptions = {}) {
  mermaid.initialize({
    theme: options.theme || 'default',
    securityLevel: options.securityLevel || 'strict',
    flowchart: {
      nodeSpacing: 50,
      rankSpacing: 50,
      curve: 'basis',
      ...options.flowchart,
    },
    sequence: {
      width: 150,
      height: 65,
      boxMargin: 10,
      boxTextMargin: 5,
      noteMargin: 10,
      messageMargin: 35,
      messageAlign: 'center',
      ...options.sequence,
    },
    gantt: {
      titleHeight: 30,
      barHeight: 20,
      fontSize: 11,
      gridLineStartPadding: 35,
      bottomPadding: 25,
      leftPadding: 75,
      gridLineInterval: 1,
      arrowMarkerAbsolute: false,
      ...options.gantt,
    },
  } as any)
}

/**
 * 渲染 Mermaid 图表
 */
async function renderMermaid(content: string, id: string): Promise<string> {
  try {
    const { svg } = await mermaid.render(id, content)
    return svg
  } catch (error) {
    console.error('Mermaid rendering error:', error)
    return `<div class="mermaid-error" style="color: red; padding: 10px; border: 1px solid red; border-radius: 4px;">
      <strong>Mermaid 渲染错误:</strong> ${error instanceof Error ? error.message : String(error)}
      <pre style="margin-top: 10px; font-size: 12px; color: #666;">${content}</pre>
    </div>`
  }
}

/**
 * Markdown-it Mermaid 插件
 */
export const mermaidPlugin: PluginSimple = (md, options: MermaidPluginOptions = {}) => {
  // 初始化 Mermaid
  initMermaid(options)

  // 添加 Mermaid 代码块渲染规则
  const originalFence = md.renderer.rules.fence

  md.renderer.rules.fence = function (tokens, idx, options, env, renderer) {
    const token = tokens[idx]
    const info = token.info ? md.utils.unescapeAll(token.info).trim() : ''
    const langName = info ? info.split(/\s+/g)[0] : ''

    // 如果是 mermaid 代码块
    if (langName === 'mermaid') {
      const content = token.content.trim()
      const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      
      // 返回一个占位符，稍后通过 JavaScript 渲染
      return `<div class="mermaid-container" data-mermaid-id="${id}" data-mermaid-content="${encodeURIComponent(content)}">
        <div class="mermaid-loading" style="text-align: center; padding: 20px; color: #666;">
          <div>正在渲染 Mermaid 图表...</div>
        </div>
      </div>`
    }

    // 其他代码块使用原始渲染器
    return originalFence ? originalFence(tokens, idx, options, env, renderer) : ''
  }
}

/**
 * 处理页面中的 Mermaid 图表
 */
export async function processMermaidDiagrams(container: HTMLElement): Promise<void> {
  const mermaidContainers = container.querySelectorAll('.mermaid-container')
  
  for (const container of mermaidContainers) {
    const id = container.getAttribute('data-mermaid-id')
    const content = container.getAttribute('data-mermaid-content')
    
    if (id && content) {
      try {
        const decodedContent = decodeURIComponent(content)
        const svg = await renderMermaid(decodedContent, id)
        container.innerHTML = svg
      } catch (error) {
        console.error('Failed to render Mermaid diagram:', error)
        container.innerHTML = `<div class="mermaid-error" style="color: red; padding: 10px; border: 1px solid red; border-radius: 4px;">
          <strong>Mermaid 渲染失败:</strong> ${error instanceof Error ? error.message : String(error)}
        </div>`
      }
    }
  }
}

export default mermaidPlugin
