import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { createRouter, createMemoryHistory } from 'vue-router';
import Header from '@/components/Header.vue';
import SearchBar from '@/components/SearchBar.vue';

const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/', component: { template: '<div />' } }],
});

describe('Header', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    document.documentElement.removeAttribute('data-theme');
  });

  afterEach(() => vi.useRealTimers());

  function mountHeader() {
    return mount(Header, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn }), router],
      },
    });
  }

  it('renders logo and search', () => {
    const wrapper = mountHeader();

    expect(wrapper.find('.logo').exists()).toBe(true);
    expect(wrapper.findComponent(SearchBar).exists()).toBe(true);
  });

  it('defaults to dark theme', async () => {
    const wrapper = mountHeader();
    await flushPromises();

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(wrapper.find('.theme-btn').text()).toBe('☀️');
  });

  it('toggles theme on click', async () => {
    const wrapper = mountHeader();
    const btn = wrapper.find('.theme-btn');

    await btn.trigger('click');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(btn.text()).toBe('🌙');

    await btn.trigger('click');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });
});
