<script setup>
import { ref, nextTick, defineProps } from 'vue'
import * as pdfjsLib from 'pdfjs-dist'
import PdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url'
import PDF from 'pdf-vue3'
// Configura el worker correctamente
pdfjsLib.GlobalWorkerOptions.workerSrc = PdfWorker
// Habilita la carga de fuentes estándar
pdfjsLib.GlobalWorkerOptions.useWorkerFetch = true

// p_pdf_source es solo lectura No escritura entonces pasamos directo el valor
const props = defineProps(['p_pdf_source'])
const button_disable = ref(true)
const current_page = ref(1)
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
    let time_out
    await ensureDOMRendered()
    view_controls.value = true
    // habilitar los botones de control
    if (totalPages.value > 100) {
        time_out = 7000
    } else {
        time_out = 3000
    }

    setTimeout(() => {
        button_disable.value = false;
    }, time_out)
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
    if (current_page.value > 1) {
        current_page.value--
    }
}

const goToNextPage = () => {
    if (current_page.value < totalPages.value) {
        current_page.value++
    }
}

// Manejo de eventos
const handlePageChange = (page) => {
    current_page.value = page
}

const handlePdfInit = (pdf) => {
    totalPages.value = pdf.numPages;
}

</script>

<template>
    <!-- Se quito para evitar renderizar cada vez porque estamos desarrollando
     
    -->
    <div class="pdf">
        <PDF  :src="props.p_pdf_source"   :page="current_page"
            :style="{ transform: `scale(${scale})`, transformOrigin: '0 0' }" :showProgress="true"
            :progressColor="'#87ceeb'" @onPageChange="handlePageChange" @onProgress="handleProgress"
            @onPdfInit="handlePdfInit" @onComplete="handleComplete" :disableStream="true" :disableAutoFetch="true"
            :disableRange="true" />
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
            <v-chip color="success" label> {{ current_page }} </v-chip>
            de
            <v-chip color="success" label> {{ totalPages }}</v-chip>
        </span>
    </div>
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
    height: 85vh;
}
</style>
