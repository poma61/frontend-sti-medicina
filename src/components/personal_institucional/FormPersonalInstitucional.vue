<script setup>
import { ref, watch, computed, nextTick, onMounted } from 'vue'
import PersonalInstitucional from '@/http/api/PersonalInstitucional'
import { toastError, toastSuccess } from '@/composables/toastify'
import app from '@/config/app'
import Camera from 'simple-vue-camera'
import { VDateInput } from 'vuetify/labs/VDateInput'
import { VNumberInput } from 'vuetify/labs/VNumberInput'
import { parseISO, format } from 'date-fns'
import Permiso from '@/http/api/Permiso'

// props and emit
const props = defineProps(["p_item_personal_institucional"])
const emit = defineEmits(["toItemRefreshDataTable", "toNewForm"])

//data
const item_personal_institucional = ref({ ...new PersonalInstitucional().collectPayload() }) // asignamos para evitar errores
const show_password = ref(false)
const src_image = ref(null);
const loading_btn = ref(false);
const serializer_errors = ref({});
const devices_camera = ref([])
const dialog_camera = ref(false)
const refCamera = ref(null)
const image_file = ref([])
const fecha_nacimiento_date_input = ref(null)
const permisos = ref([])
const loading_form = ref(false)

// cuando el valor de props.p_item_personal_institucional cambian desde el componente padre
// debemos actualizar item_personal_institucional
// esto pasa porque se ejecuta el emit toNewForm del componente padre
watch(() => props.p_item_personal_institucional, () => {
    item_personal_institucional.value = { ...props.p_item_personal_institucional }
    clear()
})

// computed
const showSerializerErrors = computed(() => {
    return function (field) {
        const field_parts = field.split('.')
        let error_field = serializer_errors.value
        //Recorrer las partes del campo, para acceder a campos anidados igual funciona para campos NO anidados
        for (let part of field_parts) {
            if (error_field[part]) {
                error_field = error_field[part]
            }
        }
        // si encuentra un error, lo retorna
        if (Array.isArray(error_field) && error_field.length > 0) {
            return error_field[0]
        } else {
            return ""
        }
    }// function
})

//methods
const loadPermiso = async () => {
    const permiso = new Permiso()
    const response = await permiso.list()
    if (response.api_status) {
        const is_permisos = response.payload

        // Recorrer todos los módulos únicos en `is_permisos`
        is_permisos.forEach((element) => {
            // Verificar si ya existe el módulo en `permisos.value`
            let existing_module = permisos.value.find((item) => item.module == element.module);

            if (!existing_module) {
                // Si no existe, creamos una nueva entrada para el módulo
                permisos.value.push({
                    module: element.module,
                    group: is_permisos.filter(row => row.module == element.module),
                })
            }
        })

    } else {
        toastError(response.detail)
    }
}

const formattedDate = (value) => {
    if (value) {
        item_personal_institucional.value.fecha_nacimiento = format(value, "yyyy-MM-dd")
    }
}

const save = () => {
    loading_btn.value = true
    // eliminamos picture si es de tipo string porque el backend espera un file
    if (typeof item_personal_institucional.value.usuario.picture == 'string') {
        delete item_personal_institucional.value.usuario.picture
    }

    setTimeout(async () => {
        if (item_personal_institucional.value.usuario.id == 0) {
            // cuando es nuevo registro
            const personal_institucional = new PersonalInstitucional()
            personal_institucional.loadPayload({ ...item_personal_institucional.value })

            const response = await personal_institucional.create()
            loading_btn.value = false

            if (response.api_status) {
                toastSuccess(response.detail)
                emit("toItemRefreshDataTable", "new", response.payload)
                emit("toNewForm")
                clear()
            } else {
                if (response.serializer_errors != undefined) {
                    serializer_errors.value = response.serializer_errors
                }
                toastError(response.detail)
            }
        } else {
            //edicion de registro
            const personal_institucional = new PersonalInstitucional({ ...item_personal_institucional.value })
            const response = await personal_institucional.update()

            loading_btn.value = false
            if (response.api_status) {
                toastSuccess(response.detail)
                emit("toItemRefreshDataTable", 'edit', response.payload)
                // solo limpiados los serializadores
                serializer_errors.value = {}
            } else {
                if (response.serializer_errors != undefined) {
                    serializer_errors.value = response.serializer_errors
                }
                toastError(response.detail)
            }
        }
    }, 200)

}// save

