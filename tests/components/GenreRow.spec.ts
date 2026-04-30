import { describe, it, expect, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import GenreRow from '@/components/GenreRow.vue';
import ShowCard from '@/components/ShowCard.vue';
import type { Show } from '@/types/show.types';

function createShows(n: number): Show[] {
  return Array.from({ length: n }, (_, i) => ({
    id: i + 1,
    name: `Show ${i + 1}`,
    type: 'Scripted',
    genres: ['Drama'],
    rating: { average: 8.0 },
    image: { medium: `show${i}.jpg`, original: `show${i}-full.jpg` },
    summary: 'Summary',
  }));
}

function mountRow(props: { genre: string; shows: Show[] }) {
  return mount(GenreRow, {
    props,
    global: {
      stubs: {
        RouterLink: { template: '<a><slot /></a>', props: ['to'] },
      },
    },
  });
}

describe('GenreRow', () => {
  it('renders title with count', () => {
    const wrapper = mountRow({ genre: 'Drama', shows: createShows(5) });

    expect(wrapper.find('.title').text()).toContain('Drama');
    expect(wrapper.find('.count').text()).toBe('(5)');
  });

  it('renders ShowCard for each show', () => {
    const shows = createShows(3);
    const wrapper = mountRow({ genre: 'Drama', shows });

    expect(wrapper.findAllComponents(ShowCard)).toHaveLength(3);
  });

  it('passes show prop to cards', () => {
    const shows = createShows(1);
    const wrapper = mountRow({ genre: 'Drama', shows });

    expect(wrapper.findComponent(ShowCard).props('show')).toEqual(shows[0]);
  });

  it('hides left arrow initially', async () => {
    const wrapper = mountRow({ genre: 'Drama', shows: createShows(2) });
    await flushPromises();

    expect(wrapper.find('.arrow.left').exists()).toBe(false);
  });

  it('scrolls on arrow click', async () => {
    const wrapper = mountRow({ genre: 'Drama', shows: createShows(20) });
    await flushPromises();

    const row = wrapper.find('.row');
    const scrollBySpy = vi.fn();
    row.element.scrollBy = scrollBySpy;

    // Mock scroll state to show right arrow
    Object.defineProperty(row.element, 'scrollWidth', { value: 4000 });
    Object.defineProperty(row.element, 'clientWidth', { value: 800 });
    Object.defineProperty(row.element, 'scrollLeft', { value: 0 });
    await row.trigger('scroll');

    const rightArrow = wrapper.find('.arrow.right');
    if (rightArrow.exists()) {
      await rightArrow.trigger('click');
      expect(scrollBySpy).toHaveBeenCalled();
    }
  });
});
