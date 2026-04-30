import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import FilterBar from '@/components/FilterBar.vue';

const categories = ['Action', 'Comedy', 'Drama', 'Thriller'];

describe('FilterBar', () => {
  it('renders both dropdowns', () => {
    const wrapper = mount(FilterBar, { props: { categories } });
    expect(wrapper.findAll('select')).toHaveLength(2);
  });

  it('shows all categories plus "All" option', () => {
    const wrapper = mount(FilterBar, { props: { categories } });
    const options = wrapper.findAll('select')[0].findAll('option');

    expect(options).toHaveLength(5); // "All categories" + 4 genres
    expect(options[0].text()).toBe('All categories');
  });

  it('shows rating options', () => {
    const wrapper = mount(FilterBar, { props: { categories } });
    const options = wrapper.findAll('select')[1].findAll('option');

    expect(options.map((o) => o.text())).toEqual([
      'Any rating',
      '9+',
      '8+',
      '7+',
    ]);
  });

  it('emits category on change', async () => {
    const wrapper = mount(FilterBar, { props: { categories } });

    await wrapper.findAll('select')[0].setValue('Drama');

    expect(wrapper.emitted('update:category')?.[0]).toEqual(['Drama']);
  });

  it('emits rating as number', async () => {
    const wrapper = mount(FilterBar, { props: { categories } });

    await wrapper.findAll('select')[1].setValue('8');

    expect(wrapper.emitted('update:rating')?.[0]).toEqual([8]);
  });

  it('emits "any" for any rating', async () => {
    const wrapper = mount(FilterBar, { props: { categories } });

    await wrapper.findAll('select')[1].setValue('any');

    expect(wrapper.emitted('update:rating')?.[0]).toEqual(['any']);
  });

  it('works with empty categories', () => {
    const wrapper = mount(FilterBar, { props: { categories: [] } });
    const options = wrapper.findAll('select')[0].findAll('option');

    expect(options).toHaveLength(1);
    expect(options[0].text()).toBe('All categories');
  });
});
