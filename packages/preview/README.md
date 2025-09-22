# Arco Chat Preview

这是一个使用 `@packages/core` 组件库构建的聊天界面预览项目。

## 功能特性

- 🎨 **完整的聊天界面** - 使用 Arco Design Vue 组件库构建
- 💬 **消息气泡** - 支持多种样式的消息显示
- 📱 **响应式设计** - 适配桌面端和移动端
- 🎯 **打字机效果** - AI 回复支持打字机动画
- 🎤 **语音输入** - 支持语音输入功能
- 📝 **Markdown 渲染** - 支持 Markdown 格式的消息内容
- 🔄 **实时更新** - 支持消息的实时发送和接收

## 技术栈

- Vue 3 + TypeScript
- Arco Design Vue
- Vite
- SCSS

## 快速开始

### 安装依赖

```bash
# 在项目根目录执行
pnpm install
```

### 构建核心包

```bash
# 构建核心组件库
pnpm --filter arco-design-x build
```

### 启动预览项目

```bash
# 方式1：只启动预览项目（需要先手动构建核心包）
pnpm --filter @arco-chat/preview dev

# 方式2：同时监听核心包和预览项目的变化（推荐）
pnpm --filter @arco-chat/preview dev:watch
```

### 开发模式说明

- **`dev`**: 只启动预览项目，需要先手动构建核心包
- **`dev:watch`**: 同时监听核心包和预览项目的变化，修改核心包源码时会自动重新构建并热更新预览项目

推荐使用 `dev:watch` 模式进行开发，这样修改核心包的任何代码都会自动反映到预览项目中，无需手动打包。

### 构建预览项目

```bash
# 构建生产版本
pnpm --filter @arco-chat/preview build
```

## 项目结构

```
packages/preview/
├── src/
│   ├── App.vue          # 主应用组件
│   ├── main.ts          # 应用入口
│   ├── style.css        # 全局样式
│   └── vue-shims.d.ts   # Vue 类型声明
├── index.html           # HTML 模板
├── package.json         # 项目配置
├── tsconfig.json        # TypeScript 配置
└── vite.config.ts       # Vite 配置
```

## 组件使用

预览项目展示了以下核心组件的使用方法：

- `Layout` - 主布局容器
- `Aside` - 侧边栏
- `Header` - 头部区域
- `Content` - 主内容区
- `Sender` - 输入区域
- `BubbleList` - 消息列表
- `Input` - 输入组件

## 开发说明

1. 确保核心包 `arco-design-x` 已经构建完成
2. 预览项目会自动引用本地构建的核心包
3. 支持热重载，修改代码后会自动刷新
4. 所有样式都使用 Arco Design 的设计令牌

## 浏览器支持

- Chrome >= 87
- Firefox >= 78
- Safari >= 14
- Edge >= 88
