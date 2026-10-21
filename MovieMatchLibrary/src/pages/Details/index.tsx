import React, { useMemo } from "react";
import {
  IonBackButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Movie, UserProfile } from "../../types/movie";
import { useCollection } from "../../hooks/useCollection";
import { useDoc } from "../../hooks/useDoc";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { LikedUsersList } from "./components/LikedUsersList";
import { BackdropHeader } from "./components/BackdropHeader";
import { MovieNotFound } from "./components/MovieNotFound";
import { useLikeToggle } from "./hooks/useLikeToggle";
import { useToast } from "../../hooks/useToast";

const Details: React.FC = () => {
  const [searchParams] = useSearchParams();
  const movieId = searchParams.get("id");
  const { user } = useAuth();
  const { showToast, toast } = useToast(2000);

  const { data: movie, loading } = useDoc<Movie>("movies", movieId);
  const { data: currentUserDoc } = useDoc<UserProfile>("users", user?.uid);
  const { items: users } = useCollection<UserProfile>("users");

  const isLiked = useMemo(
    () => (currentUserDoc?.liked_movies ?? []).includes(movieId ?? ""),
    [currentUserDoc, movieId]
  );

  const likedUsers = useMemo(
    () =>
      users.filter(
        (u) =>
          (u.liked_movies ?? []).includes(movieId ?? "") && u.id !== user?.uid
      ),
    [users, movieId, user?.uid]
  );

  const toggleLike = useLikeToggle(movieId, isLiked, showToast);

  if (!movieId || (!loading && !movie)) {
    return <MovieNotFound />;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>{movie?.name || "Movie Details"}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {loading ? (
          <LoadingSpinner marginTop="3rem" />
        ) : (
          movie && (
            <>
              <BackdropHeader movie={movie} isLiked={isLiked} onToggleLike={toggleLike} />

              <IonCard className="ion-margin">
                <IonCardContent>
                  <h3>Overview</h3>
                  <p style={{ lineHeight: "1.5", marginTop: "8px" }}>
                    {movie.description || "No overview available for this movie."}
                  </p>
                </IonCardContent>
              </IonCard>

              <LikedUsersList users={likedUsers} />
            </>
          )
        )}

        {toast}
      </IonContent>
    </IonPage>
  );
};

export default Details;
