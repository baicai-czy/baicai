// ── 分页逻辑 ──
import { ref, computed } from 'vue'

export function usePagination(initialPage = 1, initialPageSize = 10) {
  const currentPage = ref(initialPage)
  const pageSize = ref(initialPageSize)
  const total = ref(0)

  const totalPages = computed(() => Math.ceil(total.value / pageSize.value))
  const hasPrev = computed(() => currentPage.value > 1)
  const hasNext = computed(() => currentPage.value < totalPages.value)

  function goTo(page: number) {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  function next() {
    if (hasNext.value) currentPage.value++
  }

  function prev() {
    if (hasPrev.value) currentPage.value--
  }

  function reset(page = 1) {
    currentPage.value = page
    total.value = 0
  }

  function setTotal(t: number) {
    total.value = t
  }

  return {
    currentPage,
    pageSize,
    total,
    totalPages,
    hasPrev,
    hasNext,
    goTo,
    next,
    prev,
    reset,
    setTotal,
  }
}
