import type { PluginSimple, PluginWithOptions } from "markdown-it";
import MarkdownIt from "markdown-it";

/**
 * 插件注册信息
 */
export interface PluginRegistration {
  /** 插件名称 */
  name: string;
  /** 插件函数 */
  plugin: PluginSimple | PluginWithOptions<any>;
  /** 插件选项 */
  options?: any;
  /** 是否启用 */
  enabled?: boolean;
  /** 插件优先级（数字越小优先级越高） */
  priority?: number;
  /** 插件描述 */
  description?: string;
}

/**
 * 插件管理器
 */
export class PluginManager {
  private plugins: Map<string, PluginRegistration> = new Map();
  private defaultEnabled: Set<string> = new Set(["mermaid", "latex"]);

  /**
   * 注册插件
   */
  register(registration: PluginRegistration): void {
    this.plugins.set(registration.name, {
      priority: 100,
      enabled: true,
      ...registration,
    });
  }

  /**
   * 注销插件
   */
  unregister(name: string): boolean {
    return this.plugins.delete(name);
  }

  /**
   * 获取插件
   */
  get(name: string): PluginRegistration | undefined {
    return this.plugins.get(name);
  }

  /**
   * 获取所有插件
   */
  getAll(): PluginRegistration[] {
    return Array.from(this.plugins.values());
  }

  /**
   * 启用插件
   */
  enable(name: string): boolean {
    const plugin = this.plugins.get(name);
    if (plugin) {
      plugin.enabled = true;
      return true;
    }
    return false;
  }

  /**
   * 禁用插件
   */
  disable(name: string): boolean {
    const plugin = this.plugins.get(name);
    if (plugin) {
      plugin.enabled = false;
      return true;
    }
    return false;
  }

  /**
   * 检查插件是否启用
   */
  isEnabled(name: string): boolean {
    const plugin = this.plugins.get(name);
    return plugin ? plugin.enabled === true : false;
  }

  /**
   * 应用插件到 markdown-it 实例
   */
  applyPlugins(md: MarkdownIt, enabledPlugins?: string[]): void {
    const pluginsToApply = enabledPlugins
      ? this.getEnabledPluginsByName(enabledPlugins)
      : this.getEnabledPlugins();

    // 按优先级排序
    pluginsToApply.sort((a, b) => (a.priority || 100) - (b.priority || 100));

    // 应用插件
    for (const registration of pluginsToApply) {
      try {
        md.use(registration.plugin as any, registration.options || {});
      } catch (error) {
        console.error(`Failed to apply plugin ${registration.name}:`, error);
      }
    }
  }

  /**
   * 获取启用的插件
   */
  private getEnabledPlugins(): PluginRegistration[] {
    return Array.from(this.plugins.values()).filter(
      plugin => plugin.enabled === true
    );
  }

  /**
   * 根据名称列表获取启用的插件
   */
  private getEnabledPluginsByName(
    enabledNames: string[]
  ): PluginRegistration[] {
    return Array.from(this.plugins.values()).filter(
      plugin => plugin.enabled === true && enabledNames.includes(plugin.name)
    );
  }

  /**
   * 设置默认启用的插件
   */
  setDefaultEnabled(pluginNames: string[]): void {
    this.defaultEnabled.clear();
    pluginNames.forEach(name => this.defaultEnabled.add(name));
  }

  /**
   * 获取默认启用的插件名称
   */
  getDefaultEnabled(): string[] {
    return Array.from(this.defaultEnabled);
  }

  /**
   * 重置为默认状态
   */
  reset(): void {
    this.plugins.clear();
    this.defaultEnabled.clear();
    this.defaultEnabled.add("mermaid");
    this.defaultEnabled.add("latex");
  }

  /**
   * 获取插件统计信息
   */
  getStats(): {
    total: number;
    enabled: number;
    disabled: number;
    plugins: Array<{
      name: string;
      enabled: boolean;
      priority: number;
      description?: string;
    }>;
  } {
    const allPlugins = Array.from(this.plugins.values());
    const enabled = allPlugins.filter(p => p.enabled === true);
    const disabled = allPlugins.filter(p => p.enabled === false);

    return {
      total: allPlugins.length,
      enabled: enabled.length,
      disabled: disabled.length,
      plugins: allPlugins.map(p => ({
        name: p.name,
        enabled: p.enabled === true,
        priority: p.priority || 100,
        description: p.description,
      })),
    };
  }
}

// 创建全局插件管理器实例
export const pluginManager = new PluginManager();

// 导出便捷方法
export const registerPlugin = (registration: PluginRegistration) =>
  pluginManager.register(registration);
export const unregisterPlugin = (name: string) =>
  pluginManager.unregister(name);
export const enablePlugin = (name: string) => pluginManager.enable(name);
export const disablePlugin = (name: string) => pluginManager.disable(name);
export const isPluginEnabled = (name: string) => pluginManager.isEnabled(name);
export const getPlugin = (name: string) => pluginManager.get(name);
export const getAllPlugins = () => pluginManager.getAll();
export const getPluginStats = () => pluginManager.getStats();
