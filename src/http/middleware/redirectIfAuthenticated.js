import { useAuth } from "@/stores/useAuth";
const HOME = "n-home";

const redirectIfAuthenticated = (to, from, next) => {
  
  //Si es la ruta de login  y el SI usuario esta autenticado, redirige a la pagina principal
  if (useAuth().isAuthenticated() && to.path == "/") {
    next({ name: HOME });
  } else {
    // El usuario esta en la ruta "/", y NO esta autenticado dejar cargar la pagina login
    // si no colocamos next() no dejara cargar la ruta "/", y la pagina estara en blanco
    next();
  }
};

export default redirectIfAuthenticated;
