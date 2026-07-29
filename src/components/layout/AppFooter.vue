<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/stores/modules/app'

const appStore = useAppStore()

/** 当前年份 */
const year = new Date().getFullYear()

/** 备案号 */
const icp = computed(() => appStore.siteConfig.icp)

/** 底部快捷链接 */
const footerLinks = [
  { label: '关于我们', to: '/about' },
  { label: '业务版块', to: '/business' },
  { label: '产品与服务', to: '/products' },
  { label: '解决方案', to: '/solutions' },
  { label: '新闻中心', to: '/news' },
  { label: '联系我们', to: '/contact' },
]

/** 联系方式快照 */
const contactInfo = computed(() => appStore.contactInfo)
</script>

<template>
  <footer class="app-footer">
    <div class="app-footer__main container">
      <!-- 左侧：Logo + 简介 -->
      <div class="app-footer__brand">
        <h3 class="app-footer__brand-title">{{ appStore.siteConfig.title }}</h3>
        <p class="app-footer__brand-desc">{{ appStore.siteConfig.description }}</p>
        <p class="app-footer__brand-desc">{{ contactInfo.address }}</p>
      </div>

      <!-- 中间：快捷导航 -->
      <nav class="app-footer__links" aria-label="底部导航">
        <h4 class="app-footer__heading">快速导航</h4>
        <ul>
          <li v-for="link in footerLinks" :key="link.to">
            <router-link :to="link.to">{{ link.label }}</router-link>
          </li>
        </ul>
      </nav>

      <!-- 右侧：联系方式 -->
      <div class="app-footer__contact">
        <h4 class="app-footer__heading">联系我们</h4>
        <ul>
          <li>
            <el-icon><Phone /></el-icon>
            <span>{{ contactInfo.phone }}</span>
          </li>
          <li>
            <el-icon><Message /></el-icon>
            <span>{{ contactInfo.email }}</span>
          </li>
          <li>
            <el-icon><Clock /></el-icon>
            <span>{{ contactInfo.workingHours }}</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- 底栏 -->
    <div class="app-footer__bottom">
      <div class="container">
        <p>Copyright &copy; {{ year }} {{ appStore.siteConfig.title }} All Rights Reserved.</p>
        <p v-if="icp" class="app-footer__icp">
          <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">{{ icp }}</a>
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.app-footer {
  background: #1a2332;
  color: #c0c6cf;
  margin-top: auto;

  a {
    color: #c0c6cf;
    transition: color var(--transition-fast) ease;

    &:hover {
      color: var(--color-secondary);
    }
  }

  &__main {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--spacing-xl);
    padding-top: var(--spacing-2xl);
    padding-bottom: var(--spacing-xl);

    @include respond-to(sm) {
      grid-template-columns: 2fr 1fr 1fr;
    }
  }

  &__brand {
    &-title {
      color: #ffffff;
      font-size: var(--font-size-h3);
      margin-bottom: var(--spacing-sm);
    }
    &-desc {
      font-size: var(--font-size-small);
      line-height: 1.8;
      color: #8a929d;
    }
  }

  &__heading {
    color: #ffffff;
    font-size: var(--font-size-body);
    font-weight: 600;
    margin-bottom: var(--spacing-md);
  }

  &__links ul li {
    margin-bottom: var(--spacing-sm);
    font-size: var(--font-size-small);
  }

  &__contact ul li {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-sm);
    font-size: var(--font-size-small);

    .el-icon {
      color: var(--color-secondary);
      font-size: 14px;
      flex-shrink: 0;
    }
  }

  &__bottom {
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    padding: var(--spacing-lg) 0;
    font-size: var(--font-size-small);
    color: #6b727d;

    .container {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: var(--spacing-sm);
    }
  }

  &__icp a {
    color: #6b727d;
  }
}
</style>
