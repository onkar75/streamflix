import { describe, it, expect } from 'vitest';
import { mount, RouterLinkStub } from '@vue/test-utils';
import ShowCard from '@/components/ShowCard.vue';
import type { Show } from '@/types/show.types';

const show: Show = {
  id: 82,
  name: 'Game of Thrones',
  type: 'Scripted',
  genres: ['Drama', 'Fantasy'],
  rating: { average: 9.0 },
  image: {
    medium: 'https://static.tvmaze.com/uploads/images/medium/190/476117.jpg',
    original:
      'https://static.tvmaze.com/uploads/images/original/190/476117.jpg',
  },
  summary: '<p>Winter is coming</p>',
};

function mountCard(props: { show: Show }) {
  return mount(ShowCard, {
    props,
    global: { stubs: { RouterLink: RouterLinkStub } },
  });
}

describe('ShowCard', () => {
  it('renders image with lazy loading', () => {
    const wrapper = mountCard({ show });
    const img = wrapper.find('img');

    expect(img.attributes('src')).toBe(show.image?.medium);
    expect(img.attributes('loading')).toBe('lazy');
    expect(img.attributes('alt')).toBe(show.name);
  });

  it('hides image when missing', () => {
    const wrapper = mountCard({ show: { ...show, image: undefined } });
    expect(wrapper.find('img').exists()).toBe(false);
  });

  it('shows rating', () => {
    const wrapper = mountCard({ show });
    expect(wrapper.find('.rating').text()).toContain('9');
  });

  it('shows N/A for null rating', () => {
    const wrapper = mountCard({ show: { ...show, rating: { average: null } } });
    expect(wrapper.find('.rating').text()).toContain('N/A');
  });

  it('links to show details', () => {
    const wrapper = mountCard({ show });
    const link = wrapper.findComponent(RouterLinkStub);

    expect(link.props('to')).toEqual({
      name: 'show-details',
      params: { id: 82 },
    });
  });
});
