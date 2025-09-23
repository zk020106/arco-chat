<template>
  <div class="mermaid-block">
    <div class="mermaid-block-header">
      <span class="mermaid-block-title">📊 Mermaid 图表</span>
      <div class="mermaid-block-actions">
        <a-button
          v-if="showCodeToggle"
          class="mermaid-block-toggle"
          type="text"
          size="small"
          @click="toggleView"
        >
          <icon-code v-if="showPreview" />
          <icon-eye v-else />
        </a-button>
        <a-button
          v-if="showZoom"
          class="mermaid-block-zoom-out"
          type="text"
          size="small"
          @click="zoomOut"
        >
          <icon-minus />
        </a-button>
        <a-button
          v-if="showZoom"
          class="mermaid-block-zoom-in"
          type="text"
          size="small"
          @click="zoomIn"
        >
          <icon-plus />
        </a-button>
        <a-button
          v-if="showExport"
          class="mermaid-block-export"
          type="text"
          size="small"
          @click="exportImage"
        >
          <icon-download />
        </a-button>
        <a-button
          v-if="showFullscreen"
          class="mermaid-block-fullscreen"
          type="text"
          size="small"
          @click="toggleFullscreen"
        >
          <icon-fullscreen />
        </a-button>
      </div>
    </div>

    <div class="mermaid-block-content">
      <!-- 预览模式 -->
      <div v-show="showPreview" class="mermaid-preview" :style="previewStyle">
        <div v-if="loading" class="mermaid-loading">
          <div class="loading-spinner"></div>
          <div class="loading-text">正在渲染 Mermaid 图表...</div>
        </div>
        <div v-else-if="error" class="mermaid-error">
          <div class="error-icon">❌</div>
          <div class="error-message">{{ error }}</div>
          <a-button type="text" size="small" @click="retryRender"
            >重试</a-button
          >
        </div>
        <div
          v-else
          ref="mermaidContainer"
          class="mermaid-svg-container"
          v-html="renderedSvg"
        ></div>
      </div>

      <!-- 代码模式 -->
      <div v-show="!showPreview" class="mermaid-code">
        <pre><code>{{ code }}</code></pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from "vue";
import { Message } from "@arco-design/web-vue";
import {
  IconCode,
  IconEye,
  IconMinus,
  IconPlus,
  IconDownload,
  IconFullscreen,
} from "@arco-design/web-vue/es/icon";

const props = withDefaults(
  defineProps<{
    code: string;
    theme?: string;
    showCodeToggle?: boolean;
    showZoom?: boolean;
    showExport?: boolean;
    showFullscreen?: boolean;
  }>(),
  {
    theme: "default",
    showCodeToggle: true,
    showZoom: true,
    showExport: true,
    showFullscreen: true,
  }
);

const showPreview = ref(true);
const loading = ref(false);
const error = ref("");
const renderedSvg = ref("");
const mermaidContainer = ref<HTMLElement>();
const zoomLevel = ref(1);
const isFullscreen = ref(false);

// 预览样式
const previewStyle = computed(() => ({
  transform: `scale(${zoomLevel.value})`,
  transformOrigin: "top left",
  transition: "transform 0.2s ease",
}));

// 动态加载 Mermaid
async function loadMermaid(): Promise<any> {
  if (typeof window === "undefined") return null;

  if ((window as any).mermaid) {
    return (window as any).mermaid;
  }

  try {
    const mermaid = await import("mermaid");

    // 设置全局错误处理
    if ((mermaid.default as any).onError) {
      (mermaid.default as any).onError = (error: any) => {
        console.error("Mermaid error:", error);
        // 不显示错误到页面，只记录到控制台
      };
    }

    return mermaid.default;
  } catch (err) {
    console.warn("Failed to load Mermaid:", err);
    return null;
  }
}

