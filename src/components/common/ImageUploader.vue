<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { uploadImage } from '@/api/modules/admin/upload'

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [v: string] }>()

const uploading = ref(false)
const isDragover = ref(false)

function onDragOver(e: DragEvent) { e.preventDefault(); isDragover.value = true }
function onDragLeave() { isDragover.value = false }
function onDrop(e: DragEvent) {
  e.preventDefault(); isDragover.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) handleFile(file)
}

function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) handleFile(file)
}

async function handleFile(file: File) {
  if (!file.type.startsWith('image/')) { ElMessage.warning('只支持图片文件'); return }
  if (file.size > 10 * 1024 * 1024) { ElMessage.warning('图片大小不能超过 10MB'); return }

  uploading.value = true
  try {
    const result = await uploadImage(file)
    emit('update:modelValue', result.url)
    ElMessage.success('上传成功')
  } catch { /* 错误已由拦截器处理 */ }
  finally { uploading.value = false }
}

function onRemove() {
  emit('update:modelValue', '')
}
</script>

<template>
  <div
    class="image-uploader"
    :class="{ 'is-dragover': isDragover, 'is-uploading': uploading }"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
    @click="() => { const el = $refs.input as HTMLInputElement; el?.click() }"
  >
    <!-- 已有图片 → 预览 -->
    <img v-if="modelValue" :src="modelValue" class="image-uploader__preview" />

    <!-- 上传中 -->
    <div v-if="uploading" class="image-uploader__mask">
      <el-icon class="is-loading" :size="28"><Loading /></el-icon>
    </div>

    <!-- 空状态 -->
    <div v-if="!modelValue && !uploading" class="image-uploader__placeholder">
      <el-icon :size="36"><Plus /></el-icon>
      <span>拖拽图片到此处</span>
      <span class="image-uploader__hint">或点击选择文件（JPG/PNG/WebP）</span>
    </div>

    <!-- 移除按钮 -->
    <span v-if="modelValue && !uploading" class="image-uploader__remove" @click.stop="onRemove">
      <el-icon :size="16"><Delete /></el-icon>
    </span>

    <input ref="input" type="file" accept="image/*" style="display:none" @change="onFileChange" />
  </div>
</template>

<style scoped lang="scss">
.image-uploader {
  width: 100%; min-height: 140px;
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-md);
  position: relative; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden; transition: border-color var(--transition-fast);
  background: var(--color-bg);

  &:hover, &.is-dragover {
    border-color: var(--color-primary);
  }
  &.is-uploading { pointer-events: none; }

  &__preview {
    max-width: 100%; max-height: 240px; object-fit: contain;
  }

  &__mask {
    position: absolute; inset: 0;
    background: rgba(255,255,255,0.7);
    display: flex; align-items: center; justify-content: center;
  }

  &__placeholder {
    display: flex; flex-direction: column; align-items: center; gap: 8px;
    color: var(--color-text-disabled);
    .el-icon { color: var(--color-text-disabled); }
    span { font-size: 14px; }
  }

  &__hint {
    font-size: 12px !important;
    color: var(--color-text-disabled);
  }

  &__remove {
    position: absolute; top: 4px; right: 4px;
    width: 28px; height: 28px; border-radius: 50%;
    background: rgba(0,0,0,0.5); color: #fff;
    display: flex; align-items: center; justify-content: center;
    &:hover { background: var(--color-danger, #e74c3c); }
  }
}
</style>
