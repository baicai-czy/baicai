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
    height: '520px',
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
        subtitle: '自主可控 · 节约高效 · 安全可靠 · 专业创新',
        link: '/about',
        sortOrder: 0,
        isActive: true,
      },
    ]
  }
  return props.banners
})

const bannerCount = computed(() => displayBanners.value.length)

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
  if (timer) clearTimeout(timer)
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

onMounted(() => {
  preloaded.value.add(0)
  startAutoPlay()
})

onBeforeUnmount(() => stopAutoPlay())

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
    <div class="banner-swiper__track">
      <TransitionGroup name="banner-fade">
        <div
          v-for="(banner, index) in displayBanners"
          :key="banner.id"
          v-show="index === currentIndex"
          class="banner-swiper__slide"
        >
          <!-- 图片背景 -->
          <div
            v-if="banner.imageUrl"
            class="banner-swiper__slide-bg"
            :style="{ backgroundImage: `url(${banner.imageUrl})` }"
          />

          <!-- 无图片时的品牌占位背景 -->
          <div v-else class="banner-swiper__slide-placeholder">
            <div class="banner-swiper__decor-circle banner-swiper__decor-circle--1" />
            <div class="banner-swiper__decor-circle banner-swiper__decor-circle--2" />
            <div class="banner-swiper__decor-circle banner-swiper__decor-circle--3" />
            <div class="banner-swiper__decor-dots" />
          </div>

          <!-- 文字覆盖层 -->
          <div class="banner-swiper__overlay">
            <div class="banner-swiper__content container">
              <h2 class="banner-swiper__title">{{ banner.title }}</h2>
              <p v-if="banner.subtitle" class="banner-swiper__subtitle">{{ banner.subtitle }}</p>
              <div class="banner-swiper__actions">
                <router-link v-if="banner.link" :to="banner.link" class="banner-swiper__cta">
                  了解更多
                  <el-icon><ArrowRight /></el-icon>
                </router-link>
                <router-link to="/contact" class="banner-swiper__cta-secondary">
                  联系我们
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <!-- 指示器 -->
    <div v-if="bannerCount > 1" class="banner-swiper__dots" role="tablist">
      <button
        v-for="(_, idx) in displayBanners"
        :key="idx"
        class="banner-swiper__dot"
        :class="{ 'is-active': idx === currentIndex }"
        role="tab"
        :aria-label="`第 ${idx + 1} 张`"
        :aria-selected="idx === currentIndex"
        @click="goTo(idx)"
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
    }
  }

  /* ── 品牌占位背景 ── */
  &__slide-placeholder {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #0a1628 0%, #13294b 30%, #1a5bb3 70%, #0088a0 100%);
    position: relative;
    overflow: hidden;
  }

  &__decor-circle {
    position: absolute;
    border-radius: 50%;
    opacity: 0.06;
    background: #ffffff;

    &--1 {
      width: 600px;
      height: 600px;
      top: -200px;
      right: -100px;
    }
    &--2 {
      width: 300px;
      height: 300px;
      bottom: -80px;
      left: 10%;
      opacity: 0.08;
    }
    &--3 {
      width: 180px;
      height: 180px;
      top: 20%;
      right: 30%;
      opacity: 0.04;
    }
  }

  &__decor-dots {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 40%;
    background-image: radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px);
    background-size: 30px 30px;
    mask-image: linear-gradient(to right, transparent, black 60%);
  }

  /* ── 文字覆盖层 ── */
  &__overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    background: linear-gradient(90deg,
      rgba(10,22,40,0.7) 0%,
      rgba(10,22,40,0.35) 50%,
      rgba(10,22,40,0.05) 100%
    );
  }

  &__content {
    color: #ffffff;
    max-width: 640px;
  }

  &__title {
    font-size: 42px;
    font-weight: 700;
    color: #ffffff;
    line-height: 1.25;
    margin-bottom: var(--spacing-md);
    letter-spacing: 0.5px;

    @include respond-to(sm) {
      font-size: 52px;
    }
  }

  &__subtitle {
    font-size: 18px;
    color: rgba(255,255,255,0.8);
    line-height: 1.6;
    margin-bottom: var(--spacing-xl);
    letter-spacing: 1px;

    @include respond-to(sm) {
      font-size: 20px;
    }
  }

  &__actions {
    display: flex;
    gap: var(--spacing-md);
    flex-wrap: wrap;
  }

  &__cta {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 14px 36px;
    font-size: 16px;
    font-weight: 600;
    color: #ffffff;
    background: var(--color-accent);
    border-radius: 50px;
    transition: all var(--transition-base) ease;
    box-shadow: 0 4px 16px rgba(255,107,53,0.35);

    &:hover {
      background: #ff8155;
      transform: translateY(-2px);
      box-shadow: 0 6px 24px rgba(255,107,53,0.45);
      color: #ffffff;
    }
  }

  &__cta-secondary {
    display: inline-flex;
    align-items: center;
    padding: 14px 36px;
    font-size: 16px;
    font-weight: 600;
    color: #ffffff;
    background: transparent;
    border: 2px solid rgba(255,255,255,0.35);
    border-radius: 50px;
    transition: all var(--transition-base) ease;

    &:hover {
      border-color: #ffffff;
      background: rgba(255,255,255,0.08);
      color: #ffffff;
    }
  }

  /* 指示器 */
  &__dots {
    position: absolute;
    bottom: 28px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 10px;
  }

  &__dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.5);
    background: transparent;
    cursor: pointer;
    transition: all var(--transition-base) ease;
    padding: 0;

    &.is-active {
      background: #ffffff;
      border-color: #ffffff;
      width: 28px;
      border-radius: 5px;
    }
  }

  /* 前后箭头 */
  &__arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: none;
    background: rgba(255,255,255,0.12);
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0;
    transition: all var(--transition-base) ease;
    backdrop-filter: blur(8px);

    &--prev { left: 20px; }
    &--next { right: 20px; }

    &:hover {
      background: rgba(255,255,255,0.25);
    }
  }

  &:hover &__arrow {
    opacity: 1;
  }
}

/* 轮播过渡 */
.banner-fade-enter-active,
.banner-fade-leave-active {
  transition: opacity 0.8s ease;
}
.banner-fade-enter-from,
.banner-fade-leave-to {
  opacity: 0;
}
</style>
