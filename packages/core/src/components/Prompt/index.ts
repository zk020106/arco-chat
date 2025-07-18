import type { App } from 'vue'
import AcPrompt from './Prompt.vue'

AcPrompt.install = (app: App) => {
  app.component('AcPrompt', AcPrompt)
}

export { AcPrompt }
