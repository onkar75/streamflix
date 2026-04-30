export interface Show {
  id: number;
  name: string;
  type: string;
  genres: string[];
  rating: {
    average: number | null;
  };
  image?: {
    medium: string;
    original: string;
  };
  summary: string;
  premiered?: string;
  ended?: string;
  status?: string;
  runtime?: number;
  officialSite?: string;
  network?: {
    id: number;
    name: string;
    country?: {
      name: string;
      code: string;
    };
  };
  language?: string;
}
