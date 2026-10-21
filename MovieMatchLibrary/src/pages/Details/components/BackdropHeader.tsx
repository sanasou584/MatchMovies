import React from "react";
import {
  IonBadge,
  IonButton,
  IonIcon,
} from "@ionic/react";
import { calendarOutline, heart, heartOutline, star } from "ionicons/icons";
import { Movie } from "../../../types/movie";
import "./BackdropHeader.css";

interface BackdropHeaderProps {
  movie: Movie;
  isLiked: boolean;
  onToggleLike: () => void;
}

export const BackdropHeader: React.FC<BackdropHeaderProps> = ({
  movie,
  isLiked,
  onToggleLike,
}) => (
  <div
    className="details-backdrop"
    style={{
      backgroundImage: `url(${movie.backdropurl || movie.posterurl})`,
    }}
  >
    <div className="details-backdrop__overlay" />

    <div className="details-backdrop__bottom">
      <div>
        <h1 className="details-backdrop__title">{movie.name}</h1>
        <div className="details-backdrop__badges">
          {movie.rating && (
            <IonBadge color="warning" className="details-backdrop__badge">
              <IonIcon icon={star} /> {movie.rating}
            </IonBadge>
          )}
          {movie.releasedate && (
            <IonBadge color="medium" className="details-backdrop__badge">
              <IonIcon icon={calendarOutline} /> {movie.releasedate}
            </IonBadge>
          )}
        </div>
      </div>

      <IonButton color={isLiked ? "danger" : "light"} onClick={onToggleLike} shape="round">
        <IonIcon slot="icon-only" icon={isLiked ? heart : heartOutline} />
      </IonButton>
    </div>
  </div>
);
