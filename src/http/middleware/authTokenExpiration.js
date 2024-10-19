import { useAuth } from "@/stores/useAuth";

const authTokenExpiration = (to, from, next) => {
  const LOGIN = "n-login";

  if (useAuth().isRefreshTokenExpired()) {
    next({ name: LOGIN }); // Redirigir si el token ha expirado
  } else {
    next(); // Dejar pasar si no ha expirado
  }
}

export default authTokenExpiration


