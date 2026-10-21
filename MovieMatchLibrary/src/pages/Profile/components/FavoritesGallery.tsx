import React from "react";
import { IonIcon } from "@ionic/react";
import { star } from "ionicons/icons";
import { Movie } from "../../../types/movie";
import "./FavoritesGallery.css";

interface FavoritesGalleryProps {
  movies: Movie[];
  onSelectMovie: (movieId: string) => void;
}

export const FavoritesGallery: React.FC<FavoritesGalleryProps> = ({
  movies,
  onSelectMovie,
}) => {
  if (movies.length === 0) {
    return <p className="favorites-gallery__empty">No movies liked yet.</p>;
  }

  return (
    <div className="favorites-gallery">
      {movies.map((movie) => (
        <div
          key={movie.id}
          className="favorites-gallery__item"
          onClick={() => onSelectMovie(movie.id as string)}
        >
          <img
            src={movie.posterurl || "https://via.placeholder.com/120x180"}
            alt={movie.name}
            className="favorites-gallery__poster"
          />
          <p className="favorites-gallery__name">{movie.name}</p>
          <p className="favorites-gallery__rating">
            <IonIcon icon={star} color="warning" /> {movie.rating || "N/A"}
          </p>
        </div>
      ))}
    </div>
  );
};
