import React, { useEffect, useState } from "react";
import {
  IonAvatar,
  IonBadge,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonProgressBar,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { flame, heart } from "ionicons/icons";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { Movie } from "./Home";

interface MatchedUser {
  id: string;
  first_name?: string;
  last_name?: string;
  date_of_birth?: string;
  photo_url?: string;
  liked_movies?: string[];
  disabled?: boolean;
  matchRate: number;
  sharedMovieTitles: string[];
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

const Matches: React.FC = () => {
  const { user } = useAuth();
  const [currentUserLikes, setCurrentUserLikes] = useState<string[]>([]);
  const [matchedUsers, setMatchedUsers] = useState<MatchedUser[]>([]);
  const [allMovies, setAllMovies] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubMovies = onSnapshot(collection(db, "movies"), (snapshot) => {
      const movieMap: Record<string, string> = {};
      snapshot.forEach((d) => {
        const data = d.data() as Movie;
        movieMap[d.id] = data.name || "Untitled";
      });
      setAllMovies(movieMap);
    });

    return () => unsubMovies();
  }, []);

  useEffect(() => {
    if (!user) return;

    const unsubUser = onSnapshot(doc(db, "users", user.uid), (docSnap) => {
      if (docSnap.exists()) {
        setCurrentUserLikes(docSnap.data().liked_movies ?? []);
      }
    });

    return () => unsubUser();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const unsubUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      const myLikes = new Set(currentUserLikes);
      const matches: MatchedUser[] = [];

      if (myLikes.size === 0) {
        setMatchedUsers([]);
        setLoading(false);
        return;
      }

      snapshot.forEach((d) => {
        if (d.id === user.uid) return;
        const data = d.data();
        if (data.disabled === true) return;

        const theirLikes: string[] = data.liked_movies ?? [];
        if (theirLikes.length === 0) return;

        const shared = theirLikes.filter((id) => myLikes.has(id));
        const union = new Set([...currentUserLikes, ...theirLikes]);
        const rate = union.size > 0 ? (shared.length / union.size) * 100 : 0;
        const roundedRate = Math.round(rate);

        // Preference match strictly exceeds 75%
        if (roundedRate >= 75) {
          matches.push({
            id: d.id,
            first_name: data.first_name,
            last_name: data.last_name,
            date_of_birth: data.date_of_birth,
            photo_url: data.photo_url,
            matchRate: roundedRate,
            sharedMovieTitles: shared.map((id) => allMovies[id] || "Unknown Movie"),
          });
        }
      });

      matches.sort((a, b) => b.matchRate - a.matchRate);
      setMatchedUsers(matches);
      setLoading(false);
    });

    return () => unsubUsers();
  }, [user, currentUserLikes, allMovies]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Movie Matches</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", marginTop: "3rem" }}>
            <IonSpinner name="crescent" />
          </div>
        ) : currentUserLikes.length === 0 ? (
          <div style={{ textAlign: "center", marginTop: "3rem", color: "var(--ion-color-medium)" }}>
            <IonIcon icon={heart} style={{ fontSize: "3rem", color: "var(--ion-color-danger)" }} />
            <h2>No Favorites Yet</h2>
            <p>Add movies to your favorites playlist to find users with matching taste!</p>
          </div>
        ) : matchedUsers.length === 0 ? (
          <div style={{ textAlign: "center", marginTop: "3rem", color: "var(--ion-color-medium)" }}>
            <IonIcon icon={flame} style={{ fontSize: "3rem", color: "var(--ion-color-warning)" }} />
            <h2>No Matches &gt; 75%</h2>
            <p>None of the other users currently exceed a 75% preference match with your playlist.</p>
          </div>
        ) : (
          <>
            <p style={{ color: "var(--ion-color-medium)", marginBottom: "1rem" }}>
              Tap any user to view their profile and full playlist:
            </p>

            {matchedUsers.map((item) => {
              const age = calculateAge(item.date_of_birth);

              return (
                <IonCard
                  button
                  key={item.id}
                  className="ion-margin-bottom"
                  onClick={() => navigate(`/profile?id=${item.id}`)}
                >
                  <IonCardHeader>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <IonAvatar style={{ width: "60px", height: "60px" }}>
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
                                fontSize: "1.5rem",
                              }}
                            >
                              👤
                            </div>
                          )}
                        </IonAvatar>

                        <div>
                          <IonCardTitle style={{ fontSize: "1.2rem" }}>
                            {item.first_name} {item.last_name}
                          </IonCardTitle>
                          <IonCardSubtitle>
                            {age !== null ? `${age} years old` : "Age not specified"}
                          </IonCardSubtitle>
                        </div>
                      </div>

                      <IonBadge color="success" style={{ fontSize: "0.95rem", padding: "6px 10px" }}>
                        {item.matchRate}% Match
                      </IonBadge>
                    </div>
                  </IonCardHeader>

                  <IonCardContent>
                    <IonProgressBar
                      value={item.matchRate / 100}
                      color="success"
                      style={{ height: "8px", borderRadius: "4px", marginBottom: "10px" }}
                    />

                    <p style={{ fontWeight: "bold", marginBottom: "6px" }}>Shared Favorites:</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {item.sharedMovieTitles.map((title, idx) => (
                        <IonChip key={idx} color="primary" style={{ margin: 0 }}>
                          {title}
                        </IonChip>
                      ))}
                    </div>
                  </IonCardContent>
                </IonCard>
              );
            })}
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Matches;