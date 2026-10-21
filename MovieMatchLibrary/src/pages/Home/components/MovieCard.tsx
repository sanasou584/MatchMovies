import React from "react";
import {
  IonBadge,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
} from "@ionic/react";
import { star } from "ionicons/icons";
import { Movie } from "../../../types/movie";
import "./MovieCard.css";

interface MovieCardProps {
  movie: Movie;
  onClick: () => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick }) => (
  <IonCard button onClick={onClick} className="movie-card">
    <div className="movie-card__poster">
      <img
        src={movie.posterurl || "https://via.placeholder.com/300x450?text=No+Poster"}
        alt={movie.name}
      />
      {movie.rating && (
        <IonBadge color="warning" className="movie-card__rating">
          <IonIcon icon={star} />
          {movie.rating}
        </IonBadge>
      )}
    </div>

    <IonCardHeader className="movie-card__header">
      <IonCardTitle className="movie-card__title">{movie.name}</IonCardTitle>
      <IonCardSubtitle className="movie-card__subtitle">
        {movie.releasedate ? movie.releasedate.substring(0, 4) : "N/A"}
      </IonCardSubtitle>
    </IonCardHeader>
  </IonCard>
);
