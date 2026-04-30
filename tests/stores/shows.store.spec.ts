import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useShowsStore } from '@/stores/shows.store';
import * as api from '@/services/tvmaze.api';
import type { Show } from '@/types/show.types';

vi.mock('@/services/tvmaze.api', () => ({
  fetchAllShows: vi.fn(),
  searchShows: vi.fn(),
}));

const shows: Show[] = [
  {
    id: 1,
    name: 'Game of Thrones',
    type: 'Scripted',
    genres: ['Drama', 'Fantasy'],
    rating: { average: 9.0 },
    summary: 'Dragons and stuff',
    image: { medium: 'got.jpg', original: 'got-full.jpg' },
  },
  {
    id: 2,
    name: 'The Wire',
    type: 'Scripted',
    genres: ['Drama', 'Crime'],
    rating: { average: 9.3 },
    summary: 'Baltimore',
    image: { medium: 'wire.jpg', original: 'wire-full.jpg' },
  },
  {
    id: 3,
    name: 'The Office',
    type: 'Scripted',
    genres: ['Comedy'],
    rating: { average: 8.8 },
    summary: 'Paper company',
    image: { medium: 'office.jpg', original: 'office-full.jpg' },
  },
  {
    id: 4,
    name: 'Unrated Drama',
    type: 'Scripted',
    genres: ['Drama'],
    rating: { average: null },
    summary: 'No rating yet',
    image: { medium: 'unrated.jpg', original: 'unrated-full.jpg' },
  },
];

describe('shows store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('starts with empty state', () => {
    const store = useShowsStore();
    expect(store.shows).toEqual([]);
    expect(store.searchResults).toEqual([]);
    expect(store.loading).toBe(false);
    expect(store.error).toBeNull();
  });

  describe('fetchShows', () => {
    it('loads shows and clears error', async () => {
      vi.mocked(api.fetchAllShows).mockResolvedValue(shows);
      const store = useShowsStore();
      store.error = 'old error';

      await store.fetchShows();

      expect(store.shows).toEqual(shows);
      expect(store.error).toBeNull();
      expect(store.loading).toBe(false);
    });

    it('sets loading during fetch', async () => {
      let resolve: (v: Show[]) => void;
      vi.mocked(api.fetchAllShows).mockReturnValue(
        new Promise((r) => (resolve = r)),
      );
      const store = useShowsStore();

      const promise = store.fetchShows();
      expect(store.loading).toBe(true);

      resolve!(shows);
      await promise;
      expect(store.loading).toBe(false);
    });

    it('handles errors', async () => {
      vi.mocked(api.fetchAllShows).mockRejectedValue(new Error('API down'));
      const store = useShowsStore();

      await store.fetchShows();

      expect(store.error).toBe('API down');
      expect(store.shows).toEqual([]);
    });
  });

  describe('search', () => {
    it('searches and stores results', async () => {
      vi.mocked(api.searchShows).mockResolvedValue([shows[0]]);
      const store = useShowsStore();

      await store.search('game');

      expect(api.searchShows).toHaveBeenCalledWith('game');
      expect(store.searchQuery).toBe('game');
      expect(store.searchResults).toEqual([shows[0]]);
    });

    it('clears results for empty query', async () => {
      const store = useShowsStore();
      store.searchResults = shows;

      await store.search('');

      expect(api.searchShows).not.toHaveBeenCalled();
      expect(store.searchResults).toEqual([]);
    });

    it('handles search errors', async () => {
      vi.mocked(api.searchShows).mockRejectedValue(new Error('fail'));
      const store = useShowsStore();

      await store.search('test');

      expect(store.error).toBe('search failed');
    });
  });

  describe('showsByGenre', () => {
    it('groups and sorts by rating desc', () => {
      const store = useShowsStore();
      store.shows = shows;

      const byGenre = store.showsByGenre;

      expect(byGenre['Drama']).toHaveLength(3);
      // Wire (9.3) > GoT (9.0) > Unrated (null=0)
      expect(byGenre['Drama'][0].name).toBe('The Wire');
      expect(byGenre['Drama'][1].name).toBe('Game of Thrones');
      expect(byGenre['Drama'][2].name).toBe('Unrated Drama');

      expect(byGenre['Comedy']).toHaveLength(1);
      expect(byGenre['Fantasy']).toHaveLength(1);
    });

    it('returns {} when empty', () => {
      const store = useShowsStore();
      expect(store.showsByGenre).toEqual({});
    });
  });

  describe('isSearching', () => {
    it('true when query has content', () => {
      const store = useShowsStore();
      store.searchQuery = 'test';
      expect(store.isSearching).toBe(true);
    });

    it('false for empty/whitespace', () => {
      const store = useShowsStore();
      store.searchQuery = '   ';
      expect(store.isSearching).toBe(false);
    });
  });
});
