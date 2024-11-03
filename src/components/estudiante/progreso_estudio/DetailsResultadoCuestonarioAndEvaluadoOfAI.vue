<script setup>
import DOMPurify from 'dompurify';


const props = defineProps(['p_item_cuestonario'])
const emit = defineEmits(['toCloseDialogCuestionario'])

const formatTextINHtml = (content) => {
    const formattedContent = content
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') // Para **
        .replace(/\n/g, '<br/>')// Para \n
    // Sanitiza el contenido
    return DOMPurify.sanitize(formattedContent)
}

</script>

<template>
    <v-card>
        <v-card-title class="bg-indigo-darken-1">
            <v-icon icon="mdi-text-box-check" start></v-icon> Cuestionario evaluado
        </v-card-title>

        <v-card-text>
            <v-container>
                <v-stepper :items="['Cuestionario', 'Evaluacion']">
                    <template v-slot:item.1>
                        <div v-for="(row, index) in props.p_item_cuestonario.resultado_cuestionario" :key="index">
                            <p class="pa-1 text-body-1"> {{ row.pregunta }}</p>
                            <p class="pa-1 text-body-1"> <strong>Respuesta: </strong> {{ row.respuesta }}</p>
                            <v-divider></v-divider>
                        </div>
                    </template>

                    <template v-slot:item.2>
                        <p class="text-body-1"
                            v-html="formatTextINHtml(props.p_item_cuestonario.cuestionario_evaluado_of_ai.evaluate)">
                        </p>
                    </template>
                    <template v-slot:actions="{ prev, next }">
                        <div class="d-flex justify-center" style="width: 100%;">
                            <v-btn color="primary" @click="prev" class="ma-1" variant="tonal">
                                <v-icon icon="mdi-arrow-left" start></v-icon>
                                Anterior
                            </v-btn>

                            <!-- Botón de Siguiente (Next) -->
                            <v-btn color="primary" @click="next" class="ma-1" variant="tonal">
                                Siguiente
                                <v-icon icon="mdi-arrow-right" end></v-icon>
                            </v-btn>
                        </div>

                    </template>

                </v-stepper>
            </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>

            <v-btn class="ma-1" @click="emit('toCloseDialogCuestionario')" color="secondary" variant="elevated">
                <v-icon icon="mdi-close" start></v-icon> Cerrar
            </v-btn>

        </v-card-actions>
    </v-card>
</template>
