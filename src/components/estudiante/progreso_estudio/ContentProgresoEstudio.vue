<script setup>
import { toastError } from '@/composables/toastify';
import ProgresoEstudio from '@/http/api/ProgresoEstudio';
import { onMounted, ref } from 'vue';
import { format, parseISO } from 'date-fns';
import ContentResultadoCuestonarioAndEvaluadoOfAI from '@/components/estudiante/progreso_estudio/ContentResultadoCuestonarioAndEvaluadoOfAI.vue';

const loading_data_table = ref(false)
const search_data_table = ref("")
const data = ref([])
const is_component = ref({
    data_table: false,
    resultado_cuestonario_and_evaluado_of_ai: false
})
const item_progreso_estudio = ref({})
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

const loadData = () => {
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

const viewResultadoCuestonarioAndEvaluadoOfAI = (item) => {
    item_progreso_estudio.value = { ...item }
    handleComponent("resultado-cuestonario-and-evaluado-of-ai")
}

const handleComponent = (component) => {
    switch (component) {
        case "data-table":
            is_component.value.data_table = true
            is_component.value.resultado_cuestonario_and_evaluado_of_ai = false
            break
        case "resultado-cuestonario-and-evaluado-of-ai":
            is_component.value.resultado_cuestonario_and_evaluado_of_ai = true
            is_component.value.data_table = false
            break
        default:
            console.error("Valor no encontrado en handleComponent")
            break
    }
}

onMounted(() => {
    handleComponent("data-table")
    loadData()
})
</script>


<template>
    <div class="mt-4 d-flex flex-wrap">
        <v-btn color="secondary" variant="elevated" class="ma-1" @click="handleComponent('data-table')"
            :disabled="is_component.data_table">
            <v-icon icon="mdi-table" start />
            Tablero
        </v-btn>

        <v-btn color="secondary" variant="elevated" class="ma-1" @click="loadData"
            :disabled="is_component.resultado_cuestonario_and_evaluado_of_ai">
            <v-icon icon="mdi-refresh" start />
            Actualizar
        </v-btn>
    </div>

    <v-card class="mt-4" v-show="is_component.data_table">
        <v-card-text>
            <v-text-field v-model="search_data_table" append-inner-icon="mdi-magnify" clearable label="Buscar..."
                color="secondary" />

            <v-data-table :search="search_data_table" :hover="true" :items="data" :headers="columns"
                :loading="loading_data_table" :items-per-page-options="items_per_page_options" :show-current-page="true"
                :fixed-header="true" :height="650" :sort-by="[{ key: 'id', order: 'desc' }]">
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
                    <v-btn @click="viewResultadoCuestonarioAndEvaluadoOfAI(item)" color="success" class="ma-1"
                        variant="elevated">
                        <v-icon icon="mdi-text-box-check"></v-icon>
                    </v-btn>
                </template>

            </v-data-table>
        </v-card-text>
    </v-card>

    <ContentResultadoCuestonarioAndEvaluadoOfAI v-if="is_component.resultado_cuestonario_and_evaluado_of_ai"
        :p_item_progreso_estudio="item_progreso_estudio" />

</template>
