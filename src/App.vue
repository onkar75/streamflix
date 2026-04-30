<script setup lang="ts">
import { RouterView } from 'vue-router';

import Header from '@/components/Header.vue';
</script>

<template>
  <div class="app">
    <Header />
    <main class="content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
  margin-top: 16px;
}
</style>
