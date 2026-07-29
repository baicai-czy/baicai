<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = withDefaults(
  defineProps<{
    address?: string
    lat?: number
    lng?: number
    height?: string
  }>(),
  {
    address: '请通过后台配置公司地址',
    lat: 31.2304,
    lng: 121.4737,
    height: '400px',
  },
)

const mapLoaded = ref(false)
const mapFailed = ref(false)
const mapContainer = ref<HTMLDivElement>()

let observer: IntersectionObserver | null = null

/** 加载地图（预留高德/百度 API 接入点） */
function loadMap() {
  if (mapLoaded.value) return

  // TODO：实际集成高德或百度地图 SDK
  // 当前展示静态占位与外部地图链接
  mapLoaded.value = true
}

onMounted(() => {
  // 懒加载：IntersectionObserver 检测进入视口才加载
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting) {
        loadMap()
        observer?.disconnect()
      }
    },
    { threshold: 0.1 },
  )

  if (mapContainer.value) {
    observer.observe(mapContainer.value)
  }
})

onBeforeUnmount(() => {
  observer?.disconnect()
})

/** 打开外部地图 */
function openExternalMap() {
  const url = `https://uri.amap.com/marker?position=${props.lng},${props.lat}&name=${encodeURIComponent(props.address)}`
  window.open(url, '_blank', 'noopener,noreferrer')
}
</script>

<template>
  <div
    ref="mapContainer"
    class="map-viewer"
    :style="{ height: props.height }"
  >
    <!-- 加载失败 / 未加载时的静态占位 -->
    <div v-if="mapFailed || !mapLoaded" class="map-viewer__placeholder">
      <el-icon :size="40"><MapLocation /></el-icon>
      <p class="map-viewer__address">{{ props.address }}</p>
      <el-button type="primary" plain @click="openExternalMap">
        查看地图
        <el-icon><Right /></el-icon>
      </el-button>
    </div>

    <!-- 地图容器（预留） -->
    <div
      v-show="mapLoaded && !mapFailed"
      id="map-container"
      class="map-viewer__canvas"
    >
      <!-- 实际地图 SDK 在此渲染 -->
      <div class="map-viewer__mock">
        <p>地图加载中...</p>
        <p>{{ props.address }}</p>
        <el-button type="primary" size="small" @click="openExternalMap">
          在外部地图中查看
        </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.map-viewer {
  position: relative;
  width: 100%;
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--color-bg);
  border: 1px solid var(--color-border);

  &__placeholder,
  &__mock {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-md);
    color: var(--color-text-secondary);
    text-align: center;
    padding: var(--spacing-lg);
  }

  &__address {
    font-size: var(--font-size-body);
    font-weight: 600;
    color: var(--color-text-primary);
  }

  &__canvas {
    width: 100%;
    height: 100%;
  }
}
</style>
