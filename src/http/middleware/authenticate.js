import { useAuth } from "@/stores/useAuthenticateStore";

// Nombre de la ruta de login
const LOGIN = "n-login"

const authenticate = (to, from, next) => {
  const need_auth = to.matched.some((record) => record.meta.requireAuth);

  //verificar si requiere autenticacion 
  if (need_auth) {
    if (useAuth().isAuthenticated()) {
      // esta autenticado dejamos pasar
      next()
    } else {
      next({ name: LOGIN }) // si no esta autenticado redireccionamos
    }
  } else {
    next()
  }
}

export default authenticate

