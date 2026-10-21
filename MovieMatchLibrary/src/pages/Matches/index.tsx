import React, { useMemo } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { flame, heart } from "ionicons/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { UserProfile } from "../../types/movie";
import { useCollection, useMovieTitleMap } from "../../hooks/useCollection";
import { useDoc } from "../../hooks/useDoc";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { EmptyState } from "../../components/EmptyState";
import { MatchCard } from "./components/MatchCard";
import { computeMatches } from "./utils/computeMatches";

const Matches: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { movieTitleMap, loading: moviesLoading } = useMovieTitleMap();
  const { data: currentUserDoc, loading: userLoading } = useDoc<UserProfile>(
    "users",
    user?.uid
  );
  const { items: users, loading: usersLoading } = useCollection<UserProfile>("users");

  const currentUserLikes = useMemo(
    () => currentUserDoc?.liked_movies ?? [],
    [currentUserDoc]
  );

  const matchedUsers = useMemo(
    () =>
      computeMatches(users, currentUserLikes, movieTitleMap, user?.uid ?? ""),
    [users, currentUserLikes, movieTitleMap, user?.uid]
  );

  if (moviesLoading || userLoading || usersLoading) {
    return (
      <IonPage>
        <Header />
        <IonContent fullscreen className="ion-padding">
          <LoadingSpinner />
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <Header />
      <IonContent fullscreen className="ion-padding">
        {currentUserLikes.length === 0 ? (
          <EmptyState icon={heart} iconColor="var(--ion-color-danger)" title="No Favorites Yet">
            <p>Add movies to your favorites playlist to find users with matching taste!</p>
          </EmptyState>
        ) : matchedUsers.length === 0 ? (
          <EmptyState icon={flame} iconColor="var(--ion-color-warning)" title="No Matches > 75%">
            <p>
              None of the other users currently exceed a 75% preference match with your
              playlist.
            </p>
          </EmptyState>
        ) : (
          <>
            <p style={{ color: "var(--ion-color-medium)", marginBottom: "1rem" }}>
              Tap any user to view their profile and full playlist:
            </p>

            {matchedUsers.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                onClick={() => navigate(`/profile?id=${match.id}`)}
              />
            ))}
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

const Header: React.FC = () => (
  <IonHeader>
    <IonToolbar color="primary">
      <IonTitle>Movie Matches</IonTitle>
    </IonToolbar>
  </IonHeader>
);

export default Matches;
