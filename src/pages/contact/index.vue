<script setup lang="ts">
import { computed } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import ContactForm from '@/components/common/ContactForm.vue'
import MapViewer from '@/components/common/MapViewer.vue'
import { useAppStore } from '@/stores/modules/app'

const appStore = useAppStore()
const breadcrumb = [{ label: '联系我们' }]

const contactInfo = computed(() => appStore.contactInfo)
</script>

<template>
  <AppLayout :breadcrumb="breadcrumb">
    <div class="page-contact">
      <!-- 联系信息卡片 -->
      <div class="contact-info-cards">
        <div class="contact-info-card">
          <div class="contact-info-card__icon">
            <el-icon :size="24"><PhoneFilled /></el-icon>
          </div>
          <h4>电话</h4>
          <p>{{ contactInfo.phone }}</p>
        </div>
        <div class="contact-info-card">
          <div class="contact-info-card__icon">
            <el-icon :size="24"><Message /></el-icon>
          </div>
          <h4>邮箱</h4>
          <p>{{ contactInfo.email }}</p>
        </div>
        <div class="contact-info-card">
          <div class="contact-info-card__icon">
            <el-icon :size="24"><LocationFilled /></el-icon>
          </div>
          <h4>地址</h4>
          <p>{{ contactInfo.address }}</p>
        </div>
        <div class="contact-info-card">
          <div class="contact-info-card__icon">
            <el-icon :size="24"><Clock /></el-icon>
          </div>
          <h4>工作时间</h4>
          <p>{{ contactInfo.workingHours }}</p>
        </div>
      </div>

      <!-- 地图 + 表单 -->
      <div class="contact-body">
        <!-- 地图 -->
        <div class="contact-map">
          <h3>公司位置</h3>
          <MapViewer
            :address="contactInfo.address"
            :lat="31.2304"
            :lng="121.4737"
            :height="'400px'"
          />
        </div>

        <!-- 咨询表单 -->
        <div class="contact-form-wrap">
          <h3>在线咨询</h3>
          <ContactForm type="consult" />
        </div>
      </div>

      <!-- 服务申请表单 -->
      <div class="contact-service">
        <h3>服务申请</h3>
        <p class="contact-service__desc">
          如需申请定制化服务，请填写以下表单，我们的技术专家将在1个工作日内与您联系。
        </p>
        <ContactForm type="service" />
      </div>
    </div>
  </AppLayout>
</template>

<style scoped lang="scss">
.page-title {
  font-size: var(--font-size-h2);
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
}
.page-desc {
  font-size: var(--font-size-body);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xl);
}

.contact-info-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-2xl);

  @include respond-to(sm) {
    grid-template-columns: repeat(4, 1fr);
  }
}

.contact-info-card {
  text-align: center;
  padding: var(--spacing-lg);
  background: var(--color-card-bg);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);

  &__icon {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(26, 91, 179, 0.08);
    border-radius: 50%;
    color: var(--color-primary);
    margin: 0 auto var(--spacing-sm);
  }

  h4 {
    font-size: var(--font-size-body);
    font-weight: 600;
    color: var(--color-text-primary);
    margin-bottom: var(--spacing-xs);
  }

  p {
    font-size: var(--font-size-small);
    color: var(--color-text-secondary);
  }
}

.contact-body {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-2xl);

  @include respond-to(sm) {
    grid-template-columns: 1fr 1fr;
  }

  h3 {
    font-size: var(--font-size-h3);
    font-weight: 600;
    color: var(--color-text-primary);
    margin-bottom: var(--spacing-md);
  }
}

.contact-map {
  min-height: 400px;
}

.contact-form-wrap {
  background: var(--color-card-bg);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
  padding: var(--spacing-lg);
}

.contact-service {
  padding: var(--spacing-xl);
  background: var(--color-card-bg);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);

  h3 {
    font-size: var(--font-size-h3);
    font-weight: 600;
    color: var(--color-text-primary);
    margin-bottom: var(--spacing-sm);
  }

  &__desc {
    font-size: var(--font-size-body);
    color: var(--color-text-secondary);
    margin-bottom: var(--spacing-lg);
  }
}
</style>
