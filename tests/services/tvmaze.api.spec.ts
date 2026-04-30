import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  fetchShowById,
  searchShows,
  fetchShowCast,
  fetchAllShows,
} from '@/services/tvmaze.api';
import { mockFetchResponse, mockFetchError, mockFetch } from '../setup';
import type { Show } from '@/types/show.types';
import type { CastMember } from '@/types/cast.types';

const breakingBad: Show = {
  id: 169,
  name: 'Breaking Bad',
  type: 'Scripted',
  genres: ['Drama', 'Crime', 'Thriller'],
  rating: { average: 9.3 },
  image: {
    medium: 'https://static.tvmaze.com/uploads/images/medium/0/2400.jpg',
    original: 'https://static.tvmaze.com/uploads/images/original/0/2400.jpg',
  },
  summary: '<p>A high school chemistry teacher turned meth producer.</p>',
  premiered: '2008-01-20',
  status: 'Ended',
};

const bryanCranston: CastMember = {
  person: {
    id: 1,
    name: 'Bryan Cranston',
    image: {
      medium: 'https://static.tvmaze.com/uploads/images/medium/1/3603.jpg',
      original: 'https://static.tvmaze.com/uploads/images/original/1/3603.jpg',
    },
  },
};

describe('tvmaze API', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('fetchShowById', () => {
    it('fetches show by id', async () => {
      mockFetchResponse(breakingBad);
      const show = await fetchShowById(169);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.tvmaze.com/shows/169',
      );
      expect(show).toEqual(breakingBad);
    });

    it('throws on 404', async () => {
      mockFetchResponse(null, false, 404);
      await expect(fetchShowById(99999)).rejects.toThrow('Show not found');
    });

    it('throws on network error', async () => {
      mockFetchError('Network error');
      await expect(fetchShowById(1)).rejects.toThrow('Network error');
    });
  });

  describe('searchShows', () => {
    it('searches and extracts shows from results', async () => {
      mockFetchResponse([
        { score: 0.95, show: breakingBad },
        {
          score: 0.8,
          show: { ...breakingBad, id: 2, name: 'Better Call Saul' },
        },
      ]);

      const results = await searchShows('breaking');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.tvmaze.com/search/shows?q=breaking',
      );
      expect(results).toHaveLength(2);
      expect(results[0].name).toBe('Breaking Bad');
    });

    it('returns [] for empty/whitespace query without API call', async () => {
      expect(await searchShows('')).toEqual([]);
      expect(await searchShows('   ')).toEqual([]);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('encodes special chars', async () => {
      mockFetchResponse([]);
      await searchShows('breaking & bad');
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.tvmaze.com/search/shows?q=breaking%20%26%20bad',
      );
    });

    it('throws on API error', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false, status: 500 });
      await expect(searchShows('test')).rejects.toThrow(
        'TVMaze API error: 500',
      );
    });
  });

  describe('fetchShowCast', () => {
    it('fetches cast list', async () => {
      const cast = [
        bryanCranston,
        {
          ...bryanCranston,
          person: { ...bryanCranston.person, id: 2, name: 'Aaron Paul' },
        },
      ];
      mockFetchResponse(cast);

      const result = await fetchShowCast(169);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.tvmaze.com/shows/169/cast',
      );
      expect(result).toHaveLength(2);
    });

    it('throws on failure', async () => {
      mockFetchResponse(null, false, 404);
      await expect(fetchShowCast(99999)).rejects.toThrow(
        'Failed to fetch cast',
      );
    });
  });

  describe('fetchAllShows', () => {
    it('fetches all shows', async () => {
      mockFetchResponse([breakingBad, { ...breakingBad, id: 2 }]);
      const shows = await fetchAllShows();

      expect(mockFetch).toHaveBeenCalledWith('https://api.tvmaze.com/shows');
      expect(shows).toHaveLength(2);
    });

    it('throws on server error', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false, status: 503 });
      await expect(fetchAllShows()).rejects.toThrow('TVMaze API error: 503');
    });
  });
});
