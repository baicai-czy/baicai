<script setup lang="ts">
import { ref } from 'vue'

export interface OrgNode {
  id: string | number
  name: string
  title: string
  /** 头像 URL */
  photo?: string
  /** 个人简介 */
  bio?: string
  /** 部门描述 */
  departmentDesc?: string
  children?: OrgNode[]
}

defineProps<{
  data: OrgNode
}>()

const emit = defineEmits<{
  'node-click': [node: OrgNode]
}>()

/** 当前选中的节点 */
const selected = ref<OrgNode | null>(null)

function onNodeClick(node: OrgNode) {
  selected.value = node
  emit('node-click', node)
}

function closeDetail() {
  selected.value = null
}
</script>

<template>
  <div class="org-chart">
    <!-- ═══════════════════ 根节点 ═══════════════════ -->
    <div class="org-chart__root">
      <div class="org-chart__card org-chart__card--root" @click="onNodeClick(data)">
        <div class="org-chart__card-badge">CEO</div>
        <div class="org-chart__card-avatar org-chart__card-avatar--root">
          <img v-if="data.photo" :src="data.photo" :alt="data.name" />
          <span v-else>{{ data.name.slice(0, 1) }}</span>
        </div>
        <div class="org-chart__card-name">{{ data.name }}</div>
        <div class="org-chart__card-title">{{ data.title }}</div>
        <div class="org-chart__card-hint">点击查看详情</div>
      </div>
    </div>

    <!-- ═══════════════════ 主干连线 ═══════════════════ -->
    <div v-if="data.children?.length" class="org-chart__trunk">
      <div class="org-chart__trunk-line" />
      <div class="org-chart__trunk-arrow" />
    </div>

    <!-- ═══════════════════ 部门层 ═══════════════════ -->
    <div v-if="data.children?.length" class="org-chart__departments">
      <div
        v-for="child in data.children"
        :key="child.id"
        class="org-chart__department"
      >
        <div class="org-chart__card org-chart__card--dept" @click="onNodeClick(child)">
          <div class="org-chart__card-avatar org-chart__card-avatar--dept">
            <img v-if="child.photo" :src="child.photo" :alt="child.name" />
            <span v-else>{{ child.name.slice(0, 2) }}</span>
          </div>
          <div class="org-chart__card-body">
            <div class="org-chart__card-name">{{ child.name }}</div>
            <div class="org-chart__card-title">{{ child.title }}</div>
          </div>
        </div>

        <div v-if="child.children?.length" class="org-chart__teams">
          <div class="org-chart__teams-line" />
          <div class="org-chart__teams-row">
            <div
              v-for="gc in child.children"
              :key="gc.id"
              class="org-chart__card org-chart__card--team"
              @click="onNodeClick(gc)"
            >
              <div class="org-chart__card-avatar org-chart__card-avatar--team">
                <img v-if="gc.photo" :src="gc.photo" :alt="gc.name" />
                <el-icon v-else :size="16"><UserFilled /></el-icon>
              </div>
              <div>
                <div class="org-chart__card-name">{{ gc.name }}</div>
                <div class="org-chart__card-title">{{ gc.title }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════════ 详情弹窗 ═══════════════════ -->
    <Teleport to="body">
      <Transition name="org-modal">
        <div v-if="selected" class="org-modal-overlay" @click.self="closeDetail">
          <div class="org-modal">
            <button class="org-modal__close" @click="closeDetail" aria-label="关闭">
              <el-icon :size="22"><Close /></el-icon>
            </button>

            <!-- 头像 -->
            <div class="org-modal__avatar">
              <img v-if="selected.photo" :src="selected.photo" :alt="selected.name" />
              <span v-else>{{ selected.name.slice(0, 2) }}</span>
            </div>

            <h2 class="org-modal__name">{{ selected.name }}</h2>
            <p class="org-modal__title">{{ selected.title }}</p>

            <!-- 分隔线 -->
            <div class="org-modal__divider" />

            <!-- 个人简介 / 部门描述 -->
            <div class="org-modal__content">
              <template v-if="selected.bio">
                <h4>个人简介</h4>
                <p>{{ selected.bio }}</p>
              </template>
              <template v-if="selected.departmentDesc">
                <h4>部门职责</h4>
                <p>{{ selected.departmentDesc }}</p>
              </template>
              <template v-if="!selected.bio && !selected.departmentDesc">
                <p class="org-modal__placeholder">
                  详细信息将在后台管理系统中配置展示
                </p>
              </template>
            </div>

            <!-- 下属团队 -->
            <div v-if="selected.children?.length" class="org-modal__team">
              <h4>下属团队</h4>
              <div class="org-modal__team-list">
                <span v-for="c in selected.children" :key="c.id" class="org-modal__team-tag">
                  {{ c.name }} — {{ c.title }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped lang="scss">
.org-chart {
  overflow-x: auto;
  padding: var(--spacing-2xl) var(--spacing-xl);

  /* ═══ 卡片共通 ═══ */
  &__card {
    background: var(--color-card-bg);
    border-radius: var(--radius-lg);
    text-align: center;
    transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: var(--shadow-card);
    border: 2px solid transparent;
    white-space: nowrap;
    cursor: pointer;

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
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

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

      &--team {
        width: 32px;
        height: 32px;
        font-size: 12px;
        background: var(--color-bg);
        color: var(--color-text-disabled);
      }
    }

    &-hint {
      font-size: 11px;
      color: rgba(255, 255, 255, 0.5);
      margin-top: 8px;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    &-name {
      font-weight: 700;
      color: var(--color-text-primary);
    }

    &-title {
      color: var(--color-text-disabled);
    }

    &--root {
      padding: 28px 48px;
      background: linear-gradient(135deg, #0a2540 0%, #1a5bb3 100%);
      color: #ffffff;
      min-width: 200px;
      box-shadow: 0 8px 32px rgba(26, 91, 179, 0.25);

      .org-chart__card-name { font-size: 20px; color: #ffffff; margin-bottom: 4px; }
      .org-chart__card-title { font-size: 13px; color: rgba(255, 255, 255, 0.75); }

      &:hover .org-chart__card-hint { opacity: 1; }
    }

    &--dept {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 18px 28px;
      min-width: 220px;
      text-align: left;

      .org-chart__card-name { font-size: 16px; margin-bottom: 2px; }
      .org-chart__card-title { font-size: 12px; }
    }

    &--team {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 20px;
      min-width: 160px;
      border: 1px solid var(--color-border);
      text-align: left;

      .org-chart__card-name { font-size: 14px; margin-bottom: 2px; }
      .org-chart__card-title { font-size: 11px; }
    }
  }

  /* ═══ 根/主干/部门/团队 布局 ═══ */
  &__root { display: flex; justify-content: center; }

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
      width: 0; height: 0;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-top: 10px solid var(--color-border);
    }
  }

  &__departments {
    display: flex;
    justify-content: center;
    gap: var(--spacing-2xl);
    position: relative;
    padding-top: 20px;

    &::before {
      content: '';
      position: absolute;
      top: 0; left: 5%; right: 5%;
      height: 3px; border-radius: 2px;
      background: var(--color-border);
    }
  }

  &__department {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      top: -20px; left: 50%;
      width: 3px; height: 20px;
      border-radius: 2px;
      background: var(--color-border);
    }
  }

  &__teams {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 16px;
    position: relative;

    &-line {
      width: 3px; height: 20px;
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

      &::before {
        content: '';
        position: absolute;
        top: 0; left: 10%; right: 10%;
        height: 3px; border-radius: 2px;
        background: var(--color-border);
      }

      > * {
        position: relative;
        &::before {
          content: '';
          position: absolute;
          top: -16px; left: 50%;
          width: 3px; height: 16px;
          border-radius: 2px;
          background: var(--color-border);
        }
      }
    }
  }
}

/* ═══ 详情弹窗 ═══ */
.org-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 2000;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
}

