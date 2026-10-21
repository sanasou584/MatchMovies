import React, { useState } from "react";
import {
  IonAvatar,
  IonButton,
  IonCheckbox,
  IonContent,
  IonIcon,
  IonInput,
  IonInputPasswordToggle,
  IonLabel,
  IonPage,
} from "@ionic/react";
import { Camera } from "@capacitor/camera";
import { cameraOutline } from "ionicons/icons";
import { useNavigate } from "react-router-dom";
import { handleSignup } from "../auth/userAuth";

const IsValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const HasUppercase = (str: string): boolean => /[A-Z]/.test(str);
const HasNumber = (str: string): boolean => /[0-9]/.test(str);
const HasSymbol = (str: string): boolean => /[^A-Za-z0-9]/.test(str);

const IsValidPassword = (pswd: string): boolean => {
  return (
    pswd.length >= 8 &&
    HasUppercase(pswd) &&
    HasNumber(pswd) &&
    HasSymbol(pswd)
  );
};

const IsValidName = (name: string): boolean => {
  return /^[A-Za-zÀ-ÿ\s'-]+$/.test(name) && name.trim().length >= 2;
};

const IsValidDOB = (dob: string): boolean => {
  if (!dob) return false;

  const date = new Date(dob);
  const today = new Date();

  return !isNaN(date.getTime()) && date <= today;
};

const GetAge = (dob: string): number => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();

  const m = today.getMonth() - birthDate.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};

const Signup: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [photo, setPhoto] = useState("");
  const [email, setEmail] = useState("");
  const [pswd, setPswd] = useState("");
  const [confPswd, setConfPswd] = useState("");
  const [stayLoggedIn, setStayLoggedIn] = useState(true);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const takePhoto = async () => {
    try {
      const { results } = await Camera.chooseFromGallery({
        quality: 60,
        targetWidth: 360,
        targetHeight: 360,
        limit: 1,
      });

      if (results.length > 0 && results[0].webPath) {
        setPhoto(results[0].webPath);
      }
    } catch (error: any) {
      console.log("Gallery dismissed or cancelled:", error);
    }
  };

  const validateSignup = (): boolean => {
    if (!photo) {
      setErr("Profile photo taken with the camera is required");
      return false;
    }

    if (!firstName.trim() || !lastName.trim()) {
      setErr("First and last name are required");
      return false;
    }

    if (!IsValidName(firstName) || !IsValidName(lastName)) {
      setErr("Names contain invalid characters");
      return false;
    }

    if (!IsValidEmail(email)) {
      setErr("Invalid email address");
      return false;
    }

    if (!IsValidPassword(pswd)) {
      setErr(
        "Password must be at least 8 characters and contain an uppercase letter, number, and symbol"
      );
      return false;
    }

    if (pswd !== confPswd) {
      setErr("Passwords do not match");
      return false;
    }

    if (!IsValidDOB(dob)) {
      setErr("Invalid date of birth");
      return false;
    }

    if (GetAge(dob) < 13) {
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
    } catch (error: any) {
      setErr(error.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen className="ion-padding">
        <div style={{ textAlign: "center", margin: "1.5rem 0 1rem" }}>
          <IonAvatar
            style={{
              width: "110px",
              height: "110px",
              margin: "0 auto 10px",
              border: "3px solid var(--ion-color-primary)",
            }}
          >
            {photo ? (
              <img src={photo} alt="Avatar Preview" />
            ) : (
              <div
                style={{
                  backgroundColor: "var(--ion-color-step-200)",
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "2.5rem",
                }}
              >
                👤
              </div>
            )}
          </IonAvatar>

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

        <div style={{ display: "flex", alignItems: "center", margin: "1rem 0" }}>
          <IonCheckbox
            checked={stayLoggedIn}
            onIonChange={(e) => setStayLoggedIn(Boolean(e.detail.checked))}
          />

          <IonLabel style={{ marginLeft: "8px" }}>
            Stay logged in
          </IonLabel>
        </div>

        {err && <p style={{ color: "var(--ion-color-danger)" }}>{err}</p>}

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