<script setup>
import { ref, onMounted, nextTick } from 'vue';
import ActividadTema from '@/http/api/ActividadTema';
import { toastError } from '@/composables/toastify';
import Tema from '@/http/api/Tema';
import ActividadEvaluarCuestionarioTema from "@/components/areas_internado_rotatorio/temas/ActividadEvaluarCuestionarioTema.vue"

// Estado para almacenar las preguntas y respuestas
const all_questions = ref([]);
const disable_text_field = ref(false);
const loading_overlay = ref(false);
const question = ref({})
const props = defineProps(['p_item_tema'])
const component = ref({
    generar_cuestionario: true,
    evaluar_cuestionario: false,
})

const isGenerateQuestionsAI = async () => {
    try {
        all_questions.value = [] // Reiniciar preguntas
        disable_text_field.value = true
        loading_overlay.value = true
        let fragment
        let v = true
        let result = ""
        let purge_pregunta

        const actividad_tema = new ActividadTema()
        const tema = new Tema({ ...props.p_item_tema })  // debemos enviar datos de un tema para que la ia genere preguntas
        const { reader, decoder } = await actividad_tema.generateQuestionsAI(tema);
        // si ya recibimos el stream desabilitamos el overlay
        loading_overlay.value = false

        //iniciamos para la primera pregunta
        question.value = { pregunta: '', respuesta: '' }
        all_questions.value.push(question.value)

        while (v) {
            const { value: chunk, done } = await reader.read();
            if (done) {
                break;
            }
            // Decodificar el fragmento
            fragment = decoder.decode(chunk, { stream: true })
            result += fragment
            question.value.pregunta = result
            //result.includes('\n') => indica que finalizo la pregunta
            if (result.includes('\n')) {
                //antes de reiniciar pregunta.value eliminamos el  \n
                purge_pregunta = question.value.pregunta
                question.value.pregunta = purge_pregunta.replaceAll('\n', '')
                //reiniciar result para la otra pregunta y apregar un objeto question para otra pregunta
                result = ""
                question.value = { pregunta: '', respuesta: '' }
                all_questions.value.push(question.value)
            }
            nextTick(() => {
                scrollToBottom()
            })
        }
        // solo habilitamos se se genero el cuestionario
        disable_text_field.value = false

    } catch (error) {
        loading_overlay.value = false
        toastError(error)
    }
}

const evaluateAllQuestions = () => {
    component.value.generar_cuestionario = false
    component.value.evaluar_cuestionario = true
}

const filterSpecialChars = (event, index) => {
    // Expresión regular que permite letras, números, puntos y guiones
    const regex = /[^a-zA-Z0-9. -]/g
    const value = event.target.value
    const filtered_value = value.replace(regex, "")
    all_questions.value[index].respuesta = filtered_value
}

const scrollToBottom = () => {
    // Desplazarse suavemente al final de la página
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
    })
}


onMounted(() => {
    isGenerateQuestionsAI()
})
</script>


<template>
    <!-- generar cuestionario -->
    <v-card v-if="component.generar_cuestionario" max-width="1000px" min-height="85vh" class="pa-4 mx-auto"
        :elevation="2">
        <v-card-subtitle class="text-h6 text-indigo-darken-3">
            <v-icon icon="mdi-head-question"></v-icon>
            Cuestionario
            <v-divider color="indigo-lighten-1" opacity="0.5"></v-divider>
        </v-card-subtitle>

        <v-card-text>
            <p class="mb-5 text-body-2 text-disabled">
                TutorAI puede cometer errores. Considere verificar las preguntas generadas.
            </p>
            <div v-for="(item, index) in all_questions" :key="index">
                <p class="text-body-1 no-selected">{{ item.pregunta }}</p>
                <v-text-field v-model="item.respuesta" placeholder="Escribe tu respuesta..." clearable
                    :disabled="disable_text_field" color="indigo-lighten-1"
                    @input="filterSpecialChars($event, index)" />
            </div>
        </v-card-text>

        <v-card-actions>
            <v-btn @click="evaluateAllQuestions" v-if="!disable_text_field" color="indigo-lighten-1" variant="elevated"
                class="ma-1">
                <v-icon icon="mdi-arrow-right"></v-icon>
                Evaluarme
            </v-btn>
        </v-card-actions>
        <v-overlay v-model="loading_overlay" class="align-center justify-center" persistent>
            <div class="text-center">
                <v-progress-circular color="indigo-lighten-1" indeterminate size="100"></v-progress-circular>
                <p class="text-white text-h6">
                    El Tutor Inteligente esta generando un cuestionario en base al texto leido.
                </p>
                <p class="text-white text-h6">Espere un momento...</p>
            </div>
        </v-overlay>
    </v-card>

    <!-- Evaluar cuestionario -->
    <ActividadEvaluarCuestionarioTema v-else :p_all_questions="all_questions" :p_item_tema="props.p_item_tema" />

</template>

<style scoped>
.no-selected {
    -webkit-user-select:none !important; 
  -ms-user-select: none !important;  
  user-select: none !important; 
}
</style>