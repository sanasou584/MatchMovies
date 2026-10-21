import { useMemo } from "react";
import { Movie, UserProfile } from "../types/movie";
import { useCollection } from "./useCollection";
import { useDoc } from "./useDoc";

/**
 * Live list of the favorite (liked) movies of a given user,
 * built from the movies collection + that user's liked_movies list.
 */
export const useUserFavorites = (userId?: string | null) => {
  const { items: movies, loading: moviesLoading } = useCollection<Movie>("movies");
  const { data: userDoc, loading: userLoading } = useDoc<UserProfile>("users", userId);

  const favorites = useMemo(
    () =>
      movies.filter((m) =>
        (userDoc?.liked_movies ?? []).includes(m.id as string)
      ),
    [movies, userDoc]
  );

  return { favorites, loading: moviesLoading || userLoading };
};
