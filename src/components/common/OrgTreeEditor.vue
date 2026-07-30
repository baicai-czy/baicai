<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [v: string] }>()

interface TreeNode { name: string; children?: (string|TreeNode)[] }

const tree = reactive<TreeNode>({ name: 'CEO/总经理', children: [] })
const editDialog = ref(false)
const editPath = ref<string[]>([])
const editName = ref('')
const isRoot = ref(false)

function parseTree(json: string): TreeNode {
  try { const arr = JSON.parse(json); return arr[0] || { name: 'CEO/总经理', children: [] } }
  catch { return { name: 'CEO/总经理', children: [] } }
}

function serializeTree(): string {
  return JSON.stringify([tree], null, 2)
}

onMounted(() => {
  if (props.modelValue) Object.assign(tree, parseTree(props.modelValue))
})

function emitChange() { emit('update:modelValue', serializeTree()) }

function addChild(path: string[]) {
  let node: any = tree
  for (const p of path) {
    if (Array.isArray(node)) node = node.find((n: any) => (typeof n === 'string' ? n : n.name) === p)
    else node = node.children?.find((n: any) => (typeof n === 'string' ? n : n.name) === p)
  }
  if (!node.children) node.children = []
  node.children.push(`新部门`)
  emitChange()
}

function editNode(path: string[], root: boolean) {
  isRoot.value = root
  editPath.value = path
  let node: any = tree
  if (root) { editName.value = tree.name; editDialog.value = true; return }
  for (const p of path) {
    if (typeof node === 'string') break
    if (Array.isArray(node)) node = node.find((n: any) => (typeof n === 'string' ? n : n.name) === p)
    else node = node.children?.find((n: any) => (typeof n === 'string' ? n : n.name) === p)
  }
  editName.value = typeof node === 'string' ? node : (node?.name || '')
  editDialog.value = true
}

function saveEdit() {
  let node: any = tree
  if (isRoot.value) { tree.name = editName.value; emitChange(); editDialog.value = false; return }
  const path = editPath.value.slice(0, -1)
  const last = editPath.value[editPath.value.length - 1]
  for (const p of path) {
    if (typeof node === 'string') break
    if (Array.isArray(node)) node = node.find((n: any) => (typeof n === 'string' ? n : n.name) === p)
    else node = node.children?.find((n: any) => (typeof n === 'string' ? n : n.name) === p)
  }
  const children = Array.isArray(node) ? node : (node?.children || [])
  const idx = children.findIndex((n: any) => (typeof n === 'string' ? n : n.name) === last)
  if (idx >= 0) children[idx] = editName.value
  emitChange()
  editDialog.value = false
}

function deleteNode(path: string[], root: boolean) {
  if (root) return // can't delete root
  const last = path[path.length - 1]
  let node: any = tree
  const parentPath = path.slice(0, -1)
  for (const p of parentPath) {
    if (typeof node === 'string') break
    if (Array.isArray(node)) node = node.find((n: any) => (typeof n === 'string' ? n : n.name) === p)
    else node = node.children?.find((n: any) => (typeof n === 'string' ? n : n.name) === p)
  }
  const children = Array.isArray(node) ? node : (node?.children || [])
  const idx = children.findIndex((n: any) => (typeof n === 'string' ? n : n.name) === last)
  if (idx >= 0) children.splice(idx, 1)
  emitChange()
}
</script>

<template>
  <div class="tree-editor">
    <!-- 根节点 -->
    <div class="tree-node">
      <div class="tree-node__card">
        <span>{{ tree.name }}</span>
        <div class="tree-node__actions">
          <el-button size="small" text @click="editNode([], true)"><el-icon><Edit /></el-icon></el-button>
          <el-button size="small" text @click="addChild([])"><el-icon><Plus /></el-icon></el-button>
        </div>
      </div>
      <!-- 第二层 -->
      <div v-if="tree.children?.length" class="tree-children">
        <div v-for="(child, ci) in tree.children" :key="ci" class="tree-branch">
          <div class="tree-node__card tree-node__card--child">
            <span>{{ typeof child === 'string' ? child : child.name }}</span>
            <div class="tree-node__actions">
              <el-button size="small" text @click="editNode([typeof child==='string'?child:child.name], false)"><el-icon><Edit /></el-icon></el-button>
              <el-button size="small" text @click="addChild([typeof child==='string'?child:child.name])"><el-icon><Plus /></el-icon></el-button>
              <el-button size="small" text type="danger" @click="deleteNode([typeof child==='string'?child:child.name], false)"><el-icon><Delete /></el-icon></el-button>
            </div>
          </div>
          <!-- 第三层 -->
          <div v-if="typeof child !== 'string' && child.children?.length" class="tree-children">
            <div v-for="(grand, gi) in child.children" :key="gi" class="tree-node__card tree-node__card--leaf">
              <span>{{ typeof grand === 'string' ? grand : grand.name }}</span>
              <div class="tree-node__actions">
                <el-button size="small" text @click="editNode([typeof child==='string'?child:child.name, typeof grand==='string'?grand:grand.name], false)"><el-icon><Edit /></el-icon></el-button>
                <el-button size="small" text type="danger" @click="deleteNode([typeof child==='string'?child:child.name, typeof grand==='string'?grand:grand.name], false)"><el-icon><Delete /></el-icon></el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 编辑弹窗 -->
    <el-dialog v-model="editDialog" title="编辑节点" width="400px">
      <el-input v-model="editName" placeholder="节点名称" @keyup.enter="saveEdit" />
      <template #footer>
        <el-button @click="editDialog=false">取消</el-button>
        <el-button type="primary" @click="saveEdit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.tree-editor { padding: 20px 0; }
.tree-node { text-align: center; }
.tree-node__card { display: inline-flex; align-items: center; gap: 8px; padding: 10px 24px; background: var(--color-card-bg); border: 2px solid var(--color-primary); border-radius: 8px; font-weight: 700; font-size: 16px; box-shadow: var(--shadow-card); margin: 4px; }
.tree-node__card--child { border-color: var(--color-secondary); font-size: 15px; font-weight: 600; padding: 8px 18px; }
.tree-node__card--leaf { display: inline-flex; align-items: center; gap: 4px; padding: 6px 14px; background: var(--color-bg); border: 1px solid var(--color-border); border-radius: 6px; font-size: 14px; font-weight: 400; margin: 3px; }
.tree-node__actions { display: flex; gap: 2px; margin-left: 4px; }
.tree-children { display: flex; justify-content: center; gap: 8px; margin-top: 20px; padding-top: 20px; border-top: 2px solid var(--color-border); flex-wrap: wrap; position: relative; }
.tree-branch { display: flex; flex-direction: column; align-items: center; }
</style>
