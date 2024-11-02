<script setup>
import { ref, nextTick, onBeforeUnmount, onBeforeMount } from 'vue';
import CuestionarioIsTemaOfAI from '@/http/api/CuestionarioIsTemaOfAI';
import { completeLoadingToast, showLoadingToast, toastError, toastInfo } from '@/composables/toastify';
import Tema from '@/http/api/Tema';
import DOMPurify from 'dompurify';
import TutorAI from '@/http/api/TutorAI';
import ProgresoEstudio from '@/http/api/ProgresoEstudio';

const loading_overlay = ref(false);
const props = defineProps(['p_questionary', 'p_item_tema', 'p_time'])
const evaluation_of_ai = ref("")
const generate_audio_status = ref(true)
const abort_text_to_speeah_request = ref(null)
const audio = ref(null)
const abort_evaluate_question_request = ref(null)
const loading_audio = ref(null)
const is_unmounted = ref(false)

const completeProgresoEstudio = async () => {
    const data_progreso_estudio = {
        tema: props.p_item_tema.id,
        tiempo_est: props.p_time,
    }
    const data_parameters = {
        finished_tema_and_question: true,
        questionary: props.p_questionary,
        evaluation_of_ai: evaluation_of_ai.value,
    }

    const progreso_estudio = new ProgresoEstudio(data_progreso_estudio)

    progreso_estudio.loadParameters(data_parameters)
    const response = await progreso_estudio.createOrUpdate()

    if (!response.api_status) {
        toastError(response.detail)
    }
}

const isEvaluateQuestionsAI = async () => {
    try {
        loading_overlay.value = true
        let fragment
        let v = true
        const actividad_tema = new CuestionarioIsTemaOfAI()
        const tema = new Tema({ ...props.p_item_tema })

        abort_evaluate_question_request.value = new AbortController()

        const { reader, decoder } = await actividad_tema.evaluateQuestionsAI(props.p_questionary, tema, abort_evaluate_question_request.value.signal);
        // si ya recibimos el stream desabilitamos el overlay
        loading_overlay.value = false

        while (v) {
            const { value: chunk, done } = await reader.read();
            if (done) {
                break
            }
            // Decodificar el fragmento
            fragment = decoder.decode(chunk, { stream: true })
            evaluation_of_ai.value += fragment

            nextTick(() => {
                scrollToBottom()
            })
        }
        // Una vez generado texto actualizamos progreso de esutudio
        await completeProgresoEstudio()

        abort_evaluate_question_request.value = null
        // eliminamos * para evitar que el audio no genere  el caracter *
        const text = evaluation_of_ai.value.replace(/\*/g, '')
        await sendTextToSpeech(text)

    } catch (error) {
        // solo mostramos errores que NO sean BodyStreamBuffer y  AbortError
        if (!error.message.includes("AbortError") && !error.message.includes("BodyStreamBuffer")) {
            toastError(error.message);
        }
        loading_overlay.value = false
        abort_evaluate_question_request.value = null  //reiniciar
    }
}

const generateAudioStatus = () => {

    //cambiamos estado de la habilitacion del audio
    generate_audio_status.value = !generate_audio_status.value
    if (generate_audio_status.value && !is_unmounted.value) {
        toastInfo("Audio activado")
    } else if (!generate_audio_status.value && !is_unmounted.value) {
        toastInfo("Audio desactivado")
    }


    // si hay una peticion request en proceso lo detenemos
    if (abort_text_to_speeah_request.value != null) {
        abort_text_to_speeah_request.value.abort()
    }

    // si hay audio lo pausamos
    if (audio.value != null) {
        audio.value.pause()
    }
}

//  convertir de texto a audio
const sendTextToSpeech = async (text) => {
    try {
        //permitir generar audio solo si esta en true
        if (!generate_audio_status.value) {
            return
        }

        abort_text_to_speeah_request.value = new AbortController()
        loading_audio.value = showLoadingToast("Procesando audio...")

        const tutor_ai = new TutorAI()
        audio.value = await tutor_ai.textToSpeech(text, abort_text_to_speeah_request.value.signal)
        completeLoadingToast(loading_audio.value)


        audio.value.oncanplaythrough = () => {
            audio.value.play()
        }
        audio.value.onerror = (e) => {
            toastError("Se produjo un error al reproducir audio")
        }
        abort_text_to_speeah_request.value = null //reiniciar

    } catch (error) {
        if (loading_audio.value != null) {
            // detenemos el toast de generacion de audio
            completeLoadingToast(loading_audio.value)
        }

        // solo mostramos errores que NO sean BodyStreamBuffer y  AbortError
        if (!error.message.includes("AbortError") && !error.message.includes("BodyStreamBuffer")) {
            toastError(error.message)
        }
        abort_text_to_speeah_request.value = null //reiniciar
    }

}

const scrollToBottom = () => {
    // Desplazarse suavemente al final de la página
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
    })
}

const formatTextINHtml = (content) => {
    const formattedContent = content
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') // Para **
        .replace(/\n/g, '<br/>')// Para \n
    // Sanitiza el contenido
    return DOMPurify.sanitize(formattedContent);
}

onBeforeMount(async () => {
    await isEvaluateQuestionsAI()
})

onBeforeUnmount(() => {
    //indica que el componenete se esta desmontando
    // de esta manera no mostramos ningun toast
    is_unmounted.value = true
    generateAudioStatus()
    // detenemos la evaluacion del cuestionario por AI
    if (abort_evaluate_question_request.value != null) {
        abort_evaluate_question_request.value.abort()
    }

})
</script>

<template>
    <div class="controls-tutor-ai">
        <v-tooltip text="Audio TutorAI">
            <template v-slot:activator="{ props }">
                <v-btn v-bind="props" :icon="generate_audio_status ? 'mdi-volume-high' : 'mdi-volume-off'"
                    color="deep-purple-lighten-1" @click="generateAudioStatus" />
            </template>
        </v-tooltip>
    </div>

    <v-card max-width="1000px" min-height="85vh" class="pa-4 mx-auto" :elevation="2">
        <v-card-subtitle class="text-h6 text-indigo-darken-3">
            <v-icon icon="mdi-pencil-box-outline"></v-icon>
            Evaluar cuestionario
            <v-divider color="indigo-lighten-1" opacity="0.7"></v-divider>
        </v-card-subtitle>
        <v-card-text>
            <p class="mb-5 text-body-2 text-disabled">
                TutorAI puede cometer errores. Considere verificar la evaluacion del cuestionario.
            </p>
            <p v-html="formatTextINHtml(evaluation_of_ai)" class="text-body-1 no-selected"></p>
        </v-card-text>
    </v-card>

    <v-overlay v-model="loading_overlay" class="align-center justify-center" persistent>
        <div class="text-center">
            <v-progress-circular color="indigo-lighten-1" indeterminate size="100"></v-progress-circular>
            <p class="text-white text-h6">
                El Tutor Inteligente esta revisando el cuestionario.
            </p>
            <p class="text-white text-h6">Espere un momento...</p>
        </div>
    </v-overlay>
</template>

<style scoped>
.no-selected {
    -webkit-user-select: none !important;
    -ms-user-select: none !important;
    user-select: none !important;
}

.controls-tutor-ai {
    position: fixed;
    top: 50px;
    width: fit-content;
    right: 0px;
    padding: 10px;
    display: flex;
    z-index: 999;
    gap: 5px;
    flex-direction: column;
}
</style>
