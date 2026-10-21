import { Navigate, Route } from "react-router-dom";
import {
  IonApp,
  IonIcon,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import Home from "./pages/Home";
import Details from "./pages/Details";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Admin from "./pages/Admin";
import { ProtectedRoute } from "./pages/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

/* Core & Basic CSS */
import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";
import "@ionic/react/css/palettes/dark.system.css";
import "./theme/variables.css";

import { home, heart, star, person } from "ionicons/icons";
import Logout from "./auth/Logout";
import Profile from "./pages/Profile";
import Favorites from "./pages/Favorites";
import Matches from "./pages/Matches";

setupIonicReact();

const App: React.FC = () => {
  const { user, loading } = useAuth();


  if (loading) {
    return null;
  }

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/details"
              element={
                <ProtectedRoute>
                  <Details />
                </ProtectedRoute>
              }
            />

            <Route
              path="/favorites"
              element={
                <ProtectedRoute>
                  <Favorites />
                </ProtectedRoute>
              }
            />
            <Route
              path="/matches"
              element={
                <ProtectedRoute>
                  <Matches />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <Admin />
                </ProtectedRoute>
              }
            />

            <Route
              path="/login"
              element={!user ? <Login /> : <Navigate to="/home" replace />}
            />
            <Route
              path="/signup"
              element={!user ? <Signup /> : <Navigate to="/home" replace />}
            />

            <Route path="/logout" element={<Logout />} />

            <Route
              path="*"
              element={<Navigate to={user ? "/home" : "/login"} replace />}
            />
          </IonRouterOutlet>

          {user && (
            <IonTabBar slot="bottom">
              <IonTabButton tab="home" href="/home">
                <IonIcon icon={home} />
              </IonTabButton>

              <IonTabButton tab="favorites" href="/favorites">
                <IonIcon icon={heart} />
              </IonTabButton>

              <IonTabButton tab="matches" href="/matches">
                <IonIcon icon={star} />
              </IonTabButton>

              <IonTabButton tab="profile" href="/profile">
                <IonIcon icon={person} />
              </IonTabButton>
            </IonTabBar>
          )}
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;