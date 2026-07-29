<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import type { BannerItem } from '@/types/components'

const props = withDefaults(
  defineProps<{
    banners: BannerItem[]
    interval?: number
    height?: string
  }>(),
  {
    interval: 5000,
    height: '480px',
  },
)

const emit = defineEmits<{
  'slide-change': [index: number]
}>()

const currentIndex = ref(0)
const isPaused = ref(false)
const preloaded = ref(new Set<number>())
let timer: ReturnType<typeof setInterval> | null = null

/** 有效的 Banner 列表，为空时展示默认占位 */
const displayBanners = computed<BannerItem[]>(() => {
  if (props.banners.length === 0) {
    return [
      {
        id: 0,
        imageUrl: '',
        title: '城际云 — 最懂行业的云服务公司',
        subtitle: '专业 · 创新 · 共赢',
        link: '/about',
        sortOrder: 0,
        isActive: true,
      },
    ]
  }
  return props.banners
})

const bannerCount = computed(() => displayBanners.value.length)

// ── 轮播控制 ──

function startAutoPlay() {
  stopAutoPlay()
  if (bannerCount.value <= 1) return
  timer = setInterval(() => {
    if (!isPaused.value) {
      currentIndex.value = (currentIndex.value + 1) % bannerCount.value
      emit('slide-change', currentIndex.value)
      preloadNext()
    }
  }, props.interval)
}

function stopAutoPlay() {
  if (timer) clearInterval(timer)
}

function goTo(index: number) {
  if (bannerCount.value === 0) return
  currentIndex.value = ((index % bannerCount.value) + bannerCount.value) % bannerCount.value
  emit('slide-change', currentIndex.value)
  preloadNext()
}

function preloadNext() {
  if (bannerCount.value <= 1) return
  const nextIdx = (currentIndex.value + 1) % bannerCount.value
  if (!preloaded.value.has(nextIdx)) {
    const img = new Image()
    img.src = displayBanners.value[nextIdx].imageUrl
    preloaded.value.add(nextIdx)
  }
}

// ── 生命周期 ──

onMounted(() => {
  preloaded.value.add(0)
  startAutoPlay()
})

onBeforeUnmount(() => {
  stopAutoPlay()
})

// ── 键盘可访问性 ──

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowLeft') {
    currentIndex.value = (currentIndex.value - 1 + bannerCount.value) % bannerCount.value
    emit('slide-change', currentIndex.value)
  } else if (e.key === 'ArrowRight') {
    currentIndex.value = (currentIndex.value + 1) % bannerCount.value
    emit('slide-change', currentIndex.value)
  }
}
</script>

<template>
  <div
    class="banner-swiper"
    :style="{ height: props.height }"
    tabindex="0"
    role="region"
    aria-label="Banner 轮播"
    @mouseenter="isPaused = true"
    @mouseleave="isPaused = false"
    @keydown="onKeydown"
  >
    <!-- 轮播内容 -->
    <div class="banner-swiper__track">
      <TransitionGroup name="banner-fade">
        <div
          v-for="(banner, index) in displayBanners"
          :key="banner.id"
          v-show="index === currentIndex"
          class="banner-swiper__slide"
        >
          <!-- 图片（带 fallback） -->
          <div class="banner-swiper__slide-bg" :style="{ backgroundImage: `url(${banner.imageUrl})` }">
            <div v-if="!banner.imageUrl" class="banner-swiper__slide-placeholder">
              <el-icon :size="48"><Picture /></el-icon>
            </div>
          </div>

          <!-- 封面文字层 -->
          <div class="banner-swiper__overlay">
            <div class="banner-swiper__content container">
              <h2 class="banner-swiper__title">{{ banner.title }}</h2>
              <p v-if="banner.subtitle" class="banner-swiper__subtitle">{{ banner.subtitle }}</p>
              <router-link
                v-if="banner.link"
                :to="banner.link"
                class="banner-swiper__cta"
              >
                了解更多
                <el-icon><ArrowRight /></el-icon>
              </router-link>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <!-- 指示器 -->
    <div v-if="bannerCount > 1" class="banner-swiper__dots" role="tablist">
      <button
        v-for="(_, index) in displayBanners"
        :key="index"
        class="banner-swiper__dot"
        :class="{ 'is-active': index === currentIndex }"
        role="tab"
        :aria-label="`第 ${index + 1} 张`"
        :aria-selected="index === currentIndex"
        @click="goTo(index)"
      />
    </div>

    <!-- 前后箭头 -->
    <button
      v-if="bannerCount > 1"
      class="banner-swiper__arrow banner-swiper__arrow--prev"
      aria-label="上一张"
      @click="goTo(currentIndex - 1)"
    >
      <el-icon :size="20"><ArrowLeft /></el-icon>
    </button>
    <button
      v-if="bannerCount > 1"
      class="banner-swiper__arrow banner-swiper__arrow--next"
      aria-label="下一张"
      @click="goTo(currentIndex + 1)"
    >
      <el-icon :size="20"><ArrowRight /></el-icon>
    </button>
  </div>
</template>

<style scoped lang="scss">
.banner-swiper {
  position: relative;
  width: 100%;
  overflow: hidden;
  background: #0d1b2a;
  outline: none;

  &__track {
    width: 100%;
    height: 100%;
  }

  &__slide {
    position: absolute;
    inset: 0;

    &-bg {
      width: 100%;
      height: 100%;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
    }

    &-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1a5bb3 0%, #00b4d8 100%);
      color: rgba(255, 255, 255, 0.3);
    }
  }

  &__overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    background: linear-gradient(90deg, rgba(0, 0, 0, 0.55) 0%, rgba(0, 0, 0, 0.15) 100%);
  }

  &__content {
    color: #ffffff;
    max-width: 600px;
  }

  &__title {
    font-size: 40px;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: var(--spacing-md);
    line-height: 1.3;

    @include respond-to(sm) {
      font-size: 48px;
    }
  }

  &__subtitle {
    font-size: 18px;
    color: rgba(255, 255, 255, 0.85);
    margin-bottom: var(--spacing-xl);
    line-height: 1.6;
  }

  &__cta {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: 12px 32px;
    font-size: var(--font-size-body);
    font-weight: 600;
    color: #ffffff;
    background: var(--color-accent);
    border-radius: var(--radius-md);
    transition: background var(--transition-fast) ease;

    &:hover {
      background: var(--color-primary);
      color: #ffffff;
    }
  }

  /* 指示器 */
  &__dots {
    position: absolute;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 10px;
  }

  &__dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.6);
    background: transparent;
    cursor: pointer;
    transition: all var(--transition-fast) ease;
    padding: 0;

    &.is-active {
      background: #ffffff;
      border-color: #ffffff;
      transform: scale(1.2);
    }
  }

  /* 前后箭头 */
  &__arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: none;
    background: rgba(255, 255, 255, 0.15);
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0;
    transition: all var(--transition-fast) ease;
    backdrop-filter: blur(4px);

    &--prev {
      left: 16px;
    }
    &--next {
      right: 16px;
    }
  }

  &:hover &__arrow {
    opacity: 1;
  }

  &__arrow:hover {
    background: rgba(255, 255, 255, 0.3);
  }
}

/* 轮播过渡 */
.banner-fade-enter-active,
.banner-fade-leave-active {
  transition: opacity 0.6s ease;
}
.banner-fade-enter-from,
.banner-fade-leave-to {
  opacity: 0;
}
</style>
