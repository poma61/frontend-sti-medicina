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
  });

  const is_data_auth = ref(false); // Estado para saber si los datos ya fueron solicitados

  // Método para obtener datos del usuario
  const userAuthData = async () => {
    if (is_data_auth.value){
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

  return { user, userAuthData };
})
