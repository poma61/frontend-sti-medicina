<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/stores/useAuth";
import logo from "@/assets/images/logo-medicina.png";
import { toastError } from "@/composables/toastify";

// otra forma de exportar imagenes
// const logo= new URL('@/assets/images/logo-medicina.png', import.meta.url).href

const user = ref("");
const password = ref("");
const loading = ref(false) // permite habilitar desabilitar los campos y la carga del btn
const router = useRouter() // Instancia del enrutador para navegar programaticamente
const show = ref(false)
//methods
const login = () => {
  loading.value = true;

  setTimeout(async () => {
    const auth = useAuth()
    const auth_success = await auth.loginUser(user.value, password.value);
    if (auth_success.api_status) {
      router.push("/home");
    } else {
      toastError(auth_success.detail)
    }
    loading.value = false
  }, 200)
}

const required = (value) => !!value || "Campo requerido.";

const filterSpecialChars = (event) => {
  const value = event.target.value;
  const filtered_value = value.replace(/[^A-Za-z0-9]/g, ""); // Remueve caracteres especiales y espacios
  user.value = filtered_value;
}

const filterSpaces = (event) => {
  const value = event.target.value;
  const filtered_value = value.replace(/\s/g, ""); // Elimina todos los espacios
  password.value = filtered_value;
}

// Computed para habilitar o deshabilitar el botón
const canSubmit = computed(() => {
  return user.value.length > 0 && password.value.length > 0;
})
</script>


<template>
  <div class="as-content">
    <div class="as-content-login">
      <h1 class="text-h5 pa-5 text-center is-title">InternAI Tutor</h1>
      <div class="as-login">
        <div class="info-content">
          <img :src="logo" />
          <p class="text-center px-4">Sistema Tutor Inteligente</p>
        </div>
        <v-form @submit.prevent="login" class="pa-10 as-form">
          <v-text-field prepend-inner-icon="mdi-account" v-model="user" :readonly="loading" :rules="[required]"
            class="mb-2" clearable label="Usuario" placeholder="Escriba su usuario..." color="light-blue-darken-3"
            @input="filterSpecialChars($event)"></v-text-field>

          <v-text-field prepend-inner-icon="mdi-lock-outline" v-model="password" :readonly="loading" :rules="[required]"
            label="Contraseña" placeholder="Escriba su contraseña..." color="light-blue-darken-3"
            :append-inner-icon="show ? 'mdi-eye' : 'mdi-eye-off'" :type="show ? 'text' : 'password'" autocomplete="off"
            @click:append-inner="show = !show" @input="filterSpaces($event)"></v-text-field>

          <v-btn :loading="loading" :disabled="!canSubmit" block color="light-blue-darken-3" size="large" type="submit"
            variant="elevated">
            <v-icon icon="mdi-arrow-right"></v-icon>
            &nbsp;Ingresar
          </v-btn>
        </v-form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.as-content {
  min-height: 100vh;
  background-image: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)),
    url(@/assets/images/login-background-2.jpg);
  background-size: cover;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.as-content-login {
  background-color: rgba(255, 255, 255, 0.805);
  width: 900px;
  min-height: 400px;
  border-radius: 20px;
}

.as-login {
  display: flex;
  justify-content: center;
  align-items: center;
}

.info-content {
  display: flex;
  justify-content: center;
  align-items: center;
  align-items: center;
  width: 100%;
  flex-direction: column;
}

.info-content img {
  width: 200px;
  height: 200px;
}

.as-form {
  width: 100%;
}

.is-title {
  border-bottom: 1px solid #9b9b9b9e;
  width: 95%;
  margin: 0px auto;
}

/* Para dispositivos con un ancho de pantalla máximo de 1000px */
@media only screen and (max-width: 1000px) {
  .as-content-login {
    width: 700px;
  }
}

/* Para dispositivos con un ancho de pantalla máximo de 800px */
@media only screen and (max-width: 800px) {
  .as-login {
    flex-direction: column;
  }

  .as-content-login {
    width: 500px;
  }
}

/* Para dispositivos con un ancho de pantalla máximo de 600px */
@media only screen and (max-width: 600px) {
  .as-login {
    flex-direction: column;
  }

  .info-content img {
    width: 150px;
    height: 150px;
  }

  .as-content-login {
    width: 400px;
  }
}

@media only screen and (max-width: 500px) {
  .as-login {
    flex-direction: column;
  }

  .as-content-login {
    width: 300px;
  }
}
</style>
