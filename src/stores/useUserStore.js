import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useAuth } from "@/stores/useAuth";
import { toastError } from "@/composables/toastify";

export const useUserStore = defineStore('user', () => {
  const user = ref({
    nombres: "",
    apellido_paterno: "",
    apellido_materno: "",
    picture: "",
  })

  // Devuelve tiempo unix en milisegundos, por eso convertimos a segundos
  const is_data_auth = ref(false)

  // Método para obtener datos del usuario
  const userAuthData = async () => {
    if (is_data_auth.value) {
      return // No hacer la solicitud si ya se han solicitado los datos
    }

    const auth = useAuth()
    const response = await auth.userData()

    if (response.api_status) {
      user.value = response.payload;
      is_data_auth.value = true // Marcar como que los datos han sido solicitados
    } else {
      toastError(response.detail)
    }
  }

  const resetUserAuthData = () => {
    user.value = {
      nombres: "",
      apellido_paterno: "",
      apellido_materno: "",
      picture: "",
    }
    is_data_auth.value = false
  }

  return { user, userAuthData, resetUserAuthData };
})
