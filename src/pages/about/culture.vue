<script setup lang="ts">
const cultureItems = [
  {
    title: '企业使命',
    icon: 'Aim',
    content: '以领先的云计算技术赋能千行百业，推动数字中国建设',
    color: 'var(--color-primary)',
  },
  {
    title: '企业愿景',
    icon: 'Flag',
    content: '成为最懂行业的云服务公司，打造可信赖的数字化基座',
    color: 'var(--color-secondary)',
  },
  {
    title: '核心价值观',
    icon: 'Star',
    content: '专业 · 创新 · 共赢',
    color: 'var(--color-accent)',
  },
]

const values = [
  { title: '专业', desc: '深耕技术，精益求精，以专业能力赢得客户信赖' },
  { title: '创新', desc: '拥抱变化，持续突破，引领云计算技术创新应用' },
  { title: '共赢', desc: '与客户、伙伴共同成长，构建可持续发展的云生态' },
  { title: '担当', desc: '勇于承担社会责任，以科技力量助力社会发展' },
]
</script>

<template>
  <div class="page-culture">
    <h2 class="page-title">企业文化</h2>

    <!-- 使命/愿景/价值观 -->
    <div class="culture-mission">
      <div v-for="item in cultureItems" :key="item.title" class="culture-mission__card">
        <div class="culture-mission__icon" :style="{ background: item.color }">
          <el-icon :size="32" color="#fff"><component :is="item.icon" /></el-icon>
        </div>
        <h3>{{ item.title }}</h3>
        <p>{{ item.content }}</p>
      </div>
    </div>

    <!-- 价值观详解 -->
    <section class="culture-values">
      <h3 class="culture-values__heading">我们的价值观</h3>
      <div class="culture-values__grid">
        <div v-for="v in values" :key="v.title" class="culture-value-card">
          <h4>{{ v.title }}</h4>
          <p>{{ v.desc }}</p>
        </div>
      </div>
    </section>

    <!-- 团队风采 -->
    <section class="culture-team">
      <h3 class="culture-values__heading">团队风采</h3>
      <div class="culture-team__placeholder">
        <el-icon :size="48"><Picture /></el-icon>
        <p>团队活动照片将通过后台管理系统上传展示</p>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.page-title {
  font-size: var(--font-size-h2);
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xl);
}

.culture-mission {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-2xl);

  @include respond-to(sm) {
    grid-template-columns: repeat(3, 1fr);
  }

  &__card {
    text-align: center;
    padding: var(--spacing-xl);
    background: var(--color-card-bg);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-card);
    transition: transform var(--transition-base) ease;

    &:hover {
      transform: translateY(-4px);
    }

    h3 {
      font-size: var(--font-size-h3);
      font-weight: 600;
      color: var(--color-text-primary);
      margin: var(--spacing-md) 0 var(--spacing-sm);
    }

    p {
      font-size: var(--font-size-body);
      color: var(--color-text-secondary);
      line-height: 1.6;
    }
  }

  &__icon {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
  }
}

.culture-values {
  margin-bottom: var(--spacing-2xl);

  &__heading {
    font-size: var(--font-size-h3);
    font-weight: 600;
    color: var(--color-text-primary);
    margin-bottom: var(--spacing-lg);
    padding-bottom: var(--spacing-sm);
    border-bottom: 2px solid var(--color-border);
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--spacing-md);

    @include respond-to(sm) {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}

.culture-value-card {
  padding: var(--spacing-lg);
  background: var(--color-bg);
  border-radius: var(--radius-md);
  border-left: 4px solid var(--color-primary);

  h4 {
    font-size: var(--font-size-body);
    font-weight: 600;
    color: var(--color-primary);
    margin-bottom: var(--spacing-xs);
  }

  p {
    font-size: var(--font-size-body);
    color: var(--color-text-secondary);
    line-height: 1.6;
  }
}

.culture-team {
  &__placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-2xl);
    background: var(--color-bg);
    border-radius: var(--radius-md);
    border: 2px dashed var(--color-border);
    color: var(--color-text-disabled);
    gap: var(--spacing-md);

    p {
      font-size: var(--font-size-body);
    }
  }
}
</style>
