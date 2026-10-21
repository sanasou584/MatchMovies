import React from "react";
import {
  IonItem,
  IonLabel,
  IonList,
} from "@ionic/react";
import { UserProfile } from "../../../types/movie";
import { calculateAge } from "../../../utils/date";
import { UserAvatar } from "../../../components/UserAvatar";
import "./LikedUsersList.css";

interface LikedUsersListProps {
  users: UserProfile[];
}

export const LikedUsersList: React.FC<LikedUsersListProps> = ({ users }) => (
  <div className="ion-padding-horizontal">
    <h3 className="details-section__title">
      Users Who Also Liked This ({users.length})
    </h3>

    {users.length === 0 ? (
      <p className="details-section__empty">
        No other users have liked this movie yet. Be the first to match!
      </p>
    ) : (
      <IonList inset>
        {users.map((item) => {
          const userAge = calculateAge(item.date_of_birth);
          return (
            <IonItem key={item.id} lines="full">
              <UserAvatar photoUrl={item.photo_url} slot="start" />

              <IonLabel>
                <h2>
                  {item.first_name} {item.last_name}
                </h2>
                <p>{userAge !== null ? `${userAge} years old` : "Age not specified"}</p>
              </IonLabel>
            </IonItem>
          );
        })}
      </IonList>
    )}
  </div>
);
