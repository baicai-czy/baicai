<script setup lang="ts">
import { sanitizeHTML } from '@/utils/sanitize'

/** 公司简介富文本（实际从 API 获取） */
const profileHTML = ``
</script>

<template>
  <div class="page-about-profile">
    <h2 class="page-title">公司简介</h2>
    <div class="page-about-profile__banner">
      <div class="page-about-profile__placeholder">
        <el-icon :size="48"><OfficeBuilding /></el-icon>
        <p class="page-about-profile__placeholder-title">城际云（江苏）科技有限公司</p>
        <p class="page-about-profile__placeholder-desc">公司形象图片可在后台管理系统中上传替换</p>
      </div>
    </div>
    <div class="page-about-profile__content rich-content">
      <!-- 富文本内容通过 API 加载，DOMPurify 过滤后渲染 -->
      <div v-if="profileHTML" v-html="sanitizeHTML(profileHTML)" />
      <template v-else>
        <section class="about-section">
          <h3>公司概况</h3>
          <p>
            城际云（江苏）科技有限公司是一家专注于云计算服务的高新技术企业，致力于为政府和企业客户提供安全、可靠、高效的云计算解决方案。公司总部位于江苏省，业务覆盖国资云、云和智算集成两大核心版块。
          </p>
        </section>
        <section class="about-section">
          <h3>发展理念</h3>
          <p>
            公司秉持"专业、创新、共赢"的核心价值观，以"成为最懂行业的云服务公司"为愿景，持续深耕行业场景，为客户提供定制化的云计算服务。
          </p>
        </section>
        <section class="about-section">
          <h3>核心优势</h3>
          <div class="about-advantages">
            <div v-for="adv in advantages" :key="adv.title" class="about-advantage-card">
              <el-icon :size="28"><component :is="adv.icon" /></el-icon>
              <h4>{{ adv.title }}</h4>
              <p>{{ adv.desc }}</p>
            </div>
          </div>
        </section>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
const advantages = [
  { icon: 'Medal', title: '技术领先', desc: '拥有多项云计算相关专利与软著，技术团队占比超60%' },
  { icon: 'User', title: '行业深耕', desc: '服务覆盖政务、金融、医疗、教育等多个重点行业' },
  { icon: 'Lock', title: '安全合规', desc: '通过等保三级认证，严格遵循数据安全法规要求' },
  { icon: 'Service', title: '专业服务', desc: '7×24 小时运维保障，15 年行业经验沉淀' },
]
</script>

<style scoped lang="scss">
.page-title {
  font-size: var(--font-size-h2);
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xl);
}

.page-about-profile {
  &__banner {
    width: 100%;
    aspect-ratio: 21 / 9;
    max-height: 320px;
    border-radius: var(--radius-md);
    overflow: hidden;
    margin-bottom: var(--spacing-xl);
  }

  &__placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #0a2540 0%, #1a5bb3 50%, #00b4d8 100%);
    color: rgba(255, 255, 255, 0.7);
    gap: var(--spacing-xs);

    .el-icon { opacity: 0.5; }

    &-title {
      font-size: 22px;
      font-weight: 700;
      color: #ffffff;
      margin: var(--spacing-sm) 0 0 0;
    }

    &-desc {
      font-size: 13px;
      color: rgba(255, 255, 255, 0.5);
      margin: 0;
    }
  }
}

.about-section {
  margin-bottom: var(--spacing-xl);

  h3 {
    font-size: var(--font-size-h3);
    font-weight: 600;
    color: var(--color-text-primary);
    margin-bottom: var(--spacing-md);
    padding-bottom: var(--spacing-sm);
    border-bottom: 2px solid var(--color-border);
  }

  p {
    font-size: var(--font-size-body);
    color: var(--color-text-secondary);
    line-height: 1.8;
  }
}

.about-advantages {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);

  @include respond-to(sm) {
    grid-template-columns: repeat(4, 1fr);
  }
}

.about-advantage-card {
  text-align: center;
  padding: var(--spacing-lg);
  background: var(--color-bg);
  border-radius: var(--radius-md);
  transition: all var(--transition-base) ease;

  &:hover {
    background: var(--color-card-bg);
    box-shadow: var(--shadow-card);
  }

  .el-icon {
    color: var(--color-primary);
    margin-bottom: var(--spacing-sm);
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
    line-height: 1.5;
  }
}
</style>
