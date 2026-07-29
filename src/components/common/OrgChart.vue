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
    <div class="org-chart__tree">
      <!-- 根节点 -->
      <div class="org-chart__node org-chart__node--root">
        <div class="org-chart__node-card">
          <div class="org-chart__node-avatar">
            <el-icon :size="24"><UserFilled /></el-icon>
          </div>
          <div class="org-chart__node-info">
            <span class="org-chart__node-name">{{ data.name }}</span>
            <span class="org-chart__node-title">{{ data.title }}</span>
          </div>
        </div>
      </div>

      <!-- 连线 + 子节点 -->
      <div v-if="data.children?.length" class="org-chart__children-wrap">
        <div class="org-chart__connector-line" />
        <div class="org-chart__children">
          <div
            v-for="child in data.children"
            :key="child.id"
            class="org-chart__child-branch"
          >
            <div class="org-chart__node">
              <div class="org-chart__node-card">
                <div class="org-chart__node-avatar org-chart__node-avatar--child">
                  <el-icon :size="18"><UserFilled /></el-icon>
                </div>
                <div class="org-chart__node-info">
                  <span class="org-chart__node-name">{{ child.name }}</span>
                  <span class="org-chart__node-title">{{ child.title }}</span>
                </div>
              </div>
            </div>

            <!-- 递归子层级 -->
            <div v-if="child.children?.length" class="org-chart__grandchildren">
              <div v-for="gc in child.children" :key="gc.id" class="org-chart__node org-chart__node--leaf">
                <div class="org-chart__node-card">
                  <span class="org-chart__node-name">{{ gc.name }}</span>
                  <span class="org-chart__node-title">{{ gc.title }}</span>
                </div>
              </div>
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
  padding: var(--spacing-xl) 0;

  &__tree {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: max-content;
  }

  &__node {
    display: flex;
    justify-content: center;

    &-card {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      padding: var(--spacing-md) var(--spacing-lg);
      background: var(--color-card-bg);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-card);
      border: 2px solid transparent;
      transition: all var(--transition-fast) ease;
      white-space: nowrap;

      &:hover {
        border-color: var(--color-primary);
        box-shadow: 0 4px 16px rgba(26, 91, 179, 0.12);
      }
    }

    &--root &-card {
      background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
      color: #ffffff;
      border: none;
    }

    &--leaf &-card {
      background: var(--color-bg);
      padding: var(--spacing-sm) var(--spacing-md);
      font-size: var(--font-size-small);
    }

    &-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      &--child {
        background: rgba(26, 91, 179, 0.1);
        color: var(--color-primary);
      }
    }

    &-info {
      display: flex;
      flex-direction: column;
    }

    &-name {
      font-size: var(--font-size-body);
      font-weight: 600;
    }

    &-title {
      font-size: var(--font-size-small);
      opacity: 0.8;
    }
  }

  &__children-wrap {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: var(--spacing-md);
  }

  &__connector-line {
    width: 2px;
    height: 24px;
    background: var(--color-border);
  }

  &__children {
    display: flex;
    gap: var(--spacing-lg);
    position: relative;
    padding-top: var(--spacing-xs);

    /* 水平连接线（由边框顶部模拟） */
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 20%;
      right: 20%;
      height: 2px;
      background: var(--color-border);
    }
  }

  &__child-branch {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-sm);
    position: relative;

    /* 垂直连接线 */
    &::before {
      content: '';
      position: absolute;
      top: -4px;
      left: 50%;
      width: 2px;
      height: 12px;
      background: var(--color-border);
    }
  }

  &__grandchildren {
    display: flex;
    gap: var(--spacing-md);
    padding-top: var(--spacing-sm);
    position: relative;

    /* 水平连接线 */
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 10%;
      right: 10%;
      height: 1px;
      background: var(--color-border);
    }
  }
}
</style>
