import type { App } from 'vue'
import Typewriter from './Typewriter.vue'

Typewriter.install = (app: App) => {
  app.component('Typewriter', Typewriter)
}

export { Typewriter }
export type { 
  TypewriterConfig,
  TypewriterCompleteStrategy,
  TypewriterProps,
  TypewriterEmits,
  TypewriterExpose
} from './typewriter-types'
