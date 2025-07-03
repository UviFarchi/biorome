<script setup>
import MainFieldGrid from './components/MainFieldGrid.vue'
import AssemblyArea from './components/AssemblyArea.vue'
import VillagerGate from './components/VillagerGate.vue'
import GameEndPanel from './components/GameEndPanel.vue'
</script>

<template>
  <main>
    <MainFieldGrid />
    <AssemblyArea />
    <VillagerGate />
    <GameEndPanel />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
