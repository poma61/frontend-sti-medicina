import { useAuth } from "@/stores/useAuth";

const authVerifyTokenExpiration = (to, from, next) => {
  useAuth().verifyTokenExpiration();
  // si no colocamos  next(), No dejara recargar la pagina
  next();
};

export default authVerifyTokenExpiration;
