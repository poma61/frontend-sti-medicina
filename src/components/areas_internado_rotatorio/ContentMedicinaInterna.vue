<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const loading_data_iterator = ref(false)
const search_item = ref("")
const router = useRouter()

const data = ref([
    { id: 1, titulo: 'Cardiología', descripcion: 'Estudio del corazón y sus enfermedades.' },
    { id: 2, titulo: 'Neumología', descripcion: 'Estudio de los pulmones y sus enfermedades.' },
    { id: 3, titulo: 'Gastroenterología', descripcion: 'Estudio del sistema digestivo. wfserfwe rwerf' },
    { id: 3, titulo: 'Gastroenterología', descripcion: 'Estudio del sistema digestivo.' },
    { id: 3, titulo: 'Gastroenterología', descripcion: 'Estudio del sistema digestivo.' },
    { id: 3, titulo: 'Gastroenterología', descripcion: 'Estudio del sistema digestivo.' },
    { id: 3, titulo: 'Gastroenterología', descripcion: 'Estudio del sistema digestivo.' },
    { id: 3, titulo: 'Gastroenterología', descripcion: 'Estudio del sistema digestivo. ewfwerfwe wefrewrw wrewrwqe wrfwqerqwe rqwerwerf' },
    { id: 3, titulo: 'Gastroenterología', descripcion: 'Estudio del sistema digestivo.  wefwq werfwqerf werfwe wrwerfew wwerfwe rfwe' },
    { id: 3, titulo: 'Gastroenterología', descripcion: 'Estudio del sistema digestivo. werfewr rqewrwqerf wrwerwer wrwerwer werwerfw' },
    { id: 3, titulo: 'Gastroenterología', descripcion: 'Estudio del sistema digestivo. ewrewrw w3erwerwerw werwerw' },
    { id: 3, titulo: 'Gastroenterología', descripcion: 'Estudio del sistema digestivo. ewrewrw erwerewrew werwerew rwerewrew' },
    { id: 3, titulo: 'Gastroenterología', descripcion: 'Estudio del sistema digestivo. erwerew erewrwerw werwerwer werewrwe werewr' },
])

const loadDataIterator = () => {
    //
}

const showTema = (tema_id) => {
    router.push({ name: 'n-view-tema', params: { area: 'medicina-interna', uuid: tema_id.id } })
}

</script>

<template>

    <v-tooltip text="Actualizar temas">
        <template v-slot:activator="{ props }">
            <v-btn v-bind="props" color="light-blue-accent-4" variant="elevated" class="ma-1"
                @click="loadDataIterator()">
                <v-icon icon="mdi-refresh"></v-icon>
            </v-btn>
        </template>
    </v-tooltip>

    <!-- iterator -->
    <v-card class="mt-2" elevation="0">
        <v-overlay v-model="loading_data_iterator" class="align-center justify-center" persistent>
            <div class="text-center">
                <v-progress-circular color="light-blue-accent-4" indeterminate size="100"></v-progress-circular>
                <p class="text-white text-h6">Cargando datos...</p>
            </div>
        </v-overlay>

        <v-data-iterator :items="data" :items-per-page="16" :search="search_item"
            :sort-by="[{ key: 'id', order: 'desc' }]">

            <template v-slot:header>
                <v-text-field v-model="search_item" clearable density="comfortable" hide-details
                    placeholder="Buscar Registros" prepend-inner-icon="mdi-magnify" color="secondary" class="pa-2"
                    max-width="800px" />
            </template>

            <template v-slot:default="{ items }">
                <div>
                    <v-container class="as__data-iterator" fluid>
                        <v-row justify="center">
                            <v-col v-for="(item, index) in items" :key="index" cols="auto" md="3">

                                <v-card class="pa-3" elevation="4">
                                    <v-card-title>
                                        {{ item.raw.titulo }}
                                    </v-card-title>
                                    <v-card-text>

                                        {{ item.raw.descripcion }}
                                    </v-card-text>

                                    <v-card-actions>
                                        <v-divider></v-divider>
                                        <v-btn color="secondary" variant="tonal" class="ma-1"
                                            @click="showTema(item.raw)">
                                            Ver tema
                                            <v-icon icon="mdi-arrow-right-box"></v-icon>
                                        </v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-container>
                </div>
            </template>

            <template v-slot:footer="{ page, pageCount, prevPage, nextPage }">
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