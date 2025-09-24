import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import * as path from "node:path";
import dtsPlugin from "vite-plugin-dts";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ArcoResolver } from "unplugin-vue-components/resolvers";

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern",
      },
    },
  },
  build: {
    lib: {
      entry: {
        index: path.resolve(__dirname, "src/index.ts"),
        style: path.resolve(__dirname, "src/style.ts"),
      },
      name: "ArcoDesignX",
      fileName: (format, entryName) => {
        if (entryName === 'style') {
          return `style.${format === 'es' ? 'js' : 'cjs.js'}`;
        }
        return `arco-design-x.${format === 'es' ? 'es.js' : 'cjs.js'}`;
      },
      formats: ["es", "cjs"],
    },
    cssCodeSplit: false, // 禁用CSS代码分割，统一输出
    rollupOptions: {
      external: [
        "vue",
        "@arco-design/web-vue",
        "markdown-it",
        "highlight.js",
        "xss",
        "mermaid",
        "katex",
        "dayjs",
        "lodash-es",
        "dompurify",
        "markdown-it-emoji",
        "markdown-it-katex",
        "markdown-it-plantuml",
        "@datatraccorporation/markdown-it-mermaid",
      ],
      output: {
        globals: {
          vue: "Vue",
          "@arco-design/web-vue": "ArcoVue",
          "markdown-it": "MarkdownIt",
          "highlight.js": "hljs",
          xss: "XSS",
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'style.css'; // 统一输出为 style.css
          }
          return assetInfo.name || 'assets/[name].[ext]';
        },
      },
    },
    outDir: "dist",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  plugins: [
    vue(),
    AutoImport({
      imports: ["vue", { vue: ["render"] }],
      dts: "src/auto-imports.d.ts", // <--- 强制写到 src 下
      resolvers: [ArcoResolver()],
    }),
    Components({
      dts: "src/components.d.ts",
      resolvers: [
        ArcoResolver({
          sideEffect: true,
        }),
      ],
    }),
           dtsPlugin({
             tsconfigPath: "./tsconfig.build.json",
             insertTypesEntry: true,
             outDir: "dist/types", // 输出目录统一
             rollupTypes: false, // 不在入口目录生成文件
             include: ["src/**/*.ts", "src/**/*.vue"],
           }),
  ],
});