.org-modal {
  background: var(--color-card-bg);
  border-radius: var(--radius-xl);
  padding: var(--spacing-2xl);
  max-width: 520px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  text-align: center;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.25);

  &__close {
    position: absolute;
    top: 16px;
    right: 16px;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: none;
    background: var(--color-bg);
    color: var(--color-text-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all var(--transition-fast) ease;

    &:hover {
      background: var(--color-primary);
      color: #ffffff;
    }
  }

  &__avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    margin: 0 auto var(--spacing-md);
    background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    font-weight: 700;
    color: #ffffff;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__name {
    font-size: 24px;
    font-weight: 800;
    color: var(--color-text-primary);
    margin: 0 0 4px;
  }

  &__title {
    font-size: 14px;
    color: var(--color-text-disabled);
    margin: 0;
  }

  &__divider {
    width: 40px;
    height: 3px;
    border-radius: 3px;
    background: var(--color-primary);
    margin: var(--spacing-lg) auto;
  }

  &__content {
    text-align: left;
    margin-bottom: var(--spacing-lg);

    h4 {
      font-size: 15px;
      font-weight: 700;
      color: var(--color-text-primary);
      margin-bottom: var(--spacing-sm);
    }

    p {
      font-size: 14px;
      color: var(--color-text-secondary);
      line-height: 1.8;
    }
  }

  &__placeholder {
    text-align: center;
    color: var(--color-text-disabled);
    font-size: 13px;
    padding: var(--spacing-lg);
  }

  &__team {
    text-align: left;

    h4 {
      font-size: 15px;
      font-weight: 700;
      color: var(--color-text-primary);
      margin-bottom: var(--spacing-sm);
    }

    &-list {
      display: flex;
      flex-wrap: wrap;
      gap: var(--spacing-sm);
    }

    &-tag {
      padding: 4px 14px;
      font-size: 12px;
      background: rgba(26, 91, 179, 0.06);
      color: var(--color-primary);
      border-radius: 50px;
      font-weight: 500;
    }
  }
}

/* 弹窗过渡 */
.org-modal-enter-active,
.org-modal-leave-active {
  transition: all 0.3s ease;
}
.org-modal-enter-from,
.org-modal-leave-to {
  opacity: 0;
}
.org-modal-enter-from .org-modal,
.org-modal-leave-to .org-modal {
  transform: scale(0.9) translateY(20px);
}
</style>
