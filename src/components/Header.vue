<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { RouterLink } from 'vue-router';
import SearchBar from './SearchBar.vue';
import logo from '@/assets/logo.svg';

const theme = ref<'light' | 'dark'>('dark');

watchEffect(() => {
  document.documentElement.setAttribute('data-theme', theme.value);
});

const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light';
};
</script>

<template>
  <header class="header">
    <RouterLink to="/" class="brand">
      <img :src="logo" alt="StreamFlix" class="logo" />
    </RouterLink>

    <div class="search-container">
      <SearchBar />
    </div>

    <button class="theme-btn" @click="toggleTheme">
      {{ theme === 'light' ? '🌙' : '☀️' }}
    </button>
  </header>
</template>

<style>
.header {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid var(--border);
  background-color: var(--bg);
  position: sticky;
  top: 0;
  z-index: 9999;
}

.brand {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  cursor: pointer;
  text-decoration: none;
}

.search-container {
  flex: 1;
  display: flex;
  justify-content: center;
}

.logo {
  height: 28px;
  width: auto;
  display: block;
}

.theme-btn {
  flex: 0 0 auto;
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
}
</style>
