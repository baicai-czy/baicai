<script setup lang="ts">
import { ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    placeholder?: string
    delay?: number
  }>(),
  {
    modelValue: '',
    placeholder: '请输入关键词搜索...',
    delay: 300,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  search: [value: string]
  clear: []
}>()

const keyword = ref(props.modelValue)
let debounceTimer: ReturnType<typeof setTimeout> | null = null

watch(
  () => props.modelValue,
  (val) => {
    keyword.value = val
  },
)

function onInput(value: string) {
  emit('update:modelValue', value)
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    emit('search', value.trim())
  }, props.delay)
}

function onClear() {
  keyword.value = ''
  emit('update:modelValue', '')
  emit('clear')
  emit('search', '')
}

function onKeyup(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    if (debounceTimer) clearTimeout(debounceTimer)
    emit('search', keyword.value.trim())
  }
}
</script>

<template>
  <div class="search-box">
    <el-input
      v-model="keyword"
      :placeholder="props.placeholder"
      clearable
      @input="onInput"
      @clear="onClear"
      @keyup="onKeyup"
    >
      <template #prefix>
        <el-icon class="search-box__icon"><Search /></el-icon>
      </template>
    </el-input>
  </div>
</template>

<style scoped lang="scss">
.search-box {
  width: 100%;
  max-width: 400px;

  &__icon {
    color: var(--color-text-disabled);
  }
}
</style>
