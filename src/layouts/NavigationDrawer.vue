<script setup>
import AppBar from "@/layouts/AppBar.vue"
import { ref, watchEffect } from "vue"
import { usePermission, useUser } from "@/stores/useAuthenticateStore";
import { useRoute } from "vue-router"
import app from "@/config/app"
import icono from "@/assets/images/icons/icono-medicina.png"
import { useNavigationDrawerStore } from "@/stores/useNavigationDrawerStore";

const route = useRoute() // Contiene informacion sobre la ruta actual
const open = ref(["Areas"])
const use_permission = usePermission()
const user_store = useUser()

const drawer_store = useNavigationDrawerStore()

// watchEffect(() => {
// Verifica si el dispositivo es móvil
//if (window.innerWidth <= 1000) {
// Cierra el drawer cuando cambia la ruta
// drawer_store.setNavigationDrawer(false)
//}
//})

</script>

<template>

  <v-navigation-drawer v-model="drawer_store.drawer" app class="as-navigation-drawer" width="270"
    mobile-breakpoint="md" @update:model-value="drawer_store.setNavigationDrawer($event)" >
    <div class="d-flex flex-column justify-center align-center">
      <v-list-item :prepend-avatar="icono" title="InternAI" nav>
      </v-list-item>
    </div>
    <v-divider></v-divider>

    <v-list nav>
      <div class="d-flex flex-column justify-center align-center my-2">
        <v-avatar :image="app.BASE_URL + user_store.user.picture" size="80"></v-avatar>
        <p class="text-subtitle-1">
          {{
            `${user_store.user.nombres} ${user_store.user.apellido_paterno} ${user_store.user.apellido_materno}`
          }}
        </p>
      </div>
      <!-- Panel de inicio -->
      <v-divider class="border-opacity-25 my-2"></v-divider>
      <p class="text-subtitle-2 font-weight-bold">PANEL</p>

      <v-list-item prepend-icon="mdi-view-dashboard" title="Inicio" value="Inicio" :to="{ name: 'n-home' }" />

      <!-- Estudio, areas del internado rotatorio y bibloteca medica -->
      <v-divider class="border-opacity-25 my-2"></v-divider>
      <p class="text-subtitle-2 font-weight-bold">ESTUDIO</p>

      <v-list v-model:opened="open" nav class="pa-0 ma-0">
        <v-list-group value="Areas">

          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" title="Internado Rotatorio" prepend-icon="mdi-library-outline" />
          </template>
          <v-list-item prepend-icon="mdi-numeric-1-circle-outline" title="Medicina Interna" value="MedicinaInterna"
            :to="{ name: 'n-ir-medicina-interna' }"
            :class="{ 'v-list-item--active': route.params.area == 'medicina-interna' }" />

          <v-list-item prepend-icon="mdi-numeric-2-circle-outline" title="Cirugía" value="Cirugia"
            :to="{ name: 'n-ir-cirugia' }" :class="{ 'v-list-item--active': route.params.area == 'cirugia' }" />

          <v-list-item prepend-icon="mdi-numeric-3-circle-outline" title="Pediatria" value="Pediatria"
            :to="{ name: 'n-ir-pediatria' }" :class="{ 'v-list-item--active': route.params.area == 'pediatria' }" />

          <v-list-item prepend-icon="mdi-numeric-4-circle-outline" title="Ginecologia Obs."
            value="GinecologiaObstetricia" :to="{ name: 'n-ir-ginecologia-obstetricia' }"
            :class="{ 'v-list-item--active': route.params.area == 'ginecologia-obstetricia' }" />

          <v-list-item prepend-icon="mdi-numeric-5-circle-outline" title="Salud Pública" value="SaludPublica"
            :to="{ name: 'n-ir-salud-publica' }"
            :class="{ 'v-list-item--active': route.params.area == 'salud-publica' }" />

        </v-list-group>
      </v-list>

      <v-list-item prepend-icon="mdi-progress-clock" title="Pogreso de estudio" value="PogresoDeEstudio"
        v-if="user_store.user.user_type == 'estudiante'" :to="{ name: 'n-progreso-estudio' }" />

      <v-list-item prepend-icon="mdi-doctor" title="TutorAI" value="TutorAI" :to="{ name: 'n-tutorai' }" />

      <!-- parte administrativo -->
      <v-divider class="border-opacity-25 my-2"></v-divider>
      <p class="text-subtitle-2 font-weight-bold"
        v-if="use_permission.hasPermission(['data_view_students', 'data_view_institutional_staff'])">
        ADMINISTRACION
      </p>
      <v-list-item v-if="use_permission.hasPermission(['data_view_students'])" prepend-icon="mdi-account-school"
        title="Estudiantes" value="Estudiantes" :to="{ name: 'n-estudiante' }" />

      <v-list-item v-if="use_permission.hasPermission(['data_view_institutional_staff'])"
        prepend-icon="mdi-home-city-outline" title="Institucional" value="Institucional"
        :to="{ name: 'n-personal-institucional' }" />
    </v-list>

  </v-navigation-drawer>

  <AppBar :p_user="user_store.user" />
</template>
