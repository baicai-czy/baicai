<script setup lang="ts">
withDefaults(
  defineProps<{
    /** 骨架占位行数 */
    count?: number
    /** 是否展示为卡片形态 */
    card?: boolean
    /** 是否展示为列表形态 */
    list?: boolean
    /** 是否展示为段落形态 */
    paragraph?: boolean
  }>(),
  {
    count: 3,
    card: false,
    list: false,
    paragraph: false,
  },
)
</script>

<template>
  <div class="skeleton" :class="{ 'skeleton--card': card, 'skeleton--list': list }">
    <template v-if="card">
      <div v-for="i in count" :key="i" class="skeleton__card">
        <div class="skeleton__rect skeleton__rect--image" />
        <div class="skeleton__rect skeleton__rect--title" />
        <div class="skeleton__rect skeleton__rect--text" />
        <div class="skeleton__rect skeleton__rect--text skeleton__rect--short" />
      </div>
    </template>

    <template v-else-if="list">
      <div v-for="i in count" :key="i" class="skeleton__list-item">
        <div class="skeleton__circle" />
        <div class="skeleton__list-content">
          <div class="skeleton__rect skeleton__rect--title" />
          <div class="skeleton__rect skeleton__rect--text" />
        </div>
      </div>
    </template>

    <template v-else-if="paragraph">
      <div v-for="i in count" :key="i" class="skeleton__rect skeleton__rect--text" />
    </template>

    <template v-else>
      <div v-for="i in count" :key="i" class="skeleton__rect skeleton__rect--block" />
    </template>
  </div>
</template>

<style scoped lang="scss">
.skeleton {
  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }

  &__rect,
  &__circle {
    background: linear-gradient(
      90deg,
      var(--color-border) 25%,
      #eef0f3 37%,
      var(--color-border) 63%
    );
    background-size: 200% 100%;
    animation: shimmer 1.6s ease-in-out infinite;
    border-radius: var(--radius-sm);
  }

  &__rect {
    width: 100%;
    height: 16px;
    margin-bottom: var(--spacing-sm);

    &--block {
      height: 48px;
    }
    &--image {
      height: 180px;
      border-radius: var(--radius-md);
    }
    &--title {
      height: 20px;
      width: 70%;
    }
    &--text {
      height: 14px;
    }
    &--short {
      width: 50%;
    }
  }

  &__circle {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  &--card {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: var(--spacing-lg);
  }

  &__card {
    padding: var(--spacing-md);
    background: var(--color-card-bg);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-card);
  }

  &--list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  &__list-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
    background: var(--color-card-bg);
    border-radius: var(--radius-md);
  }

  &__list-content {
    flex: 1;
  }
}
</style>
