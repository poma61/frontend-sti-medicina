<script setup>
import Estudiante from '@/http/api/Estudiante'
import { ref, onMounted } from 'vue'
import { toastError, showLoadingToast, completeLoadingToast } from '@/composables/toastify'
import FormEstudiante from '@/components/estudiante/FormEstudiante.vue'
import { mergeIntoObject } from '@/utils/objectHelpers'
import app from '@/config/app'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale' // Importar la configuración regional en español

//data
const index_item = ref(-1);
const is_component = ref({
    data_table: false,
    form: false,
})
const search_data_table = ref("")
const dialog_delete = ref(false);
const dialog_item_details = ref(false);
const item_estudiante = ref({});
const loading_data_table = ref(null);
const items_per_page_options = ref([
    { value: 10, title: '10' },
    { value: 25, title: '25' },
    { value: 50, title: '50' },
]);
const columns = ref([
    { title: 'Nombres', key: 'nombres', },
    { title: 'Apellido paterno', key: 'apellido_paterno', },
    { title: 'Apellido materno', key: 'apellido_materno', },
    { title: 'CI', key: 'ci__', value: (item) => `${item.ci} ${item.ci_expedido}`, },
    { title: 'Correo electronico', key: 'usuario.email' },
    { title: 'Activo', key: 'usuario.is_active', align: 'center' },
    { title: 'Acciones', key: 'actions', align: 'center' },
]);
const data = ref([]);


const loadDataTable = () => {
    loading_data_table.value = "yellow-darken-2"
    setTimeout(async () => {
        const estudiante = new Estudiante()
        const response = await estudiante.list()
        loading_data_table.value = null
        if (response.api_status) {
            data.value = response.payload
        } else {
            toastError(response.detail)
        }
    }, 200)
}

const newForm = () => {
    clear()
    const estudiante = new Estudiante()
    item_estudiante.value = { ...estudiante.fields }
    handleComponent("form")
}

const editForm = (item) => {
    clear()
    item_estudiante.value = { ...item }
    index_item.value = data.value.indexOf(item)
    handleComponent("form")
}

const openItemDetails = (item) => {
    clear()
    dialog_item_details.value = true
    item_estudiante.value = { ...item }
}

const closeItemDetails = () => {
    dialog_item_details.value = false
}

const openDeleteItem = (item) => {
    clear()
    item_estudiante.value = { ...item }
    dialog_delete.value = true
}

const closeDeleteItem = () => {
    dialog_delete.value = false
}

const confirmDeteleItem = () => {
    const toast_id = showLoadingToast("Eliminando registro...")
    closeDeleteItem()
    setTimeout(async () => {
        const estudiante = new Estudiante()
        estudiante.loadPayload({ ...item_estudiante.value })
        const response = await estudiante.delete()
        if (response.api_status) {
            completeLoadingToast(toast_id, response.detail, 'success')
            itemRefreshDataTable('delete')
        } else {
            completeLoadingToast(toast_id, response.detail, 'error')
        }
    }, 1500)
}

//methods 
const handleComponent = (component) => {
    switch (component) {
        case "data_table":
            is_component.value.data_table = true
            is_component.value.form = false
            break
        case "form":
            is_component.value.form = true
            is_component.value.data_table = false
            break
        default:
            console.error("El componente no existe 'handleComponent'")
            break
    }
}
const itemRefreshDataTable = (type, item) => {
    switch (type) {
        case "new":
            if (item != undefined && item != null) {
                data.value.push({ ...item })
            }
            break
        case "edit":
            if (item != undefined && item != null) {
                mergeIntoObject(data.value[index_item.value], item)
            }
            break
        case "delete": data.value.splice(index_item.value, 1)
            break
        default: console.log("Datos no procesados, 'itemRefreshDataTable'")
            break
    }
}

const clear = () => {
    item_estudiante.value = {};
    index_item.value = -1;
}

onMounted(() => {
    handleComponent('data_table')
    loadDataTable()
})

</script>

