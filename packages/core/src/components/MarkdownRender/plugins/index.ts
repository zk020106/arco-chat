// 导出插件
export { mermaidPlugin, processMermaidDiagrams } from './mermaid-plugin'
export type { MermaidPluginOptions } from './mermaid-plugin'

export { latexPlugin } from './latex-plugin'
export type { LatexPluginOptions } from './latex-plugin'

export { emojiPluginWrapper as emojiPlugin } from './emoji-plugin'
export type { EmojiPluginOptions } from './emoji-plugin'

// 导出插件管理器
export { 
  PluginManager, 
  pluginManager,
  registerPlugin,
  unregisterPlugin,
  enablePlugin,
  disablePlugin,
  isPluginEnabled,
  getPlugin,
  getAllPlugins,
  getPluginStats
} from './plugin-manager'
export type { PluginRegistration } from './plugin-manager'

// 默认插件配置
export const defaultPluginOptions = {
  mermaid: {
    theme: 'default' as const,
    securityLevel: 'strict' as const,
    responsive: true,
    animate: true,
  },
  latex: {
    strict: 'warn' as const,
    trust: false,
    throwOnError: true,
    errorColor: '#cc0000',
  },
  emoji: {
    enabled: true,
    size: '1em',
    className: 'emoji',
    renderMode: 'unicode' as const,
    shortcuts: {
      'smile': [':)', ':-)'],
      'laughing': ':D',
      'heart': '<3',
      'thumbsup': ':+1:',
      'thumbsdown': ':-1:',
    },
  },
}

// 初始化内置插件
import { pluginManager } from './plugin-manager'
import { mermaidPlugin } from './mermaid-plugin'
import { latexPlugin } from './latex-plugin'
import { emojiPluginWrapper as emojiPlugin } from './emoji-plugin'

// 注册内置插件
pluginManager.register({
  name: 'mermaid',
  plugin: mermaidPlugin,
  options: defaultPluginOptions.mermaid,
  priority: 10,
  description: 'Mermaid 图表渲染插件',
})

pluginManager.register({
  name: 'latex',
  plugin: latexPlugin,
  options: defaultPluginOptions.latex,
  priority: 20,
  description: 'LaTeX 数学公式渲染插件',
})

pluginManager.register({
  name: 'emoji',
  plugin: emojiPlugin,
  options: defaultPluginOptions.emoji,
  priority: 30,
  description: 'Emoji 表情符号支持插件',
})
