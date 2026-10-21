import React, { useEffect, useState } from "react";
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSpinner,
  IonThumbnail,
  IonTitle,
  IonToast,
  IonToolbar,
} from "@ionic/react";
import { arrayRemove, collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { heartDislikeOutline, star } from "ionicons/icons";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { Movie } from "./Home";

const Favorites: React.FC = () => {
  const { user } = useAuth();
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    let allMoviesList: Movie[] = [];

    // 1. Listen to all movies
    const unsubMovies = onSnapshot(collection(db, "movies"), (moviesSnap) => {
      allMoviesList = moviesSnap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Movie, "id">),
      }));

      // 2. Listen to user's liked array
      const unsubUser = onSnapshot(doc(db, "users", user.uid), (userSnap) => {
        if (userSnap.exists()) {
          const likedIds: string[] = userSnap.data().liked_movies ?? [];
          const matched = allMoviesList.filter((m) => likedIds.includes(m.id));
          setFavoriteMovies(matched);
        }
        setLoading(false);
      });

      return () => unsubUser();
    });

    return () => unsubMovies();
  }, [user]);

  const handleRemove = async (movieId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;

    try {
      await updateDoc(doc(db, "users", user.uid), {
        liked_movies: arrayRemove(movieId),
      });
      setToastMessage("Movie removed from favorites.");
    } catch (err: any) {
      setToastMessage(err.message || "Failed to remove movie.");
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>My Favorite Playlist</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", marginTop: "3rem" }}>
            <IonSpinner name="crescent" />
          </div>
        ) : favoriteMovies.length === 0 ? (
          <div style={{ textAlign: "center", marginTop: "3rem", color: "var(--ion-color-medium)" }}>
            <p>Your playlist is empty.</p>
            <IonButton routerLink="/home" fill="outline">
              Explore Movies
            </IonButton>
          </div>
        ) : (
          <IonList inset>
            {favoriteMovies.map((movie) => (
              <IonItem
                key={movie.id}
                button
                onClick={() => navigate(`/details?id=${movie.id}`)}
                lines="full"
              >
                <IonThumbnail slot="start">
                  <img
                    src={movie.posterurl || "https://via.placeholder.com/150"}
                    alt={movie.name}
                    style={{ borderRadius: "4px" }}
                  />
                </IonThumbnail>

                <IonLabel>
                  <h2>{movie.name}</h2>
                  <p style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <IonIcon icon={star} color="warning" /> {movie.rating || "N/A"}
                  </p>
                  <p>{movie.releasedate ? movie.releasedate.substring(0, 4) : ""}</p>
                </IonLabel>

                <IonButton
                  fill="clear"
                  color="danger"
                  slot="end"
                  onClick={(e) => handleRemove(movie.id, e)}
                >
                  <IonIcon slot="icon-only" icon={heartDislikeOutline} />
                </IonButton>
              </IonItem>
            ))}
          </IonList>
        )}

        <IonToast
          isOpen={!!toastMessage}
          message={toastMessage ?? ""}
          duration={2000}
          onDidDismiss={() => setToastMessage(null)}
        />
      </IonContent>
    </IonPage>
  );
};

export default Favorites;