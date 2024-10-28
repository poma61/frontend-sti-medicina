<script setup>
import { ref, onMounted, nextTick, onUnmounted, onBeforeUnmount } from 'vue';
import ActividadTema from '@/http/api/ActividadTema';
import { completeLoadingToast, showLoadingToast, toastError } from '@/composables/toastify';
import Tema from '@/http/api/Tema';
import DOMPurify from 'dompurify';
import TutorAI from '@/http/api/TutorAI';

const loading_overlay = ref(false);
const props = defineProps(['p_all_questions', 'p_item_tema'])
const result = ref("")
const generate_audio_status = ref(true)
const abort_text_to_speeah_request = ref(null)
const audio = ref(null)
const abort_evaluate_question_request = ref(null)
const loading_audio = ref(null)

const isEvaluateQuestionsAI = async () => {
    try {
        loading_overlay.value = true
        let fragment
        let v = true
        const actividad_tema = new ActividadTema()
        const tema = new Tema({ ...props.p_item_tema })

        abort_evaluate_question_request.value = new AbortController()

        const { reader, decoder } = await actividad_tema.evaluateQuestionsAI(props.p_all_questions, tema, abort_evaluate_question_request.value.signal);
        // si ya recibimos el stream desabilitamos el overlay
        loading_overlay.value = false

        while (v) {
            const { value: chunk, done } = await reader.read();
            if (done) {
                break
            }
            // Decodificar el fragmento
            fragment = decoder.decode(chunk, { stream: true })
            result.value += fragment

            nextTick(() => {
                scrollToBottom()
            })
        }
        abort_evaluate_question_request.value = null
        // eliminamos * para evitar que el audio no genere  el caracter *
        const text = result.value.replace(/\*/g, '')
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

onMounted(() => {
    isEvaluateQuestionsAI()
})

onBeforeUnmount(() => {
    // detenemos generacion de audio y si hay una solicitud en curso tambien detenemos
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
            <p v-html="formatTextINHtml(result)" class="text-body-1 no-selected"></p>
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
