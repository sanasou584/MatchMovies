import React, { useEffect, useState } from "react";
import {
  IonBadge,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonPage,
  IonRow,
  IonSearchbar,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

import { collection, onSnapshot } from "firebase/firestore";
import { star } from "ionicons/icons";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";

export interface Movie {
  id: string;
  tmdbid?: string;
  imdbid?: string;
  name: string;
  description: string;
  rating: string;
  releasedate: string;
  posterurl: string;
  backdropurl: string;
}

const Home: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "movies"),
      (snapshot) => {
        const movieList: Movie[] = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<Movie, "id">),
        }));

        setMovies(movieList);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching movies:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

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
          <div style={{ display: "flex", justifyContent: "center", marginTop: "3rem" }}>
            <IonSpinner name="crescent" />
          </div>
        ) : filteredMovies.length === 0 ? (
          <p style={{ textAlign: "center", color: "var(--ion-color-medium)", marginTop: "2rem" }}>
            No movies found.
          </p>
        ) : (
          <IonGrid>
            <IonRow>
              {filteredMovies.map((movie) => (
                <IonCol size="6" sizeMd="4" sizeLg="3" key={movie.id}>
                  <IonCard
                    button
                    onClick={() => navigate(`/details?id=${movie.id}`)}
                    style={{ margin: "0 0 1rem 0", height: "100%", display: "flex", flexDirection: "column" }}
                  >
                    <div style={{ position: "relative", width: "100%", paddingTop: "140%", overflow: "hidden" }}>
                      <img
                        src={movie.posterurl || "https://via.placeholder.com/300x450?text=No+Poster"}
                        alt={movie.name}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      {movie.rating && (
                        <IonBadge
                          color="warning"
                          style={{
                            position: "absolute",
                            top: "8px",
                            right: "8px",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <IonIcon icon={star} />
                          {movie.rating}
                        </IonBadge>
                      )}
                    </div>

                    <IonCardHeader style={{ padding: "10px" }}>
                      <IonCardTitle style={{ fontSize: "1rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {movie.name}
                      </IonCardTitle>
                      <IonCardSubtitle style={{ fontSize: "0.8rem" }}>
                        {movie.releasedate ? movie.releasedate.substring(0, 4) : "N/A"}
                      </IonCardSubtitle>
                    </IonCardHeader>
                  </IonCard>
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