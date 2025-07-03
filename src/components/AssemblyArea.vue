<template>
  <section class="assembly-area">
    <h2>Modules</h2>
    <div class="modules-list">
      <div
        v-for="m in modules.state.modules"
        :key="m.type"
        class="module"
        :class="{ disabled: m.usesLeft <= 0 }"
        draggable="true"
        @dragstart="onDragStart(m.type, $event)"
        @click="selectModule(m.type)"
      >
        {{ m.type }} ({{ m.usesLeft }})
      </div>
    </div>

    <h3>Assembly</h3>
    <div class="assembly-slots">
      <div
        v-for="(slot, index) in 3"
        :key="index"
        class="slot"
        @dragover.prevent
        @drop="onDrop(index, $event)"
        @click="removeModule(index)"
      >
        {{ selectedModules[index] || 'Empty' }}
      </div>
    </div>

    <div class="deploy-controls">
      <label>
        Row:
        <select v-model.number="selectedRow">
          <option v-for="r in board.size" :key="r" :value="r - 1">{{ r - 1 }}</option>
        </select>
      </label>
      <label>
        Col:
        <select v-model.number="selectedCol">
          <option v-for="c in board.size" :key="c" :value="c - 1">{{ c - 1 }}</option>
        </select>
      </label>
      <button @click="deploy" :disabled="selectedModules.length === 0">Deploy</button>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useModulesStore } from '../stores/modules'
import { useBoardStore } from '../stores/board'

const modules = useModulesStore()
const board = useBoardStore()

const selectedModules = ref([])
const selectedRow = ref(0)
const selectedCol = ref(0)

function selectModule(type) {
  const mod = modules.state.modules.find(m => m.type === type)
  if (!mod || mod.usesLeft <= 0) return
  if (selectedModules.value.length >= 3) return
  if (!selectedModules.value.includes(type)) {
    selectedModules.value.push(type)
  }
}

function removeModule(index) {
  selectedModules.value.splice(index, 1)
}

function onDragStart(type, event) {
  event.dataTransfer.setData('text/plain', type)
}

function onDrop(index, event) {
  const type = event.dataTransfer.getData('text/plain')
  selectModule(type)
}

function deploy() {
  const assembly = modules.assemble(selectedModules.value)
  modules.deploy(selectedRow.value, selectedCol.value, assembly)
  selectedModules.value = []
}
</script>

<style scoped>
.assembly-area {
  margin-top: 1rem;
}

.modules-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.module {
  border: 1px solid #ccc;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  user-select: none;
}

.module.disabled {
  opacity: 0.4;
  pointer-events: none;
}

.assembly-slots {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.slot {
  border: 1px dashed #888;
  padding: 0.5rem;
  min-width: 60px;
  text-align: center;
}

.deploy-controls {
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
