import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import * as path from 'node:path';
import dtsPlugin from "vite-plugin-dts";
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ArcoResolver } from 'unplugin-vue-components/resolvers';

export default defineConfig({
    css: {
        preprocessorOptions: {
            scss: {
                api: 'modern'
            }
        }
    },
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: 'ArcoChatCore',
            fileName: 'index',
            formats: ['es']
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
        outDir: 'dist',
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
    plugins: [
        vue(),
        AutoImport({
            imports:['vue'],
            resolvers: [ArcoResolver()],
        }),
        Components({
            resolvers: [
                ArcoResolver({
                    sideEffect: true
                })
            ]
        }),
        dtsPlugin({
            tsconfigPath: './tsconfig.build.json',
            insertTypesEntry: true,
            outDir: 'dist/types',       // 输出目录统一
            rollupTypes: false,         // 不在入口目录生成文件
            include: ['src/**/*.ts', 'src/**/*.vue']
        }),
        cssInjectedByJsPlugin()
    ],
});
