<script setup>
import { toastError } from '@/composables/toastify';
import ProgresoEstudio from '@/http/api/ProgresoEstudio';
import { onMounted, ref } from 'vue';
import { format, parseISO } from 'date-fns';

const loading_data_table = ref(false)
const data = ref([])

const items_per_page_options = ref([
    { value: 10, title: '10' },
    { value: 25, title: '25' },
    { value: 50, title: '50' },
])

const columns = ref([
    { title: 'Progreso', key: 'progress', align: "center" },
    { title: 'Tiempo', key: 'tiempo_est', align: "center" },
    { title: 'Tema', key: 'tema.title', align: "center" },
    { title: 'Fecha estudio', key: 'ult_actualizacion', align: "center" },
    { title: 'Acciones', key: 'actions', align: "center" },
])

const loadProgresoEstudio = () => {
    loading_data_table.value = "info"
    setTimeout(async () => {
        const progreso_estudio = new ProgresoEstudio()
        const response = await progreso_estudio.list()
        loading_data_table.value = false

        if (response.api_status) {
            data.value = response.payload
        } else {
            toastError(response.detail)
        }

    }, 200)
}
const getProgressColor = (progress) => {
    if (progress >= 0.9) return 'success'
    if (progress >= 0.7) return 'light-green'
    if (progress >= 0.5) return 'yellow-darken-4'
    if (progress >= 0.3) return 'yellow-accent-4'
    if (progress >= 0.1) return 'red'
    return 'red'
}


onMounted(() => {
    loadProgresoEstudio()
})
</script>


<template>
    <v-card class="mt-5">
        <v-card-text>
            <v-btn color="info" variant="elevated" class="ma-1" @click="loadProgresoEstudio">
                <v-icon icon="mdi-refresh" start />
                Actualizar
            </v-btn>

            <v-data-table :hover="true" :items="data" :headers="columns" :loading="loading_data_table"
                :items-per-page-options="items_per_page_options" :show-current-page="true" :fixed-header="true"
                :height="700" :sort-by="[{ key: 'id', order: 'desc' }]">
                <template v-slot:loading>
                    <v-skeleton-loader type="table-row@14"></v-skeleton-loader>
                </template>

                <template v-slot:item.progress="{ item }">
                    <div style="min-width:250px">
                        <v-progress-linear :color="getProgressColor(item.progress)" height="15"
                            :model-value="item.progress * 100" striped>
                            <strong> {{ item.progress * 100 }} %</strong>
                        </v-progress-linear>
                    </div>
                </template>
                <template v-slot:item.tiempo_est="{ item }">

                    <v-chip prepend-icon="mdi-clock" color="cyan-darken-3" label> {{ item.tiempo_est }} </v-chip>
                </template>

                <template v-slot:item.ult_actualizacion="{ item }">
                    <v-chip prepend-icon="mdi-calendar" color="info" label>
                        {{ format(parseISO(item.ult_actualizacion), "dd-MM-yyyy HH:mm:ss") }}
                    </v-chip>
                </template>

                <template v-slot:item.actions="{ item }">
                    <v-btn @click="item" color="success" class="ma-1" variant="elevated">
                        <v-icon icon="mdi-file"></v-icon>
                    </v-btn>
                </template>

            </v-data-table>
        </v-card-text>
    </v-card>


    <v-overlay v-model="loading" class="align-center justify-center" persistent>
        <div class="text-center">
            <v-progress-circular color="cyan-darken-1" indeterminate size="100"></v-progress-circular>
            <p class="text-white text-h6">
                Cargando datos...
            </p>
        </div>
    </v-overlay>

</template>
