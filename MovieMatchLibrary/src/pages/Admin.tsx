import React, { useEffect, useState } from "react";
import {
  IonAvatar,
  IonBadge,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonSpinner,
  IonTextarea,
  IonTitle,
  IonToast,
  IonToolbar,
} from "@ionic/react";
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { calculateAge } from "../auth/userAuth";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || "a586ab7a154ede644e21b89309ed264a";

export type Movie = {
  tmdbid: string;
  imdbid: string;
  name: string;
  description: string;
  rating: string;
  releasedate: string;
  posterurl: string;
  backdropurl: string;
};

interface UserProfile {
  id: string;
  first_name?: string;
  last_name?: string;
  date_of_birth?: string;
  photo_url?: string;
  email: string;
  role: "admin" | "user";
  disabled?: boolean;
  liked_movies?: string[];
}

const initialMovieState: Movie = {
  tmdbid: "",
  imdbid: "",
  name: "",
  description: "",
  rating: "",
  releasedate: "",
  posterurl: "",
  backdropurl: "",
};

const Admin: React.FC = () => {
  const { user: currentAdmin } = useAuth();
  const [selectedSegment, setSelectedSegment] = useState<"users" | "add-movie">("users");

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(true);

  const [movie, setMovie] = useState<Movie>(initialMovieState);
  const [fetchingTMDB, setFetchingTMDB] = useState(false);
  const [savingMovie, setSavingMovie] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribeUsers = onSnapshot(
      collection(db, "users"),
      (snapshot) => {
        const userList: UserProfile[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<UserProfile, "id">),
        }));
        setUsers(userList);
        setLoadingUsers(false);
      },
      (error) => {
        console.error("Error fetching users:", error);
        setToastMessage("Failed to load users.");
        setLoadingUsers(false);
      }
    );

    return () => unsubscribeUsers();
  }, []);

  const handleToggleDisable = async (userId: string, currentDisabledStatus?: boolean) => {
    try {
      await updateDoc(doc(db, "users", userId), { disabled: !currentDisabledStatus });
      setToastMessage(!currentDisabledStatus ? "User has been disabled." : "User has been re-enabled.");
    } catch (err: any) {
      setToastMessage(err.message || "Failed to update user status.");
    }
  };

  const filteredUsers = users.filter((u) => {
    const fullName = `${u.first_name ?? ""} ${u.last_name ?? ""}`.toLowerCase();
    const email = (u.email ?? "").toLowerCase();
    const query = userSearchQuery.toLowerCase().trim();
    return fullName.includes(query) || email.includes(query);
  });

  const fetchFromTMDB = async () => {
    const tmdbId = movie.tmdbid.trim();
    if (!tmdbId) {
      setToastMessage("Enter a TMDB ID first.");
      return;
    }

    setFetchingTMDB(true);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${TMDB_API_KEY}`
      );

      if (!response.ok) {
        throw new Error("Movie not found on TMDB or invalid API Key.");
      }

      const data = await response.json();

      setMovie({
        tmdbid: String(data.id ?? tmdbId),
        imdbid: data.imdb_id ?? "",
        name: data.title ?? "",
        description: data.overview ?? "",
        rating: data.vote_average ? String(data.vote_average) : "",
        releasedate: data.release_date ?? "",
        posterurl: data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : "",
        backdropurl: data.backdrop_path ? `https://image.tmdb.org/t/p/original${data.backdrop_path}` : "",
      });

      setToastMessage("Movie data loaded from TMDB!");
    } catch (err: any) {
      setToastMessage(err.message || "Failed to fetch from TMDB.");
    } finally {
      setFetchingTMDB(false);
    }
  };

  const handleAddMovie = async () => {
    if (!movie.name.trim()) {
      setToastMessage("Movie name is required.");
      return;
    }

    setSavingMovie(true);
    try {
      const docId = movie.tmdbid.trim() || doc(collection(db, "movies")).id;
      await setDoc(doc(db, "movies", docId), movie);
      setToastMessage("Movie added to database!");
      setMovie(initialMovieState);
    } catch (err: any) {
      setToastMessage(err.message || "Failed to add movie.");
    } finally {
      setSavingMovie(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Administrator Panel</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSegment
            value={selectedSegment}
            onIonChange={(e) =>
              setSelectedSegment(e.detail.value as "users" | "add-movie")
            }
          >
            <IonSegmentButton value="users">
              <IonLabel>Manage Users</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="add-movie">
              <IonLabel>Add Movies</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        {selectedSegment === "users" && (
          <>
            <IonSearchbar
              value={userSearchQuery}
              placeholder="Search users..."
              onIonInput={(e) => setUserSearchQuery(e.detail.value ?? "")}
            />

            {loadingUsers ? (
              <div style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
                <IonSpinner name="crescent" />
              </div>
            ) : filteredUsers.length === 0 ? (
              <p style={{ textAlign: "center", color: "var(--ion-color-medium)" }}>
                No users found.
              </p>
            ) : (
              <IonList inset>
                {filteredUsers.map((item) => {
                  const isSelf = item.id === currentAdmin?.uid;
                  const age = calculateAge(item.date_of_birth);

                  return (
                    <IonItem key={item.id} lines="full">
                      <IonAvatar slot="start">
                        {item.photo_url ? (
                          <img src={item.photo_url} alt="User Avatar" />
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
                          {item.disabled && (
                            <IonBadge color="danger" style={{ marginLeft: "8px" }}>
                              Disabled
                            </IonBadge>
                          )}
                          {isSelf && (
                            <IonBadge color="medium" style={{ marginLeft: "8px" }}>
                              You
                            </IonBadge>
                          )}
                        </h2>
                        <p>{item.email}</p>
                        <p>
                          Age: {age !== null ? age : "N/A"} | Favorites: {item.liked_movies?.length ?? 0}
                        </p>
                      </IonLabel>

                      <IonButton
                        fill={item.disabled ? "solid" : "outline"}
                        color={item.disabled ? "success" : "danger"}
                        size="small"
                        disabled={isSelf}
                        onClick={() => handleToggleDisable(item.id, item.disabled)}
                      >
                        {item.disabled ? "Enable" : "Disable"}
                      </IonButton>
                    </IonItem>
                  );
                })}
              </IonList>
            )}
          </>
        )}

        {selectedSegment === "add-movie" && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Add Movie to Starting Database</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonItem lines="none" style={{ marginBottom: "1rem" }}>
                <IonInput
                  label="TMDB ID (Optional Auto-Fill)"
                  labelPlacement="stacked"
                  placeholder="e.g. 550"
                  value={movie.tmdbid}
                  onIonInput={(e) =>
                    setMovie((prev) => ({ ...prev, tmdbid: e.detail.value ?? "" }))
                  }
                />
                <IonButton
                  slot="end"
                  onClick={fetchFromTMDB}
                  disabled={fetchingTMDB || !movie.tmdbid.trim()}
                  style={{ alignSelf: "flex-end" }}
                >
                  {fetchingTMDB ? <IonSpinner name="dots" /> : "Fetch from TMDB"}
                </IonButton>
              </IonItem>

              <IonList lines="full">
                <IonItem>
                  <IonInput
                    label="Movie Name *"
                    labelPlacement="stacked"
                    value={movie.name}
                    onIonInput={(e) =>
                      setMovie((prev) => ({ ...prev, name: e.detail.value ?? "" }))
                    }
                  />
                </IonItem>

                <IonItem>
                  <IonInput
                    label="IMDb ID"
                    labelPlacement="stacked"
                    value={movie.imdbid}
                    onIonInput={(e) =>
                      setMovie((prev) => ({ ...prev, imdbid: e.detail.value ?? "" }))
                    }
                  />
                </IonItem>

                <IonItem>
                  <IonInput
                    label="Rating"
                    labelPlacement="stacked"
                    value={movie.rating}
                    onIonInput={(e) =>
                      setMovie((prev) => ({ ...prev, rating: e.detail.value ?? "" }))
                    }
                  />
                </IonItem>

                <IonItem>
                  <IonInput
                    type="date"
                    label="Release Date"
                    labelPlacement="stacked"
                    value={movie.releasedate}
                    onIonInput={(e) =>
                      setMovie((prev) => ({ ...prev, releasedate: e.detail.value ?? "" }))
                    }
                  />
                </IonItem>

                <IonItem>
                  <IonTextarea
                    label="Description"
                    labelPlacement="stacked"
                    rows={3}
                    value={movie.description}
                    onIonInput={(e) =>
                      setMovie((prev) => ({ ...prev, description: e.detail.value ?? "" }))
                    }
                  />
                </IonItem>

                <IonItem>
                  <IonInput
                    label="Poster URL"
                    labelPlacement="stacked"
                    value={movie.posterurl}
                    onIonInput={(e) =>
                      setMovie((prev) => ({ ...prev, posterurl: e.detail.value ?? "" }))
                    }
                  />
                </IonItem>

                <IonItem>
                  <IonInput
                    label="Backdrop URL"
                    labelPlacement="stacked"
                    value={movie.backdropurl}
                    onIonInput={(e) =>
                      setMovie((prev) => ({ ...prev, backdropurl: e.detail.value ?? "" }))
                    }
                  />
                </IonItem>
              </IonList>

              {movie.posterurl && (
                <div style={{ textAlign: "center", margin: "1rem 0" }}>
                  <img
                    src={movie.posterurl}
                    alt="Poster Preview"
                    style={{ maxHeight: "180px", borderRadius: "8px" }}
                  />
                </div>
              )}

              <IonButton
                expand="block"
                className="ion-margin-top"
                onClick={handleAddMovie}
                disabled={savingMovie}
              >
                {savingMovie ? <IonSpinner name="dots" /> : "Save to Database"}
              </IonButton>
            </IonCardContent>
          </IonCard>
        )}

        <IonToast
          isOpen={!!toastMessage}
          message={toastMessage ?? ""}
          duration={2500}
          onDidDismiss={() => setToastMessage(null)}
        />
      </IonContent>
    </IonPage>
  );
};

export default Admin;