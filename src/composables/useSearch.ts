// ── 搜索防抖与竞态处理 ──
import { ref, watch, type Ref } from 'vue'

export function useSearch(
  keywordRef: Ref<string>,
  onSearch: (keyword: string) => void | Promise<void>,
  delay = 300,
) {
  const isSearching = ref(false)
  let timer: ReturnType<typeof setTimeout> | null = null
  let requestSeq = 0

  function trigger(value: string) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      const seq = ++requestSeq
      const result = onSearch(value.trim())
      if (result instanceof Promise) {
        isSearching.value = true
        result.finally(() => {
          if (seq === requestSeq) {
            isSearching.value = false
          }
        })
      }
    }, delay)
  }

  watch(keywordRef, (val) => {
    trigger(val)
  })

  function cancel() {
    if (timer) clearTimeout(timer)
    requestSeq++
    isSearching.value = false
  }

  return { isSearching, cancel, trigger }
}
