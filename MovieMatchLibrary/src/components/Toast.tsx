import React from "react";
import { IonToast } from "@ionic/react";

interface ToastProps {
  message: string | null;
  onDismiss: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  onDismiss,
  duration = 2000,
}) => (
  <IonToast
    isOpen={!!message}
    message={message ?? ""}
    duration={duration}
    onDidDismiss={onDismiss}
  />
);
