<script setup>
import app from '@/config/app';
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale' // Importar la configuración regional en español


const emit = defineEmits(['toCloseItemDetails'])
const props = defineProps(['p_item_personal_institucional', 'p_list_permisos'])

const objs_permisos = props.p_list_permisos.filter(
    row => props.p_item_personal_institucional.usuario.permisos.includes(row.code)
)
</script>

<template>
    <v-card>
        <v-card-title class="bg-teal-lighten-2 pa-4 text-wrap">
            <h6 class="text-h6">
                <v-icon icon="mdi-home-city-outline" start></v-icon>
                Datos del personal institucional
            </h6>
        </v-card-title>
        <v-card-text>
            <v-table>
                <tbody>
                    <tr>
                        <td colspan="2">
                            <div class="text-center ma-2">
                                <v-avatar size="200"
                                    :image="app.BASE_URL + props.p_item_personal_institucional.usuario.picture" />
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td class="font-weight-bold">Nombres:</td>
                        <td>{{ props.p_item_personal_institucional.nombres }}</td>
                    </tr>

                    <tr>
                        <td class="font-weight-bold">Apellido paterno:</td>
                        <td>{{ props.p_item_personal_institucional.apellido_paterno }}</td>
                    </tr>

                    <tr>
                        <td class="font-weight-bold">Apellido materno:</td>
                        <td>{{ props.p_item_personal_institucional.apellido_materno }}</td>
                    </tr>
                    <tr>
                        <td class="font-weight-bold">Correo electronico:</td>
                        <td> <v-chip color="cyan-darken-2" label>{{ props.p_item_personal_institucional.usuario.email }}
                            </v-chip></td>
                    </tr>
                    <tr>
                        <td class="font-weight-bold">Tipo de usuario:</td>
                        <td> <v-chip color="cyan-darken-2" label>
                                {{ props.p_item_personal_institucional.usuario.user_type }}
                            </v-chip></td>
                    </tr>

                    <tr>
                        <td class="font-weight-bold">C.I.:</td>
                        <td>
                            <v-chip color="cyan-darken-2" label>
                                {{ props.p_item_personal_institucional.ci }}
                                {{ props.p_item_personal_institucional.ci_complemento }}
                                {{ props.p_item_personal_institucional.ci_expedido }}
                            </v-chip>
                        </td>
                    </tr>
                    <tr>
                        <td class="font-weight-bold">Genero:</td>
                        <td>{{ props.p_item_personal_institucional.genero }}</td>
                    </tr>
                    <tr>
                        <td class="font-weight-bold">Fecha nacimiento:</td>
                        <td>{{ format(parseISO(props.p_item_personal_institucional.fecha_nacimiento), 'dd/MMMM/yyyy', {
                            locale:
                                es
                        }) }}
                        </td>
                    </tr>
                    <tr>
                        <td class="font-weight-bold">Número de contacto:</td>
                        <td> <v-chip color="cyan-darken-2" label> {{ props.p_item_personal_institucional.numero_contacto
                                }}
                            </v-chip>
                        </td>
                    </tr>

                    <tr>
                        <td class="font-weight-bold">Cargo:</td>
                        <td> {{ props.p_item_personal_institucional.cargo }}</td>
                    </tr>
                    <tr>
                        <td class="font-weight-bold">Grado academico:</td>
                        <td>{{ props.p_item_personal_institucional.grado_academico }}</td>
                    </tr>
                    <tr>
                        <td class="font-weight-bold">Dirección:</td>
                        <td>{{ props.p_item_personal_institucional.direccion }}</td>
                    </tr>

                    <tr>
                        <td class="font-weight-bold">Observaciones:</td>
                        <td>{{ props.p_item_personal_institucional.observaciones }}</td>
                    </tr>

                    <tr>
                        <td class="font-weight-bold">Permisos:</td>
                        <td>
                            <v-chip v-for="(permiso, idx) in objs_permisos " :key="idx" color="success" label
                                class="ma-1">
                                <v-icon icon="mdi-check" start />
                                {{ permiso.name }}
                            </v-chip>
                        </td>
                    </tr>

                </tbody>
            </v-table>

        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-btn @click="emit('toCloseItemDetails')" color="teal-lighten-2" variant="elevated">
                <v-icon icon="mdi-close" start></v-icon>
                Cerrar
            </v-btn>
        </v-card-actions>
    </v-card>
</template>
