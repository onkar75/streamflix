import { vi, beforeEach } from 'vitest';
import { config } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';

// Mock global fetch
const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

// Helper to mock successful fetch responses
export function mockFetchResponse<T>(data: T, ok = true, status = 200) {
  mockFetch.mockResolvedValueOnce({
    ok,
    status,
    json: () => Promise.resolve(data),
  });
}

// Helper to mock fetch errors
export function mockFetchError(message: string) {
  mockFetch.mockRejectedValueOnce(new Error(message));
}

// Export mockFetch for use in tests
export { mockFetch };

// Reset mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
});

// Stub router-link globally for component tests
config.global.stubs = {
  RouterLink: {
    template: '<a :href="to"><slot /></a>',
    props: ['to'],
  },
};

// Export createTestingPinia for use in tests
export { createTestingPinia };
