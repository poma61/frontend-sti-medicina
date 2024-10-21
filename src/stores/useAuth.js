import { defineStore } from "pinia";
import { axiosSecure, axiosPublic } from "@/http/connection/axiosHTTP";
import { ref } from "vue";

export const useAuth = defineStore("useAuth", () => {
  const auth = ref({
    state: false,
    access_token: "",
    refresh_token: "",
    access_token_expiration: 0,
    refresh_token_expiration: 0,
  });

  const initializeAuthState = () => {
    if (localStorage.getItem("sessionAuth") == null || localStorage.getItem("sessionAuth") == undefined) {
      localStorage.setItem("sessionAuth", JSON.stringify(auth.value));
    }

  }
  initializeAuthState();

  const setAuthState = (is_auth) => {
    auth.value.state = is_auth.state
    auth.value.access_token = is_auth.access_token
    auth.value.refresh_token = is_auth.refresh_token
    auth.value.access_token_expiration = is_auth.access_token_expiration
    auth.value.refresh_token_expiration = is_auth.refresh_token_expiration

    localStorage.setItem("sessionAuth", JSON.stringify(auth.value));
  }
  const getAuthState = () => {
    return JSON.parse(localStorage.getItem("sessionAuth"));
  }

  const loginUser = async (is_user, is_password) => {
    try {
      const resolve = await axiosPublic.post("auth/login/", {
        user: is_user,
        password: is_password,
      })

      if (resolve.data.api_status) {
        setAuthState({
          state: true,
          access_token: resolve.data.access_token,
          refresh_token: resolve.data.refresh_token,
          access_token_expiration: resolve.data.access_token_expiration,
          refresh_token_expiration: resolve.data.refresh_token_expiration,
        });
      }

      return resolve.data;
    } catch (error) {
      if (error.response == undefined || error.response.data == undefined) {
        return { api_status: false, detail: error + "" }
      }
      return error.response.data
    }
  }

  const refreshAccessToken = async () => {
    try {
      const is_refresh_token = getAuthState().refresh_token
      const is_refresh_token_expiration = getAuthState().refresh_token_expiration
      if (!is_refresh_token) {
        return { api_status: false, detail: "No hay token de actualización disponible." }
      }
      const resolve = await axiosPublic.post("auth/token/refresh/", {
        refresh: is_refresh_token,
      })

      if (resolve.data.api_status) {
        setAuthState({
          state: true,
          access_token: resolve.data.new_access_token,
          refresh_token: is_refresh_token,  // Mantener el refresh token
          access_token_expiration: resolve.data.access_token_expiration,
          refresh_token_expiration: is_refresh_token_expiration,// Mantener el refresh token expiration
        });
      }
      return resolve.data;
    } catch (error) {
      if (error.response == undefined || error.response.data == undefined) {
        return { api_status: false, detail: error + "" };
      }
      return error.response.data;
    }
  }

  const userData = async () => {
    try {
      const resolve = await axiosSecure.post("auth/me/");
      return resolve.data
    } catch (error) {
      if (error.response == undefined || error.response.data == undefined) {
        return { api_status: false, detail: error + "" }
      }
      return error.response.data
    }
  }

  const hasRole = (roles) => {
    // Verifica si el valor de getAuthState().role se encuentra en el array roles
    //devuelve true si el valor getAuthState().role esta en el array roles;
    // return roles.includes(getAuthState().role);
    return true;
  }

  const updateAuthUserData = async (user_auth_data) => {
    try {
      const config = {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data'// de esta forma podemos enviar imagenes
        }
      }
      const response = await axiosSecure.post("auth/user-update/", {
        ...user_auth_data,
      }, config);
      return response.data;
    } catch (error) {
      if (error.response == undefined || error.response.data == undefined) {
        return { api_status: false, detail: error + "" };
      }
      return error.response.data;
    }
  }

  const logoutUser = async () => {
    try {
      const response = await axiosSecure.post("auth/logout/", {
        refresh_token: getAuthState().refresh_token
      });
      if (response.data.api_status) {
        setAuthState({
          state: false,
          access_token: "",
          refresh_token: "",
          access_token_expiration: 0,
          refresh_token_expiration: 0,
        });
      }
      return response.data;
    } catch (error) {
      if (error.response == undefined || error.response.data == undefined) {
        return { api_status: false, detail: error + "" };
      }
      // tenemos un error 401 posiblente el usuario ya se haya eliminado o este inactivo
      if (error.response.status === 401) {
        setAuthState({
          state: false,
          access_token: "",
          refresh_token: "",
          access_token_expiration: 0,
          refresh_token_expiration: 0,
        });
        return { api_status: true, detail: "" };
      }
      return error.response.data;
    }
  }

  const isRefreshTokenExpired = () => {
    const current_time_in_seconds = Math.floor(Date.now() / 1000); // Devuelve tiempo unix en milisegundos, por eso convertimos a segundos
    if (isAuthenticated() && current_time_in_seconds >= getAuthState().refresh_token_expiration) {
      setAuthState({
        state: false,
        access_token: "",
        refresh_token: "",
        access_token_expiration: 0,
        refresh_token_expiration: 0,
      });
      return true
    } else {
      return false
    }
  }

  const isAccessTokenExpired = () => {
    const current_time_in_seconds = Math.floor(Date.now() / 1000); // Devuelve tiempo unix en milisegundos, por eso convertimos a segundos
    if (isAuthenticated() && current_time_in_seconds >= getAuthState().access_token_expiration) {
      return true;
    } else {
      return false;
    }
  }

  const isAuthenticated = () => {
    return getAuthState().state
  }
  return {
    getAuthState,
    loginUser,
    userData,
    hasRole,
    updateAuthUserData,
    logoutUser,
    isRefreshTokenExpired,
    isAccessTokenExpired,
    isAuthenticated,
    refreshAccessToken,
  }
})
