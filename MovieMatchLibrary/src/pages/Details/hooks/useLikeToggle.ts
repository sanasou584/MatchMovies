import { doc, updateDoc, arrayRemove, arrayUnion } from "firebase/firestore";
import { db } from "../../../firebase";
import { useAuth } from "../../../context/AuthContext";
import { getErrorMessage } from "../../../utils/errors";

/** Toggles a movie in / out of the current user's liked_movies list. */
export const useLikeToggle = (
  movieId?: string | null,
  isLiked?: boolean,
  showToast?: (message: string) => void
) => {
  const { user } = useAuth();

  const toggleLike = async () => {
    if (!user || !movieId) return;

    try {
      const userRef = doc(db, "users", user.uid);
      if (isLiked) {
        await updateDoc(userRef, { liked_movies: arrayRemove(movieId) });
        showToast?.("Removed from your favorite playlist.");
      } else {
        await updateDoc(userRef, { liked_movies: arrayUnion(movieId) });
        showToast?.("Added to your favorite playlist!");
      }
    } catch (err) {
      showToast?.(getErrorMessage(err, "Failed to update favorites."));
    }
  };

  return toggleLike;
};