//visualizar imagen cargada
const uploadImage = () => {
    const archivo = image_file.value
    item_personal_institucional.value.usuario.picture = image_file.value // cargar la imagen
    if (archivo) {
        const render = new FileReader()
        render.readAsDataURL(archivo)
        render.onload = (e) => {
            src_image.value = e.target.result
        }
    }
}

const clearImageFile = () => {
    src_image.value = null
    item_personal_institucional.value.usuario.picture = null
}

const clear = () => {
    serializer_errors.value = {}
    src_image.value = null
    image_file.value = []
    fecha_nacimiento_date_input.value = null
}

const openCamera = async () => {
    dialog_camera.value = true
    // Esperar el siguiente siglo de renderizacion
    // espera que se renderize <Camera><Camera/>
    await nextTick()
    //espera que inicie la camera
    await refCamera.value.start()
    // listar otras camaras
    devices_camera.value = await refCamera.value.devices(["videoinput"])
    // verificamos si se encontraron camaras
    if (devices_camera.value.length == 0) {
        toastError('No hay dispositvos de camara.')
    }
}
const closeCamera = () => {
    if (refCamera.value !== null) {
        refCamera.value.stop()
    }
    devices_camera.value = []
    dialog_camera.value = false
}

// capturar foto con camara
const capturePhoto = async () => {
    if (refCamera.value !== null) {
        const blob = await refCamera.value.snapshot({ width: 800, height: 600 }, "image/jpeg")
        if (blob) {
            src_image.value = URL.createObjectURL(blob)
            const extension_type = blob.type.split('/')
            const archivo = new File([blob], `fotografia.${extension_type[1]}`, { type: blob.type });
            //cargamos el archivo imagen
            item_personal_institucional.value.usuario.picture = archivo
        } else {
            toastError('Error al capturar foto.')
        }
    }
    closeCamera()
}

// funciones para la camara
const changeCameraDevice = async (device_id) => {
    await refCamera.value.changeCamera(device_id)
}


const filterSpaces = (event, field) => {
    const value = event.target.value;
    const filtered_value = value.replace(/\s/g, ""); // Elimina todos los espacios
    item_personal_institucional.value.usuario[field] = filtered_value;
}

const isValueForm = () => {
    //cargamos los datos de usuario
    item_personal_institucional.value = { ...props.p_item_personal_institucional }

    // si el formulariose esta editando
    if (item_personal_institucional.value.usuario.id > 0) {
        // Para cargar la imagen cuando se esta editando el registro
        src_image.value = app.BASE_URL + item_personal_institucional.value.usuario.picture
        //para cargar la fecha porque la fecha de date-input es de tipo "Sun Oct 27 2024 00:00:00 GMT-0400 (hora de Bolivia)""
        fecha_nacimiento_date_input.value = parseISO(item_personal_institucional.value.fecha_nacimiento)
    }
}

onMounted(async () => {
    loading_form.value = true
    setTimeout(async () => {
        await loadPermiso()
        loading_form.value = false
        isValueForm()
    }, 200)

})
</script>

