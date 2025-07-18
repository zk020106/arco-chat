import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import * as path from "node:path";

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern' // 或者 'modern-compiler'
      }
    }
  },
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'ArcoChat',
      fileName: (format) => {
        if (format === 'es') return 'index.es.js';
        if (format === 'cjs') return 'index.cjs.js';
        if (format === 'umd') return 'index.umd.js';
        return `index.${format}.js`;
      },
      formats: ['es', 'cjs', 'umd'] // 必须包含 'cjs'
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
      '@': path.resolve(__dirname, 'src'), // 将@映射到src目录
    },
  },
  plugins: [vue(), dts({
    entryRoot: 'src',
    outDir: 'dist',
    include: ['src/components', 'src/index.ts'],
  }),],
});
