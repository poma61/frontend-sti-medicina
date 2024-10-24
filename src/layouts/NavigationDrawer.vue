<script setup>
import AppBar from "@/layouts/AppBar.vue";
import { ref, onMounted } from "vue";
import { useUserStore } from "@/stores/useUserStore"; // Importar la nueva store
import { useRoute } from "vue-router";
import app from "@/config/app";
import logo from "@/assets/images/logo-medicina.png";

const route = useRoute(); // Contiene informacion sobre la ruta actual
const open = ref([])

const userStore = useUserStore();

//data
const drawer = ref(true);
//methods
const byHiddenNavigationDrawer = () => {
  drawer.value = !drawer.value
}

// Obtener datos del usuario al montar el componente
onMounted(() => {
  userStore.userAuthData()
})
</script>


<template>

  <v-navigation-drawer v-model="drawer" app class="as-navigation-drawer">
    <div class="d-flex flex-column justify-center align-center">
      <v-list-item :prepend-avatar="logo" title="InternAI Tutor" nav>
      </v-list-item>
    </div>
    <v-divider></v-divider>

    <v-list nav>
      <div class="d-flex flex-column justify-center align-center my-2">
        <v-avatar :image="app.BASE_URL + userStore.user.picture" size="80"></v-avatar>
        <p class="text-subtitle-1">
          {{
            `${userStore.user.nombres} ${userStore.user.apellido_paterno} ${userStore.user.apellido_materno}`
          }}
        </p>
      </div>
      <!-- Panel de inicio -->
      <v-divider class="border-opacity-25 my-2"></v-divider>
      <p class="text-subtitle-2 font-weight-bold">PANEL</p>

      <v-list-item prepend-icon="mdi-view-dashboard" title="Inicio" value="Inicio" :to="{ name: 'n-home' }"
        :class="{ 'v-list-item--active': route.name == 'n-home' }" />

      <!-- Estudio, areas del internado rotatorio y bibloteca medica -->
      <v-divider class="border-opacity-25 my-2"></v-divider>
      <p class="text-subtitle-2 font-weight-bold">ESTUDIO</p>


      <v-list-group value="Areas">

        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" title="Areas I.R." prepend-icon="mdi-library-outline" />
        </template>
        <v-list-item prepend-icon="mdi-numeric-1-circle-outline" title="Medicina Interna" value="MedicinaInterna"
          :to="{ name: 'n-ir-medicina-interna' }"
          :class="{ 'v-list-item--active': route.name == 'n-ir-medicina-interna' || route.name == 'n-view-tema' }" />

        <v-list-item prepend-icon="mdi-numeric-2-circle-outline" title="Cirurgía" value="Cirurgia" />

        <v-list-item prepend-icon="mdi-numeric-3-circle-outline" title="Pediatria" value="Pediatria" />

        <v-list-item prepend-icon="mdi-numeric-4-circle-outline" title="Ginecologia Obs."
          value="GinecologiaObstetricia" />
        <v-list-item prepend-icon="mdi-numeric-5-circle-outline" title="Salud Pública" value="SaludPublica" />

      </v-list-group>

      <v-list-item prepend-icon="mdi-bookmark-box-multiple" title="Biblioteca médica" value="BibliotecaMedica" />

      <v-list-item prepend-icon="mdi-message-processing" title="TutorAI" value="TutorAI" :to="{ name: 'n-tutorai' }"
        :class="{ 'v-list-item--active': route.name == 'n-tutorai' }" />

      <!-- parte administrativo -->
      <v-divider class="border-opacity-25 my-2"></v-divider>
      <p class="text-subtitle-2 font-weight-bold">ADMINISTRACION</p>
      <v-list-item prepend-icon="mdi-account-school" title="Estudiantes" value="Estudiantes"
        :to="{ name: 'n-estudiante' }" :class="{ 'v-list-item--active': route.name == 'n-estudiante' }" />

      <v-list-item prepend-icon="mdi-home-city-outline" title="Institucional" value="Institucional"
        :to="{ name: 'n-personal-institucional' }"
        :class="{ 'v-list-item--active': route.name == 'n-personal-institucional' }" />
    </v-list>

  </v-navigation-drawer>

  <AppBar @byHiddenNavigationDrawerEmit="byHiddenNavigationDrawer" :p_user="userStore.user" />
</template>
