<script setup>
import { toastError } from '@/composables/toastify'
import Tema from '@/http/api/Tema'
import { onBeforeMount, onBeforeUnmount, ref, shallowRef, } from 'vue'
import { useRouter, useRoute } from 'vue-router';
import app from '@/config/app'
import EstudiarTema from '@/components/internado_rotatorio/temas/EstudiarTema.vue';
import ActividadGenerarCuestionarioTema from "@/components/internado_rotatorio/temas/ActividadGenerarCuestionarioTema.vue"
import { useTimerStore } from '@/stores/useTimerStore';

const router = useRouter()
const route = useRoute()
const loading_tema_content = ref(false)
// inicializamos para evitar errores
const item_tema = ref({ ... new Tema().collectPayload() })
const is_component = shallowRef(EstudiarTema)
const timer_store = useTimerStore()
const area = ref(route.params.area)
const area_parsed = ref("")
// Reemplazar guiones por espacios y capitalizar la primera letra de cada palabra
area_parsed.value = area.value
  .replace(/-/g, ' ') // Reemplaza guiones por espacios
  .split(' ') // Divide la cadena en palabras
  .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitaliza cada palabra
  .join(' ') // Une las palabras con un espacio

const goBack = () => {
  router.push({ name: `n-ir-${route.params.area}` })
}

const isRead = () => {
  loading_tema_content.value = true
  const params = route.params
  const data_tema = {
    area: {
      name: params.area,
    },
    uuid: params.uuid,
  }

  setTimeout(async () => {
    const tema = new Tema();
    tema.loadPayload({ ...data_tema })
    const response = await tema.read()
    if (response.api_status) {
      item_tema.value = response.payload
      item_tema.value.archivo_pdf = app.BASE_URL + response.payload.archivo_pdf
    } else {
      toastError(response.detail);
    }
    loading_tema_content.value = false

  }, 200)
}

const handleComponent = (component) => {
  is_component.value = component
}

onBeforeMount(async () => {
  //iniciar temporizador
  timer_store.startTimer()
  isRead()
})

onBeforeUnmount(() => {
  //detener temporizador
  timer_store.stopTimer()
})
</script>

<template>
  <v-btn color="light-blue-accent-4" variant="elevated" class="ma-1" rounded @click="goBack">
    <v-icon icon="mdi-arrow-left" start></v-icon>
    Volver
  </v-btn>

  <h1 class="text-h6 pa-1 my-3 as-box-shadow bg-secondary">
    <v-icon icon="mdi-arrow-right" start></v-icon>
    {{ area_parsed }}
  </h1>

  <v-card elevation="10">
    <v-card-title class="bg-secondary text-h6 text-center text-wrap py-2">
      Tema: {{ item_tema.title }}
    </v-card-title>

    <div class="d-flex justify-space-around pa-1 flex-wrap" min-height="80vh">
      <div class="flex-grow-1" style="width:300px">

        <v-chip label color="secondary" class="ma-2 pa-3 py-5 text-subtitle-1 font-weight-black">
          Tiempo: {{ timer_store.toTimer() }}
        </v-chip>
        <v-divider></v-divider>

        <p class="px-3 py-5 text-body-1 text-justify">
          {{ item_tema.description }}
        </p>
        <v-divider class="my-2"></v-divider>
        <v-tabs direction="vertical" color="indigo-lighten-1">
          <v-tab @click="handleComponent(EstudiarTema)">
            <v-icon icon="mdi-numeric-1-circle-outline" />
            Estudiar
          </v-tab>

          <v-tab @click="handleComponent(ActividadGenerarCuestionarioTema)">
            <v-icon icon="mdi-numeric-2-circle-outline" />
            Actividad
          </v-tab>
        </v-tabs>
      </div>
      <!-- Contenido de estudio, pdf y actividad -->
      <div class="flex-grow-1" style="width: 80%;">
        <component v-if="!loading_tema_content" :is="is_component" :p_item_tema="item_tema"
          :p_time="timer_store.toTimer()" />
      </div>

    </div>
  </v-card>

  <!-- Overlay para cargar mientras cargamos lor recursos del tema -->
  <v-overlay v-model="loading_tema_content" class="align-center justify-center" persistent>
    <div class="text-center">
      <v-progress-circular color="indigo-lighten-1" indeterminate size="100"></v-progress-circular>
      <p class="text-white text-h6">Cargando tema...</p>
    </div>
  </v-overlay>

</template>
