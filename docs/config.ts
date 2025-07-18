import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'arco-chat-components',
  description: 'arco-chat-components 组件库文档',
  themeConfig: {
    nav: [
      { text: '指南', link: '/guide/' },
      { text: '组件', link: '/components/' }
    ],
    sidebar: [
      {
        text: '会话',
        items: [
          { text: 'Bubble 气泡', link: '/components/Bubble' }
        ]
      },
      {
        text: '输入',
        items: [
          { text: 'Input 输入', link: '/components/Input' }
        ]
      },
      {
        text: '展示',
        items: [
          { text: 'MarkdownCard 卡片', link: '/components/MarkdownCard' }
        ]
      }
    ]
  }
}) 