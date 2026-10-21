import React, { useState } from "react";
import {
  IonButton,
  IonCheckbox,
  IonContent,
  IonInput,
  IonInputPasswordToggle,
  IonLabel,
  IonPage,
  IonIcon,
} from "@ionic/react";
import { cameraOutline } from "ionicons/icons";
import { useNavigate } from "react-router-dom";
import { handleSignup } from "../../auth/userAuth";
import { isValidEmail, isValidName, isValidDOB, isValidPassword } from "../../utils/validation";
import { getAge } from "../../utils/date";
import { getErrorMessage } from "../../utils/errors";
import { UserAvatar } from "../../components/UserAvatar";
import { usePhotoPicker } from "./hooks/usePhotoPicker";
import "./shared/signup.css";

const Signup: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [pswd, setPswd] = useState("");
  const [confPswd, setConfPswd] = useState("");
  const [stayLoggedIn, setStayLoggedIn] = useState(true);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { photo, takePhoto } = usePhotoPicker();

  const validateSignup = (): boolean => {
    if (!photo) {
      setErr("Profile photo taken with the camera is required");
      return false;
    }

    if (!firstName.trim() || !lastName.trim()) {
      setErr("First and last name are required");
      return false;
    }

    if (!isValidName(firstName) || !isValidName(lastName)) {
      setErr("Names contain invalid characters");
      return false;
    }

    if (!isValidEmail(email)) {
      setErr("Invalid email address");
      return false;
    }

    if (!isValidPassword(pswd)) {
      setErr(
        "Password must be at least 8 characters and contain an uppercase letter, number, and symbol"
      );
      return false;
    }

    if (pswd !== confPswd) {
      setErr("Passwords do not match");
      return false;
    }

    if (!isValidDOB(dob)) {
      setErr("Invalid date of birth");
      return false;
    }

    if (getAge(dob) < 13) {
      setErr("You must be at least 13 years old");
      return false;
    }

    return true;
  };

  const signup = async () => {
    setErr("");

    if (!validateSignup()) return;

    setLoading(true);

    try {
      await handleSignup(
        email,
        pswd,
        firstName,
        lastName,
        dob,
        photo,
        stayLoggedIn
      );

      navigate("/home");
    } catch (error) {
      setErr(getErrorMessage(error, "Failed to create account"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen className="ion-padding">
        <div className="signup-photo">
          <UserAvatar
            photoUrl={photo}
            size={110}
            className="signup-photo__avatar"
          />

          <IonButton fill="outline" size="small" onClick={takePhoto}>
            <IonIcon slot="start" icon={cameraOutline} />
            {photo ? "Retake Photo" : "Take Profile Photo"}
          </IonButton>
        </div>

        <IonInput
          type="text"
          label="First Name"
          labelPlacement="floating"
          onIonInput={(e) => setFirstName(e.detail.value ?? "")}
        />

        <IonInput
          type="text"
          label="Last Name"
          labelPlacement="floating"
          onIonInput={(e) => setLastName(e.detail.value ?? "")}
        />

        <IonInput
          type="date"
          label="Date of birth"
          labelPlacement="floating"
          onIonInput={(e) => setDob(e.detail.value ?? "")}
        />

        <IonInput
          type="email"
          label="Email Address"
          labelPlacement="floating"
          onIonInput={(e) => setEmail(e.detail.value ?? "")}
        />

        <IonInput
          type="password"
          label="Password"
          labelPlacement="floating"
          onIonInput={(e) => setPswd(e.detail.value ?? "")}
        >
          <IonInputPasswordToggle slot="end" />
        </IonInput>

        <IonInput
          type="password"
          label="Confirm Password"
          labelPlacement="floating"
          onIonInput={(e) => setConfPswd(e.detail.value ?? "")}
        >
          <IonInputPasswordToggle slot="end" />
        </IonInput>

        <div className="signup-stay-logged-in">
          <IonCheckbox
            checked={stayLoggedIn}
            onIonChange={(e) => setStayLoggedIn(Boolean(e.detail.checked))}
          />

          <IonLabel>Stay logged in</IonLabel>
        </div>

        {err && <p className="signup-error">{err}</p>}

        <IonButton expand="block" onClick={signup} disabled={loading}>
          {loading ? "Creating Account..." : "Signup"}
        </IonButton>

        <IonButton
          expand="block"
          fill="clear"
          onClick={() => navigate("/login")}
        >
          I already have an account
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Signup;
