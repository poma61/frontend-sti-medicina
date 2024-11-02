<script setup>
import { ref, nextTick, onBeforeUnmount, onBeforeMount } from 'vue';
import CuestionarioIsTemaOfAI from '@/http/api/CuestionarioIsTemaOfAI';
import { toastError } from '@/composables/toastify';
import Tema from '@/http/api/Tema';
import ActividadEvaluarCuestionarioTema from "@/components/internado_rotatorio/temas/ActividadEvaluarCuestionarioTema.vue"
import ProgresoEstudio from '@/http/api/ProgresoEstudio';

// Estado para almacenar las preguntas y respuestas
const questionary = ref([]);
const disable_text_field = ref(false);
const loading_overlay = ref(false);
const question = ref({})
const props = defineProps(['p_item_tema', 'p_time'])
const component = ref({
    generar_cuestionario: true,
    evaluar_cuestionario: false,
})
const abort_evaluate_question_request = ref(null)
const interval_id_register = ref(null)

const registerProgresoEstudio = async () => {
    const data_progreso_estudio = {
        tema: props.p_item_tema.id,
        tiempo_est: props.p_time,
    }
    const progreso_estudio = new ProgresoEstudio({ ...data_progreso_estudio })
    const response = await progreso_estudio.createOrUpdate()

    if (!response.api_status) {
        toastError(response.detail)
    }
}


const isGenerateQuestionsAI = async () => {
    try {
        questionary.value = []
        disable_text_field.value = true
        loading_overlay.value = true
        let fragment

        let result = ""
        let purge_pregunta

        const actividad_tema = new CuestionarioIsTemaOfAI()
        // debemos enviar datos de un tema para que la ia genere preguntas
        const tema = new Tema({ ...props.p_item_tema })
        abort_evaluate_question_request.value = new AbortController()

        const { reader, decoder } = await actividad_tema.generateQuestionsAI(tema, abort_evaluate_question_request.value.signal);

        loading_overlay.value = false

        //iniciamos para la primera pregunta
        question.value = { pregunta: '', respuesta: '' }
        questionary.value.push(question.value)

        let v = true
        while (v) {
            const { value: chunk, done } = await reader.read();
            if (done) {
                break;
            }

            fragment = decoder.decode(chunk, { stream: true })
            result += fragment
            question.value.pregunta = result

            if (result.includes('\n')) {
                //antes de reiniciar pregunta.value eliminamos el  \n
                purge_pregunta = question.value.pregunta
                question.value.pregunta = purge_pregunta.replaceAll('\n', '')
                //reiniciar result para la otra pregunta y apregar un objeto question para otra pregunta
                result = ""
                question.value = { pregunta: '', respuesta: '' }
                questionary.value.push(question.value)
            }
            nextTick(() => {
                scrollToBottom()
            })
        }
        abort_evaluate_question_request.value = null
        // solo habilitamos los campos de respuesta cuando se  genero el cuestionario
        disable_text_field.value = false

    } catch (error) {
        // solo mostramos errores que NO sean BodyStreamBuffer y  AbortError
        if (!error.message.includes("AbortError") && !error.message.includes("BodyStreamBuffer")) {
            toastError(error.message)
        }

        loading_overlay.value = false
        abort_evaluate_question_request.value = null
    }
}

const evaluateAllQuestions = () => {
    component.value.generar_cuestionario = false
    component.value.evaluar_cuestionario = true
    // Limpiamos el intervalo cuando mandamos evaluar cuestionario
    if (interval_id_register.value) {
        clearInterval(interval_id_register.value)
    }
}

const filterSpecialChars = (event, index) => {
    // Expresión regular que permite letras, números, puntos y guiones
    const regex = /[^a-zA-Z0-9. -]/g
    const value = event.target.value
    const filtered_value = value.replace(regex, "")
    questionary.value[index].respuesta = filtered_value
}

const scrollToBottom = () => {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
    })
}

onBeforeMount(async () => {
    // Ejecutamos la función cada 3 minutos (180000 ms) (1 min = 60000 ms)
    interval_id_register.value = setInterval(registerProgresoEstudio, 180000)
    await isGenerateQuestionsAI()

})
onBeforeUnmount(() => {
    // detenemos la evaluacion del cuestionario por AI
    if (abort_evaluate_question_request.value != null) {
        abort_evaluate_question_request.value.abort()
    }
    // Limpiamos el intervalo cuando el antes que el componente se desmonte 
    if (interval_id_register.value) {
        clearInterval(interval_id_register.value)
    }
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
            <div v-for="(item, index) in questionary" :key="index">
                <p class="text-body-1 no-selected">{{ item.pregunta }}</p>
                <v-text-field v-model="item.respuesta" placeholder="Escribe tu respuesta..." clearable
                    :disabled="disable_text_field" color="indigo-lighten-1" maxlength="200" counter
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
    <ActividadEvaluarCuestionarioTema v-else :p_questionary="questionary" v-bind="props" />

</template>

<style scoped>
.no-selected {
    -webkit-user-select: none !important;
    -ms-user-select: none !important;
    user-select: none !important;
}
</style>