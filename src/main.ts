import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import App from './App.vue'
import router from './router'
import { pinia } from './stores'

// 全局样式
import './assets/styles/reset.scss'
import './assets/styles/global.scss'

const app = createApp(App)

// Element Plus
app.use(ElementPlus, { size: 'default' })

// 全局注册 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// Pinia
app.use(pinia)

// Router
app.use(router)

app.mount('#app')
