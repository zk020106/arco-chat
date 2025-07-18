# Bubble 气泡组件

## 组件简介
用于展示聊天消息气泡，支持不同类型、头像、状态等。

## 使用示例

### 基础用法
```vue
<Bubble type="sent" avatar="/avatar.png">你好！</Bubble>
```

### 展示加载中
```vue
<Bubble type="received" :loading="true">对方正在输入...</Bubble>
```

### 展示失败状态
```vue
<Bubble type="sent" :failed="true">消息发送失败</Bubble>
```

## Props
| 属性名   | 类型     | 说明           | 默认值   |
|----------|----------|----------------|----------|
| type     | string   | 气泡类型（sent/received） | sent     |
| avatar   | string   | 头像图片地址   | -        |
| loading  | boolean  | 是否显示加载中 | false    |
| failed   | boolean  | 是否显示失败状态 | false   |
| ...      | ...      | ...            | ...      |

## Events
| 事件名   | 说明           | 回调参数   |
|----------|----------------|------------|
| click    | 气泡被点击时   | event      |

## Slots
| 名称     | 说明           |
|----------|----------------|
| default  | 气泡内容       |
| avatar   | 自定义头像内容 |

## Methods
| 方法名   | 说明           | 参数       |
|----------|----------------|------------|
| 无       | -              | -          | 