<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    total: number
    currentPage: number
    pageSize?: number
    pageSizes?: number[]
    layout?: string
    background?: boolean
    small?: boolean
  }>(),
  {
    pageSize: 10,
    pageSizes: () => [6, 12, 24, 48],
    layout: 'total, sizes, prev, pager, next, jumper',
    background: true,
    small: false,
  },
)

const emit = defineEmits<{
  'update:currentPage': [page: number]
  'update:pageSize': [size: number]
  change: [page: number]
  'size-change': [size: number]
}>()

const currentPageModel = computed({
  get: () => props.currentPage,
  set: (val) => {
    emit('update:currentPage', val)
    emit('change', val)
  },
})

const pageSizeModel = computed({
  get: () => props.pageSize,
  set: (val) => {
    emit('update:pageSize', val)
    emit('size-change', val)
  },
})
</script>

<template>
  <div class="pagination-wrapper">
    <el-pagination
      v-model:current-page="currentPageModel"
      v-model:page-size="pageSizeModel"
      :total="total"
      :page-sizes="props.pageSizes"
      :layout="props.layout"
      :background="props.background"
      :small="props.small"
    />
  </div>
</template>

<style scoped lang="scss">
.pagination-wrapper {
  display: flex;
  justify-content: center;
  padding: var(--spacing-lg) 0;
}
</style>
