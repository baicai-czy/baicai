<script setup lang="ts">
import AppLayout from '@/components/layout/AppLayout.vue'

const sideNavItems = [
  { label: '公司简介', to: '/about/profile' },
  { label: '发展历程', to: '/about/history' },
  { label: '企业文化', to: '/about/culture' },
  { label: '资质荣誉', to: '/about/honors' },
  { label: '组织架构', to: '/about/structure' },
]

const breadcrumb = [{ label: '关于我们' }]
</script>

<template>
  <AppLayout :show-side-nav="true" :side-nav-items="sideNavItems" :breadcrumb="breadcrumb">
    <router-view />
  </AppLayout>
</template>
