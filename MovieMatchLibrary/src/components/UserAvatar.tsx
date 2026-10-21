import React from "react";
import { IonAvatar } from "@ionic/react";

interface UserAvatarProps {
  photoUrl?: string;
  slot?: "start" | "end";
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

/** Reusable user photo with a friendly placeholder fallback. */
export const UserAvatar: React.FC<UserAvatarProps> = ({
  photoUrl,
  slot,
  size,
  className,
  style,
}) => (
  <IonAvatar
    slot={slot}
    className={className}
    style={{
      width: size ? `${size}px` : undefined,
      height: size ? `${size}px` : undefined,
      ...style,
    }}
  >
    <img src={photoUrl || "/Avatar.png"} alt={photoUrl ? "User avatar" : "Default avatar"} />
  </IonAvatar>
);
