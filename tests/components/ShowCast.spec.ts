import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import ShowCast from '@/components/ShowCast.vue';
import * as api from '@/services/tvmaze.api';
import type { CastMember } from '@/types/cast.types';

vi.mock('@/services/tvmaze.api', () => ({
  fetchShowCast: vi.fn(),
}));

function createCast(n: number): CastMember[] {
  return Array.from({ length: n }, (_, i) => ({
    person: {
      id: i + 1,
      name: `Actor ${i + 1}`,
      image:
        i % 2 === 0
          ? { medium: `actor${i}.jpg`, original: `actor${i}-full.jpg` }
          : undefined,
    },
  }));
}

describe('ShowCast', () => {
  beforeEach(() => vi.clearAllMocks());

  async function mountCast(showId: number) {
    const wrapper = mount(ShowCast, { props: { showId } });
    await flushPromises();
    return wrapper;
  }

  it('fetches cast on mount', async () => {
    vi.mocked(api.fetchShowCast).mockResolvedValue(createCast(5));
    await mountCast(82);

    expect(api.fetchShowCast).toHaveBeenCalledWith(82);
  });

  it('renders cast names', async () => {
    vi.mocked(api.fetchShowCast).mockResolvedValue(createCast(3));
    const wrapper = await mountCast(1);

    const names = wrapper.findAll('.name');
    expect(names).toHaveLength(3);
    expect(names[0].text()).toBe('Actor 1');
  });

  it('limits to 12 members', async () => {
    vi.mocked(api.fetchShowCast).mockResolvedValue(createCast(20));
    const wrapper = await mountCast(1);

    expect(wrapper.findAll('.cast-item')).toHaveLength(12);
  });

  it('shows placeholder for missing images', async () => {
    vi.mocked(api.fetchShowCast).mockResolvedValue([
      { person: { id: 1, name: 'John Doe', image: undefined } },
    ]);
    const wrapper = await mountCast(1);

    expect(wrapper.find('.avatar-placeholder').text()).toBe('J');
  });

  it('hides section when empty', async () => {
    vi.mocked(api.fetchShowCast).mockResolvedValue([]);
    const wrapper = await mountCast(1);

    expect(wrapper.find('section.cast').exists()).toBe(false);
  });

  it('handles fetch errors gracefully', async () => {
    vi.mocked(api.fetchShowCast).mockRejectedValue(new Error('fail'));
    const wrapper = await mountCast(1);

    expect(wrapper.find('section.cast').exists()).toBe(false);
  });
});
