import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import HomePage from '@/pages/HomePage.vue';
import { useShowsStore } from '@/stores/shows.store';
import FilterBar from '@/components/FilterBar.vue';
import GenreRow from '@/components/GenreRow.vue';
import ShowCard from '@/components/ShowCard.vue';
import type { Show } from '@/types/show.types';

const shows: Show[] = [
  {
    id: 1,
    name: 'Breaking Bad',
    type: 'Scripted',
    genres: ['Drama', 'Crime'],
    rating: { average: 9.3 },
    summary: '',
    image: { medium: '1.jpg', original: '1.jpg' },
  },
  {
    id: 2,
    name: 'The Office',
    type: 'Scripted',
    genres: ['Comedy'],
    rating: { average: 8.8 },
    summary: '',
    image: { medium: '2.jpg', original: '2.jpg' },
  },
  {
    id: 3,
    name: 'True Detective',
    type: 'Scripted',
    genres: ['Drama', 'Crime'],
    rating: { average: 8.5 },
    summary: '',
    image: { medium: '3.jpg', original: '3.jpg' },
  },
  {
    id: 4,
    name: 'Low Rated',
    type: 'Scripted',
    genres: ['Drama'],
    rating: { average: 6.0 },
    summary: '',
    image: { medium: '4.jpg', original: '4.jpg' },
  },
];

describe('HomePage', () => {
  beforeEach(() => vi.clearAllMocks());

  function mountPage(
    opts: Partial<{
      shows: Show[];
      loading: boolean;
      error: string | null;
      isSearching: boolean;
      searchResults: Show[];
    }> = {},
  ) {
    return mount(HomePage, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              shows: {
                shows: opts.shows ?? [],
                loading: opts.loading ?? false,
                error: opts.error ?? null,
                searchQuery: opts.isSearching ? 'test' : '',
                searchResults: opts.searchResults ?? [],
              },
            },
            stubActions: false,
          }),
        ],
        stubs: {
          RouterLink: { template: '<a><slot /></a>', props: ['to'] },
        },
      },
    });
  }

  it('shows loading state', () => {
    const wrapper = mountPage({ loading: true });
    expect(wrapper.text()).toContain('Loading');
  });

  it('shows error message', () => {
    const wrapper = mountPage({ error: 'Network error' });
    expect(wrapper.text()).toContain('Network error');
  });

  describe('search mode', () => {
    it('shows search results header', () => {
      const wrapper = mountPage({
        shows,
        isSearching: true,
        searchResults: [shows[0]],
      });
      expect(wrapper.find('h2').text()).toBe('Search Results');
    });

    it('shows empty state for no results', () => {
      const wrapper = mountPage({
        shows,
        isSearching: true,
        searchResults: [],
      });
      expect(wrapper.text()).toContain('No results');
    });

    it('renders cards for results', () => {
      const wrapper = mountPage({
        shows,
        isSearching: true,
        searchResults: shows.slice(0, 2),
      });
      expect(wrapper.findAllComponents(ShowCard)).toHaveLength(2);
    });
  });

  describe('dashboard mode', () => {
    it('renders FilterBar with sorted categories', () => {
      const wrapper = mountPage({ shows });
      const categories = wrapper.findComponent(FilterBar).props('categories');

      expect(categories).toContain('Drama');
      expect(categories).toContain('Comedy');
      expect(categories).toEqual([...categories].sort());
    });

    it('renders genre rows', () => {
      const wrapper = mountPage({ shows });
      expect(wrapper.findAllComponents(GenreRow).length).toBeGreaterThan(0);
    });

    it('filters by category', async () => {
      const wrapper = mountPage({ shows });

      await wrapper
        .findComponent(FilterBar)
        .vm.$emit('update:category', 'Comedy');
      await flushPromises();

      const rows = wrapper.findAllComponents(GenreRow);
      expect(rows).toHaveLength(1);
      expect(rows[0].props('genre')).toBe('Comedy');
    });

    it('filters by rating', async () => {
      const wrapper = mountPage({ shows });

      await wrapper.findComponent(FilterBar).vm.$emit('update:rating', 8);
      await flushPromises();

      const rows = wrapper.findAllComponents(GenreRow);
      rows.forEach((row) => {
        const rowShows = row.props('shows') as Show[];
        rowShows.forEach((s) =>
          expect(s.rating.average).toBeGreaterThanOrEqual(8),
        );
      });
    });

    it('shows empty state and reset button when filters match nothing', async () => {
      const wrapper = mountPage({ shows });

      await wrapper
        .findComponent(FilterBar)
        .vm.$emit('update:category', 'Comedy');
      await wrapper.findComponent(FilterBar).vm.$emit('update:rating', 9);
      await flushPromises();

      expect(wrapper.text()).toContain('No shows match');
      expect(wrapper.find('.empty-state button').text()).toBe('Clear filters');
    });

    it('resets filters on clear', async () => {
      const wrapper = mountPage({ shows });

      await wrapper
        .findComponent(FilterBar)
        .vm.$emit('update:category', 'Comedy');
      await wrapper.findComponent(FilterBar).vm.$emit('update:rating', 9);
      await flushPromises();

      await wrapper.find('.empty-state button').trigger('click');
      await flushPromises();

      expect(wrapper.findAllComponents(GenreRow).length).toBeGreaterThan(0);
    });
  });

  it('fetches shows on mount when empty', async () => {
    mountPage({ shows: [] });
    const store = useShowsStore();
    await flushPromises();

    expect(store.fetchShows).toHaveBeenCalled();
  });

  it('skips fetch when shows exist', async () => {
    mountPage({ shows });
    const store = useShowsStore();
    await flushPromises();

    expect(store.fetchShows).not.toHaveBeenCalled();
  });
});
