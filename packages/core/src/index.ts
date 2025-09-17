import '@arco-design/web-vue/dist/arco.css'
import './style.css'

import type { App, Plugin } from 'vue'
import { AcBubble, AcBubbleList } from '@/components/Bubble'
import { AcInput } from '@/components/Input'
import { AcMention } from '@/components/Mention'
import { AcPrompt } from '@/components/Prompt'
import { AcLayout, AcLayoutAside, AcLayoutContent, AcLayoutHeader, AcLayoutSender } from '@/components/Layout'
import { AcMarkdownRenderer } from '@/components/MarkdownRenderer'

const installs = [
  { name: 'AcBubble', comp: AcBubble },
  { name: 'AcBubbleList', comp: AcBubbleList },
  { name: 'AcInput', comp: AcInput },
  { name: 'AcMention', comp: AcMention },
  { name: 'AcPrompt', comp: AcPrompt },
  { name: 'AcLayout', comp: AcLayout },
  { name: 'AcMarkdownRenderer', comp: AcMarkdownRenderer },
]

export {
  AcBubble,
  AcBubbleList,
  AcInput,
  AcMention,
  AcPrompt,
  AcLayout,
  AcLayoutAside,
  AcLayoutContent,
  AcLayoutHeader,
  AcLayoutSender,
  AcMarkdownRenderer,
}

// 统一类型导出
export * from './components/Bubble/bubble-types'
export * from './components/Input/input-types'
export * from './components/Layout/layout-types'
export * from './components/MarkdownRenderer/markdown-renderer-types'
export * from './components/Mention/mention-types'
export * from './components/Prompt/prompt-types'

const arcoChat: Plugin = {
  install(app: App) {
    installs.forEach(({ name, comp }) => {
      app.component(name, comp)
    })
  },
}

export default arcoChat
