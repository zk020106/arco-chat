# MarkdownCard Markdown 卡片

用于渲染和展示 markdown 格式的内容，支持代码块、思考块等扩展。

<img src="/banner-markdown.png" style="width:100%;border-radius:12px;margin-bottom:24px;" />

<VPTabGroup>
  <VPTab label="Demo">

<MarkdownCard content="# 标题\n正文内容" />

<MarkdownCard content="```js\nconsole.log('Hello')\n```" />

<MarkdownCard content="> 思考：这是一条提示信息" />

  </VPTab>
  <VPTab label="API">

## 引入方式

```ts
import { MarkdownCard } from '@arco-chat/core'
```

## Props

| 属性名   | 类型     | 说明           | 默认值   |
|----------|----------|----------------|----------|
| content  | string   | markdown 内容  | ''       |

## Events

| 事件名   | 说明           | 回调参数   |
|----------|----------------|------------|
| 无       | -              | -          |

## Slots

| 名称     | 说明           |
|----------|----------------|
| default  | 自定义内容覆盖 |

  </VPTab>
</VPTabGroup> 