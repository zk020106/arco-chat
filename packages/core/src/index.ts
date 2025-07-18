import '@arco-design/web-vue/dist/arco.css'
import './style.css'

import type { App, Plugin } from 'vue'
import { AcBubble } from '@/components/Bubble'
import { AcInput } from '@/components/Input'
import { AcMention } from '@/components/Mention'
import { AcPrompt } from '@/components/Prompt'
import { AcLayout, AcLayoutAside, AcLayoutContent, AcLayoutHeader, AcLayoutSender } from '@/components/Layout'
import { AcMarkdownCard } from '@/components/MarkdownCard'

const installs = [
  { name: 'AcBubble', comp: AcBubble },
  { name: 'AcInput', comp: AcInput },
  { name: 'AcMention', comp: AcMention },
  { name: 'AcPrompt', comp: AcPrompt },
  { name: 'AcLayout', comp: AcLayout },
  { name: 'AcMarkdownCard', comp: AcMarkdownCard },
]

export {
  AcBubble,
  AcInput,
  AcMention,
  AcPrompt,
  AcLayout,
  AcLayoutAside,
  AcLayoutContent,
  AcLayoutHeader,
  AcLayoutSender,
  AcMarkdownCard,
}

// 统一类型导出
export * from './components/Bubble/bubble-types'
export * from './components/Input/input-types'
export * from './components/Layout/layout-types'
export * from './components/MarkdownCard/markdown-card-types'
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
