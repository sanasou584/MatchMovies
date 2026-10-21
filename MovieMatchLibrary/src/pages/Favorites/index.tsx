import React from "react";
import {
  IonButton,
  IonContent,
  IonHeader,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { arrayRemove, doc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import { useUserFavorites } from "../../hooks/useUserFavorites";
import { useToast } from "../../hooks/useToast";
import { getErrorMessage } from "../../utils/errors";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { EmptyState } from "../../components/EmptyState";
import { FavoriteItem } from "./components/FavoriteItem";

const Favorites: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast, toast } = useToast(2000);

  const { favorites, loading } = useUserFavorites(user?.uid);

  const handleRemove = async (movieId: string) => {
    if (!user) return;

    try {
      await updateDoc(doc(db, "users", user.uid), {
        liked_movies: arrayRemove(movieId),
      });
      showToast("Movie removed from favorites.");
    } catch (err) {
      showToast(getErrorMessage(err, "Failed to remove movie."));
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
          <LoadingSpinner />
        ) : favorites.length === 0 ? (
          <EmptyState>
            <p>Your playlist is empty.</p>
            <IonButton routerLink="/home" fill="outline">
              Explore Movies
            </IonButton>
          </EmptyState>
        ) : (
          <IonList inset>
            {favorites.map((movie) => (
              <FavoriteItem
                key={movie.id}
                movie={movie}
                onClick={() => navigate(`/details?id=${movie.id}`)}
                onRemove={() => handleRemove(movie.id as string)}
              />
            ))}
          </IonList>
        )}

        {toast}
      </IonContent>
    </IonPage>
  );
};

export default Favorites;
