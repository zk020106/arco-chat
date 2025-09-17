import type { App } from 'vue'
import Mention from './Mention.vue'

Mention.install = (app: App) => {
  app.component('Mention', Mention)
}

export { Mention }
