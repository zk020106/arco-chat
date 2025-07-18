# Input 输入框

用于输入文本内容，支持多行、发送按钮等功能。

<img src="/banner-input.png" style="width:100%;border-radius:12px;margin-bottom:24px;" />

<VPTabGroup>
  <VPTab label="Demo">

<Input v-model="inputValue" placeholder="请输入内容" />

<Input v-model="inputValue" :autosize="true" placeholder="多行输入..." />

<Input v-model="inputValue" show-send @send="onSend" />

  </VPTab>
  <VPTab label="API">

## 引入方式

```ts
import { Input } from '@arco-chat/core'
```

## Props

| 属性名         | 类型           | 说明               | 默认值     |
|----------------|----------------|--------------------|------------|
| modelValue     | string         | 输入框内容         | ''         |
| placeholder    | string         | 占位符             | ''         |
| autosize       | boolean        | 是否自适应高度     | false      |
| showSend       | boolean        | 是否显示发送按钮   | false      |
| disabled       | boolean        | 是否禁用           | false      |
| maxlength      | number         | 最大输入长度       | -          |

## Events

| 事件名   | 说明           | 回调参数         |
|----------|----------------|-----------------|
| send     | 点击发送按钮   | (value: string) |
| input    | 输入内容变化   | (value: string) |
| focus    | 获得焦点       | (event)         |
| blur     | 失去焦点       | (event)         |

## Slots

| 名称     | 说明           |
|----------|----------------|
| default  | 输入框内容区域 |
| prepend  | 输入框前置内容 |
| append   | 输入框后置内容 |

## Methods

| 方法名   | 说明           | 参数           |
|----------|----------------|----------------|
| focus    | 使输入框聚焦   | 无             |
| blur     | 使输入框失焦   | 无             |

  </VPTab>
</VPTabGroup> 