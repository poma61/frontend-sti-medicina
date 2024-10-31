import { useAuth } from "@/stores/useAuthenticateStore";
const LOGIN = "n-login"

const authTokenExpiration = (to, from, next) => {
  if (useAuth().isRefreshTokenExpired()) {
    next({ name: LOGIN }); // Redirigir si el token ha expirado
  } else {
    next(); // Dejar pasar si no ha expirado
  }
}

export default authTokenExpiration


