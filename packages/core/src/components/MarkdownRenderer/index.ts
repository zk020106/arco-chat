import type { App } from 'vue'
import MarkdownRenderer from './MarkdownRenderer.vue'

export { type MarkdownRendererProps } from './markdown-renderer-types'
export { default as MarkdownRenderer } from './MarkdownRenderer.vue'

MarkdownRenderer.install = (app: App) => {
  app.component('MarkdownRenderer', MarkdownRenderer)
}


