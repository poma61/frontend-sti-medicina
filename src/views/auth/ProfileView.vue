<script setup>
import BaseTemplate from '@/layouts/BaseTemplate.vue';
import app from "@/config/app";
import { useUser } from "@/stores/useAuthenticateStore";
import {  ref, computed } from "vue";
import { toastError, toastSuccess } from "@/composables/toastify";

//data
const loading_save = ref(false)
const update_auth_user_data = ref({
  email: "",
  user: "",
  password: "",
  new_password: "",
  confirm_new_password: "",
  picture: []
})
const form = ref(null)
const user_store = useUser()

const serializer_errors_validate = ref({});
const show_new_password = ref(false);
const show_old_password = ref(false);
const show_confirm_new_password = ref(false);
const src_view_picture = ref(null)

// ************ methods
const viewImage = () => {
  const archivo = update_auth_user_data.value.picture;

  if (archivo) {
    const reader = new FileReader()
    reader.readAsDataURL(archivo)
    reader.onload = (e) => {
      src_view_picture.value = e.target.result
    }
  }
}

const filterSpecialChars = (event) => {
  const value = event.target.value
  const filtered_value = value.replace(/[^A-Za-z0-9]/g, "") // Remueve caracteres especiales y espacios
  update_auth_user_data.value.user = filtered_value
}

const filterSpaces = (event, field) => {
  const value = event.target.value;
  const filtered_value = value.replace(/\s/g, ""); // Elimina todos los espacios
  if (field == "password") {
    update_auth_user_data.value.password = filtered_value;
  }
  if (field == "new_password") {
    update_auth_user_data.value.new_password = filtered_value;
  }
  if (field == "confirm_new_password") {
    update_auth_user_data.value.confirm_new_password = filtered_value;
  }
}

const updateAuthUser = () => {
  loading_save.value = true // deshabilitar los campos
  setTimeout(async () => {
    const user = useUser()
    const response = await user.updateUser(Object.assign({}, update_auth_user_data.value))
    loading_save.value = false //una vez procesado volvemos habilitar los campos
    if (response.api_status) {
      toastSuccess(response.detail)
      clear();
    } else {
      if (response.serializer_errors != undefined) {
        serializer_errors_validate.value = response.serializer_errors
      }
      toastError(response.detail)
    }
  }, 200)
}
const clear = () => {
  form.value.reset() // limpiar formulario evita que salten los rules
  serializer_errors_validate.value = {}
  update_auth_user_data.value.email = "",
    update_auth_user_data.value.user = "",
    update_auth_user_data.value.password = "",
    update_auth_user_data.value.new_password = "",
    update_auth_user_data.value.confirm_new_password = "",
    update_auth_user_data.value.picture = {}
}

const requiredRule = [
  (v) => !!v || "Campo requerido.",
]
//*********** computed
const showSerializerErrors = computed(() => {
  return function (property) {
    if (serializer_errors_validate.value[property]) {
      return serializer_errors_validate.value[property][0]
    }
    return ""
  }
})

const confirmPasswordRule = [
  (value) => !!value || "Campo requerido.",
  (value) => (value == update_auth_user_data.value.new_password) || "Las contraseñas no coinciden.",
]
// Cuando rules es un array debe ser computed
const passwordRules = [
  (v) => !!v || "Campo requerido.",
  (v) => (v && v.length >= 8) || "La contraseña debe tener al menos 8 caracteres.",
  (v) => /[A-Z]/.test(v) || "La contraseña debe contener al menos una mayúscula.",
  (v) => /\d/.test(v) || "La contraseña debe contener al menos un número.",
  (v) => /[@$!%*?&]/.test(v) || "La contraseña debe contener al menos un carácter especial.",
]

// Validaciones para la imagen
const imageRules = [
  value => {
    return !value || !value.length || (value[0].size < 2 * 1024 * 1024) || 'El tamaño de la imagen debe ser inferior a 2 MB.'
  },
]

// Validaciones para el email
const emailRules = [
  (v) => !!v || "Campo requerido.",
  (v) => v.includes("@") || "El correo electrónico debe contener '@'.",
  (v) => {
    // Validar las extensiones del correo electrónico en esta función
    const valid_extensions = [".com", ".net", ".bo", ".org", ".info", ".edu"]
    return (valid_extensions.some((end) => v.endsWith(end)) || "El email debe terminar con .com, .net, .bo, .org, .info, .edu.")
  },
]

</script>

