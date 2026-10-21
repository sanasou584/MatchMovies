import {
  IonButton,
  IonCheckbox,
  IonContent,
  IonInput,
  IonInputPasswordToggle,
  IonLabel,
  IonPage,
  IonIcon,
} from '@ionic/react';

import "./Login.css";
import { filmOutline } from "ionicons/icons";
import { handleLogin } from '../auth/userAuth';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [pswd, setPswd] = useState("");
  const [stayLoggedIn, setStayLoggedIn] = useState(true);
  const [err, setErr] = useState("");

  const navigate = useNavigate();

  const login = async () => {
    try {
      setErr("");
      await handleLogin(email, pswd, stayLoggedIn);
      navigate('/home');
    } catch (err: any) {
      setErr(err.message);
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen className="login-content">
        <div className="login-container">
          <div className="login-card">
            <div className="login-header">
              <IonIcon
                icon={filmOutline}
                className="login-logo"
              />
              <h1>MovieMatch</h1>
              <p>Welcome back! Sign in to continue.</p>
            </div>

            <div className="login-field">
              <label>Email Address</label>

              <IonInput
                className="login-input"
                type='email'
                placeholder="Enter your email"
                value={email}
                onIonInput={(e) => setEmail(e.detail.value ?? "")}
              />
            </div>

            <div className="login-field">
              <label>Password</label>

              <IonInput
                className="login-input"
                type='password'
                placeholder="Enter your password"
                value={pswd}
                onIonInput={(e) => setPswd(e.detail.value ?? "")}
              >
                <IonInputPasswordToggle slot='end' />
              </IonInput>
            </div>

            <div className="login-options">
              <IonCheckbox
                checked={stayLoggedIn}
                onIonChange={(e) => setStayLoggedIn(Boolean(e.detail.checked))}
              />

              <IonLabel>Stay logged in</IonLabel>
            </div>

            {err && <p className="login-error">{err}</p>}

            <IonButton
              expand="block"
              className="login-button"
              onClick={login}
            >
              Login
            </IonButton>

            <p className="signup-text">
              Don't have an account?
            </p>

            <IonButton
              expand="block"
              fill="outline"
              className="signup-button"
              onClick={() => navigate("/signup")}
            >
              Create New Account
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;