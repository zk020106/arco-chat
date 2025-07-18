import type { App } from 'vue'
import MarkdownCard from './MarkdownCard.vue'

const AcMarkdownCard = MarkdownCard

AcMarkdownCard.install = (app: App) => {
  app.component('AcMarkdownCard', MarkdownCard)
}

export { AcMarkdownCard }
export default AcMarkdownCard
