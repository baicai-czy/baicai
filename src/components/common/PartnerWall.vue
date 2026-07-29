<script setup lang="ts">
import type { PartnerItem } from '@/types/components'

defineProps<{
  items: PartnerItem[]
}>()
</script>

<template>
  <div class="partner-wall">
    <div
      v-for="item in items"
      :key="item.id"
      class="partner-wall__item"
      :title="item.name"
    >
      <a
        v-if="item.website"
        :href="item.website"
        target="_blank"
        rel="noopener noreferrer"
        class="partner-wall__link"
      >
        <img
          :src="item.logoUrl"
          :alt="item.name"
          class="partner-wall__logo"
          loading="lazy"
        />
      </a>
      <img
        v-else
        :src="item.logoUrl"
        :alt="item.name"
        class="partner-wall__logo"
        loading="lazy"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.partner-wall {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: var(--spacing-xl);

  &__item {
    flex: 0 0 auto;
  }

  &__link {
    display: block;
  }

  &__logo {
    height: 48px;
    width: auto;
    filter: grayscale(100%);
    opacity: 0.6;
    transition: all var(--transition-base) ease;

    &:hover {
      filter: grayscale(0%);
      opacity: 1;
      transform: scale(1.1);
    }
  }
}
</style>