<template>
    <div class="my-3 d-flex flex-wrap">
        <v-btn color="yellow-darken-2" variant="elevated" class="ma-1" @click="handleComponent('data_table')">
            <v-icon icon="mdi-table" />&nbsp;Tablero
        </v-btn>

        <v-btn color="yellow-darken-2" variant="elevated" class="ma-1" @click="loadDataTable"
            :disabled="is_component.form">
            <v-icon icon="mdi-refresh" />
        </v-btn>
        <v-btn color="yellow-darken-2" variant="elevated" class="ma-1" @click="newForm">
            <v-icon icon="mdi-plus" />&nbsp;Nuevo estudiante
        </v-btn>

    </div>
    <!-- data table -->
    <v-card v-show="is_component.data_table">
        <v-text-field v-model="search_data_table" append-inner-icon="mdi-magnify" clearable label="Buscar Registros..."
            color="yellow-darken-4" />

        <v-data-table :hover="true" :items="data" :headers="columns" :search="search_data_table"
            :loading="loading_data_table" :items-per-page-options="items_per_page_options" :show-current-page="true"
            :fixed-header="true" :height="580" :sort-by="[{ key: 'usuario.id', order: 'desc' }]">
            <template v-slot:loading>
                <v-skeleton-loader type="table-row@11"></v-skeleton-loader>
            </template>

            <template v-slot:item.usuario.is_active="{ item }">
                <v-chip color="success" v-if="item.usuario.is_active" prepend-icon="mdi-checkbox-marked-circle">
                    Activo </v-chip>

                <v-chip color="red" v-else prepend-icon="mdi-cancel"> Descativado </v-chip>
            </template>

            <template v-slot:item.actions="{ item }">
                <div style="width:250px">
                    <v-btn color="success" class="ma-1" variant="elevated" @click="openItemDetails(item)">
                        <v-icon icon="mdi-format-align-left"></v-icon>
                    </v-btn>

                    <v-btn @click="editForm(item)" color="cyan-darken-1" class="ma-1" variant="elevated">
                        <v-icon icon="mdi-pencil"></v-icon>
                    </v-btn>
                    <v-btn @click="openDeleteItem(item)" color="red" class="ma-1" variant="elevated">
                        <v-icon icon="mdi-delete"></v-icon>
                    </v-btn>
                </div>
            </template>

        </v-data-table>
    </v-card>
    <!-- formulario -->
    <FormEstudiante :p_item_estudiante="item_estudiante" v-if="is_component.form"
        @toItemRefreshDataTable="itemRefreshDataTable" @toNewForm="newForm" />

    <!-- dialog para eliminar un item -->
    <v-dialog v-model="dialog_delete" persistent max-width="500px" transition="dialog-bottom-transition" scrollable>
        <v-card class="text-center">
            <v-card-title>
                <v-icon icon="mdi-delete" color="red" size="100"></v-icon>
            </v-card-title>
            <v-card-text>
                <p class="text-h6 text-center">
                    ¿Esta seguro(a) de eliminar este registro?
                </p>
            </v-card-text>

            <v-card-actions class="justify-center">
                <v-btn color="red" variant="elevated" @click="closeDeleteItem" class="ma-1">
                    <v-icon icon="mdi-cancel"></v-icon>&nbsp;Cancelar
                </v-btn>
                <v-btn color="cyan-darken-1" variant="elevated" class="ma-1" @click="confirmDeteleItem">
                    <v-icon icon="mdi-check-bold"></v-icon>&nbsp;Si
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <!-- dialog para ver detalles del estudiante -->
    <v-dialog v-model="dialog_item_details" transition="dialog-bottom-transition" scrollable max-width="600px">
        <v-card>
            <v-card-title class="bg-cyan-darken-1 pa-4">

                <h6 class="text-h6">
                    <v-icon icon="mdi-account-school"></v-icon>
                    Datos del estudiante
                </h6>
            </v-card-title>
            <v-card-text>
                <v-table>
                    <tbody>
                        <tr>
                            <td colspan="2">
                                <div class="text-center ma-2">
                                    <v-avatar size="200" :image="app.BASE_URL + item_estudiante.usuario.picture" />
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td class="font-weight-bold">Nombres:</td>
                            <td>{{ item_estudiante.nombres }}</td>
                        </tr>

                        <tr>
                            <td class="font-weight-bold">Apellido paterno:</td>
                            <td>{{ item_estudiante.apellido_paterno }}</td>
                        </tr>

                        <tr>
                            <td class="font-weight-bold">Apellido materno:</td>
                            <td>{{ item_estudiante.apellido_materno }}</td>
                        </tr>
                        <tr>
                            <td class="font-weight-bold">Correo electronico:</td>
                            <td> <v-chip color="cyan-darken-2" label>{{ item_estudiante.usuario.email }} </v-chip></td>
                        </tr>
                        <tr>
                            <td class="font-weight-bold">C.I.:</td>
                            <td>{{ item_estudiante.ci }}  {{ item_estudiante.ci_expedido }}</td>
                        </tr>
                        <tr>
                            <td class="font-weight-bold">Genero:</td>
                            <td>{{ item_estudiante.genero }}</td>
                        </tr>
                        <tr>
                            <td class="font-weight-bold">Fecha nacimiento:</td>
                            <td>{{ format(parseISO(item_estudiante.fecha_nacimiento), 'dd/MMMM/yyyy', { locale: es }) }}
                            </td>
                        </tr>
                        <tr>
                            <td class="font-weight-bold">Número de contacto:</td>
                            <td> <v-chip color="cyan-darken-2" label> {{ item_estudiante.numero_contacto }} </v-chip>
                            </td>
                        </tr>

                        <tr>
                            <td class="font-weight-bold">Matricula universitaria:</td>
                            <td> <v-chip color="cyan-darken-2" label>{{ item_estudiante.matricula_univ }} </v-chip></td>
                        </tr>
                        <tr>
                            <td class="font-weight-bold">Internado Rotatorio:</td>
                            <td>{{ item_estudiante.internado_rot }}</td>
                        </tr>
                        <tr>
                            <td class="font-weight-bold">Dirección:</td>
                            <td>{{ item_estudiante.direccion }}</td>
                        </tr>

                        <tr>
                            <td class="font-weight-bold">Observaciones:</td>
                            <td>{{ item_estudiante.observaciones }}</td>
                        </tr>

                    </tbody>
                </v-table>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-btn @click="closeItemDetails" color="cyan-darken-1" variant="elevated">
                    <v-icon icon="mdi-close"></v-icon>
                    Cerrar
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

</template>
