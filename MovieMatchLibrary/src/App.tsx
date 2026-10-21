import React from "react";
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
import { home, heart, star, person } from "ionicons/icons";
import { useAuth } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Logout from "./auth/Logout";

import Home from "./pages/Home";
import Details from "./pages/Details";
import Favorites from "./pages/Favorites";
import Matches from "./pages/Matches";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

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

setupIonicReact();

interface ProtectedRouteConfig {
  path: string;
  element: React.ReactElement;
  requiredRole?: "admin" | "user";
}

const protectedRoutes: ProtectedRouteConfig[] = [
  { path: "/home", element: <Home /> },
  { path: "/details", element: <Details /> },
  { path: "/favorites", element: <Favorites /> },
  { path: "/matches", element: <Matches /> },
  { path: "/profile", element: <Profile /> },
  { path: "/admin", element: <Admin />, requiredRole: "admin" },
];

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
            {protectedRoutes.map(({ path, element, requiredRole }) => (
              <Route
                key={path}
                path={path}
                element={
                  <ProtectedRoute requiredRole={requiredRole}>
                    {element}
                  </ProtectedRoute>
                }
              />
            ))}

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
