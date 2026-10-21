import React, { useState } from "react";
import {
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonPage,
  IonRow,
  IonSearchbar,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useNavigate } from "react-router-dom";
import { Movie } from "../../types/movie";
import { useCollection } from "../../hooks/useCollection";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { EmptyState } from "../../components/EmptyState";
import { MovieCard } from "./components/MovieCard";

const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const { items: movies, loading } = useCollection<Movie>("movies");

  const filteredMovies = movies.filter((m) =>
    (m.name ?? "").toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Movie Collection</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar
            value={searchQuery}
            placeholder="Search movies..."
            onIonInput={(e) => setSearchQuery(e.detail.value ?? "")}
          />
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        {loading ? (
          <LoadingSpinner />
        ) : filteredMovies.length === 0 ? (
          <EmptyState marginTop="2rem">
            <p>No movies found.</p>
          </EmptyState>
        ) : (
          <IonGrid>
            <IonRow>
              {filteredMovies.map((movie) => (
                <IonCol size="6" sizeMd="4" sizeLg="3" key={movie.id}>
                  <MovieCard
                    movie={movie}
                    onClick={() => navigate(`/details?id=${movie.id}`)}
                  />
                </IonCol>
              ))}
            </IonRow>
          </IonGrid>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Home;
