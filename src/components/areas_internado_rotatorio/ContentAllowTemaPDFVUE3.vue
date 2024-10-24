<script setup>
import { toastError } from '@/composables/toastify';
import Tema from '@/http/api/Tema';
import { onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import app from '@/config/app';

// Configura el worker correctamente
//pdfjsLib.GlobalWorkerOptions.workerSrc = PdfWorker;
//pdfjsLib.GlobalWorkerOptions.useWorkerFetch = true; // Habilita la carga de fuentes estándar


const router = useRouter();
const route = useRoute();
const loading_tema_content = ref(false);
const pdfSource = "http://192.168.0.200:8000/media/areas_internado_rotatorio/medicina_interna/Medicina-Interna-TomoI-4ed.pdf"


const goBack = () => {
  router.push({ name: 'n-ir-medicina-interna' });
};

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
    });
    const response = await tema.read();
    loading_tema_content.value = false;
    if (response.api_status) {
      const url = app.BASE_URL + response.payload.archivo_pdf;
    } else {
      toastError(response.detail);
    }
  }, 100);
}


onMounted(() => {
  isRead()
})
//************* */

import  PDF  from 'pdf-vue3';


// Estado de la página actual
const currentPage = ref(1);
const scale = ref(1);
const totalPages = ref(0); // Total de páginas
const loadRatio = ref(0); // Proporción de carga

// Funciones de control
const zoomIn = () => {
  scale.value += 0.1;
};

const zoomOut = () => {
  if (scale.value > 0.1) {
    scale.value -= 0.1;
  }
};

const goToPreviousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const goToNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};


// Manejo de eventos
const handlePageChange = (page) => {
  currentPage.value = page;
};

const handleProgress = (progress) => {
  loadRatio.value = progress.loadRatio; // Se espera que 'loadRatio' venga en el objeto de progreso
};

const handlePdfInit = (pdf) => {
  totalPages.value = pdf.numPages; // Total de páginas del documento PDF
  console.log("PDF inicializado:", pdf);
};

const handleComplete = () => {
  console.log("PDF cargado completamente");
};
</script>

<template>
  <div class="d-flex flex-wrap">
    <v-btn color="light-blue-accent-4" variant="elevated" class="ma-1" rounded @click="goBack">
      <v-icon icon="mdi-arrow-left"></v-icon>
      Volver
    </v-btn>
  </div>

  <v-card>
    <v-overlay v-model="loading_tema_content" class="align-center justify-center" persistent contained>
      <div class="text-center">
        <v-progress-circular color="light-blue-accent-4" indeterminate size="100"></v-progress-circular>
        <p class="text-white text-h6">Cargando tema...</p>
      </div>
    </v-overlay>

    <div>
    <div class="controls">
      <v-btn @click="zoomIn">Zoom In</v-btn>
      <v-btn @click="zoomOut">Zoom Out</v-btn>
      <v-btn @click="goToPreviousPage">Anterior</v-btn>
      <v-btn @click="goToNextPage">Siguiente</v-btn>
      <span>Página {{ currentPage }} de {{ totalPages }}</span>
    </div>

    <PDF
      :src="pdfSource"
      :page="currentPage"
      :showProgress="true"
      :progressColor="'#87ceeb'"
      :pdfWidth="'800px'" 
      @onPageChange="handlePageChange"
      @onProgress="handleProgress"
      @onPdfInit="handlePdfInit"
      @onComplete="handleComplete"
    />

    <div class="progress">
      <div class="progress-bar" :style="{ width: loadRatio + '%' }"></div>
    </div>
  </div>
  </v-card>


</template>

<style scoped>
.controls {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.progress {
  width: 100%;
  background: #f3f3f3;
  position: relative;
  border-radius: 5px;
}

.progress-bar {
  height: 10px;
  background: #87ceeb;
  border-radius: 5px;
  transition: width 0.3s;
}
</style>

