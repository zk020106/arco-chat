import type { App } from 'vue'
import Input from './Input.vue'

Input.install = (app: App) => {
  app.component('Input', Input)
}

export { Input }
