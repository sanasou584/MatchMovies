import React from "react";
import {
  IonBadge,
  IonCard,
  IonCardSubtitle,
  IonCardTitle,
} from "@ionic/react";
import { UserProfile } from "../../../types/movie";
import { UserAvatar } from "../../../components/UserAvatar";
import "./ProfileHeaderCard.css";

interface ProfileHeaderCardProps {
  profile: UserProfile;
}

export const ProfileHeaderCard: React.FC<ProfileHeaderCardProps> = ({ profile }) => (
  <IonCard className="profile-header-card">
    <div className="profile-header-card__avatar-wrap">
      <UserAvatar
        photoUrl={profile.photo_url}
        size={110}
        className="profile-header-card__avatar"
      />
    </div>

    <IonCardTitle>
      {profile.first_name} {profile.last_name}
    </IonCardTitle>

    <IonCardSubtitle className="profile-header-card__role">
      <IonBadge color={profile.role === "admin" ? "warning" : "medium"}>
        {profile.role?.toUpperCase() || "USER"}
      </IonBadge>
    </IonCardSubtitle>
  </IonCard>
);
