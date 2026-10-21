import React from "react";
import {
  IonBadge,
  IonButton,
  IonItem,
  IonLabel,
  IonList,
  IonSearchbar,
  IonSpinner,
} from "@ionic/react";
import { UserProfile } from "../../../types/movie";
import { calculateAge } from "../../../utils/date";
import { UserAvatar } from "../../../components/UserAvatar";

interface UsersPanelProps {
  users: UserProfile[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
  loading: boolean;
  currentAdminUid: string | undefined;
  onToggleDisable: (userId: string, currentDisabledStatus?: boolean) => void;
}

export const UsersPanel: React.FC<UsersPanelProps> = ({
  users,
  searchQuery,
  onSearchChange,
  loading,
  currentAdminUid,
  onToggleDisable,
}) => {
  const filteredUsers = users.filter((u) => {
    const fullName = `${u.first_name ?? ""} ${u.last_name ?? ""}`.toLowerCase();
    const email = (u.email ?? "").toLowerCase();
    const query = searchQuery.toLowerCase().trim();
    return fullName.includes(query) || email.includes(query);
  });

  return (
    <>
      <IonSearchbar
        value={searchQuery}
        placeholder="Search users..."
        onIonInput={(e) => onSearchChange(e.detail.value ?? "")}
      />

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
          <IonSpinner name="crescent" />
        </div>
      ) : filteredUsers.length === 0 ? (
        <p style={{ textAlign: "center", color: "var(--ion-color-medium)" }}>
          No users found.
        </p>
      ) : (
        <IonList inset>
          {filteredUsers.map((item) => {
            const isSelf = item.id === currentAdminUid;
            const age = calculateAge(item.date_of_birth);

            return (
              <IonItem key={item.id} lines="full">
                <UserAvatar photoUrl={item.photo_url} slot="start" />

                <IonLabel>
                  <h2>
                    {item.first_name} {item.last_name}
                    {item.disabled && (
                      <IonBadge color="danger" style={{ marginLeft: "8px" }}>
                        Disabled
                      </IonBadge>
                    )}
                    {isSelf && (
                      <IonBadge color="medium" style={{ marginLeft: "8px" }}>
                        You
                      </IonBadge>
                    )}
                  </h2>
                  <p>{item.email}</p>
                  <p>
                    Age: {age !== null ? age : "N/A"} | Favorites:{" "}
                    {item.liked_movies?.length ?? 0}
                  </p>
                </IonLabel>

                <IonButton
                  fill={item.disabled ? "solid" : "outline"}
                  color={item.disabled ? "success" : "danger"}
                  size="small"
                  disabled={isSelf}
                  onClick={() => onToggleDisable(item.id, item.disabled)}
                >
                  {item.disabled ? "Enable" : "Disable"}
                </IonButton>
              </IonItem>
            );
          })}
        </IonList>
      )}
    </>
  );
};
