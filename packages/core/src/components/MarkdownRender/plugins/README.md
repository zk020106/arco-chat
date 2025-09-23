# MarkdownRender 插件系统

MarkdownRender 组件提供了一个强大的插件系统，支持动态添加、移除和管理插件。

## 内置插件

### 1. Mermaid 插件

支持流程图、序列图、甘特图等 Mermaid 图表。

### 2. LaTeX 插件

支持数学公式渲染，包括内联和块级公式。

### 3. Emoji 插件

支持表情符号渲染，包括短代码和 Unicode emoji。

## 插件管理器

插件管理器提供了完整的插件生命周期管理功能：

```typescript
import { pluginManager, registerPlugin } from "./plugins";

// 获取插件统计信息
const stats = pluginManager.getStats();
console.log(
  `总插件数: ${stats.total}, 启用: ${stats.enabled}, 禁用: ${stats.disabled}`
);

// 启用/禁用插件
pluginManager.enable("emoji");
pluginManager.disable("latex");

// 检查插件状态
const isEnabled = pluginManager.isEnabled("mermaid");
```

## 添加自定义插件

### 1. 创建插件

```typescript
// my-custom-plugin.ts
import type { PluginSimple } from "markdown-it";

export interface MyCustomPluginOptions {
  enabled?: boolean;
  customOption?: string;
}

export const myCustomPlugin: PluginSimple = (
  md,
  options: MyCustomPluginOptions = {}
) => {
  if (!options.enabled) return;

  // 添加自定义渲染规则
  md.renderer.rules.custom_rule = function (tokens, idx) {
    const token = tokens[idx];
    return `<div class="custom-content">${token.content}</div>`;
  };
};

export default myCustomPlugin;
```

### 2. 注册插件

```typescript
import { registerPlugin } from "./plugins";
import { myCustomPlugin } from "./my-custom-plugin";

// 注册插件
registerPlugin({
  name: "my-custom",
  plugin: myCustomPlugin,
  options: {
    enabled: true,
    customOption: "value",
  },
  priority: 50,
  description: "我的自定义插件",
});
```

### 3. 在组件中使用

```vue
<template>
  <MarkdownRender :content="content" :plugin-config="pluginConfig" />
</template>

<script setup>
const pluginConfig = {
  "my-custom": {
    enabled: true,
    customOption: "new-value",
  },
};
</script>
```

## 插件优先级

插件按优先级顺序加载，数字越小优先级越高：

- Mermaid: 10
- LaTeX: 20
- Emoji: 30
- 自定义插件: 50+

## 插件配置

每个插件都可以通过 `pluginConfig` 进行配置：

```typescript
const pluginConfig = {
  mermaid: {
    theme: "dark",
    securityLevel: "strict",
    animate: true,
  },
  latex: {
    strict: "warn",
    trust: false,
    throwOnError: true,
  },
  emoji: {
    enabled: true,
    shortcodes: true,
    unicode: true,
    size: "1.2em",
  },
};
```

## 插件开发指南

### 1. 插件结构

```typescript
export interface PluginOptions {
  // 插件配置选项
}

export const myPlugin: PluginSimple = (md, options: PluginOptions = {}) => {
  // 插件实现
};
```

### 2. 常用 API

- `md.renderer.rules` - 自定义渲染规则
- `md.inline.ruler` - 添加内联规则
- `md.block.ruler` - 添加块级规则
- `md.utils.escapeHtml` - HTML 转义
- `md.utils.unescapeAll` - 取消转义

### 3. 错误处理

```typescript
export const myPlugin: PluginSimple = (md, options = {}) => {
  try {
    // 插件逻辑
  } catch (error) {
    console.error("Plugin error:", error);
    // 优雅降级
  }
};
```

### 4. 性能考虑

- 避免在插件中进行重计算
- 使用缓存机制
- 异步操作要正确处理
- 避免内存泄漏

## 示例插件

### 表格增强插件

```typescript
export const tableEnhancePlugin: PluginSimple = (md, options = {}) => {
  const originalTable =
    md.renderer.rules.table_open ||
    function () {
      return "<table>";
    };

  md.renderer.rules.table_open = function (tokens, idx) {
    return '<table class="enhanced-table">';
  };
};
```

### 代码块增强插件

```typescript
export const codeBlockEnhancePlugin: PluginSimple = (md, options = {}) => {
  const originalFence = md.renderer.rules.fence;

  md.renderer.rules.fence = function (tokens, idx, options, env, renderer) {
    const token = tokens[idx];
    const lang = token.info ? md.utils.unescapeAll(token.info).trim() : "";

    if (lang === "enhanced") {
      return `<div class="enhanced-code-block">${token.content}</div>`;
    }

    return originalFence
      ? originalFence(tokens, idx, options, env, renderer)
      : "";
  };
};
```

## 最佳实践

1. **命名规范**: 使用 kebab-case 命名插件
2. **类型安全**: 为插件选项提供完整的 TypeScript 类型
3. **文档完整**: 提供详细的插件文档和使用示例
4. **向后兼容**: 保持插件 API 的向后兼容性
5. **测试覆盖**: 为插件编写完整的测试用例
6. **性能优化**: 避免不必要的计算和 DOM 操作
7. **错误处理**: 提供友好的错误信息和降级方案

## 调试插件

```typescript
// 启用插件调试
pluginManager.getStats().plugins.forEach(plugin => {
  console.log(
    `${plugin.name}: ${plugin.enabled ? "enabled" : "disabled"} (priority: ${plugin.priority})`
  );
});

// 检查插件配置
const mermaidPlugin = pluginManager.get("mermaid");
console.log("Mermaid config:", mermaidPlugin?.options);
```
