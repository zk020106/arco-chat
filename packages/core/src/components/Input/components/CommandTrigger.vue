<template>
  <div v-if="showPopup" class="ac-command-trigger-popup" :style="popupStyle">
    <div class="ac-command-trigger-content">
      <div class="ac-command-trigger-header">
        <span class="ac-command-trigger-title">{{ currentTrigger?.trigger }} 指令</span>
        <button class="ac-command-trigger-close" @click="closePopup">×</button>
      </div>
      
      <div class="ac-command-trigger-body">
        <div v-if="currentTrigger?.popupContent" class="ac-command-trigger-description">
          {{ currentTrigger.popupContent }}
        </div>
        
        <div class="ac-command-trigger-suggestions">
          <div 
            v-for="(suggestion, index) in suggestions" 
            :key="index"
            :class="['ac-command-suggestion', { active: selectedIndex === index }]"
            @click="selectSuggestion(suggestion)"
            @mouseenter="selectedIndex = index"
          >
            <div class="ac-command-suggestion-content">
              <span class="ac-command-suggestion-trigger">{{ suggestion.trigger }}</span>
              <span class="ac-command-suggestion-text">{{ suggestion.text }}</span>
            </div>
            <div v-if="suggestion.description" class="ac-command-suggestion-description">
              {{ suggestion.description }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inputInjectionKey } from '../input-types'
import type { InputContext, CommandTrigger } from '../input-types'

const { inputValue, rootProps, rootEmits } = inject(inputInjectionKey) as InputContext

interface CommandSuggestion {
  trigger: string
  text: string
  description?: string
  value?: string
}

const props = withDefaults(defineProps<{
  triggers: CommandTrigger[]
  cursorPosition: number
  showPopup: boolean
}>(), {
  triggers: () => [],
  cursorPosition: 0,
  showPopup: false
})

const emit = defineEmits<{
  close: []
  select: [suggestion: CommandSuggestion]
}>()

const selectedIndex = ref(0)
const currentTrigger = ref<CommandTrigger | null>(null)

// 计算弹窗位置
const popupStyle = computed(() => {
  return {
    position: 'absolute' as const,
    bottom: '100%',
    left: '0',
    zIndex: 1000,
  }
})

// 计算建议列表
const suggestions = computed<CommandSuggestion[]>(() => {
  if (!currentTrigger.value) return []
  
  // 如果用户提供了自定义建议函数，使用自定义函数
  if (currentTrigger.value.getSuggestions) {
    return currentTrigger.value.getSuggestions(currentTrigger.value.trigger, props.cursorPosition)
  }
  
  // 如果用户提供了建议列表，直接使用
  if (currentTrigger.value.suggestions) {
    return currentTrigger.value.suggestions
  }
  
  // 默认返回空列表，让用户自己实现
  return []
})

// 监听输入变化，检测指令触发
watch(
  () => inputValue.value,
  (newValue) => {
    if (!props.showPopup) return
    
    const text = newValue.slice(0, props.cursorPosition)
    const lastSpaceIndex = text.lastIndexOf(' ')
    const lastChar = text.slice(lastSpaceIndex + 1)
    
    // 检查是否匹配任何触发字符
    const matchedTrigger = props.triggers.find(trigger => 
      lastChar.startsWith(trigger.trigger)
    )
    
    if (matchedTrigger) {
      currentTrigger.value = matchedTrigger
      selectedIndex.value = 0
    } else {
      currentTrigger.value = null
    }
  },
  { immediate: true }
)

// 选择建议
const selectSuggestion = (suggestion: CommandSuggestion) => {
  const text = inputValue.value
  const beforeCursor = text.slice(0, props.cursorPosition)
  const afterCursor = text.slice(props.cursorPosition)
  
  // 找到最后一个触发字符的位置
  const lastSpaceIndex = beforeCursor.lastIndexOf(' ')
  const triggerStart = lastSpaceIndex + 1
  const beforeTrigger = text.slice(0, triggerStart)
  
  // 替换触发字符为建议值
  const newValue = beforeTrigger + (suggestion.value || suggestion.text) + afterCursor
  inputValue.value = newValue
  
  // 触发自定义处理函数
  if (currentTrigger.value?.handler) {
    currentTrigger.value.handler(newValue, triggerStart + (suggestion.value || suggestion.text).length)
  }
  
  emit('select', suggestion)
  emit('close')
}

// 关闭弹窗
const closePopup = () => {
  emit('close')
}

// 键盘导航
const handleKeydown = (event: KeyboardEvent) => {
  if (!props.showPopup || !currentTrigger.value) return
  
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      selectedIndex.value = Math.min(selectedIndex.value + 1, suggestions.value.length - 1)
      break
    case 'ArrowUp':
      event.preventDefault()
      selectedIndex.value = Math.max(selectedIndex.value - 1, 0)
      break
    case 'Enter':
      event.preventDefault()
      if (suggestions.value[selectedIndex.value]) {
        selectSuggestion(suggestions.value[selectedIndex.value])
      }
      break
    case 'Escape':
      event.preventDefault()
      closePopup()
      break
  }
}

// 暴露方法
defineExpose({
  handleKeydown,
})
</script>

<style scoped lang="scss">
.ac-command-trigger-popup {
  background: var(--color-bg-1, #fff);
  border: 1px solid var(--color-border-2, #e5e6eb);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 300px;
  min-width: 200px;
  max-height: 300px;
  overflow: hidden;
}

.ac-command-trigger-content {
  display: flex;
  flex-direction: column;
}

.ac-command-trigger-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-bottom: 1px solid var(--color-border-2, #e5e6eb);
  background: var(--color-bg-2, #f7f8fa);
}

.ac-command-trigger-title {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-2, #4e5969);
}

.ac-command-trigger-close {
  background: none;
  border: none;
  font-size: 16px;
  color: var(--color-text-3, #86909c);
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  
  &:hover {
    background: var(--color-bg-3, #e5e6eb);
  }
}

.ac-command-trigger-body {
  max-height: 200px;
  overflow-y: auto;
}

.ac-command-trigger-description {
  padding: 8px 12px;
  font-size: 12px;
  color: var(--color-text-3, #86909c);
  border-bottom: 1px solid var(--color-border-2, #e5e6eb);
}

.ac-command-trigger-suggestions {
  padding: 4px 0;
}

.ac-command-suggestion {
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover,
  &.active {
    background: var(--color-bg-2, #f7f8fa);
  }
}

.ac-command-suggestion-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ac-command-suggestion-trigger {
  font-weight: 500;
  color: var(--color-primary-6, #165dff);
  font-size: 12px;
  min-width: 16px;
}

.ac-command-suggestion-text {
  font-size: 14px;
  color: var(--color-text-1, #1d2129);
}

.ac-command-suggestion-description {
  margin-top: 2px;
  font-size: 12px;
  color: var(--color-text-3, #86909c);
  margin-left: 24px;
}

// 滚动条样式
.ac-command-trigger-body::-webkit-scrollbar {
  width: 4px;
}

.ac-command-trigger-body::-webkit-scrollbar-track {
  background: transparent;
}

.ac-command-trigger-body::-webkit-scrollbar-thumb {
  background: var(--color-border-3, #c9cdd4);
  border-radius: 2px;
}

.ac-command-trigger-body::-webkit-scrollbar-thumb:hover {
  background: var(--color-border-4, #86909c);
}
</style>
