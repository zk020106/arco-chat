import type { App } from 'vue'
import Aside from './Aside.vue'
import Content from './Content.vue'
import Header from './Header.vue'
import Layout from './Layout.vue'
import Sender from './Sender.vue'

Layout.install = (app: App) => {
  app.component('Aside', Aside)
  app.component('Content', Content)
  app.component('Header', Header)
  app.component('Layout', Layout)
  app.component('Sender', Sender)
}

export { Aside, Content, Header, Layout, Sender }
