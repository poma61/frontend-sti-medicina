<script setup>
import PersonalInstitucional from '@/http/api/PersonalInstitucional'
import { ref, onMounted } from 'vue'
import { toastError, showLoadingToast, completeLoadingToast } from '@/composables/toastify'
import FormPersonalInstitucional from '@/components/personal_institucional/FormPersonalInstitucional.vue'
import { mergeIntoObject } from '@/utils/objectHelpers'
import DetailsPersonalInstitucional from '@/components/personal_institucional/DetailsPersonalInstitucional.vue'
import Permiso from '@/http/api/Permiso'

//data
const index_item = ref(-1);
const is_component = ref({
    data_table: false,
    form: false,
})
const search_data_table = ref("")
const dialog_delete = ref(false);
const dialog_item_details = ref(false);
const item_personal_institucional = ref({});
const loading_data_table = ref(null);
const loading_item_details = ref(false);
const list_permisos = ref([])
const items_per_page_options = ref([
    { value: 10, title: '10' },
    { value: 25, title: '25' },
    { value: 50, title: '50' },
]);
const columns = ref([
    { title: 'Nombres', key: 'nombres', },
    { title: 'Apellido paterno', key: 'apellido_paterno', },
    { title: 'Apellido materno', key: 'apellido_materno', },
    { title: 'Numero de contacto', key: 'numero_contacto' },
    { title: 'Correo electronico', key: 'usuario.email' },
    { title: 'Activo', key: 'usuario.is_active', align: 'center' },
    { title: 'Acciones', key: 'actions', align: 'center' },
]);
const data = ref([]);


const loadDataTable = () => {
    loading_data_table.value = "yellow-darken-2"
    setTimeout(async () => {
        const personal_institucional = new PersonalInstitucional()
        const response = await personal_institucional.list()
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
    const personal_institucional = new PersonalInstitucional()
    item_personal_institucional.value = { ...personal_institucional.fields }
    handleComponent("form")
}

const editForm = (item) => {
    clear()
    item_personal_institucional.value = { ...item }
    index_item.value = data.value.indexOf(item)
    handleComponent("form")
}

const openItemDetails = (item) => {
    clear()
    loading_item_details.value = true
    setTimeout(async () => {
        const permiso = new Permiso()
        const response = await permiso.list()
        loading_item_details.value = false
        if (response.api_status) {
            list_permisos.value = response.payload
            item_personal_institucional.value = { ...item }
            dialog_item_details.value = true

        } else {
            toastError(response.detail)
        }

    }, 200);
}

const closeItemDetails = () => {
    dialog_item_details.value = false
}

const openDeleteItem = (item) => {
    clear()
    item_personal_institucional.value = { ...item }
    index_item.value = data.value.indexOf(item)
    dialog_delete.value = true
}

const closeDeleteItem = () => {
    dialog_delete.value = false
}

const confirmDeteleItem = () => {
    const toast_id = showLoadingToast("Eliminando registro...")
    closeDeleteItem()
    setTimeout(async () => {
        const personal_institucional = new PersonalInstitucional()
        personal_institucional.loadPayload({ ...item_personal_institucional.value })
        const response = await personal_institucional.delete()
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
            if (item !== undefined && item !== null) {
                data.value.push({ ...item })
            }
            break
        case "edit":
            if (item !== undefined && item !== null) {
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
    item_personal_institucional.value = {}
    index_item.value = -1
    list_permisos.value = []
}

onMounted(() => {
    handleComponent('data_table')
    loadDataTable()
})
</script>

<template>
    <div class="my-3 d-flex flex-wrap">
        <v-btn color="teal-lighten-2" variant="elevated" class="ma-1" @click="handleComponent('data_table')">
            <v-icon icon="mdi-table" start />
            Tablero
        </v-btn>

        <v-btn color="teal-lighten-2" variant="elevated" class="ma-1" @click="loadDataTable"
            :disabled="is_component.form">
            <v-icon icon="mdi-refresh" />
        </v-btn>
        <v-btn color="teal-lighten-2" variant="elevated" class="ma-1" @click="newForm">
            <v-icon icon="mdi-plus" start />
            Nuevo personal
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
                    Habilitado </v-chip>

                <v-chip color="red" v-else prepend-icon="mdi-cancel"> Deshabilitado </v-chip>
            </template>

            <template v-slot:item.actions="{ item }">
                <div style="width:250px">
                    <v-btn color="success" class="ma-1" variant="elevated" @click="openItemDetails(item)"
                        icon="mdi-format-align-left">

                    </v-btn>

                    <v-btn @click="editForm(item)" color="teal-lighten-2" class="ma-1" variant="elevated"
                        icon="mdi-pencil">

                    </v-btn>
                    <v-btn @click="openDeleteItem(item)" color="red" class="ma-1" variant="elevated" icon="mdi-delete">
                    </v-btn>
                </div>
            </template>

        </v-data-table>
    </v-card>
    <!-- formulario -->
    <FormPersonalInstitucional :p_item_personal_institucional="item_personal_institucional" v-if="is_component.form"
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
                    <v-icon icon="mdi-cancel" start></v-icon>
                    Cancelar
                </v-btn>
                <v-btn color="teal-lighten-2" variant="elevated" class="ma-1" @click="confirmDeteleItem">
                    <v-icon icon="mdi-check-bold" start></v-icon>
                    Si
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <!-- dialog para ver detalles del personal_institucional -->
    <v-dialog v-model="dialog_item_details" transition="dialog-bottom-transition" scrollable max-width="700px">
        <DetailsPersonalInstitucional :p_item_personal_institucional="item_personal_institucional"
            :p_list_permisos="list_permisos" @toCloseItemDetails="closeItemDetails" />
    </v-dialog>

    <v-overlay v-model="loading_item_details" class="align-center justify-center" persistent>
        <div class="text-center">
            <v-progress-circular color="cyan-darken-1" indeterminate size="100"></v-progress-circular>
            <p class="text-white text-h6">
                Cargando datos...
            </p>
        </div>
    </v-overlay>
</template>
