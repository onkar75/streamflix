<script setup lang="ts">
import { reactive, computed, onMounted, ref } from 'vue';
import { useShowsStore } from '@/stores/shows.store';

import GenreRow from '@/components/GenreRow.vue';
import ShowCard from '@/components/ShowCard.vue';
import FilterBar from '@/components/FilterBar.vue';

const filterBarRef = ref<InstanceType<typeof FilterBar> | null>(null);

const store = useShowsStore();

onMounted(async () => {
  if (!store.shows.length) {
    await store.fetchShows();
  }
});

const filters = reactive({
  category: 'all' as string,
  rating: 'any' as 'any' | 7 | 8 | 9,
});

const categories = computed(() => {
  const set = new Set<string>();

  store.shows.forEach((show) => {
    show.genres.forEach((genre) => set.add(genre));
  });

  return Array.from(set).sort();
});

const filteredShowsByGenre = computed(() => {
  const result: Record<string, typeof store.shows> = {};

  Object.entries(store.showsByGenre).forEach(([genre, shows]) => {
    // Category filter
    if (filters.category !== 'all' && filters.category !== genre) return;

    const filtered = shows.filter((show) => {
      // Rating filter
      if (
        filters.rating !== 'any' &&
        (show.rating.average ?? 0) < filters.rating
      ) {
        return false;
      }

      return true;
    });

    if (filtered.length > 0) {
      result[genre] = filtered;
    }
  });

  return result;
});

const resetFilters = () => {
  filters.category = 'all';
  filters.rating = 'any';
  filterBarRef.value?.reset();
};
</script>

<template>
  <div class="home">
    <div v-if="store.loading">Loading shows...</div>
    <div v-else-if="store.error">{{ store.error }}</div>

    <!--  SEARCH RESULTS -->
    <section v-else-if="store.isSearching">
      <h2>Search Results</h2>

      <div v-if="store.searchResults.length === 0">No results found</div>

      <div class="search-grid">
        <ShowCard
          v-for="show in store.searchResults"
          :key="show.id"
          :show="show"
        />
      </div>
    </section>
    <!-- DASHBOARD -->
    <section v-else>
      <FilterBar
        ref="filterBarRef"
        :categories="categories"
        @update:category="(value) => (filters.category = value)"
        @update:rating="(value) => (filters.rating = value)"
      />

      <div
        v-if="Object.keys(filteredShowsByGenre).length === 0"
        class="empty-state"
      >
        <p>No shows match your filters.</p>
        <button @click="resetFilters">Clear filters</button>
      </div>

      <GenreRow
        v-for="(shows, genre) in filteredShowsByGenre"
        :key="genre"
        :genre="genre"
        :shows="shows"
      />
    </section>
  </div>
</template>

<style>
.empty-state {
  padding: 32px;
  text-align: center;
}

.empty-state button {
  margin-top: 12px;
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text);
  cursor: pointer;
}

button:hover {
  border-color: var(--text);
}

.search-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding: 16px;
  justify-content: center;
}
</style>
