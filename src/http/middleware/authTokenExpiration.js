import { useAuth } from "@/stores/useAuth";

const authTokenExpiration = (to, from, next) => {
  useAuth().isRefreshTokenExpired();
  // si no colocamos  next(), No dejara recargar la pagina
  next();
};

export default authTokenExpiration;
