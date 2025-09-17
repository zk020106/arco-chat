import type { App } from 'vue'
import AcBubble from './Bubble.vue'
import AcBubbleList from './BubbleList.vue'

AcBubble.install = (app: App) => {
  app.component('AcBubble', AcBubble)
}

AcBubbleList.install = (app: App) => {
  app.component('AcBubbleList', AcBubbleList)
}

export { AcBubble, AcBubbleList }
