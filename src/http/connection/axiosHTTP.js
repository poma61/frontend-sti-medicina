import axios from "axios";
import app from "@/config/app";
import { useAuth } from "@/stores/useAuthenticateStore";

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

