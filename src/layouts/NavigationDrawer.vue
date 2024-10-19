<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app class="as-navigation-drawer">
      <div class="d-flex flex-column justify-center align-center">
        <v-list-item :prepend-avatar="logo" title="InternAI Tutor" nav>
        </v-list-item>
      </div>
      <v-divider></v-divider>

      <v-list density="compact" nav>
        <div class="d-flex flex-column justify-center align-center my-2">
          <v-avatar :image="app.BASE_URL + user.picture" size="80"></v-avatar>
          <p class="text-subtitle-1">
            {{
              `${user.nombres} ${user.apellido_paterno} ${user.apellido_materno}`
            }}
          </p>
        </div>

        <v-divider class="border-opacity-25 my-2"></v-divider>
        <p class="text-subtitle-1 font-weight-bold">PANEL</p>

        <v-list-item prepend-icon="mdi-view-dashboard" title="Inicio" value="Inicio" :to="{ name: 'n-home' }"
          :class="{ 'v-list-item--active': route.name == 'n-home' }" />

        <v-divider class="border-opacity-25 my-2"></v-divider>
        <p class="text-subtitle-1 font-weight-bold">ADMINISTRACION</p>
        <v-list-item prepend-icon="mdi-account-school" title="Estudiantes" value="Estudiantes"
          :to="{ name: 'n-estudiante' }" :class="{ 'v-list-item--active': route.name == 'n-estudiante' }" />
        <v-list-item prepend-icon="mdi-home-city-outline" title="Institucional" value="Institucional" />
      </v-list>
    </v-navigation-drawer>

    <AppBar @byHiddenNavigationDrawerEmit="byHiddenNavigationDrawer" :p_user="user" />
    <v-main class="ma-3">
      <slot></slot>
    </v-main>
  </v-app>
</template>

<script setup>
import AppBar from "@/layouts/AppBar.vue";
import { ref, onMounted } from "vue";
import { useAuth } from "@/stores/useAuth";
import { toastError } from "@/composables/toastify";
import { useRoute } from "vue-router";

import app from "@/config/app";
import logo from "@/assets/images/logo-medicina.png";

const route = useRoute(); // Contiene informacion sobre la ruta actual

//data
const drawer = ref(true);
const user = ref({
  nombres: "",
  apellido_paterno: "",
  apellido_materno: "",
  picture: "",
});

//methods
const byHiddenNavigationDrawer = () => {
  drawer.value = !drawer.value;
};

const userAuthData = async () => {
  const auth = useAuth();
  const response = await auth.userData();
  if (response.api_status) {
    user.value = response.payload;
  } else {
    toastError(response.detail);
  }
};

onMounted(async () => {
  userAuthData();
});
</script>
