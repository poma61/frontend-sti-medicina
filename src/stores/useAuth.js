import { defineStore } from "pinia";
import axios from "@/http/connection/axiosHTTP";
import { ref } from "vue";

export const useAuth = defineStore("useAuth", () => {
  const auth = ref({
    state: false,
    access_token: "",
    access_token_expiration: 0,
  });

  const initializeAuthState = () => {
    if (
      localStorage.getItem("sessionAuth") == null ||
      localStorage.getItem("sessionAuth") == undefined
    ) {
      localStorage.setItem("sessionAuth", JSON.stringify(auth.value));
    }
  };
  initializeAuthState();

  const setAuthState = (is_auth) => {
    auth.value.state = is_auth.state;
    auth.value.access_token = is_auth.access_token;
    auth.value.access_token_expiration = is_auth.access_token_expiration;

    localStorage.setItem("sessionAuth", JSON.stringify(auth.value));
  };
  const getAuthState = () => {
    return JSON.parse(localStorage.getItem("sessionAuth"));
  };

  const loginUser = async (is_user, is_password) => {
    try {
      const resolve = await axios.post("auth/login/", {
        user: is_user,
        password: is_password,
      });

      if (resolve.data.api_status == true) {
        setAuthState({
          state: true,
          access_token: resolve.data.access_auth.access_token,
          access_token_expiration:
            resolve.data.access_auth.access_token_expiration,
        });
      }

      return resolve.data;
    } catch (error) {
      if (error.response == undefined || error.response.data == undefined) {
        console.error(error);
        return { api_status: false, detail: error + "" };
      }
      return error.response.data;
    }
  };

  const userData = async () => {
    try {
      const resolve = await axios.post("auth/me/");
      return resolve.data;
    } catch (error) {
      if (error.response == undefined || error.response.data == undefined) {
        console.error(error);
        return { api_status: false, detail: error + "" };
      }
      return error.response.data;
    }
  };

  const hasRole = (roles) => {
    // Verifica si el valor de getAuthState().role se encuentra en el array roles
    //devuelve true si el valor getAuthState().role esta en el array roles;
    // return roles.includes(getAuthState().role);
    return true;
  };

  const updateCredentials = async (credentials) => {
    try {
      const response = await axios.post("auth/actualizar-credenciales/", {
        ...credentials,
      });
      return response.data;
    } catch (error) {
      if (error.response == undefined || error.response.data == undefined) {
        console.error(error);
        return { api_status: false, detail: error + "" };
      }
      return error.response.data;
    }
  };

  const logoutUser = async () => {
    try {
      const response = await axios.post("auth/logout/");
      if (response.data.api_status) {
        setAuthState({
          state: false,
          access_token: "",
          access_token_expiration: 0,
        });
      }
      return response.data;
    } catch (error) {
      if (error.response == undefined || error.response.data == undefined) {
        console.error(error);
        return { api_status: false, detail: error + "" };
      }
      return error.response.data;
    }
  };

  const verifyTokenExpiration = () => {
    const current_time_in_seconds = Math.floor(Date.now() / 1000); // Devuelve tiempo unix en milisegundos, por eso convertimos a segundos
    if (
      isAuthenticated() &&
      current_time_in_seconds >= getAuthState().access_token_expiration
    ) {
      setAuthState({
        state: false,
        access_token: "",
        access_token_expiration: 0,
      });
    }
  };

  const isAuthenticated = () => {
    return getAuthState().state;
  };
  return {
    getAuthState,
    loginUser,
    userData,
    hasRole,
    updateCredentials,
    logoutUser,
    verifyTokenExpiration,
    isAuthenticated,
  };
});