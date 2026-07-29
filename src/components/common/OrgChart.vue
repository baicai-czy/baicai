<script setup lang="ts">
interface OrgNode {
  id: string | number
  name: string
  title: string
  children?: OrgNode[]
}

defineProps<{
  data: OrgNode
}>()
</script>

<template>
  <div class="org-chart">
    <!-- ═══════════════════ 顶层：根节点（CEO） ═══════════════════ -->
    <div class="org-chart__root">
      <div class="org-chart__card org-chart__card--root">
        <div class="org-chart__card-badge">CEO</div>
        <div class="org-chart__card-avatar org-chart__card-avatar--root">
          <span>{{ data.name.slice(0, 1) }}</span>
        </div>
        <div class="org-chart__card-name">{{ data.name }}</div>
        <div class="org-chart__card-title">{{ data.title }}</div>
      </div>
    </div>

    <!-- ═══════════════════ 垂直主干连线 ═══════════════════ -->
    <div v-if="data.children?.length" class="org-chart__trunk">
      <div class="org-chart__trunk-line" />
      <div class="org-chart__trunk-arrow" />
    </div>

    <!-- ═══════════════════ 第二层：部门（CTO/CMO/COO） ═══════════════════ -->
    <div v-if="data.children?.length" class="org-chart__departments">
      <div
        v-for="child in data.children"
        :key="child.id"
        class="org-chart__department"
      >
        <!-- 部门负责人 -->
        <div class="org-chart__card org-chart__card--dept">
          <div class="org-chart__card-avatar org-chart__card-avatar--dept">
            <span>{{ child.name.slice(0, 2) }}</span>
          </div>
          <div class="org-chart__card-body">
            <div class="org-chart__card-name">{{ child.name }}</div>
            <div class="org-chart__card-title">{{ child.title }}</div>
          </div>
        </div>

        <!-- 下属团队 -->
        <div v-if="child.children?.length" class="org-chart__teams">
          <div class="org-chart__teams-line" />
          <div class="org-chart__teams-row">
            <div
              v-for="gc in child.children"
              :key="gc.id"
              class="org-chart__card org-chart__card--team"
            >
              <div class="org-chart__card-name">{{ gc.name }}</div>
              <div class="org-chart__card-title">{{ gc.title }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.org-chart {
  overflow-x: auto;
  padding: var(--spacing-2xl) var(--spacing-xl);

  /* ═══════════════════ 共通卡片 ═══════════════════ */
  &__card {
    background: var(--color-card-bg);
    border-radius: var(--radius-lg);
    text-align: center;
    transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: var(--shadow-card);
    border: 2px solid transparent;
    white-space: nowrap;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 32px rgba(26, 91, 179, 0.14);
      border-color: var(--color-primary);
    }

    &-badge {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 2px;
      margin-bottom: 8px;
    }

    &-avatar {
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      font-weight: 700;

      &--root {
        width: 56px;
        height: 56px;
        margin: 0 auto 8px;
        font-size: 24px;
        background: rgba(255, 255, 255, 0.2);
        color: #ffffff;
      }

      &--dept {
        width: 44px;
        height: 44px;
        font-size: 16px;
        background: rgba(26, 91, 179, 0.08);
        color: var(--color-primary);
      }
    }

    &-body {
      display: flex;
      flex-direction: column;
    }

    &-name {
      font-weight: 700;
      color: var(--color-text-primary);
    }

    &-title {
      color: var(--color-text-disabled);
    }

    /* ─── 根节点（CEO） ─── */
    &--root {
      padding: 28px 48px;
      background: linear-gradient(135deg, #0a2540 0%, #1a5bb3 100%);
      color: #ffffff;
      min-width: 200px;
      box-shadow: 0 8px 32px rgba(26, 91, 179, 0.25);

      .org-chart__card-name {
        font-size: 20px;
        color: #ffffff;
        margin-bottom: 4px;
      }

      .org-chart__card-title {
        font-size: 13px;
        color: rgba(255, 255, 255, 0.75);
      }
    }

    /* ─── 部门负责人 ─── */
    &--dept {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 18px 28px;
      min-width: 220px;
      text-align: left;

      .org-chart__card-name {
        font-size: 16px;
        margin-bottom: 2px;
      }

      .org-chart__card-title {
        font-size: 12px;
      }
    }

    /* ─── 团队成员 ─── */
    &--team {
      padding: 14px 22px;
      min-width: 140px;
      border: 1px solid var(--color-border);

      .org-chart__card-name {
        font-size: 14px;
        margin-bottom: 3px;
      }

      .org-chart__card-title {
        font-size: 11px;
      }
    }
  }

  /* ═══════════════════ 根节点容器 ═══════════════════ */
  &__root {
    display: flex;
    justify-content: center;
  }

  /* ═══════════════════ 主干连线 ═══════════════════ */
  &__trunk {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 8px 0;

    &-line {
      width: 3px;
      height: 36px;
      background: linear-gradient(to bottom, var(--color-primary), var(--color-border));
      border-radius: 2px;
    }

    &-arrow {
      width: 0;
      height: 0;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-top: 10px solid var(--color-border);
    }
  }

  /* ═══════════════════ 部门容器 ═══════════════════ */
  &__departments {
    display: flex;
    justify-content: center;
    gap: var(--spacing-2xl);
    position: relative;
    padding-top: 20px;

    /* 水平连接横杆 */
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 5%;
      right: 5%;
      height: 3px;
      border-radius: 2px;
      background: var(--color-border);
    }
  }

  &__department {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;

    /* 垂直连接线下垂 */
    &::before {
      content: '';
      position: absolute;
      top: -20px;
      left: 50%;
      width: 3px;
      height: 20px;
      border-radius: 2px;
      background: var(--color-border);
    }
  }

  /* ═══════════════════ 团队容器 ═══════════════════ */
  &__teams {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 16px;
    position: relative;

    &-line {
      width: 3px;
      height: 20px;
      border-radius: 2px;
      background: var(--color-border);
    }

    &-row {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: var(--spacing-lg);
      position: relative;
      padding-top: 16px;

      /* 横杆 */
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 10%;
        right: 10%;
        height: 3px;
        border-radius: 2px;
        background: var(--color-border);
      }
    }
  }

  /* 每个团队卡片的垂直连线 */
  &__teams-row > * {
    position: relative;

    &::before {
      content: '';
      position: absolute;
      top: -16px;
      left: 50%;
      width: 3px;
      height: 16px;
      border-radius: 2px;
      background: var(--color-border);
    }
  }
}
</style>
