import { useAuth } from "@/stores/useAuth";

// Nombre de la ruta de login
const LOGIN = "n-login";

const authenticate = (to, from, next) => {
  const need_auth = to.matched.some((record) => record.meta.requireAuth);

  //verificar si debemos verificar need_auth
  if (need_auth) {
    //SI necesita autenticacion
    if (useAuth().isAuthenticated()) {
      next();
     
    } else {
      next({ name: LOGIN }); // si no esta autenticado redireccionamos

    }
  }
  
  //verificar, 
  next();

};

export default authenticate;
