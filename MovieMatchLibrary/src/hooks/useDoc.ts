import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { WithId } from "../types/movie";

/** Generic Firestore single-document listener. */
export function useDoc<T extends object>(name: string, docId?: string | null) {
  const [data, setData] = useState<WithId<T> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!docId) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, name, docId),
      (docSnap) => {
        if (docSnap.exists()) {
          setData({ id: docSnap.id, ...(docSnap.data() as T) });
        }
        setLoading(false);
      },
      (error) => {
        console.error(`Error listening to document "${name}/${docId}":`, error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [name, docId]);

  return { data, loading };
}
