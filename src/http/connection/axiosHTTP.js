import axios from "axios";
import app from "@/config/app";
import { useAuth } from "@/stores/useAuth";

const axiosSecure = axios.create({
  baseURL: app.BASE_URL + app.PREFIX_URL,
});
const axiosPublic = axios.create({
  baseURL: app.BASE_URL + app.PREFIX_URL,
});

// Interceptor de solicitud
axiosSecure.interceptors.request.use(
  async (config) => {
    const auth = useAuth()
    // si acces token expiro obtenemos nuevo token
    if (auth.isAccessTokenExpired()) {
      await auth.refreshAccessToken()
    }
    config.headers["Authorization"] = `Bearer ${auth.getAuthState().access_token}`;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
)

export { axiosSecure, axiosPublic }

// // Interceptor de respuesta
// axiosSecure.interceptors.response.use(
//   (response) => {
//     // Si la respuesta es exitosa, simplemente retornamos la respuesta
//     return response;
//   },
//   async (error) => {
//     const original_request = error.config;
//     if (error.response.status === 401 && !original_request._retry) {

//       original_request._retry = true; // Marcar la solicitud original como reintentada

//       // Intentar renovar el token de acceso
//       const refresh_token_response = await useAuth().refreshAccessToken();
//       // Si la renovación fue exitosa
//       if (refresh_token_response.api_status) {
//         // Añadir el nuevo token de acceso a la solicitud original
//         //useAuth().getAuthState().access_token => se actualiza en useAuth de forma automatica
//         original_request.headers["Authorization"] = `Bearer ${useAuth().getAuthState().access_token}`;
//         // Reintentar la solicitud original
//         return instance(original_request);
//       }
//     }
//     // Si hay un error diferente a 401 o falla la renovación, rechazamos la promesa
//     return Promise.reject(error);
//   }
// )


