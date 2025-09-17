import type { App } from 'vue'
import Bubble from './Bubble.vue'

Bubble.install = (app: App) => {
  app.component('Bubble', Bubble)
}


export { Bubble }
