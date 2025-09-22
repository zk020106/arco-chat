import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ArcoResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ArcoResolver()],
    }),
    Components({
      resolvers: [
        ArcoResolver({
          sideEffect: true
        })
      ]
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      'arco-design-x': resolve(__dirname, '../core/src')
    }
  },
  server: {
    port: 3000,
    open: true,
    watch: {
      // 监听核心包的变化
      ignored: ['!**/node_modules/arco-design-x/**']
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  optimizeDeps: {
    // 不预构建 arco-design-x，让它保持源码形式
    exclude: ['arco-design-x']
  }
})
