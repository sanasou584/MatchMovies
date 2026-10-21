import React from "react";
import {
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonThumbnail,
} from "@ionic/react";
import { heartDislikeOutline, star } from "ionicons/icons";
import { Movie } from "../../../types/movie";
import "./FavoriteItem.css";

interface FavoriteItemProps {
  movie: Movie;
  onClick: () => void;
  onRemove: () => void;
}

export const FavoriteItem: React.FC<FavoriteItemProps> = ({
  movie,
  onClick,
  onRemove,
}) => (
  <IonItem button onClick={onClick} lines="full">
    <IonThumbnail slot="start">
      <img
        src={movie.posterurl || "https://via.placeholder.com/150"}
        alt={movie.name}
        className="favorite-item__thumbnail"
      />
    </IonThumbnail>

    <IonLabel>
      <h2>{movie.name}</h2>
      <p className="favorite-item__rating">
        <IonIcon icon={star} color="warning" /> {movie.rating || "N/A"}
      </p>
      <p>{movie.releasedate ? movie.releasedate.substring(0, 4) : ""}</p>
    </IonLabel>

    <IonButton
      fill="clear"
      color="danger"
      slot="end"
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation();
        onRemove();
      }}
    >
      <IonIcon slot="icon-only" icon={heartDislikeOutline} />
    </IonButton>
  </IonItem>
);
