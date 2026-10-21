export interface Movie {
  id?: string;
  tmdbid?: string;
  imdbid?: string;
  name: string;
  description?: string;
  rating?: string;
  releasedate?: string;
  posterurl?: string;
  backdropurl?: string;
}

export interface UserProfile {
  id: string;
  first_name?: string;
  last_name?: string;
  date_of_birth?: string;
  photo_url?: string;
  email?: string;
  role?: "admin" | "user";
  disabled?: boolean;
  liked_movies?: string[];
}

export type WithId<T> = T & { id: string };
