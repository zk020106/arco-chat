import type { App } from 'vue'
import AcInput from './Input.vue'

AcInput.install = (app: App) => {
  app.component('AcInput', AcInput)
}

export { AcInput }