// 渲染 Mermaid 图表
async function renderMermaid() {
  if (!props.code.trim()) {
    error.value = "Mermaid 内容为空";
    return;
  }

  // 检查是否是 loading 状态的代码
  if (props.code.includes("正在加载...") && props.code.includes("请稍候")) {
    // loading.value = true
    // renderedSvg.value = '' // 清空之前的渲染结果
    return;
  }

  // loading.value = true
  error.value = "";

  try {
    const mermaid = await loadMermaid();
    if (!mermaid) {
      throw new Error("无法加载 Mermaid 库");
    }

    // 初始化 Mermaid - 配置为忽略错误
    mermaid.initialize({
      theme: props.theme,
      securityLevel: "loose", // 使用宽松的安全级别
      startOnLoad: false,
      suppressErrorRendering: true, // 抑制错误渲染到页面
      suppressWarnings: true, // 抑制警告
      logLevel: "silent", // 静默模式，不输出任何日志
      maxTextSize: 50000, // 增加文本大小限制
    });

    // 生成唯一 ID
    const id = `mermaid-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

    // 尝试渲染图表，如果失败则显示当前内容
    try {
      const { svg } = await mermaid.render(id, props.code);
      renderedSvg.value = svg;
    } catch (renderError) {
      // 如果渲染失败，可能是内容不完整，显示一个简单的占位符
      // console.log('Mermaid render failed (content may be incomplete):', renderError)
      // renderedSvg.value = `
      //   <svg width="100%" height="100" viewBox="0 0 400 100">
      //     <rect width="100%" height="100%" fill="#f8f9fa" stroke="#e9ecef" stroke-width="1" rx="4"/>
      //     <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle"
      //           font-family="Arial, sans-serif" font-size="14" fill="#6c757d">
      //       正在加载 Mermaid 图表...
      //     </text>
      //   </svg>
      // `
    }

    await nextTick();

    // 调整 SVG 大小
    const svgElement = mermaidContainer.value?.querySelector("svg");
    if (svgElement) {
      svgElement.style.maxWidth = "100%";
      svgElement.style.height = "auto";
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : String(err);
    console.error("Mermaid rendering error:", err);
  } finally {
    loading.value = false;
  }
}

// 切换视图
function toggleView() {
  showPreview.value = !showPreview.value;
}

// 缩放功能
function zoomIn() {
  zoomLevel.value = Math.min(zoomLevel.value + 0.2, 3);
}

function zoomOut() {
  zoomLevel.value = Math.max(zoomLevel.value - 0.2, 0.5);
}

// 下载 SVG 文件的辅助函数
const downloadSVG = (svgElement: SVGElement) => {
  try {
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });
    const link = document.createElement("a");
    link.download = `mermaid-diagram-${Date.now()}.svg`;
    link.href = URL.createObjectURL(svgBlob);
    link.click();
    URL.revokeObjectURL(link.href);
    Message.success("SVG 文件导出成功");
  } catch (error) {
    console.error("SVG 导出失败:", error);
    Message.error("导出失败");
  }
};

// 导出图片
async function exportImage() {
  if (!renderedSvg.value) {
    Message.warning("没有可导出的图表");
    return;
  }

  try {
    const svgElement = mermaidContainer.value?.querySelector("svg");
    if (!svgElement) {
      Message.error("无法找到图表元素");
      return;
    }

    // 创建 canvas
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      Message.error("无法创建画布");
      return;
    }

    // 设置 canvas 尺寸
    const rect = svgElement.getBoundingClientRect();
    canvas.width = rect.width * 2; // 高分辨率
    canvas.height = rect.height * 2;

    // 创建图片
    const img = new Image();
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      try {
        ctx.scale(2, 2); // 高分辨率
        ctx.drawImage(img, 0, 0, rect.width, rect.height);

        // 下载图片
        canvas.toBlob(blob => {
          if (blob) {
            const link = document.createElement("a");
            link.download = `mermaid-diagram-${Date.now()}.png`;
            link.href = URL.createObjectURL(blob);
            link.click();
            URL.revokeObjectURL(link.href);
            Message.success("图片导出成功");
          }
        }, "image/png");
      } catch (error) {
        // 如果 Canvas 被污染，回退到下载 SVG
        console.warn("Canvas 被污染，回退到 SVG 下载:", error);
        downloadSVG(svgElement);
      }

      URL.revokeObjectURL(url);
    };

    img.onerror = () => {
      // 如果图片加载失败，回退到下载 SVG
      console.warn("图片加载失败，回退到 SVG 下载");
      downloadSVG(svgElement);
      URL.revokeObjectURL(url);
    };

    img.src = url;
  } catch (err) {
    console.error("Export error:", err);
    Message.error("导出失败");
  }
}

