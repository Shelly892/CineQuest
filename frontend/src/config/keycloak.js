import Keycloak from "keycloak-js";
import { KEYCLOAK_URL, KEYCLOAK_REALM, KEYCLOAK_CLIENT_ID } from "./constants";

// ==================== Keycloak Configuration ====================
// Keycloak will automatically construct the authority URL as:
// {url}/realms/{realm} = http://localhost:8000/keycloak/realms/cinequest
const keycloakConfig = {
  url: KEYCLOAK_URL, // http://localhost:8000/keycloak
  realm: KEYCLOAK_REALM, // cinequest
  clientId: KEYCLOAK_CLIENT_ID, // cinequest-frontend-client
};

console.log("[Keycloak Config]", keycloakConfig);
console.log(
  "[Keycloak Authority]",
  `${keycloakConfig.url}/realms/${keycloakConfig.realm}`
);

// ==================== Initialize Keycloak ====================
const keycloak = new Keycloak(keycloakConfig);

export default keycloak;

// ==================== Keycloak Init Options ====================
export const keycloakInitOptions = {
  onLoad: "check-sso", // Check if user is already logged in
  // Disable iframe check completely to avoid X-Frame-Options errors
  checkLoginIframe: false,
  checkLoginIframeInterval: -1, // Completely disable iframe polling
  enableLogging: false, // Disable verbose logging
  pkceMethod: "S256", // Use PKCE for better security
};
