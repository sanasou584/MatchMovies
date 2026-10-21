import React, { useState } from "react";
import {
  IonContent,
  IonHeader,
  IonLabel,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import { UserProfile } from "../../types/movie";
import { useCollection } from "../../hooks/useCollection";
import { useToast } from "../../hooks/useToast";
import { getErrorMessage } from "../../utils/errors";
import { UsersPanel } from "./components/UsersPanel";
import { AddMoviePanel } from "./components/AddMoviePanel";

type AdminSegment = "users" | "add-movie";

const Admin: React.FC = () => {
  const { user: currentAdmin } = useAuth();
  const [selectedSegment, setSelectedSegment] = useState<AdminSegment>("users");
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const { items: users, loading: loadingUsers } = useCollection<UserProfile>("users");
  const { showToast, toast } = useToast(2500);

  const handleToggleDisable = async (
    userId: string,
    currentDisabledStatus?: boolean
  ) => {
    try {
      await updateDoc(doc(db, "users", userId), {
        disabled: !currentDisabledStatus,
      });
      showToast(
        !currentDisabledStatus
          ? "User has been disabled."
          : "User has been re-enabled."
      );
    } catch (err) {
      showToast(getErrorMessage(err, "Failed to update user status."));
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Administrator Panel</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSegment
            value={selectedSegment}
            onIonChange={(e) => setSelectedSegment(e.detail.value as AdminSegment)}
          >
            <IonSegmentButton value="users">
              <IonLabel>Manage Users</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="add-movie">
              <IonLabel>Add Movies</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        {selectedSegment === "users" && (
          <UsersPanel
            users={users}
            searchQuery={userSearchQuery}
            onSearchChange={setUserSearchQuery}
            loading={loadingUsers}
            currentAdminUid={currentAdmin?.uid}
            onToggleDisable={handleToggleDisable}
          />
        )}

        {selectedSegment === "add-movie" && <AddMoviePanel />}

        {toast}
      </IonContent>
    </IonPage>
  );
};

export default Admin;
