<script setup>
import app from '@/config/app';
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale' // Importar la configuración regional en español


const emit = defineEmits(['toCloseItemDetails'])
const props = defineProps(['p_item_estudiante'])

</script>

<template>
    <v-card>
        <v-card-title class="bg-cyan-darken-1 pa-4">

            <h6 class="text-h6">
                <v-icon icon="mdi-account-school" start></v-icon>
                Datos del estudiante
            </h6>
        </v-card-title>
        <v-card-text>
            <v-table>
                <tbody>
                    <tr>
                        <td colspan="2">
                            <div class="text-center ma-2">
                                <v-avatar size="200" :image="app.BASE_URL + props.p_item_estudiante.usuario.picture" />
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td class="font-weight-bold">Nombres:</td>
                        <td>{{ props.p_item_estudiante.nombres }}</td>
                    </tr>

                    <tr>
                        <td class="font-weight-bold">Apellido paterno:</td>
                        <td>{{ props.p_item_estudiante.apellido_paterno }}</td>
                    </tr>

                    <tr>
                        <td class="font-weight-bold">Apellido materno:</td>
                        <td>{{ props.p_item_estudiante.apellido_materno }}</td>
                    </tr>
                    <tr>
                        <td class="font-weight-bold">Correo electronico:</td>
                        <td> <v-chip color="cyan-darken-2" label>{{ props.p_item_estudiante.usuario.email }} </v-chip>
                        </td>
                    </tr>
                    <tr>
                        <td class="font-weight-bold">C.I.:</td>
                        <td>{{ props.p_item_estudiante.ci }}
                            {{ props.p_item_estudiante.ci_complemento }}
                            {{ props.p_item_estudiante.ci_expedido }}</td>
                    </tr>
                    <tr>
                        <td class="font-weight-bold">Genero:</td>
                        <td>{{ props.p_item_estudiante.genero }}</td>
                    </tr>
                    <tr>
                        <td class="font-weight-bold">Fecha nacimiento:</td>
                        <td>{{ format(parseISO(props.p_item_estudiante.fecha_nacimiento), 'dd/MMMM/yyyy', {
                            locale: es
                        }) }}
                        </td>
                    </tr>
                    <tr>
                        <td class="font-weight-bold">Número de contacto:</td>
                        <td> <v-chip color="cyan-darken-2" label> {{ props.p_item_estudiante.numero_contacto }}
                            </v-chip>
                        </td>
                    </tr>

                    <tr>
                        <td class="font-weight-bold">Matricula universitaria:</td>
                        <td> <v-chip color="cyan-darken-2" label>{{ props.p_item_estudiante.matricula_univ }} </v-chip>
                        </td>
                    </tr>
                    <tr>
                        <td class="font-weight-bold">Internado Rotatorio:</td>
                        <td>{{ props.p_item_estudiante.internado_rot }}</td>
                    </tr>
                    <tr>
                        <td class="font-weight-bold">Dirección:</td>
                        <td>{{ props.p_item_estudiante.direccion }}</td>
                    </tr>

                    <tr>
                        <td class="font-weight-bold">Observaciones:</td>
                        <td>{{ props.p_item_estudiante.observaciones }}</td>
                    </tr>

                </tbody>
            </v-table>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-btn @click="emit('toCloseItemDetails')" color="cyan-darken-1" variant="elevated">
                <v-icon icon="mdi-close" start></v-icon>
                Cerrar
            </v-btn>
        </v-card-actions>
    </v-card>
</template>
