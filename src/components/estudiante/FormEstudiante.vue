<script setup>
import { ref, defineProps, defineEmits, watch, computed } from 'vue';

const props = defineProps(["p_item_estudiante"])
const emit = defineEmits(["toItemRefreshDataTable", "toNewForm"])

const item_estudiante = ref(props.p_item_estudiante);
const src_image = ref(null);
const loading_btn = ref(false);
const serializer_errors_validate = ref({});

// cuando el valor de props.p_item_estudiante cambian desde el componente padre
// debemos actualizar item_estudiante
watch(() => props.p_item_estudiante, () => {
    item_estudiante.value = props.p_item_estudiante
})
const showSerializerErrors = computed(() => {
    return function (field) {
        if (serializer_errors_validate.value[field]) {
            return serializer_errors_validate.value[field][0]
        }
        return ""
    }
})

const save = () => {
    loading_btn.value = true
    setTimeout(() => {
        loading_btn.value = false
    }, 200)
}

</script>


<template>
    <v-card>
        <v-card-title class="bg-indigo-lighten-1 pa-4">
            <span class="text-h6" v-if="item_estudiante.usuario.id == 0"> Registrar nuevo estudiante</span>
            <span class="text-h6" v-else> Actualizar datos del estudiante</span>
        </v-card-title>
        <!-- formulairo -->
        <v-card-text class="pa-4">
            <p class="text-red text-subtitle-1">Los campos marcados con (*) son obligatorios.</p>
            <v-form @submit.prevent="save">
                <p class="text-h6">Usuario</p>
                <v-divider class="mb-5" opacity="0.3"></v-divider>
                <v-row>
                    <v-col cols="12" sm="4">
                        <v-text-field v-model="item_estudiante.usuario.user" label="Usuario (*)"
                            color="indigo-lighten-1" clearable :error-messages="showSerializerErrors('usuario.user')" />
                    </v-col>

                    <v-col cols="12" sm="4">
                        <v-text-field v-model="item_estudiante.usuario.password" label="Contraseña (*)"
                            color="indigo-lighten-1" clearable
                            :error-messages="showSerializerErrors('usuario.password')" />
                    </v-col>

                    <v-col cols="12" sm="4">
                        <v-text-field v-model="item_estudiante.usuario.email" label="Correo electronico (*)"
                            color="indigo-lighten-1" clearable
                            :error-messages="showSerializerErrors('usuario.email')" />
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" sm="4">
                        <v-switch color="indigo-lighten-1" label="Activo" v-model="item_estudiante.usuario.is_active"
                            inset hide />
                    </v-col>
                </v-row>

                <p class="text-h6">Datos del estudiante</p>
                <v-divider class="mb-5" opacity="0.3"></v-divider>
                <v-row>
                    <v-col cols="12" sm="4">
                        <v-text-field v-model="item_estudiante.nombres" label="Nombres (*)" color="indigo-lighten-1"
                            clearable :error-messages="showSerializerErrors('nombres')" />
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-text-field v-model="item_estudiante.apellido_paterno" label="Apellido paterno (*)"
                            color="indigo-lighten-1" clearable
                            :error-messages="showSerializerErrors('apellido_paterno')" />
                    </v-col>

                    <v-col cols="12" sm="4">
                        <v-text-field v-model="item_estudiante.apellido_materno" label="Apellido materno (*)"
                            color="indigo-lighten-1" clearable
                            :error-messages="showSerializerErrors('apellido_materno')" />
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" sm="4">
                        <v-select v-model="item_estudiante.genero" label="Genero (*)" :items="['masculino', 'femenino']"
                            color="indigo-lighten-1" clearable
                            :error-messages="showSerializerErrors('genero')"></v-select>
                    </v-col>

                    <v-col cols="12" sm="4">
                        <v-text-field v-model="item_estudiante.fecha_nacimiento" label="Fecha de nacimiento (*)"
                            color="indigo-lighten-1" :error-messages="showSerializerErrors('fecha_nacimiento')"
                            type="date" />
                    </v-col>

                    <v-col cols="12" sm="4">
                        <v-text-field v-model="item_estudiante.numero_contacto" label="N° de contacto (*)"
                            color="indigo-lighten-1" :error-messages="showSerializerErrors('numero_contacto')"
                            type="number" />
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-text-field v-model="item_estudiante.matricula_univ" label="Matricula universitaria (*)"
                            color="indigo-lighten-1" :error-messages="showSerializerErrors('matricula_univ')"
                            type="number" />
                    </v-col>

                    <v-col cols="12" sm="4">
                        <v-text-field v-model="item_estudiante.internado_rot" label="Internado Rotario (*)"
                            color="indigo-lighten-1" :error-messages="showSerializerErrors('internado_rot')" />
                    </v-col>
                </v-row>

                <v-row>
                    <v-col cols="12" sm="4">
                        <v-text-field v-model="item_estudiante.ci" label="C.I. (*)" color="indigo-lighten-1" clearable
                            :error-messages="showSerializerErrors('ci')" />
                    </v-col>

                    <v-col cols="12" sm="4">
                        <v-autocomplete v-model="item_estudiante.ci_expedido" label="Expedido (*)"
                            :items="['SC', 'CH', 'CB', 'PT', 'BN', 'LP', 'PA', 'TJ', 'OR', 'SinExp']"
                            color="indigo-lighten-1" clearable
                            :error-messages="showSerializerErrors('ci_expedido')"></v-autocomplete>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" sm="4">
                        <v-textarea v-model="item_estudiante.direccion" label="Direccion (*)" color="indigo-lighten-1"
                            :error-messages="showSerializerErrors('direccion')" />
                    </v-col>

                    <v-col cols="12" sm="4">
                        <v-textarea v-model="item_estudiante.observaciones" label="Observaciones"
                            color="indigo-lighten-1" :error-messages="showSerializerErrors('Observaciones')" />
                    </v-col>

                </v-row>

            </v-form>

        </v-card-text>
        <!-- accionees -->
        <v-divider opacity="0.3"></v-divider>
        <v-card-actions>
            <v-btn color="indigo-lighten-1" variant="elevated" @click="save" :loading="loading_btn">
                <v-icon icon="mdi-content-save-outline"></v-icon>&nbsp;Guardar
            </v-btn>
        </v-card-actions>
    </v-card>
</template>
