<script setup>
import { toastError } from '@/composables/toastify'
import Tema from '@/http/api/Tema'
import { onBeforeUnmount, onMounted, ref, } from 'vue'
import { useRouter, useRoute } from 'vue-router';
import app from '@/config/app'
import EstudiarTema from '@/components/areas_internado_rotatorio/temas/EstudiarTema.vue';
import ActividadGenerarCuestionarioTema from "@/components/areas_internado_rotatorio/temas/ActividadGenerarCuestionarioTema.vue"
import { useTimerStore } from '@/stores/useTimerStore';

// Usar el store de Pinia
const timerStore = useTimerStore();

const router = useRouter()
const route = useRoute()
const loading_tema_content = ref(false)
const item_tema = ref({})
const is_component = ref(EstudiarTema)
const component_props = ref({})
const goBack = () => {
  router.push({ name: 'n-ir-medicina-interna' });
}

const isRead = () => {
  loading_tema_content.value = true;
  const params = route.params;
  setTimeout(async () => {
    const tema = new Tema();
    tema.loadPayload({
      area: {
        name: params.area,
      },
      uuid: params.uuid,
    })
    const response = await tema.read();
    loading_tema_content.value = false;
    if (response.api_status) {
      item_tema.value = response.payload
      item_tema.value.archivo_pdf = app.BASE_URL + response.payload.archivo_pdf
      component_props.value = { p_pdf_source: item_tema.value.archivo_pdf }
    } else {
      toastError(response.detail);
    }
  }, 200)
}


const handleComponent = (component) => {
  if (component == EstudiarTema) {
    //enviamos props al componente  EstudiarTema
    component_props.value = { p_pdf_source: item_tema.value.archivo_pdf };
  } else if (component == ActividadGenerarCuestionarioTema) {
     //enviamos props al componente  ActividadGenerarCuestionarioTema
    component_props.value = {
      p_item_tema: item_tema.value
    }
  }
  is_component.value = component
}

onMounted(async () => {
  //iniciar temporizador
  timerStore.startTimer()
  isRead()

})

onBeforeUnmount(() => {
  //detener temporizador
  timerStore.stopTimer()
})

</script>

<template>
  <v-btn color="light-blue-accent-4" variant="elevated" class="ma-1" rounded @click="goBack">
    <v-icon icon="mdi-arrow-left" start></v-icon>
    Volver
  </v-btn>

  <v-card elevation="10">
    <v-card-title class="bg-secondary text-h6 text-center text-wrap py-2">
      Tema: {{ item_tema.title }}
    </v-card-title>
    <!-- Overlay para cargar mientras cargamos lor recursos del tema -->
    <v-overlay v-model="loading_tema_content" class="align-center justify-center" persistent contained>
      <div class="text-center">
        <v-progress-circular color="indigo-lighten-1" indeterminate size="100"></v-progress-circular>
        <p class="text-white text-h6">Cargando tema...</p>
      </div>
    </v-overlay>

    <div class="d-flex justify-space-around pa-1 flex-wrap" min-height="80vh">
      <div class="flex-grow-1" style="width:300px">

        <v-chip label color="secondary" class="ma-2 pa-3 py-5 text-subtitle-1 font-weight-black">
          Tiempo: {{ timerStore.formatTime() }}
        </v-chip>
        <v-divider ></v-divider>

        <p class="px-3 py-5 text-body-1 text-justify">
          {{ item_tema.description }}
        </p>
        <v-divider class="my-2" ></v-divider> 
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
        <component :is="is_component" v-bind="component_props" />
      </div>

    </div>
  </v-card>
</template>
