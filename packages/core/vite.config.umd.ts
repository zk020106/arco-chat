import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import * as path from 'node:path';

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern'
      }
    }
  },
  build: {
    outDir: 'dist/umd',
    lib: {
      entry: 'src/index.ts',
      name: 'ArcoChatCore',
      fileName: () => 'arco-chat-components.umd.js',
      formats: ['umd']
    },
    rollupOptions: {
      external: [
        'vue',
        '@arco-design/web-vue',
        'markdown-it',
        'highlight.js',
        'xss',
      ],
      output: {
        globals: {
          vue: 'Vue',
          '@arco-design/web-vue': 'ArcoVue',
          'markdown-it': 'MarkdownIt',
          'highlight.js': 'hljs',
          'xss': 'XSS',
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [vue(), dts({
    entryRoot: 'src',
    outDir: 'dist/umd/types',
    include: ['src/components', 'src/index.ts'],
  })],
}); 