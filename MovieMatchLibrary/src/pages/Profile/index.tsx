import React from "react";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import {
  filmOutline,
  logOutOutline,
  mailOutline,
  personOutline,
  shieldCheckmarkOutline,
} from "ionicons/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { UserProfile } from "../../types/movie";
import { useDoc } from "../../hooks/useDoc";
import { useUserFavorites } from "../../hooks/useUserFavorites";
import { calculateAge } from "../../utils/date";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import "./shared/profile.css";
import { ProfileHeaderCard } from "./components/ProfileHeaderCard";
import { FavoritesGallery } from "./components/FavoritesGallery";

const Profile: React.FC = () => {
  const { user: currentAuthUser, role: myRole, logout } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // If `?id=` param is passed, we are viewing another user's profile
  const targetUserId = searchParams.get("id") || currentAuthUser?.uid;
  const isOwnProfile =
    !searchParams.get("id") || searchParams.get("id") === currentAuthUser?.uid;

  const { data: profile, loading: profileLoading } = useDoc<UserProfile>(
    "users",
    targetUserId
  );
  const { favorites: likedMovies, loading: favoritesLoading } =
    useUserFavorites(targetUserId);

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
        {profileLoading || favoritesLoading ? (
          <LoadingSpinner />
        ) : !profile ? (
          <p style={{ textAlign: "center", marginTop: "2rem" }}>
            User profile not found.
          </p>
        ) : (
          <>
            <ProfileHeaderCard profile={profile} />

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
            <div className="profile-favorites">
              <div className="profile-favorites__heading">
                <h3>
                  {isOwnProfile
                    ? "Favorite Movies"
                    : `${profile.first_name}'s Favorites`}
                </h3>
              </div>

              <FavoritesGallery
                movies={likedMovies}
                onSelectMovie={(movieId) => navigate(`/details?id=${movieId}`)}
              />
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
