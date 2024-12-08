<script setup>
import { toastError } from '@/composables/toastify';
import Tema from '@/http/api/Tema';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const loading_data_iterator = ref(false)
const search_item = ref("")
const router = useRouter()

const data = ref([])

const loadDataIterator = () => {
    loading_data_iterator.value = true
    setTimeout(async () => {
        const tema = new Tema({ area: { name: 'medicina-interna' } })
        const response = await tema.list()
        loading_data_iterator.value = false
        if (response.api_status) {
            data.value = response.payload
        } else {
            toastError(response.detail)
        }
    }, 200)
}

const showTema = (tema) => {
    router.push({ name: 'n-view-tema', params: { area: tema.area.name, uuid: tema.uuid } })
}

onMounted(() => {
    loadDataIterator()
})
</script>

<template>
    <v-tooltip text="Actualizar temas">
        <template v-slot:activator="{ props }">
            <v-btn v-bind="props" color="light-blue-accent-4" variant="elevated" class="ma-1" rounded
                @click="loadDataIterator()">
                <v-icon icon="mdi-refresh"></v-icon>
            </v-btn>
        </template>
    </v-tooltip>

    <!-- iterator -->
    <v-card class="mt-2 as-container-data-iterator" elevation="0">
        <v-overlay v-model="loading_data_iterator" class="align-center justify-center" persistent contained>
            <div class="text-center">
                <v-progress-circular color="deep-purple-lighten-1" indeterminate size="100"></v-progress-circular>
                <p class="text-white text-h6">Cargando temas...</p>
            </div>
        </v-overlay>

        <v-data-iterator :items="data" :items-per-page="9" :search="search_item"
            :sort-by="[{ key: 'id', order: 'desc' }]">

            <template v-slot:header>
                <v-text-field v-model="search_item" clearable density="comfortable" hide-details
                    placeholder="Buscar temas..." prepend-inner-icon="mdi-magnify" color="deep-purple-lighten-1" class="pa-2" />
            </template>

            <template v-slot:default="{ items }">
                <v-container class="as__data-iterator" fluid>
                    <v-row justify="center">
                        <v-col v-for="(item, index) in items" :key="index" cols="auto" md="4">

                            <v-card class="pa-2 d-flex justify-space-between flex-column" elevation="6" min-height="240px">
                                <v-card-title class="text-wrap">
                                    {{ item.raw.title }}
                                </v-card-title>
                                <v-card-text>

                                    {{ item.raw.description }}
                                </v-card-text>

                                <v-card-actions>
                                    <v-divider color="deep-purple-lighten-1" opacity="0.4"></v-divider>
                                    <v-btn color="deep-purple-lighten-1" variant="tonal" class="ma-1" @click="showTema(item.raw)">
                                        Estudiar tema
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