import React, { useState } from "react";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonInput,
  IonItem,
  IonList,
  IonSpinner,
  IonTextarea,
} from "@ionic/react";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { Movie } from "../../../types/movie";
import { fetchMovieFromTMDB } from "../../../utils/tmdb";
import { getErrorMessage } from "../../../utils/errors";
import { useToast } from "../../../hooks/useToast";
import { initialMovieForm } from "../data/movieForm";

export const AddMoviePanel: React.FC = () => {
  const [movie, setMovie] = useState<Movie>(initialMovieForm);
  const [fetchingTMDB, setFetchingTMDB] = useState(false);
  const [savingMovie, setSavingMovie] = useState(false);
  const { showToast, toast } = useToast(2500);

  const setMovieField = (field: keyof Movie, value: string) => {
    setMovie((prev) => ({ ...prev, [field]: value }));
  };

  const handleFetchFromTMDB = async () => {
    const tmdbId = movie.tmdbid?.trim() ?? "";
    if (!tmdbId) {
      showToast("Enter a TMDB ID first.");
      return;
    }

    setFetchingTMDB(true);
    try {
      const fetched = await fetchMovieFromTMDB(tmdbId);
      setMovie({ ...fetched });
      showToast("Movie data loaded from TMDB!");
    } catch (err) {
      showToast(getErrorMessage(err, "Failed to fetch from TMDB."));
    } finally {
      setFetchingTMDB(false);
    }
  };

  const handleAddMovie = async () => {
    if (!movie.name.trim()) {
      showToast("Movie name is required.");
      return;
    }

    setSavingMovie(true);
    try {
      const docId = movie.tmdbid?.trim() || doc(collection(db, "movies")).id;
      await setDoc(doc(db, "movies", docId as string), movie);
      showToast("Movie added to database!");
      setMovie(initialMovieForm);
    } catch (err) {
      showToast(getErrorMessage(err, "Failed to add movie."));
    } finally {
      setSavingMovie(false);
    }
  };

  return (
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
            onIonInput={(e) => setMovieField("tmdbid", e.detail.value ?? "")}
          />
          <IonButton
            slot="end"
            onClick={handleFetchFromTMDB}
            disabled={fetchingTMDB || !(movie.tmdbid ?? "").trim()}
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
              onIonInput={(e) => setMovieField("name", e.detail.value ?? "")}
            />
          </IonItem>

          <IonItem>
            <IonInput
              label="IMDb ID"
              labelPlacement="stacked"
              value={movie.imdbid}
              onIonInput={(e) => setMovieField("imdbid", e.detail.value ?? "")}
            />
          </IonItem>

          <IonItem>
            <IonInput
              label="Rating"
              labelPlacement="stacked"
              value={movie.rating}
              onIonInput={(e) => setMovieField("rating", e.detail.value ?? "")}
            />
          </IonItem>

          <IonItem>
            <IonInput
              type="date"
              label="Release Date"
              labelPlacement="stacked"
              value={movie.releasedate}
              onIonInput={(e) => setMovieField("releasedate", e.detail.value ?? "")}
            />
          </IonItem>

          <IonItem>
            <IonTextarea
              label="Description"
              labelPlacement="stacked"
              rows={3}
              value={movie.description}
              onIonInput={(e) => setMovieField("description", e.detail.value ?? "")}
            />
          </IonItem>

          <IonItem>
            <IonInput
              label="Poster URL"
              labelPlacement="stacked"
              value={movie.posterurl}
              onIonInput={(e) => setMovieField("posterurl", e.detail.value ?? "")}
            />
          </IonItem>

          <IonItem>
            <IonInput
              label="Backdrop URL"
              labelPlacement="stacked"
              value={movie.backdropurl}
              onIonInput={(e) => setMovieField("backdropurl", e.detail.value ?? "")}
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

        {toast}
      </IonCardContent>
    </IonCard>
  );
};
