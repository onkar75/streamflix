import { defineStore } from 'pinia';

import { ref, computed } from 'vue';

import type { Show } from '@/types/show.types';

import { fetchAllShows, searchShows } from '@/services/tvmaze.api';

export const useShowsStore = defineStore('shows', () => {
  // state
  const shows = ref<Show[]>([]);
  const searchResults = ref<Show[]>([]);
  const searchQuery = ref('');
  const loading = ref(false);
  const error = ref<string | null>(null);

  // action
  const fetchShows = async () => {
    loading.value = true;
    error.value = null;
    try {
      shows.value = await fetchAllShows();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
    } finally {
      loading.value = false;
    }
  };

  const search = async (query: string) => {
    searchQuery.value = query;

    if (!query.trim()) {
      searchResults.value = [];
      return;
    }

    loading.value = true;

    try {
      searchResults.value = await searchShows(query);
    } catch {
      error.value = 'search failed';
    } finally {
      loading.value = false;
    }
  };

  // getter
  const showsByGenre = computed(() => {
    const map: Record<string, Show[]> = {};

    shows.value.forEach((show) => {
      show.genres.forEach((genre) => {
        if (!map[genre]) {
          map[genre] = [];
        }
        map[genre].push(show);
      });
    });

    //sort genre by rating
    Object.values(map).forEach((list) => {
      list.sort((a, b) => (b.rating.average ?? 0) - (a.rating.average ?? 0));
    });

    return map;
  });

  const isSearching = computed(() => searchQuery.value.trim().length > 0);

  return {
    shows,
    showsByGenre,
    searchResults,
    searchQuery,
    isSearching,
    loading,
    error,
    fetchShows,
    search,
  };
});
