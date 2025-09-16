import DefaultTheme from 'vitepress/theme'
import { useDark, usePreferredDark, useToggle } from '@vueuse/core'

// 引入 Arco 样式（明暗主题）
import '@arco-design/web-vue/dist/arco.css'

function syncArcoTheme(isDark: boolean) {
  const body = document.body
  if (isDark) {
    body.setAttribute('arco-theme', 'dark')
  } else {
    body.removeAttribute('arco-theme')
  }
}

export default {
  ...DefaultTheme,
  enhanceApp(ctx: any) {
    // 先运行默认主题的 enhanceApp
    // @ts-ignore
    DefaultTheme.enhanceApp && DefaultTheme.enhanceApp(ctx)
    if (typeof window === 'undefined') return
    const isDark = useDark({
      selector: 'html',
      attribute: 'class',
      valueDark: 'dark',
      valueLight: '',
      storageKey: 'vitepress-theme-appearance'
    })
    // 初始同步
    syncArcoTheme(!!isDark.value)
    // 响应切换
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const apply = () => syncArcoTheme(!!isDark.value)
    const onChange = () => apply()
    // 监听 storage 与媒体查询都能触发 useDark 的值变化，但这里稳妥起见双保
    media.addEventListener?.('change', onChange)
    window.addEventListener('storage', onChange)
    const stop = () => {
      media.removeEventListener?.('change', onChange)
      window.removeEventListener('storage', onChange)
    }
    // 首次应用一次
    apply()
    // HMR 清理
    // @ts-ignore
    if (import.meta && import.meta.hot && stop) {
      // @ts-ignore
      import.meta.hot.on('vite:beforeFullReload', () => stop())
    }
  }
}