// 全屏功能
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    mermaidContainer.value?.requestFullscreen();
    isFullscreen.value = true;
  } else {
    document.exitFullscreen();
    isFullscreen.value = false;
  }
}

// 重试渲染
function retryRender() {
  renderMermaid();
}

// 监听全屏状态变化
document.addEventListener("fullscreenchange", () => {
  isFullscreen.value = !!document.fullscreenElement;
});

onMounted(() => {
  renderMermaid();
});

// 监听 code 变化，重新渲染
watch(
  () => props.code,
  (newCode, oldCode) => {
    // 如果代码没有实际变化，不重新渲染
    if (newCode === oldCode) return;

    // 如果新代码是空的，不渲染
    if (!newCode || !newCode.trim()) return;

    renderMermaid();
  },
  { immediate: false }
);
</script>

<style lang="scss" scoped>
.mermaid-block {
  border-radius: 8px;
  border: 1px solid var(--color-border-2, #e5e6eb);
  margin-bottom: 16px;
  background: var(--color-fill-2, #f7f8fa);
  overflow: hidden;
}

.mermaid-block-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  font-size: 13px;
  background: var(--color-fill-1, #f2f3f5);
  border-bottom: 1px solid var(--color-border-2, #e5e6eb);
}

.mermaid-block-title {
  color: var(--color-text-2, #4e5969);
  font-weight: 500;
}

.mermaid-block-actions {
  display: flex;
  gap: 4px;
}

.mermaid-block-toggle,
.mermaid-block-zoom-out,
.mermaid-block-zoom-in,
.mermaid-block-export,
.mermaid-block-fullscreen {
  background: none;
  border: none;
  color: var(--color-text-3, #86909c);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: var(--color-fill-2, #f2f3f5);
    color: var(--color-text-1, #1d2129);
  }
}

.mermaid-block-content {
  position: relative;
}

.mermaid-preview {
  padding: 16px;
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mermaid-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 40px 20px;
  color: var(--color-text-3, #86909c);
  min-height: 120px;

  .loading-spinner {
    width: 32px;
    height: 32px;
    border: 3px solid var(--color-border-2, #e5e6eb);
    border-top: 3px solid var(--color-primary-6, #165dff);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .loading-text {
    font-size: 14px;
    font-weight: 500;
    color: var(--color-text-2, #4e5969);
  }
}

.mermaid-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: var(--color-danger-6, #f53f3f);

  .error-icon {
    font-size: 24px;
  }

  .error-message {
    text-align: center;
    font-size: 14px;
  }
}

.mermaid-svg-container {
  width: 100%;
  text-align: center;

  :deep(svg) {
    max-width: 100%;
    height: auto;
  }
}

.mermaid-code {
  padding: 16px;
  background: var(--color-bg-1, #ffffff);

  pre {
    margin: 0;
    padding: 0;
    background: none;
    border: none;

    code {
      font-family: var(
        --font-family-code,
        "Monaco",
        "Menlo",
        "Ubuntu Mono",
        monospace
      );
      font-size: 13px;
      line-height: 1.5;
      color: var(--color-text-1, #1d2129);
      white-space: pre-wrap;
      word-break: break-word;
    }
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

// 全屏模式
:fullscreen {
  .mermaid-preview {
    padding: 32px;
    background: var(--color-bg-1, #ffffff);
  }

  .mermaid-svg-container {
    max-width: 90vw;
    max-height: 90vh;
  }
}
</style>
