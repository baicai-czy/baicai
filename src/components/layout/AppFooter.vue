<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/stores/modules/app'

const appStore = useAppStore()
const year = new Date().getFullYear()
const icp = computed(() => appStore.siteConfig.icp)
const contactInfo = computed(() => appStore.contactInfo)

/** 产品服务链接 */
const productLinks = [
  { label: '通算云服务器', to: '/products/compute' },
  { label: 'GPU 智算实例', to: '/products/ai' },
  { label: '对象存储', to: '/products/storage' },
  { label: '云安全', to: '/products/security' },
  { label: '大数据平台', to: '/products/bigdata' },
]

/** 快速导航 */
const navLinks = [
  { label: '关于我们', to: '/about' },
  { label: '业务版块', to: '/business' },
  { label: '解决方案', to: '/solutions' },
  { label: '新闻中心', to: '/news' },
  { label: '联系我们', to: '/contact' },
  { label: '服务申请', to: '/contact' },
]
</script>

<template>
  <footer class="app-footer">
    <div class="app-footer__main container">
      <!-- 第1栏：品牌简介 -->
      <div class="app-footer__col">
        <div class="app-footer__brand">
          <span class="app-footer__brand-dot" />
          <span class="app-footer__brand-name">{{ appStore.siteConfig.siteName }}</span>
        </div>
        <p class="app-footer__brand-desc">最懂行业的云服务公司，提供国资云、云和智算集成等专业云服务。</p>
        <p class="app-footer__brand-desc">自主可控 · 节约高效 · 安全可靠</p>
      </div>

      <!-- 第2栏：产品服务 -->
      <div class="app-footer__col">
        <h4 class="app-footer__heading">产品与服务</h4>
        <ul>
          <li v-for="link in productLinks" :key="link.to">
            <router-link :to="link.to">{{ link.label }}</router-link>
          </li>
        </ul>
      </div>

      <!-- 第3栏：快速导航 -->
      <div class="app-footer__col">
        <h4 class="app-footer__heading">快速导航</h4>
        <ul>
          <li v-for="link in navLinks" :key="link.label">
            <router-link :to="link.to">{{ link.label }}</router-link>
          </li>
        </ul>
      </div>

      <!-- 第4栏：联系方式 -->
      <div class="app-footer__col">
        <h4 class="app-footer__heading">联系我们</h4>
        <ul class="app-footer__contact">
          <li>
            <el-icon :size="14"><Phone /></el-icon>
            <span>{{ contactInfo.phone }}</span>
          </li>
          <li>
            <el-icon :size="14"><Message /></el-icon>
            <span>{{ contactInfo.email }}</span>
          </li>
          <li>
            <el-icon :size="14"><LocationFilled /></el-icon>
            <span>{{ contactInfo.address }}</span>
          </li>
          <li>
            <el-icon :size="14"><Clock /></el-icon>
            <span>{{ contactInfo.workingHours }}</span>
          </li>
        </ul>
        <!-- 公众号占位 -->
        <div class="app-footer__qrcode">
          <el-icon :size="28"><Picture /></el-icon>
          <span>微信公众号</span>
        </div>
      </div>
    </div>

    <!-- 底栏 -->
    <div class="app-footer__bottom">
      <div class="container">
        <p>Copyright &copy; {{ year }} {{ appStore.siteConfig.siteName }} All Rights Reserved.</p>
        <p v-if="icp">
          <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">{{ icp }}</a>
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.app-footer {
  background: #111827;
  color: #9ca3af;
  margin-top: auto;

  a {
    color: #9ca3af;
    font-size: 13px;
    transition: color var(--transition-fast) ease;

    &:hover {
      color: var(--color-secondary);
    }
  }

  &__main {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-xl);
    padding-top: 48px;
    padding-bottom: var(--spacing-xl);

    @include respond-to(sm) {
      grid-template-columns: 1.5fr 1fr 1fr 1.3fr;
    }
  }

  &__col {
    min-width: 0;
  }

  /* ── 品牌 ── */
  &__brand {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: var(--spacing-md);

    &-dot {
      width: 14px;
      height: 14px;
      border-radius: 4px;
      background: linear-gradient(135deg, var(--color-secondary), #00b4d8);
      flex-shrink: 0;
    }

    &-name {
      font-size: 18px;
      font-weight: 800;
      color: #ffffff;
    }

    &-desc {
      font-size: 13px;
      line-height: 1.8;
      margin-bottom: 4px;
    }
  }

  &__heading {
    color: #ffffff;
    font-size: 14px;
    font-weight: 700;
    margin-bottom: var(--spacing-md);
    letter-spacing: 0.5px;
  }

  ul {
    list-style: none;

    li {
      margin-bottom: 8px;
    }
  }

  &__contact li {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    font-size: 13px;
    margin-bottom: 10px;

    .el-icon {
      margin-top: 2px;
      color: var(--color-secondary);
      flex-shrink: 0;
    }
  }

  /* ── 二维码占位 ── */
  &__qrcode {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    margin-top: var(--spacing-md);
    padding: var(--spacing-sm);
    background: rgba(255, 255, 255, 0.04);
    border-radius: var(--radius-sm);
    border: 1px dashed rgba(255, 255, 255, 0.1);
    color: #6b7280;
    font-size: 12px;

    .el-icon {
      opacity: 0.4;
    }
  }

  /* ── 底栏 ── */
  &__bottom {
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    padding: var(--spacing-lg) 0;
    font-size: 12px;
    color: #6b7280;

    .container {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: var(--spacing-sm);
    }

    a {
      font-size: 12px;
      color: #6b7280;
    }
  }
}
</style>
