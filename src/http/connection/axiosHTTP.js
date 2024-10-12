import axios from "axios";
import app from "@/config/app";
import { useAuth } from "@/stores/useAuth";

const instance = axios.create({
  baseURL: app.BASE_URL + app.PREFIX_URL,
});

instance.interceptors.request.use(
  (config) => {

    if (useAuth().isAuthenticated()) {
      // Agregamos el token de autenticacion de jwt
      config.headers["Authorization"] = `Bearer ${useAuth().getAuthState().access_token}`;
    }
    return config;
  },
  (error) => {
    // Manejo de errores en la solicitud
    return Promise.reject(error);
  }
);

export default instance;
