import React from "react";
import { IonIcon } from "@ionic/react";

interface EmptyStateProps {
  icon?: string;
  iconColor?: string;
  title?: string;
  marginTop?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  iconColor,
  title,
  marginTop = "3rem",
  style,
  children,
}) => (
  <div
    style={{
      textAlign: "center",
      marginTop,
      color: "var(--ion-color-medium)",
      ...style,
    }}
  >
    {icon && (
      <IonIcon
        icon={icon}
        style={{
          fontSize: "3rem",
          color: iconColor,
        }}
      />
    )}
    {title && <h2>{title}</h2>}
    {children}
  </div>
);
