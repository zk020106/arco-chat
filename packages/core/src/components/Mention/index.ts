import type { App } from 'vue'
import AcMention from './Mention.vue'

AcMention.install = (app: App) => {
  app.component('AcMention', AcMention)
}

export { AcMention }
