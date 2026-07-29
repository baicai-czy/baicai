<script setup lang="ts">
import AppLayout from '@/components/layout/AppLayout.vue'

const sideNavItems = [
  { label: '国资云服务', to: '/business/state-cloud', icon: 'Cloudy' },
  { label: '云和智算集成', to: '/business/integration', icon: 'Connection' },
]

const breadcrumb = [{ label: '业务版块' }]
</script>

<template>
  <AppLayout :show-side-nav="true" :side-nav-items="sideNavItems" :breadcrumb="breadcrumb">
    <router-view />
  </AppLayout>
</template>
