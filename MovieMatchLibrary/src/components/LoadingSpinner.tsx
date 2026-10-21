import React from "react";
import { IonSpinner } from "@ionic/react";

export const LoadingSpinner: React.FC<{ marginTop?: string }> = ({
  marginTop = "3rem",
}) => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      marginTop,
    }}
  >
    <IonSpinner name="crescent" />
  </div>
);
