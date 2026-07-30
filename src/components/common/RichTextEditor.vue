<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'

const props = defineProps<{ modelValue: string; height?: string }>()
const emit = defineEmits<{ 'update:modelValue': [v: string] }>()

const editorEl = ref<HTMLDivElement>()
let editor: any = null

// 动态加载 wangEditor（轻量级国产富文本编辑器）
async function initEditor() {
  if (editor) return
  // 使用 CDN 动态加载，避免打包体积
  const loadScript = (src: string) => new Promise<void>((resolve, reject) => {
    const s = document.createElement('script'); s.src = src; s.onload = () => resolve(); s.onerror = () => reject(); document.head.appendChild(s)
  })
  try {
    await loadScript('https://unpkg.com/@wangeditor/editor@latest/dist/index.js')
    const E = (window as any).wangEditor
    if (!E) return
    editor = E.createEditor({ selector: editorEl.value!, html: props.modelValue || '', config: { placeholder: '请输入内容...', MENU_CONF: {} } })
    editor.on('change', () => { emit('update:modelValue', editor.getHtml()) })
    if (props.height) editor.getConfig().height = props.height
    editor.create()
  } catch { /* CDN failed, fallback to textarea */ }
}

watch(() => props.modelValue, (val) => {
  if (editor && val !== editor.getHtml()) editor.setHtml(val || '')
})

onBeforeUnmount(() => { editor?.destroy?.() })

// 延迟初始化（等 DOM 挂载）
setTimeout(initEditor, 100)
</script>

<template>
  <div class="rich-editor-wrapper" :style="{ minHeight: height || '300px' }">
    <div ref="editorEl" style="height:100%;border:1px solid var(--color-border);border-radius:4px" />
    <!-- Fallback: 编辑器未加载成功时显示 textarea -->
    <el-input
      v-if="!editor"
      :model-value="modelValue"
      type="textarea"
      :rows="10"
      placeholder="富文本编辑器加载中，可直接输入 HTML 源码..."
      style="margin-top:8px"
      @update:model-value="(v:string) => emit('update:modelValue', v)"
    />
  </div>
</template>

<style scoped>
.rich-editor-wrapper { width: 100%; }
:deep(.w-e-toolbar) { border-radius: 4px 4px 0 0 !important; }
:deep(.w-e-text-container) { border-radius: 0 0 4px 4px !important; }
</style>
