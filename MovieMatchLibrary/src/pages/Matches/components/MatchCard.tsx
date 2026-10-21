import React from "react";
import {
  IonBadge,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonChip,
  IonProgressBar,
} from "@ionic/react";
import { MatchedUser } from "../utils/computeMatches";
import { calculateAge } from "../../../utils/date";
import { UserAvatar } from "../../../components/UserAvatar";
import "./MatchCard.css";

interface MatchCardProps {
  match: MatchedUser;
  onClick: () => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, onClick }) => {
  const age = calculateAge(match.date_of_birth);

  return (
    <IonCard button onClick={onClick} className="match-card">
      <IonCardHeader>
        <div className="match-card__header">
          <div className="match-card__identity">
            <UserAvatar photoUrl={match.photo_url} size={60} />

            <div>
              <IonCardTitle style={{ fontSize: "1.2rem" }}>
                {match.first_name} {match.last_name}
              </IonCardTitle>
              <IonCardSubtitle>
                {age !== null ? `${age} years old` : "Age not specified"}
              </IonCardSubtitle>
            </div>
          </div>

          <IonBadge color="success" className="match-card__rate">
            {match.matchRate}% Match
          </IonBadge>
        </div>
      </IonCardHeader>

      <IonCardContent>
        <IonProgressBar
          value={match.matchRate / 100}
          color="success"
          className="match-card__progress"
        />

        <p className="match-card__shared-title">Shared Favorites:</p>
        <div className="match-card__shared-list">
          {match.sharedMovieTitles.map((title, idx) => (
            <IonChip key={idx} color="primary" style={{ margin: 0 }}>
              {title}
            </IonChip>
          ))}
        </div>
      </IonCardContent>
    </IonCard>
  );
};
