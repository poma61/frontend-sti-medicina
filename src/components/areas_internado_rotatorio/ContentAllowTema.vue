<script setup>
import { toastError } from '@/composables/toastify';
import Tema from '@/http/api/Tema';
import { onMounted, ref, nextTick, onBeforeUnmount } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import app from '@/config/app';
import * as pdfjsLib from 'pdfjs-dist';
import PdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
import PDF from 'pdf-vue3';
// Configura el worker correctamente
pdfjsLib.GlobalWorkerOptions.workerSrc = PdfWorker;
pdfjsLib.GlobalWorkerOptions.useWorkerFetch = true; // Habilita la carga de fuentes estándar

const button_disable = ref(true)
const router = useRouter()
const route = useRoute()
const loading_tema_content = ref(false)
const pdfSource = ref("")
const currentPage = ref(1)
const scale = ref(1)
const totalPages = ref(0)
const view_controls = ref(false)

// Función para asegurar que Todos los componentes DOM se hayan renderizado
const ensureDOMRendered = async () => {
  return new Promise((resolve) => {
    nextTick(() => {
      resolve()
    })
  })
}


const handleComplete = async () => {
  console.log("complete")
  let time_out
  await ensureDOMRendered()
  view_controls.value = true

  if (totalPages.value > 100) {
    time_out = 7000
  } else {
    time_out = 3000
  }

  setTimeout(() => {
    button_disable.value = false;
  }, time_out)
}

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
      pdfSource.value = app.BASE_URL + response.payload.archivo_pdf;
    } else {
      toastError(response.detail);
    }
  }, 200)
}


// Funciones de control
const zoomIn = () => {
  scale.value += 0.1
}

const zoomOut = () => {
  if (scale.value > 0.1) {
    scale.value -= 0.1
  }
}

const goToPreviousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const goToNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

// Manejo de eventos
const handlePageChange = (page) => {
  currentPage.value = page
}

const handlePdfInit = (pdf) => {
  totalPages.value = pdf.numPages;
}

onMounted(async () => {
  isRead()
})

</script>

<template>
  <div class="d-flex flex-wrap">
    <v-btn color="light-blue-accent-4" variant="elevated" class="ma-1" rounded @click="goBack">
      <v-icon icon="mdi-arrow-left"></v-icon>
      Volver
    </v-btn>
  </div>

  <v-card class="d-flex justify-space-around pa-1 flex-wrap" min-height="80vh">
    <v-overlay v-model="loading_tema_content" class="align-center justify-center" persistent contained>
      <div class="text-center">
        <v-progress-circular color="light-blue-accent-4" indeterminate size="100"></v-progress-circular>
        <p class="text-white text-h6">Cargando tema...</p>
      </div>
    </v-overlay>

    <v-tabs direction="vertical">
      <v-tab color="indigo-lighten-1">
        <v-icon icon="mdi-numeric-1-circle-outline" />
        Contenido
      </v-tab>

      <v-tab color="indigo-lighten-1">
        <v-icon icon="mdi-numeric-2-circle-outline" />
        Actividad
      </v-tab>

    </v-tabs>
    <div class="pdf_content">
      <div class="pdf" >
        <PDF :style="{ transform: `scale(${scale})`, transformOrigin: '0 0' }" :src="pdfSource" :page="currentPage" :showProgress="true" :progressColor="'#87ceeb'"
          @onPageChange="handlePageChange" @onProgress="handleProgress" @onPdfInit="handlePdfInit"
          @onComplete="handleComplete"  />
      </div>
      <div class="controls" v-if="view_controls">
        <v-btn @click="zoomIn" :disabled="button_disable" color="indigo-lighten-1">
          <v-icon icon="mdi-magnify-plus"></v-icon>
          Zoom
        </v-btn>
        <v-btn @click="zoomOut" :disabled="button_disable" color="indigo-lighten-1">
          <v-icon icon="mdi-magnify-minus"></v-icon>
          Zoom
        </v-btn>
        <v-btn @click="goToPreviousPage" :disabled="button_disable" color="indigo-lighten-1">
          <v-icon icon="mdi-arrow-left-thin-circle-outline"></v-icon>
          Anterior
        </v-btn>
        <v-btn @click="goToNextPage" :disabled="button_disable" color="indigo-lighten-1">
          Siguiente
          <v-icon icon="mdi-arrow-right-thin-circle-outline"></v-icon>
        </v-btn>
        <span>
          Página
          <v-chip color="success" label> {{ currentPage }} </v-chip>
          de
          <v-chip color="success" label> {{ totalPages }}</v-chip>
        </span>

      </div>
    </div>



  </v-card>
</template>

<style scoped>
.controls {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  flex-wrap: wrap;
  gap: 5px;
}

.pdf {
  border: 2px solid #8d8d8d71;
  overflow-y: hidden;
  overflow-x: auto;
  height: 80vh;
}
.pdf_content {
  min-width: 70%;
}
</style>
