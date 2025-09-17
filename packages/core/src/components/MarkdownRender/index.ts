import type { App } from 'vue'
import MarkdownRender from './MarkdownRender.vue'

export { type MarkdownRenderProps } from './markdown-render-types'
export { default as MarkdownRender } from './MarkdownRender.vue'

// 兼容旧名安装，但对外名称为 MarkdownRender
MarkdownRender.install = (app: App) => {
  app.component('MarkdownRender', MarkdownRender)
}


