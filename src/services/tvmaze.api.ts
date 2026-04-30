import type { Show } from '@/types/show.types';
import type { CastMember } from '@/types/cast.types';

interface SearchResult {
  score: number;
  show: Show;
}

const BASE_URL = 'https://api.tvmaze.com';

async function fetchData<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`TVMaze API error: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function fetchShowById(id: number): Promise<Show> {
  try {
    return await fetchData<Show>(`${BASE_URL}/shows/${id}`);
  } catch (err) {
    if (err instanceof Error && err.message.includes('TVMaze API error')) {
      throw new Error('Show not found');
    }
    throw err;
  }
}

export const searchShows = async (query: string): Promise<Show[]> => {
  if (!query.trim()) {
    return [];
  }

  const results = await fetchData<SearchResult[]>(
    `${BASE_URL}/search/shows?q=${encodeURIComponent(query)}`,
  );
  return results.map((result) => result.show);
};

export const fetchShowCast = async (showId: number): Promise<CastMember[]> => {
  try {
    return await fetchData<CastMember[]>(`${BASE_URL}/shows/${showId}/cast`);
  } catch (err) {
    if (err instanceof Error && err.message.includes('TVMaze API error')) {
      throw new Error('Failed to fetch cast');
    }
    throw err;
  }
};

export const fetchAllShows = async (): Promise<Show[]> => {
  return fetchData<Show[]>(`${BASE_URL}/shows`);
};
