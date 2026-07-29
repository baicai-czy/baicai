<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import type { StatItem } from '@/types/components'

const props = withDefaults(
  defineProps<{
    items: StatItem[]
    duration?: number
  }>(),
  {
    duration: 1500,
  },
)

/** 当前展示的数值（动画过渡中） */
const displayValues = ref<number[]>(props.items.map(() => 0))
const hasAnimated = ref(false)

let observer: IntersectionObserver | null = null
let rafIds: number[] = []

/** easeOutCubic 缓动 */
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

/** 单个数字增长动画 */
function animateValue(index: number, target: number) {
  const startTime = performance.now()
  const startValue = 0

  function tick(now: number) {
    const elapsed = now - startTime
    const progress = Math.min(elapsed / props.duration, 1)
    const eased = easeOutCubic(progress)
    displayValues.value[index] = Math.round(startValue + (target - startValue) * eased)

    if (progress < 1) {
      rafIds[index] = requestAnimationFrame(tick)
    }
  }

  rafIds[index] = requestAnimationFrame(tick)
}

/** 触发全部数字动画 */
function startAnimation() {
  if (hasAnimated.value) return
  hasAnimated.value = true
  props.items.forEach((item, index) => animateValue(index, item.value))
}

onMounted(() => {
  // IntersectionObserver 检测进入视口时触发动画
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting) {
        startAnimation()
        observer?.disconnect()
      }
    },
    { threshold: 0.3 },
  )
  const el = document.querySelector('.data-counter')
  if (el) observer.observe(el)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  rafIds.forEach((id) => cancelAnimationFrame(id))
})
</script>

<template>
  <div class="data-counter">
    <div v-for="(item, index) in props.items" :key="item.id" class="data-counter__item">
      <div class="data-counter__value">
        <span v-if="item.prefix" class="data-counter__prefix">{{ item.prefix }}</span>
        <span class="data-counter__number">{{ displayValues[index]?.toLocaleString() }}</span>
        <span v-if="item.suffix" class="data-counter__suffix">{{ item.suffix }}</span>
      </div>
      <p class="data-counter__label">{{ item.label }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.data-counter {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-xl);
  text-align: center;

  @include respond-to(sm) {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }

  &__item {
    padding: var(--spacing-lg);
  }

  &__value {
    font-size: 36px;
    font-weight: 700;
    color: var(--color-primary);
    font-variant-numeric: tabular-nums;
    margin-bottom: var(--spacing-sm);
    line-height: 1.2;

    @include respond-to(sm) {
      font-size: 44px;
    }
  }

  &__prefix,
  &__suffix {
    font-size: 24px;
    font-weight: 500;
    color: var(--color-text-secondary);
  }

  &__number {
    font-family: 'Helvetica Neue', Arial, sans-serif;
  }

  &__label {
    font-size: var(--font-size-body);
    color: var(--color-text-secondary);
    margin-top: var(--spacing-xs);
  }
}
</style>
