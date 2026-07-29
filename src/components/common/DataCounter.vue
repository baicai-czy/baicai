<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import type { StatItem } from '@/types/components'

const props = withDefaults(
  defineProps<{
    items: StatItem[]
    duration?: number
  }>(),
  { duration: 1800 },
)

const displayValues = ref<number[]>(props.items.map(() => 0))
const hasAnimated = ref(false)

let observer: IntersectionObserver | null = null
const rafIds: number[] = []

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

function animateValue(index: number, target: number, decimals: number) {
  const startTime = performance.now()
  const startValue = 0

  function tick(now: number) {
    const elapsed = now - startTime
    const progress = Math.min(elapsed / props.duration, 1)
    const eased = easeOutCubic(progress)
    const raw = startValue + (target - startValue) * eased
    displayValues.value[index] = decimals > 0 ? parseFloat(raw.toFixed(decimals)) : Math.round(raw)

    if (progress < 1) {
      rafIds[index] = requestAnimationFrame(tick)
    }
  }

  rafIds[index] = requestAnimationFrame(tick)
}

function formatDisplay(index: number): string {
  const val = displayValues.value[index]
  const decimals = props.items[index]?.decimals ?? 0
  if (decimals > 0) return val.toFixed(decimals)
  return Math.round(val).toLocaleString()
}

function startAnimation() {
  if (hasAnimated.value) return
  hasAnimated.value = true
  props.items.forEach((item, index) => animateValue(index, item.value, item.decimals ?? 0))
}

onMounted(() => {
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
      <div class="data-counter__icon">
        <el-icon :size="20">
          <Check v-if="index === 0" />
          <User v-else-if="index === 1" />
          <Medal v-else-if="index === 2" />
          <Clock v-else />
        </el-icon>
      </div>
      <div class="data-counter__value">
        <span v-if="item.prefix" class="data-counter__prefix">{{ item.prefix }}</span>
        <span class="data-counter__number">{{ formatDisplay(index) }}</span>
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
    grid-template-columns: repeat(4, 1fr);
  }

  &__item {
    padding: var(--spacing-lg);
  }

  &__icon {
    width: 44px;
    height: 44px;
    margin: 0 auto var(--spacing-md);
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, rgba(26,91,179,0.1), rgba(0,180,216,0.15));
    border-radius: var(--radius-md);
    color: var(--color-primary);
  }

  &__value {
    font-size: 44px;
    font-weight: 800;
    color: var(--color-text-primary);
    font-variant-numeric: tabular-nums;
    margin-bottom: var(--spacing-xs);
    line-height: 1.15;

    @include respond-to(sm) {
      font-size: 52px;
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
    letter-spacing: -1px;
  }

  &__label {
    font-size: var(--font-size-body);
    color: var(--color-text-secondary);
    font-weight: 500;
  }
}
</style>
