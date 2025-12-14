import { useKeycloak } from "@react-keycloak/web";
import { useNavigate } from "react-router-dom";

// ==================== Sign in ====================
export const useLogin = () => {
  const { keycloak, initialized } = useKeycloak();

  const login = () => {
    if (!initialized) {
      console.warn("[Login] Keycloak not initialized yet");
      return;
    }

    keycloak
      .login()
      .then(() => {
        console.log("[Login Success] User authenticated");
      })
      .catch((error) => {
        console.error("[Login Failed]", error);
      });
  };

  return login;
};

// ==================== Sign out ====================
export const useLogout = () => {
  const { keycloak, initialized } = useKeycloak();
  const navigate = useNavigate();

  const logout = () => {
    if (!initialized) {
      console.warn("[Logout] Keycloak not initialized yet");
      return;
    }

    keycloak
      .logout()
      .then(() => {
        console.log("[Logout Success] User logged out");
        navigate("/login");
      })
      .catch((error) => {
        console.error("[Logout Failed]", error);
      });
  };

  return logout;
};

// ==================== Authentication status ====================
const useAuth = () => {
  const { keycloak, initialized } = useKeycloak();

  return {
    isAuthenticated: initialized && keycloak.authenticated,
    isLoading: !initialized,
    user: keycloak.authenticated
      ? {
          username: keycloak.tokenParsed?.preferred_username,
          email: keycloak.tokenParsed?.email,
          id: keycloak.tokenParsed?.sub,
        }
      : null,
    keycloak,
    initialized,
  };
};

export default useAuth;
