<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAppStore } from '@/stores/modules/app'

const appStore = useAppStore()
const isOpen = ref(false)
const messages = ref<{ text: string; from: 'user' | 'bot'; time: string }[]>([])
const inputText = ref('')

// ── 在线状态（工作日 9:00-18:00 在线，其余时间离线留言） ──
const isOnline = computed(() => {
  const now = new Date()
  const day = now.getDay() // 0=周日, 1=周一, ..., 6=周六
  const hour = now.getHours()
  return day >= 1 && day <= 5 && hour >= 9 && hour < 18
})

// 初始欢迎消息
const welcomeMsg = computed(() => {
  if (isOnline.value) {
    return `您好！欢迎来到${appStore.siteConfig.siteName}。请问有什么可以帮助您的？
- 产品咨询
- 服务申请
- 技术支持
- 其他问题
请直接输入您的问题，或拨打 ${appStore.contactInfo.phone}`
  }
  return `您好！当前为非工作时间，客服暂时离线。
如需帮助，您可以：
- 拨打 ${appStore.contactInfo.phone}
- 发送邮件至 ${appStore.contactInfo.email}
- 在此留言，我们将在工作日第一时间回复
请留下您的联系方式和需求描述：`
})

function toggleChat() {
  isOpen.value = !isOpen.value
  if (isOpen.value && messages.value.length === 0) {
    addBotMessage(welcomeMsg.value)
  }
}

function addBotMessage(text: string) {
  messages.value.push({ text, from: 'bot', time: formatNow() })
}

function addUserMessage(text: string) {
  messages.value.push({ text, from: 'user', time: formatNow() })
}

function formatNow(): string {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function sendMessage() {
  const text = inputText.value.trim()
  if (!text) return

  addUserMessage(text)
  inputText.value = ''

  // 模拟自动回复（对接真实客服系统时替换为 WebSocket/API）
  setTimeout(() => {
    const reply = getAutoReply(text)
    addBotMessage(reply)
  }, 800)
}

function getAutoReply(query: string): string {
  const q = query.toLowerCase()
  if (q.includes('产品') || q.includes('服务')) {
    return '感谢您的咨询！我们有通算云、智算云、云集成和运维服务四大产品线。您可以在"产品与服务"页面查看详情，或留下联系方式，我们安排技术专家与您对接。'
  }
  if (q.includes('价格') || q.includes('费用')) {
    return '我们的服务价格根据具体配置和规模定制，建议您通过"服务申请"提交需求，我们会提供专属报价方案。'
  }
  if (q.includes('电话') || q.includes('联系')) {
    return `您可以拨打 ${appStore.contactInfo.phone} 与我们联系，工作时间为 ${appStore.contactInfo.workingHours}。`
  }
  return `感谢您的留言！如需更详细的解答，建议您：
1. 拨打 ${appStore.contactInfo.phone} 直接沟通
2. 在"服务申请"页面提交详细需求
3. 发送邮件至 ${appStore.contactInfo.email}`
}

function onKeyup(e: KeyboardEvent) {
  if (e.key === 'Enter') sendMessage()
}
</script>

<template>
  <div class="cs-float" :class="{ 'cs-float--open': isOpen }">
    <!-- 对话窗口 -->
    <Transition name="cs-slide">
      <div v-if="isOpen" class="cs-float__panel">
        <div class="cs-float__header">
          <div class="cs-float__header-info">
            <el-icon :size="20"><Service /></el-icon>
            <span>在线客服</span>
          </div>
          <div class="cs-float__header-actions">
            <span class="cs-float__status" :class="{ 'is-offline': !isOnline }">
              {{ isOnline ? '在线' : '离线' }}
            </span>
            <button class="cs-float__close-btn" @click="isOpen = false" aria-label="关闭">
              <el-icon :size="16"><Close /></el-icon>
            </button>
          </div>
        </div>

        <div class="cs-float__body" ref="chatBody">
          <div
            v-for="(msg, idx) in messages"
            :key="idx"
            class="cs-float__msg"
            :class="{ 'cs-float__msg--user': msg.from === 'user' }"
          >
            <div class="cs-float__msg-bubble">{{ msg.text }}</div>
            <span class="cs-float__msg-time">{{ msg.time }}</span>
          </div>
        </div>

        <div class="cs-float__footer">
          <el-input
            v-model="inputText"
            placeholder="请输入您的问题..."
            @keyup="onKeyup"
          >
            <template #append>
              <el-button :icon="Promotion" @click="sendMessage" />
            </template>
          </el-input>
        </div>
      </div>
    </Transition>

    <!-- 触发按钮 -->
    <button class="cs-float__trigger" @click="toggleChat" :aria-label="isOpen ? '关闭客服' : '在线客服'">
      <el-icon :size="26">
        <ChatDotRound v-if="!isOpen" />
        <Close v-else />
      </el-icon>
    </button>
  </div>
</template>

<script lang="ts">
import { Promotion, ChatDotRound, Service, Close } from '@element-plus/icons-vue'
</script>

<style scoped lang="scss">
.cs-float {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 1500;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;

  &__panel {
    width: 360px;
    height: 480px;
    max-height: calc(100vh - 120px);
    background: var(--color-card-bg);
    border-radius: var(--radius-md);
    box-shadow: 0 8px 36px rgba(0, 0, 0, 0.18);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    background: linear-gradient(135deg, var(--color-primary), #0d3b7a);
    color: #ffffff;

    &-info {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: var(--font-size-body);
      font-weight: 600;
    }

    &-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }
  }

  &__status {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.9);

    &::before {
      content: '';
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #4caf50;
      flex-shrink: 0;
      box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.25);
    }

    &.is-offline {
      color: rgba(255, 255, 255, 0.6);

      &::before {
        background: #9e9e9e;
        box-shadow: 0 0 0 3px rgba(158, 158, 158, 0.2);
      }
    }
  }

  &__close-btn {
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.8);
    cursor: pointer;
    padding: 2px;

    &:hover { color: #ffffff; }
  }

  &__body {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    background: var(--color-bg);
  }

  &__msg {
    display: flex;
    flex-direction: column;
    max-width: 80%;

    &--user {
      align-self: flex-end;
    }

    &-bubble {
      padding: 10px 14px;
      border-radius: 12px;
      font-size: var(--font-size-small);
      line-height: 1.6;
      white-space: pre-wrap;
      word-break: break-word;

      .cs-float__msg:not(.cs-float__msg--user) & {
        background: var(--color-card-bg);
        border-bottom-left-radius: 4px;
      }

      .cs-float__msg--user & {
        background: var(--color-primary);
        color: #ffffff;
        border-bottom-right-radius: 4px;
      }
    }

    &-time {
      font-size: 10px;
      color: var(--color-text-disabled);
      margin-top: 4px;
      padding: 0 4px;

      .cs-float__msg--user & {
        text-align: right;
      }
    }
  }

  &__footer {
    padding: 12px;
    border-top: 1px solid var(--color-border);
    background: var(--color-card-bg);
  }

  &__trigger {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    border: none;
    background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 16px rgba(26, 91, 179, 0.4);
    transition: all var(--transition-base) ease;

    &:hover {
      transform: scale(1.08);
      box-shadow: 0 6px 22px rgba(26, 91, 179, 0.5);
    }
  }
}

/* 面板过渡 */
.cs-slide-enter-active,
.cs-slide-leave-active {
  transition: all 0.3s ease;
}
.cs-slide-enter-from,
.cs-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
