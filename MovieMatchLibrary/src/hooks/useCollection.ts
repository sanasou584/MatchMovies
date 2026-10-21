import { useEffect, useState , useMemo} from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { WithId ,Movie} from "../types/movie";

/** Generic Firestore collection listener. Returns live items plus loading state. */
export const useCollection = <T extends object>(name: string) => {
  const [items, setItems] = useState<WithId<T>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, name),
      (snapshot) => {
        setItems(snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as T) })));
        setLoading(false);
      },
      (error) => {
        console.error(`Error listening to collection "${name}":`, error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [name]);

  return { items, loading };
};

/** Live map of movie id -> name (used by matching features). */
export const useMovieTitleMap = () => {
  const { items: movies, loading } = useCollection<Movie>("movies");

  const movieTitleMap = useMemo(() => {
    const map: Record<string, string> = {};
    movies.forEach((m) => {
      map[m.id] = m.name || "Untitled";
    });
    return map;
  }, [movies]);

  return { movieTitleMap, loading };
};
