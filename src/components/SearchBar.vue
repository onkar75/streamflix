<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import { useShowsStore } from '@/stores/shows.store';
import { debounce } from '@/utils/debounce';

const store = useShowsStore();
const router = useRouter();
const route = useRoute();

const query = ref('');

const debouncedSearch = debounce(async (value: string) => {
  await store.search(value);
  if (value && route.path !== '/') {
    router.push('/');
  }
}, 300);

const onInput = async () => {
  await debouncedSearch(query.value);
};
</script>

<template>
  <div class="search-bar">
    <input
      type="search"
      name="search"
      v-model="query"
      @input="onInput"
      placeholder="Search TV shows..."
      class="search-input"
    />

    <button class="search-btn" aria-label="Search">🔍</button>
  </div>
</template>

<style>
.search-bar {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 440px;
}

.search-input {
  width: 100%;
  padding: 8px 40px 8px 16px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text);
  font-size: 14px;
}

.search-btn {
  position: absolute;
  right: 8px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text);
  font-size: 16px;
}

.search-bar:hover .search-input {
  border-color: var(--text);
}
</style>