<template>
  <BaseTemplate>
    <v-card>
      <h1 class="text-h6 my-3 pa-1 bg-teal-accent-4 as-box-shadow">
        <v-icon icon="mdi-account-eye" start></v-icon>
        Perfil de usuario
      </h1>
      <v-card min-height="85vh" elevation="15">
        <v-card-text class="as-flex-profile">
          <v-table density="compact" class="as-item-profile">
            <tbody>
              <tr>
                <td colspan="2">
                  <div class="text-center ma-2">
                    <v-avatar v-if="src_view_picture == null || src_view_picture == undefined"
                      :image="app.BASE_URL + user_store.user.picture" size="200" />
                    <v-avatar v-else :image="src_view_picture" size="200" />
                  </div>
                </td>
              </tr>
              <tr>
                <td colspan="2" class="text-center text-h6">Datos generales</td>
              </tr>
              <tr>
                <th>Nombres:</th>
                <td>{{ user_store.user.nombres }}</td>
              </tr>

              <tr>
                <th>Apellido paterno:</th>
                <td>{{ user_store.user.apellido_paterno }}</td>
              </tr>

              <tr>
                <th>Apellido materno:</th>
                <td>{{ user_store.user.apellido_materno }}</td>
              </tr>
              <tr>
                <th>CI.:</th>
                <td>{{ user_store.user.ci }} {{ user_store.user.ci_expedido }}</td>
              </tr>
              <tr>
                <th>N° de contacto:</th>
                <td v-if="user_store.user.numero_contacto != null">
                  {{ user_store.user.numero_contacto }}
                </td>
                <td v-else class="text-warning">Sin numero de contacto!</td>
              </tr>
            </tbody>
          </v-table>

          <v-form ref="form" @submit.prevent="updateAuthUser" class="as-item-profile">
            <h6 class="text-h6 text-center my-2">Datos de usuario</h6>

            <v-text-field v-model="update_auth_user_data.email" :readonly="loading_save" class="mb-3" clearable
              prepend-inner-icon="mdi-email" label="Email" placeholder="Escriba su email..." color="blue-darken-3"
              :error-messages="showSerializerErrors('email')" :rules="emailRules" />

            <v-text-field v-model="update_auth_user_data.user" :readonly="loading_save" class="mb-3" clearable
              prepend-inner-icon="mdi-account" label="Usuario" placeholder="Escriba su usuario..." color="blue-darken-3"
              :error-messages="showSerializerErrors('user')" :rules="requiredRule"
              @input="filterSpecialChars($event)" />

            <v-text-field v-model="update_auth_user_data.password" class="mb-3" :readonly="loading_save"
              label="Contraseña actual" placeholder="Escriba su contraseña..." color="blue-darken-3"
              prepend-inner-icon="mdi-lock" :append-inner-icon="show_old_password ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show_old_password ? 'text' : 'password'" autocomplete="off"
              @click:append-inner="show_old_password = !show_old_password" :rules="requiredRule"
              :error-messages="showSerializerErrors('password')" @input="filterSpaces($event, 'password')" />

            <v-text-field v-model="update_auth_user_data.new_password" class="mb-3" :readonly="loading_save"
              prepend-inner-icon="mdi-lock" label="Nueva contraseña" placeholder="Escriba su contraseña..."
              color="blue-darken-3" :append-inner-icon="show_new_password ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show_new_password ? 'text' : 'password'" autocomplete="off"
              @click:append-inner="show_new_password = !show_new_password"
              :error-messages="showSerializerErrors('new_password')" :rules="passwordRules"
              @input="filterSpaces($event, 'new_password')" />

            <v-text-field v-model="update_auth_user_data.confirm_new_password" class="mb-3" :readonly="loading_save"
              prepend-inner-icon="mdi-lock" label="Confirmar contraseña" placeholder="Escriba su contraseña..."
              color="blue-darken-3" :append-inner-icon="show_confirm_new_password ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show_confirm_new_password ? 'text' : 'password'" autocomplete="off"
              @click:append-inner=" show_confirm_new_password = !show_confirm_new_password" :rules="confirmPasswordRule"
              :error-messages="showSerializerErrors('confirm_new_password')"
              @input="filterSpaces($event, 'confirm_new_password')" />

            <v-file-input v-model="update_auth_user_data.picture" accept="image/jpeg, image/jpg, image/png" class="mb-3"
              label="Foto" prepend-icon="mdi-camera" :error-messages="showSerializerErrors('picture')"
              :readonly="loading_save" @change="viewImage" :rules="imageRules" show-size />

            <div class="text-center">
              <v-btn :loading="loading_save" color="blue-darken-3" type="submit" variant="elevated">
                <v-icon icon="mdi-checkbox-marked" />&nbsp;Actualizar credenciales
              </v-btn>
            </div>
          </v-form>
        </v-card-text>

        <p class="ma-5 text-center">
          Para actualizar los datos nombres, apellidos y otros debe comunicarse
          con el administrador del sistema. En caso de que se olvido su contraseña
          debe comunicarse con el administrador del sistema para restablecer la
          contraseña y/o solicitar un nuevo usuario.
        </p>
      </v-card>

    </v-card>
  </BaseTemplate>
</template>

<style scoped>
.as-flex-profile {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.as-flex-profile .as-item-profile {
  width: 500px;
}

@media only screen and (max-width: 1200px) {
  .as-flex-profile .as-item-profile {
    width: 500px;
  }
}

@media only screen and (max-width: 700px) {
  .as-flex-profile .as-item-profile {
    width: 100%;
  }
}
</style>
