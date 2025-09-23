import type { App } from 'vue'
import Layout from './Layout.vue'

Layout.install = (app: App) => {
  app.component('Layout', Layout)
}

export { Layout }
