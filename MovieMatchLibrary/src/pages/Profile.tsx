import React, { useEffect, useState } from "react";
import {
  IonAvatar,
  IonBackButton,
  IonBadge,
  IonButton,
  IonButtons,
  IonCard,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { collection, doc, onSnapshot } from "firebase/firestore";
import {
  filmOutline,
  logOutOutline,
  mailOutline,
  personOutline,
  shieldCheckmarkOutline,
  star,
} from "ionicons/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { Movie } from "./Home";

interface UserProfileData {
  first_name?: string;
  last_name?: string;
  date_of_birth?: string;
  photo_url?: string;
  email?: string;
  role?: "admin" | "user";
  liked_movies?: string[];
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

const Profile: React.FC = () => {
  const { user: currentAuthUser, role: myRole, logout } = useAuth();
  const [searchParams] = useSearchParams();

  // If `?id=` param is passed, we are viewing another user's profile
  const targetUserId = searchParams.get("id") || currentAuthUser?.uid;
  const isOwnProfile = !searchParams.get("id") || searchParams.get("id") === currentAuthUser?.uid;

  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [likedMovies, setLikedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!targetUserId) {
      setLoading(false);
      return;
    }

    let allMovies: Movie[] = [];

    const unsubMovies = onSnapshot(collection(db, "movies"), (snap) => {
      allMovies = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Movie, "id">),
      }));

      const unsubUser = onSnapshot(doc(db, "users", targetUserId), (userDoc) => {
        if (userDoc.exists()) {
          const data = userDoc.data() as UserProfileData;
          setProfile(data);
          const userLikedIds = data.liked_movies ?? [];
          setLikedMovies(allMovies.filter((m) => userLikedIds.includes(m.id)));
        } else {
          setProfile(null);
        }
        setLoading(false);
      });

      return () => unsubUser();
    });

    return () => unsubMovies();
  }, [targetUserId]);

  const userAge = calculateAge(profile?.date_of_birth);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          {!isOwnProfile && (
            <IonButtons slot="start">
              <IonBackButton defaultHref="/matches" />
            </IonButtons>
          )}
          <IonTitle>
            {isOwnProfile
              ? "My Profile"
              : `${profile?.first_name || "User"}'s Profile`}
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", marginTop: "3rem" }}>
            <IonSpinner name="crescent" />
          </div>
        ) : !profile ? (
          <p style={{ textAlign: "center", marginTop: "2rem" }}>User profile not found.</p>
        ) : (
          <>
            {/* Profile Avatar Card */}
            <IonCard style={{ textAlign: "center", padding: "1.5rem 1rem" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
                <IonAvatar
                  style={{
                    width: "110px",
                    height: "110px",
                    border: "3px solid var(--ion-color-primary)",
                  }}
                >
                  {profile.photo_url ? (
                    <img src={profile.photo_url} alt="Profile" />
                  ) : (
                    <div
                      style={{
                        backgroundColor: "var(--ion-color-step-200)",
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "2.5rem",
                      }}
                    >
                      👤
                    </div>
                  )}
                </IonAvatar>
              </div>

              <IonCardTitle>
                {profile.first_name} {profile.last_name}
              </IonCardTitle>

              <IonCardSubtitle style={{ marginTop: "0.5rem" }}>
                <IonBadge color={profile.role === "admin" ? "warning" : "medium"}>
                  {profile.role?.toUpperCase() || "USER"}
                </IonBadge>
              </IonCardSubtitle>
            </IonCard>

            {/* Admin Dashboard Button (Only on own profile if admin) */}
            {isOwnProfile && myRole === "admin" && (
              <IonButton
                expand="block"
                color="secondary"
                routerLink="/admin"
                className="ion-margin-bottom"
              >
                <IonIcon slot="start" icon={shieldCheckmarkOutline} />
                Admin Dashboard
              </IonButton>
            )}

            {/* User Details */}
            <IonList inset>
              <IonItem lines="full">
                <IonIcon slot="start" icon={mailOutline} color="primary" />
                <IonLabel>
                  <p>Email</p>
                  <h2>{profile.email}</h2>
                </IonLabel>
              </IonItem>

              <IonItem lines="full">
                <IonIcon slot="start" icon={personOutline} color="primary" />
                <IonLabel>
                  <p>Age</p>
                  <h2>{userAge !== null ? `${userAge} years old` : "Not provided"}</h2>
                </IonLabel>
              </IonItem>

              <IonItem lines="none">
                <IonIcon slot="start" icon={filmOutline} color="primary" />
                <IonLabel>
                  <p>Favorite Playlist</p>
                  <h2>{profile.liked_movies?.length ?? 0} Movies Saved</h2>
                </IonLabel>
              </IonItem>
            </IonList>

            {/* Liked Movies Horizontal Gallery */}
            <div style={{ marginTop: "1.5rem" }}>
              <div style={{ margin: "0 8px 8px" }}>
                <h3 style={{ margin: 0, fontWeight: "bold" }}>
                  {isOwnProfile ? "Favorite Movies" : `${profile.first_name}'s Favorites`}
                </h3>
              </div>

              {likedMovies.length === 0 ? (
                <p style={{ color: "var(--ion-color-medium)", fontStyle: "italic", paddingLeft: "8px" }}>
                  No movies liked yet.
                </p>
              ) : (
                <div
                  style={{
                    display: "flex",
                    overflowX: "auto",
                    gap: "12px",
                    paddingBottom: "8px",
                  }}
                >
                  {likedMovies.map((movie) => (
                    <div
                      key={movie.id}
                      onClick={() => navigate(`/details?id=${movie.id}`)}
                      style={{
                        minWidth: "120px",
                        maxWidth: "120px",
                        cursor: "pointer",
                      }}
                    >
                      <img
                        src={movie.posterurl || "https://via.placeholder.com/120x180"}
                        alt={movie.name}
                        style={{
                          width: "100%",
                          height: "170px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                      <p
                        style={{
                          margin: "4px 0 0",
                          fontSize: "0.85rem",
                          fontWeight: "bold",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {movie.name}
                      </p>
                      <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--ion-color-medium)" }}>
                        <IonIcon icon={star} color="warning" style={{ verticalAlign: "middle" }} />{" "}
                        {movie.rating || "N/A"}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Logout Button (Only on own profile) */}
            {isOwnProfile && (
              <IonButton
                expand="block"
                color="danger"
                fill="outline"
                style={{ marginTop: "2rem" }}
                onClick={logout}
              >
                <IonIcon slot="start" icon={logOutOutline} />
                Logout
              </IonButton>
            )}
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Profile;