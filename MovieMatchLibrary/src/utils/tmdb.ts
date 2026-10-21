import { Movie } from "../types/movie";

const TMDB_API_KEY =
  import.meta.env.VITE_TMDB_API_KEY || "a586ab7a154ede644e21b89309ed264a";

export const fetchMovieFromTMDB = async (tmdbId: string): Promise<Movie> => {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${TMDB_API_KEY}`
  );

  if (!response.ok) {
    throw new Error("Movie not found on TMDB or invalid API Key.");
  }

  const data = await response.json();

  return {
    tmdbid: String(data.id ?? tmdbId),
    imdbid: data.imdb_id ?? "",
    name: data.title ?? "",
    description: data.overview ?? "",
    rating: data.vote_average ? String(data.vote_average) : "",
    releasedate: data.release_date ?? "",
    posterurl: data.poster_path
      ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
      : "",
    backdropurl: data.backdrop_path
      ? `https://image.tmdb.org/t/p/original${data.backdrop_path}`
      : "",
  };
};
