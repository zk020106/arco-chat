import type { App } from 'vue'
import AcBubble from './Bubble.vue'

AcBubble.install = (app: App) => {
  app.component('AcBubble', AcBubble)
}

export { AcBubble }
