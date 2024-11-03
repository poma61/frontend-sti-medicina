<script setup>
import { toastError } from '@/composables/toastify';
import ProgresoEstudio from '@/http/api/ProgresoEstudio';
import { onMounted, ref } from 'vue';
import { format, parseISO } from 'date-fns';
import DetailsResultadoCuestonarioAndEvaluadoOfAI from '@/components/estudiante/progreso_estudio/DetailsResultadoCuestonarioAndEvaluadoOfAI.vue';

//data
const props = defineProps(['p_item_progreso_estudio'])
const data = ref([])
const loading_data_iterator = ref(false)
const dialog_cuestinario = ref(false)
const item_cuestonario = ref({})


//methods
const loadData = () => {
    loading_data_iterator.value = true
    setTimeout(async () => {
        const progreso_estudio = new ProgresoEstudio({ ...props.p_item_progreso_estudio })
        const response = await progreso_estudio.listResultadoCuestionarioAndEvaluadoOfAI()
        loading_data_iterator.value = false
        if (response.api_status) {
            data.value = response.payload
        } else {
            toastError(response.detail)
        }
    }, 200)
}
const openDialogCuestionario = (item) => {
    clear()
    item_cuestonario.value = { ...item }
    dialog_cuestinario.value = true
}

const closeDialogCuestionario = () => {
    dialog_cuestinario.value = false
}

const clear = () => {
    item_cuestonario.value = {}
}
//
onMounted(() => {
    loadData()
})

</script>

<template>
    <!-- iterator -->
    <v-card class="mt-2 as-container-data-iterator">
        <v-overlay v-model="loading_data_iterator" class="align-center justify-center" persistent contained>
            <div class="text-center">
                <v-progress-circular color="indigo-darken-1" indeterminate size="100"></v-progress-circular>
                <p class="text-white text-h6">Cargando temas...</p>
            </div>
        </v-overlay>

        <v-data-iterator :items="data" :items-per-page="9"
            :sort-by="[{ key: 'resultado_cuestionario.created_at', order: 'desc' }]">

            <template v-slot:default="{ items }">
                <v-container class="as__data-iterator" fluid>
                    <v-row justify="center">
                        <v-col v-for="(item, index) in items" :key="index" cols="auto" md="4">

                            <v-card class="pa-3" elevation="4" min-height="200px">
                                <v-card-title>
                                    {{ item.raw.intento }}
                                </v-card-title>
                                <v-card-text>
                                    <p> Cuestionario evaluado </p>
                                    <v-chip prepend-icon="mdi-calendar" color="success" label>
                                        {{ format(
                                            parseISO(item.raw.cuestionario_evaluado_of_ai.created_at),
                                            "dd-MM-yyyy HH:mm:ss"
                                        ) }}
                                    </v-chip>
                                </v-card-text>

                                <v-card-actions>
                                    <v-divider color="indigo-darken-1" opacity="0.4"></v-divider>
                                    <v-btn color="indigo-darken-1" variant="tonal" class="ma-1"
                                        @click="openDialogCuestionario(item.raw)">
                                        Ver cuestionario
                                        <v-icon icon="mdi-arrow-right-box" end></v-icon>
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-container>
            </template>

            <template v-slot:footer="{ page, pageCount, prevPage, nextPage }" v-if="data.length != 0">
                <div class="d-flex align-center justify-end pa-2">
                    <v-btn :disabled="page == 1" icon="mdi-arrow-left" density="comfortable" variant="elevated"
                        @click="prevPage" color="light-blue-accent-4" />

                    <div class="mx-2 text-caption">
                        Página {{ page }} de {{ pageCount }}
                    </div>
                    <v-btn :disabled="page >= pageCount" icon="mdi-arrow-right" density="comfortable" variant="elevated"
                        @click="nextPage" color="light-blue-accent-4" />
                </div>
            </template>

        </v-data-iterator>

        <div class="as__data-iterator d-flex justify-center align-center" v-if="data.length == 0">
            <p>No hay datos disponibles.</p>
        </div>
    </v-card>
    <!-- iterator -->
    <v-dialog v-model="dialog_cuestinario" scrollable persistent fullscreen>
        
        <DetailsResultadoCuestonarioAndEvaluadoOfAI :p_item_cuestonario="item_cuestonario"
            @toCloseDialogCuestionario="closeDialogCuestionario" />
    </v-dialog>

</template>

<style scoped>
/* ========================================
data iterator 
el valor height de as-container-data-iterator es +130 o +100 sobre el valor height de as__data-iterator
ejemplo: as__data-iterator =>height700px entonces as-container-data-iterator  => height:130px+700px;
ejemplo2:as__data-iterator =>height700px entonces as-container-data-iterator => height:100px+700px;
========================================== */

.as-container-data-iterator {
    height: 830px;
}

.as__data-iterator {
    overflow-y: auto;
    height: 700px;
    border-bottom: 1px solid #c2c2c2;
}
</style>