<template>
    <v-card>
        <v-card-title class="bg-indigo-lighten-1 pa-4">
            <span class="text-h6 text-wrap" v-if="item_personal_institucional.usuario.id == 0"> Registrar nuevo
                personal institucional</span>
            <span class="text-h6 text-wrap" v-else> Actualizar datos del personal institucional</span>
        </v-card-title>
        <!-- formulairo -->
        <v-card-text class="pa-4">
            <p class="text-red text-subtitle-1">Los campos marcados con (*) son obligatorios.</p>
            <v-form @submit.prevent="save">
                <p class="text-h6">Usuario</p>
                <v-divider class="mb-5" opacity="0.3"></v-divider>
                <v-row>
                    <v-col cols="12" sm="4">
                        <v-text-field v-model="item_personal_institucional.usuario.user" label="Usuario (*)"
                            color="indigo-lighten-1" clearable :error-messages="showSerializerErrors('usuario.user')"
                            @input="filterSpaces($event, 'user')" />
                    </v-col>

                    <v-col cols="12" sm="4">
                        <v-text-field v-model="item_personal_institucional.usuario.password"
                            :label="item_personal_institucional.usuario.id == 0 ? 'Contraseña (*)' : 'Contraseña'"
                            color="indigo-lighten-1" clearable
                            :append-inner-icon="show_password ? 'mdi-eye' : 'mdi-eye-off'"
                            :type="show_password ? 'text' : 'password'" autocomplete="off"
                            @click:append-inner="show_password = !show_password"
                            :error-messages="showSerializerErrors('usuario.password')"
                            @input="filterSpaces($event, 'password')" />
                    </v-col>

                    <v-col cols="12" sm="4">
                        <v-text-field v-model="item_personal_institucional.usuario.email" label="Correo electronico (*)"
                            color="indigo-lighten-1" clearable
                            :error-messages="showSerializerErrors('usuario.email')" />
                    </v-col>
                </v-row>

                <v-row>
                    <v-col cols="12" sm="4">
                        <v-select v-model="item_personal_institucional.usuario.user_type" label="Tipo de usuario (*)"
                            :items="['doctor', 'administrativo']" color="indigo-lighten-1" clearable
                            :error-messages="showSerializerErrors('usuario.user_type')"></v-select>
                    </v-col>
                </v-row>
                <v-row>

                    <v-col cols="12" sm="12">
                        <p class="text-warning">Si el usuario está habilitado, podrá acceder al sistema; de lo
                            contrario, si está deshabilitado, no tendrá acceso.</p>
                        <v-switch color="indigo-lighten-1" inset
                            :label="item_personal_institucional.usuario.is_active ? 'Habilitado' : 'Deshabilitado'"
                            v-model="item_personal_institucional.usuario.is_active"
                            :error-messages="showSerializerErrors('usuario.is_active')" />
                    </v-col>
                </v-row>

                <!-- gestionar los permisos Permisos -->
                <p class="text-h6">Permisos</p>
                <v-divider class="mb-5" opacity="0.3"></v-divider>

                <v-row v-for="(row, idx) in permisos" :key="idx">
                    <v-col cols="12" sm="12" class="py-0 px-3">
                        <p class="text-body-1">{{ row.module }}</p>
                    </v-col>

                    <v-col cols="12" sm="4" v-for="(permiso, id) in row.group" :key="id">
                        <v-switch :label="permiso.name" :value="permiso.code" color="success" hide-details inset
                            v-model="item_personal_institucional.usuario.permisos" />
                    </v-col>
                </v-row>

                <!-- Datos del personal isntitucional -->
                <p class="text-h6">Datos del personal institucional</p>
                <v-divider class="mb-5" opacity="0.3"></v-divider>
                <v-row>
                    <v-col cols="12" sm="4">
                        <v-text-field v-model="item_personal_institucional.nombres" label="Nombres (*)"
                            color="indigo-lighten-1" clearable :error-messages="showSerializerErrors('nombres')" />
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-text-field v-model="item_personal_institucional.apellido_paterno"
                            label="Apellido paterno (*)" color="indigo-lighten-1" clearable
                            :error-messages="showSerializerErrors('apellido_paterno')" />
                    </v-col>

                    <v-col cols="12" sm="4">
                        <v-text-field v-model="item_personal_institucional.apellido_materno"
                            label="Apellido materno (*)" color="indigo-lighten-1" clearable
                            :error-messages="showSerializerErrors('apellido_materno')" />
                    </v-col>
                </v-row>

                <v-row>
                    <v-col cols="12" sm="4">
                        <v-select v-model="item_personal_institucional.genero" label="Genero (*)"
                            :items="['masculino', 'femenino']" color="indigo-lighten-1" clearable
                            :error-messages="showSerializerErrors('genero')"></v-select>
                    </v-col>

                    <v-col cols="12" sm="4">
                        <v-date-input clearable v-model:model-value="fecha_nacimiento_date_input"
                            label="Fecha de nacimiento (*)" color="indigo-lighten-1" prepend-icon=""
                            prepend-inner-icon="mdi-calendar" :error-messages="showSerializerErrors('fecha_nacimiento')"
                            @update:model-value="formattedDate($event)">
                        </v-date-input>

                    </v-col>

                    <v-col cols="12" sm="4">
                        <v-number-input :min="0" v-model="item_personal_institucional.numero_contacto"
                            :model-value="Number(item_personal_institucional.numero_contacto)"
                            label="N° de contacto (*)" color="indigo-lighten-1"
                            :error-messages="showSerializerErrors('numero_contacto')"></v-number-input>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col cols="12" sm="4">
                        <v-text-field v-model="item_personal_institucional.cargo" label="Cargo (*)"
                            color="indigo-lighten-1" :error-messages="showSerializerErrors('cargo')" clearable />

                    </v-col>

                    <v-col cols="12" sm="4">
                        <v-text-field v-model="item_personal_institucional.grado_academico" label="Grado academico (*)"
                            color="indigo-lighten-1" :error-messages="showSerializerErrors('grado_academico')"
                            clearable />
                    </v-col>
                </v-row>

                <v-row>
                    <v-col cols="12" sm="4">
                        <v-number-input v-model="item_personal_institucional.ci" label="C.I. (*)"
                            color="indigo-lighten-1" :model-value="Number(item_personal_institucional.ci)" clearable
                            :error-messages="showSerializerErrors('ci')" />
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-text-field v-model="item_personal_institucional.ci_complemento" label="Complemento"
                            color="indigo-lighten-1" clearable
                            :error-messages="showSerializerErrors('ci_complemento')" />
                    </v-col>

                    <v-col cols="12" sm="4">
                        <v-autocomplete v-model="item_personal_institucional.ci_expedido" label="Expedido en (*)"
                            :items="['SC', 'CH', 'CB', 'PT', 'BN', 'LP', 'PA', 'TJ', 'OR', 'SinExp']"
                            color="indigo-lighten-1" clearable
                            :error-messages="showSerializerErrors('ci_expedido')"></v-autocomplete>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" sm="4">
                        <v-textarea v-model="item_personal_institucional.direccion" label="Direccion (*)"
                            color="indigo-lighten-1" :error-messages="showSerializerErrors('direccion')" clearable />
                    </v-col>

                    <v-col cols="12" sm="4">
                        <v-textarea v-model="item_personal_institucional.observaciones" label="Observaciones" clearable
                            color="indigo-lighten-1" :error-messages="showSerializerErrors('Observaciones')" />
                    </v-col>

                </v-row>

                <v-row>
                    <v-col cols="12" sm="6">
                        <v-file-input accept="image/*" label="Foto" color="indigo-lighten-1"
                            :error-messages="showSerializerErrors('usuario.picture')" v-model="image_file"
                            @change="uploadImage" @click:clear="clearImageFile">
                            <template v-slot:append>
                                <v-btn v-bind="props" icon="mdi-camera" color="indigo-lighten-1" @click="openCamera" />
                            </template>
                        </v-file-input>
                    </v-col>
                </v-row>

                <div class="ma-1 image-content">
                    <v-img v-if="src_image !== null" width="280px" height="280px" :src="src_image" />
                </div>

                <v-btn type="submit" color="indigo-lighten-1" variant="elevated" :loading="loading_btn">
                    <v-icon icon="mdi-content-save-outline" start></v-icon>
                    Guardar
                </v-btn>

            </v-form>
        </v-card-text>
    </v-card>

    <v-dialog v-model="dialog_camera" persistent max-width="600px" max-height="600px">
        <v-card>
            <v-card-title class="text-h6 bg-indigo-lighten-1 pa-4">
                <v-icon icon="mdi-camera"></v-icon>
            </v-card-title>
            <v-card-text>
                <Camera ref="refCamera" :autoplay="false" />

                <v-select label="Dispositivos de camara" :items="devices_camera" item-value="deviceId"
                    item-title="label" color="bg-indigo-lighten-1" @update:model-value="changeCameraDevice($event)"
                    :error-messages="devices_camera.length == 0 ? 'No hay dispositivos de camara.' : ''">
                    <template v-slot:item="{ props, item }">
                        <v-list-item v-bind="props" :title="item.raw.label" />
                    </template>
                </v-select>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red" variant="elevated" @click="closeCamera">
                    <v-icon icon="mdi-close" start></v-icon>
                    Cerrar
                </v-btn>
                <v-btn color="indigo-lighten-1" variant="elevated" @click="capturePhoto"
                    :disabled="devices_camera.length == 0 ? true : false">
                    <v-icon icon="mdi-record-circle-outline"></v-icon>
                </v-btn>
            </v-card-actions>

        </v-card>
    </v-dialog>

    <v-overlay v-model="loading_form" class="align-center justify-center" persistent>
        <div class="text-center">
            <v-progress-circular color="indigo-lighten-1" indeterminate size="100"></v-progress-circular>
            <p class="text-white text-h6">
                Cargando datos...
            </p>
        </div>
    </v-overlay>
</template>

<style scoped>
.image-content {
    border: 1px dashed #000;
    width: 280px;
    height: 280px;
}
</style>
