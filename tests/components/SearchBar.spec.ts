import { createRouter, createMemoryHistory } from 'vue-router';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import SearchBar from '@/components/SearchBar.vue';
import { useShowsStore } from '@/stores/shows.store';

const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/', component: { template: '<div />' } }],
});

describe('SearchBar', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  function mountComponent() {
    return mount(SearchBar, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn }), router],
      },
    });
  }

  it('renders input and button', () => {
    const wrapper = mountComponent();
    expect(wrapper.find('input[type="search"]').exists()).toBe(true);
    expect(wrapper.find('button').exists()).toBe(true);
  });

  it('debounces search calls', async () => {
    const wrapper = mountComponent();
    const store = useShowsStore();
    const input = wrapper.find('input');

    await input.setValue('breaking');
    await input.trigger('input');
    expect(store.search).not.toHaveBeenCalled();

    vi.advanceTimersByTime(300);
    expect(store.search).toHaveBeenCalledWith('breaking');
  });

  it('only calls once for rapid typing', async () => {
    const wrapper = mountComponent();
    const store = useShowsStore();
    const input = wrapper.find('input');

    await input.setValue('b');
    await input.trigger('input');
    vi.advanceTimersByTime(100);

    await input.setValue('br');
    await input.trigger('input');
    vi.advanceTimersByTime(100);

    await input.setValue('bre');
    await input.trigger('input');
    vi.advanceTimersByTime(300);

    expect(store.search).toHaveBeenCalledTimes(1);
    expect(store.search).toHaveBeenCalledWith('bre');
  });
});
