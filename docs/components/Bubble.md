# Bubble 气泡

用于展示聊天消息气泡。

<img src="/banner-bubble.png" style="width:100%;border-radius:12px;margin-bottom:24px;" />

<VPTabGroup>
  <VPTab label="Demo">

<Bubble type="sent" avatar="/avatar.png">你好！</Bubble>

<Bubble type="received" :loading="true">对方正在输入...</Bubble>

<Bubble type="sent" :failed="true">消息发送失败</Bubble>

  </VPTab>
  <VPTab label="API">

## 引入方式

```ts
import { Bubble } from '@arco-chat/core'
```

## Props

| 属性名   | 类型     | 说明           | 默认值   |
|----------|----------|----------------|----------|
| type     | string   | 气泡类型（sent/received） | sent     |
| avatar   | string   | 头像图片地址   | -        |
| loading  | boolean  | 是否显示加载中 | false    |
| failed   | boolean  | 是否显示失败状态 | false   |

## Events

| 事件名   | 说明           | 回调参数   |
|----------|----------------|------------|
| click    | 气泡被点击时   | event      |

## Slots

| 名称     | 说明           |
|----------|----------------|
| default  | 气泡内容       |
| avatar   | 自定义头像内容 |

  </VPTab>
</VPTabGroup> 