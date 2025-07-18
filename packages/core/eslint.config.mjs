import antfu from '@antfu/eslint-config'

// https://github.com/antfu/eslint-config
export default antfu(
  {
    vue: {
      overrides: {
        'vue/block-order': ['error', {
          order: [['script', 'template'], 'style'],
        }], // 强制组件顶级元素的顺序
        'vue/define-macros-order': ['error', {
          order: ['defineOptions', 'defineModel', 'defineProps', 'defineEmits', 'defineSlots'],
          defineExposeLast: true,
        }], // 强制执行定义限制和定义弹出编译器宏的顺序
        'vue/singleline-html-element-content-newline': 'off', // 要求在单行元素的内容前后换行
        'vue/html-self-closing': ['off', {
          html: {
            void: 'never',
            normal: 'always',
            component: 'never',
          },
        }], // 强制自结束样式
        'vue/custom-event-name-casing': ['error', 'kebab-case'], // 对自定义事件名称强制使用特定大小写
      },
    },
    typescript: true,
    ignores: [
      '**/*.md',
      '.github',
      '.image',
      'src/types/shims-vue.d.ts',
    ],
  },
  {
    rules: {
      'curly': ['off', 'all'], // 对所有控制语句强制使用一致的大括号样式
      'no-new': 'off', // 不允许在赋值或比较之外使用 new 运算符
      // 'no-console': 'error', // 禁止使用 console
      'style/arrow-parens': ['error', 'always'], // 箭头函数参数需要括号
      'style/brace-style': ['error', '1tbs', { allowSingleLine: true }], // 对块执行一致的大括号样式
      'regexp/no-unused-capturing-group': 'off',
      'regexp/no-super-linear-backtracking': 'off',
      'node/prefer-global/process': 'off',
      'antfu/top-level-function': 'off',
      'antfu/if-newline': 'off',
      // 关闭 jsdoc 相关规则
      'jsdoc/check-tag-names': 'off',
      'jsdoc/check-types': 'off',
      'jsdoc/require-jsdoc': 'off',
      // ...可根据报错关闭其它 jsdoc 规则
    },
  },
)
