<template>
  <section class="villager-gate">
    <h2>Villager Gate</h2>
    <ul class="villagers">
      <li
        v-for="villager in villagers.activeVillagers"
        :key="villager.id"
        class="villager"
        @dragover.prevent
        @drop="onDrop(villager, $event)"
      >
        <div class="header">
          <span>Villager {{ villager.id }}</span>
          <span class="timer">{{ villager.timer }} turns left</span>
        </div>
        <ul class="requests">
          <li v-for="(item, idx) in villager.requestedItems" :key="idx" class="request">
            <span class="icon">{{ iconFor(item) }}</span>
            <span class="name">{{ item }}</span>
            <button class="deliver" @click="deliverItem(villager, item)">Deliver</button>
          </li>
        </ul>
      </li>
    </ul>
    <div v-if="message.text" :class="['feedback', message.type]">{{ message.text }}</div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useVillagerStore } from '../stores/villagers'

const villagers = useVillagerStore()

const message = ref({ text: '', type: '' })

const iconMap = {
  Corn: '🌽',
  Milk: '🥛',
  Eggs: '🥚'
}

function iconFor(item) {
  return iconMap[item] || '📦'
}

function showMessage(text, type) {
  message.value = { text, type }
  setTimeout(() => {
    message.value.text = ''
  }, 1500)
}

function deliverItem(villager, item) {
  const idx = villager.requestedItems.indexOf(item)
  if (idx !== -1) {
    villager.requestedItems.splice(idx, 1)
    if (villager.requestedItems.length === 0) {
      villagers.fulfillVillager(villager.id)
      showMessage('Villager satisfied!', 'success')
    } else {
      showMessage(`Delivered ${item}!`, 'success')
    }
  } else {
    showMessage('Item not requested', 'error')
  }
}

function onDrop(villager, event) {
  const item = event.dataTransfer.getData('text/plain')
  if (item) {
    deliverItem(villager, item)
  }
}
</script>

<style scoped>
.villager-gate {
  margin-top: 1rem;
}

.villagers {
  list-style: none;
  padding: 0;
  margin: 0;
}

.villager {
  border: 1px solid #ccc;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
}

.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.25rem;
}

.requests {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.request {
  background: #f0f0f0;
  padding: 0.25rem 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.deliver {
  margin-left: 0.25rem;
}

.feedback {
  margin-top: 0.5rem;
  padding: 0.25rem 0.5rem;
}

.feedback.success {
  color: green;
}

.feedback.error {
  color: red;
}
</style>
