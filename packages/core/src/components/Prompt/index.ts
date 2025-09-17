import type { App } from 'vue'
import Prompt from './Prompt.vue'

export { type PromptProps } from './prompt-types'
export { default as Prompt } from './Prompt.vue'

Prompt.install = (app: App) => {
  app.component('Prompt', Prompt)
}


