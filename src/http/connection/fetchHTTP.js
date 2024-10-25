import app from "@/config/app";
import { useAuth } from "@/stores/useAuth";

// Función para hacer una solicitud Fetch segura
const fetchSecure = async (url, options = {}) => {
  const auth = useAuth();

  if (auth.isAccessTokenExpired()) {
    // si el token expiro solicitar otro token
    await auth.refreshAccessToken();
  }

  // Añadir el token de autorización a los encabezados
  const accessToken = auth.getAuthState().access_token;
  const headers = {
    ...options.headers,
    "Authorization": `Bearer ${accessToken}`,
  };

  const response = await fetch(`${app.BASE_URL}${app.PREFIX_URL}${url}`, {
    ...options,
    headers,
  });

  return response
}

export { fetchSecure };

