import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import ShowDetailsPage from '@/pages/ShowDetailsPage.vue';
import * as api from '@/services/tvmaze.api';
import type { Show } from '@/types/show.types';

vi.mock('@/services/tvmaze.api', () => ({
  fetchShowById: vi.fn(),
  fetchShowCast: vi.fn(),
}));

const mockRoute = { params: { id: '82' } };
const mockRouter = { back: vi.fn() };

vi.mock('vue-router', () => ({
  useRoute: () => mockRoute,
  useRouter: () => mockRouter,
}));

const got: Show = {
  id: 82,
  name: 'Game of Thrones',
  type: 'Scripted',
  genres: ['Drama', 'Fantasy'],
  rating: { average: 9.0 },
  image: { medium: 'got.jpg', original: 'got-full.jpg' },
  summary: '<p>Winter is coming</p>',
  premiered: '2011-04-17',
  ended: '2019-05-19',
  status: 'Ended',
  runtime: 60,
  officialSite: 'https://hbo.com/game-of-thrones',
  network: {
    id: 1,
    name: 'HBO',
    country: { name: 'United States', code: 'US' },
  },
  language: 'English',
};

const runningShow: Show = { ...got, status: 'Running', ended: undefined };

describe('ShowDetailsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRoute.params.id = '82';
    vi.mocked(api.fetchShowCast).mockResolvedValue([]);
  });

  function mountPage(opts: { shows?: Show[]; loading?: boolean } = {}) {
    return mount(ShowDetailsPage, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              shows: {
                shows: opts.shows ?? [],
                loading: opts.loading ?? false,
              },
            },
          }),
        ],
        stubs: { ShowCast: true },
      },
    });
  }

  describe('data loading', () => {
    it('uses cached show from store', async () => {
      const wrapper = mountPage({ shows: [got] });
      await flushPromises();

      expect(api.fetchShowById).not.toHaveBeenCalled();
      expect(wrapper.find('h1.title').text()).toBe('Game of Thrones');
    });

    it('fetches from API when not cached', async () => {
      vi.mocked(api.fetchShowById).mockResolvedValue(got);
      const wrapper = mountPage({ shows: [] });
      await flushPromises();

      expect(api.fetchShowById).toHaveBeenCalledWith(82);
      expect(wrapper.find('h1.title').text()).toBe('Game of Thrones');
    });

    it('shows not found on error', async () => {
      vi.mocked(api.fetchShowById).mockRejectedValue(new Error('404'));
      const wrapper = mountPage({ shows: [] });
      await flushPromises();

      expect(wrapper.text()).toContain('not found');
    });

    it('shows loading state', async () => {
      let resolve: (v: Show) => void;
      vi.mocked(api.fetchShowById).mockReturnValue(
        new Promise((r) => (resolve = r)),
      );

      const wrapper = mountPage({ shows: [] });

      await wrapper.vm.$nextTick();

      expect(wrapper.text()).toContain('Loading');

      resolve!(got);
      await flushPromises();

      expect(wrapper.text()).not.toContain('Loading');
      expect(wrapper.text()).toContain('Game of Thrones');
    });
  });

  describe('show details', () => {
    it('displays basic info', async () => {
      const wrapper = mountPage({ shows: [got] });
      await flushPromises();

      expect(wrapper.find('.rating').text()).toContain('9');
      expect(wrapper.find('.poster').attributes('src')).toBe('got-full.jpg');
    });

    it('shows N/A for null rating', async () => {
      const wrapper = mountPage({
        shows: [{ ...got, rating: { average: null } }],
      });
      await flushPromises();

      expect(wrapper.find('.rating').text()).toContain('N/A');
    });

    it('renders genre chips', async () => {
      const wrapper = mountPage({ shows: [got] });
      await flushPromises();

      const chips = wrapper.findAll('.genre-chip');
      expect(chips.map((c) => c.text())).toEqual(['Drama', 'Fantasy']);
    });

    it('renders HTML summary', async () => {
      const wrapper = mountPage({ shows: [got] });
      await flushPromises();

      expect(wrapper.find('.paragraph').html()).toContain(
        '<p>Winter is coming</p>',
      );
    });
  });

  describe('metadata', () => {
    it('shows year range for ended shows', async () => {
      const wrapper = mountPage({ shows: [got] });
      await flushPromises();

      expect(wrapper.find('.meta').text()).toContain('2011');
      expect(wrapper.find('.meta').text()).toContain('2019');
    });

    it('shows Present for running shows', async () => {
      const wrapper = mountPage({ shows: [runningShow] });
      await flushPromises();

      expect(wrapper.find('.meta').text()).toContain('Present');
    });

    it('displays runtime and status', async () => {
      const wrapper = mountPage({ shows: [got] });
      await flushPromises();

      expect(wrapper.find('.meta').text()).toContain('60 min');
      expect(wrapper.find('.meta').text()).toContain('Ended');
    });
  });

  describe('details section', () => {
    it('links to official site', async () => {
      const wrapper = mountPage({ shows: [got] });
      await flushPromises();

      const link = wrapper.find('.details a');
      expect(link.attributes('href')).toBe('https://hbo.com/game-of-thrones');
      expect(link.attributes('target')).toBe('_blank');
    });

    it('shows network and language', async () => {
      const wrapper = mountPage({ shows: [got] });
      await flushPromises();

      expect(wrapper.text()).toContain('HBO');
      expect(wrapper.text()).toContain('English');
    });
  });

  describe('navigation', () => {
    it('back button calls router.back', async () => {
      const wrapper = mountPage({ shows: [got] });
      await flushPromises();

      await wrapper.find('.back').trigger('click');
      expect(mockRouter.back).toHaveBeenCalled();
    });
  });
});
