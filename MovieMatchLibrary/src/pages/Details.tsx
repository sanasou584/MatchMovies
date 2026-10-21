import React, { useEffect, useState } from "react";
import {
  IonAvatar,
  IonBackButton,
  IonBadge,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSpinner,
  IonTitle,
  IonToast,
  IonToolbar,
} from "@ionic/react";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { calendarOutline, heart, heartOutline, star } from "ionicons/icons";
import { useSearchParams } from "react-router-dom";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { Movie } from "./Home";

interface UserMatch {
  id: string;
  first_name?: string;
  last_name?: string;
  date_of_birth?: string;
  photo_url?: string;
}

const calculateAge = (dobString?: string): number | null => {
  if (!dobString) return null;
  const birthDate = new Date(dobString);
  if (isNaN(birthDate.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 0 ? age : null;
};

const Details: React.FC = () => {
  const [searchParams] = useSearchParams();
  const movieId = searchParams.get("id");
  const { user } = useAuth();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likedUsers, setLikedUsers] = useState<UserMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 1. Listen to Movie details
  useEffect(() => {
    if (!movieId) {
      setLoading(false);
      return;
    }

    const unsubscribeMovie = onSnapshot(doc(db, "movies", movieId), (docSnap) => {
      if (docSnap.exists()) {
        setMovie({ id: docSnap.id, ...(docSnap.data() as Omit<Movie, "id">) });
      }
      setLoading(false);
    });

    return () => unsubscribeMovie();
  }, [movieId]);//relancera l'effet car id change

  // 2. Listen to Current User's liked status
  useEffect(() => {
    if (!user || !movieId) return;

    const unsubscribeUser = onSnapshot(doc(db, "users", user.uid), (docSnap) => {
      if (docSnap.exists()) {
        const likedList: string[] = docSnap.data().liked_movies ?? [];
        setIsLiked(likedList.includes(movieId));
      }
    });

    return () => unsubscribeUser();
  }, [user, movieId]);

  // 3. Listen to other users who also liked this movie
  useEffect(() => {
    if (!movieId) return;

    const usersQuery = query(
      collection(db, "users"),
      where("liked_movies", "array-contains", movieId)
    );

    const unsubscribeLikedUsers = onSnapshot(usersQuery, (snapshot) => {
      const others: UserMatch[] = [];
      snapshot.forEach((docSnap) => {
        // Exclude current user from the list
        if (docSnap.id !== user?.uid) {
          others.push({ id: docSnap.id, ...docSnap.data() });
        }
      });
      setLikedUsers(others);
    });

    return () => unsubscribeLikedUsers();
  }, [movieId, user]);

  // Toggle Like / Favorite
  const handleToggleLike = async () => {
    if (!user || !movieId) return;

    try {
      const userRef = doc(db, "users", user.uid);
      if (isLiked) {
        await updateDoc(userRef, { liked_movies: arrayRemove(movieId) });
        setToastMessage("Removed from your favorite playlist.");
      } else {
        await updateDoc(userRef, { liked_movies: arrayUnion(movieId) });
        setToastMessage("Added to your favorite playlist!");
      }
    } catch (err: any) {
      setToastMessage(err.message || "Failed to update favorites.");
    }
  };

  if (!movieId || (!loading && !movie)) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar color="primary">
            <IonButtons slot="start">
              <IonBackButton defaultHref="/home" />
            </IonButtons>
            <IonTitle>Details</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <p style={{ textAlign: "center", marginTop: "2rem" }}>Movie not found.</p>
        </IonContent>
      </IonPage>
    );
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
          <div style={{ display: "flex", justifyContent: "center", marginTop: "3rem" }}>
            <IonSpinner name="crescent" />
          </div>
        ) : (
          movie && (
            <>
              {/* Backdrop / Poster Banner */}
              <div
                style={{
                  width: "100%",
                  height: "220px",
                  backgroundImage: `url(${movie.backdropurl || movie.posterurl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 100%)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: "16px",
                    left: "16px",
                    right: "16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                  }}
                >
                  <div>
                    <h1 style={{ color: "#fff", margin: 0, fontSize: "1.4rem", fontWeight: "bold" }}>
                      {movie.name}
                    </h1>
                    <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
                      {movie.rating && (
                        <IonBadge color="warning" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <IonIcon icon={star} /> {movie.rating}
                        </IonBadge>
                      )}
                      {movie.releasedate && (
                        <IonBadge color="medium" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <IonIcon icon={calendarOutline} /> {movie.releasedate}
                        </IonBadge>
                      )}
                    </div>
                  </div>

                  {/* Like Button */}
                  <IonButton
                    color={isLiked ? "danger" : "light"}
                    onClick={handleToggleLike}
                    shape="round"
                  >
                    <IonIcon slot="icon-only" icon={isLiked ? heart : heartOutline} />
                  </IonButton>
                </div>
              </div>

              {/* Description Card */}
              <IonCard className="ion-margin">
                <IonCardContent>
                  <h3>Overview</h3>
                  <p style={{ lineHeight: "1.5", marginTop: "8px" }}>
                    {movie.description || "No overview available for this movie."}
                  </p>
                </IonCardContent>
              </IonCard>

              {/* Users Who Also Liked This Movie */}
              <div className="ion-padding-horizontal">
                <h3 style={{ fontWeight: "bold", margin: "1rem 0 0.5rem" }}>
                  Users Who Also Liked This ({likedUsers.length})
                </h3>

                {likedUsers.length === 0 ? (
                  <p style={{ color: "var(--ion-color-medium)", fontStyle: "italic" }}>
                    No other users have liked this movie yet. Be the first to match!
                  </p>
                ) : (
                  <IonList inset>
                    {likedUsers.map((item) => {
                      const userAge = calculateAge(item.date_of_birth);
                      return (
                        <IonItem key={item.id} lines="full">
                          <IonAvatar slot="start">
                            {item.photo_url ? (
                              <img src={item.photo_url} alt="User" />
                            ) : (
                              <div
                                style={{
                                  backgroundColor: "var(--ion-color-step-200)",
                                  width: "100%",
                                  height: "100%",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                👤
                              </div>
                            )}
                          </IonAvatar>
                          <IonLabel>
                            <h2>
                              {item.first_name} {item.last_name}
                            </h2>
                            <p>{userAge !== null ? `${userAge} years old` : "Age not specified"}</p>
                          </IonLabel>
                        </IonItem>
                      );
                    })}
                  </IonList>
                )}
              </div>
            </>
          )
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

export default Details;