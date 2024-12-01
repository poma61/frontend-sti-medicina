<script setup>
import { ref, onMounted, nextTick, watch, onBeforeUnmount, } from 'vue'
import DOMPurify from 'dompurify'
import { completeLoadingToast, showLoadingToast, toastError, toastInfo } from '@/composables/toastify'
import TypingIndicator from '@/components/tutor_ai/TypingIndicator.vue'
import TutorAI from '@/http/api/TutorAI'
import HelpDialog from '@/components/tutor_ai/HelpDialog.vue'
import BarControls from '@/components/tutor_ai/BarControls.vue'
import HistoryChatDrawer from '@/components/tutor_ai/HistoryChatDrawer.vue'

const messages = ref([
    {
        role: 'assistant',
        content: 'Hola, soy tu tutor inteligente. ¿En qué puedo ayudarte hoy?'
    }
])
const user_message = ref('')
const loading = ref(false)
const textareaRef = ref(null);
const loading_typing_indicator = ref(false)
const assistant_message = ref({})
const abort_text_to_speeah_request = ref(null)
const abort_tutor_ai_request = ref(null)
const audio = ref(null)
const generate_audio_status = ref(true)
const dialog_help = ref(false)
const loading_audio = ref(null)
const max_words = ref(800)
const word_count_message = ref('')
const word_count = ref(0)
const is_unmounted = ref(false)

const newChat = () => {
    messages.value = []
    // si hay una peticion request de audio en proceso detenemos
    if (abort_text_to_speeah_request.value != null) {
        abort_text_to_speeah_request.value.abort()
    }

    // si hay audio
    if (audio.value != null) {
        // pausamos el audio de reproduccion
        audio.value.pause()
    }
    // si tutor ai esta respondiendo detenemos
    if (abort_tutor_ai_request.value != null) {
        abort_tutor_ai_request.value.abort()
    }
}

const closeHelpDialog = () => {
    dialog_help.value = false
}

const openHelpDialog = () => {
    dialog_help.value = true
}

const generateAudioStatus = () => {
    //cambiamos estado de la habilitacion del audio
    generate_audio_status.value = !generate_audio_status.value
    if (generate_audio_status.value && !is_unmounted.value) {
        toastInfo("Audio activado")
    } else if (!generate_audio_status.value && !is_unmounted.value) {
        toastInfo("Audio desactivado")
    }

    // si hay una peticion request de audio en proceso detenemos
    if (abort_text_to_speeah_request.value != null) {
        abort_text_to_speeah_request.value.abort()
    }

    // si hay audio
    if (audio.value != null) {
        // pausamos el audio de reproduccion
        audio.value.pause()
    }
}

//  convertir de texto a audio
const sendTextToSpeech = async (text) => {
    try {
        //permitir generar audio solo si esta  habilitadi
        if (!generate_audio_status.value) {
            return
        }
        abort_text_to_speeah_request.value = new AbortController()

        const tutor_ai = new TutorAI()
        loading_audio.value = showLoadingToast("Procesando audio...")

        audio.value = await tutor_ai.textToSpeech(text, abort_text_to_speeah_request.value.signal)
        completeLoadingToast(loading_audio.value)

        audio.value.oncanplaythrough = () => {
            audio.value.play()
        }
        audio.value.onerror = (e) => {
            toastError("Se produjo un error al reproducir audio");
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
        abort_text_to_speeah_request.value = null
    }
}

// Función para manejar el envío de mensajes
const sendMessage = async () => {
    try {
        // eliminamos espacios al final e inicio
        // y si no hay palabras retornamos
        if (!user_message.value.trim()) {

            return
        }
        // si la cantidad de palabras super no enviamos mensaje
        if (word_count.value > max_words.value) {
            return
        }

        // si hay audio reproduciendose pausamos para evitar choques de audio
        if (audio.value != null) {
            audio.value.pause()
        }

        const message = user_message.value
        messages.value.push({ role: 'user', content: message })
        loading.value = true
        user_message.value = '' // reiniciar el valor

        // Añadimos un mensaje vacío inicialmente del asistente
        assistant_message.value = { role: 'assistant', content: "" }
        messages.value.push(assistant_message.value)

        // iniciamos el AbortController
        abort_tutor_ai_request.value = new AbortController()

        const tutor_ai = new TutorAI()
        // indicamos que esta escribiendo mientras esperamos la solicitud http
        loading_typing_indicator.value = true
        const { reader, decoder } = await tutor_ai.tutorAI(message, abort_tutor_ai_request.value.signal)
        loading_typing_indicator.value = false

        const v = true
        let fragment
        while (v) {
            const { value: chunk, done } = await reader.read()

            if (done) {
                break
            }
            // Decodificar el fragmento
            fragment = decoder.decode(chunk, { stream: true })
            assistant_message.value.content += fragment;  // Acumulamos el fragmento

            nextTick(() => {
                // Desplazarse suavemente al final de la página
                autoScroollTo()
            })
        }
        // eliminamos * para evitar que el audio no genere  el caracter *
        const text = assistant_message.value.content.replace(/\*/g, '')
        await sendTextToSpeech(text)
        loading.value = false
        abort_tutor_ai_request.value = null // reinicar el AbortController()

    } catch (error) {
        // solo mostramos errores que NO sean BodyStreamBuffer y  AbortError
        if (!error.message.includes("AbortError") && !error.message.includes("BodyStreamBuffer")) {
            toastError(error.message);
        }
        abort_tutor_ai_request.value = null
        loading.value = false
        loading_typing_indicator.value = false
    }
}

const checkWordCount = () => {
    // Contar palabras y actualizar el contador
    word_count.value = user_message.value.trim().split(/\s+/).filter(word => word).length;
    // Mensaje sobre el límite de palabras
    if (word_count.value > max_words.value) {
        word_count_message.value = `Máximo de ${max_words.value} palabras.`;

    } else {
        word_count_message.value = ''
    }
}


const autoScroollTo = () => {
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
    return DOMPurify.sanitize(formattedContent)
}


// Clase para los mensajes, dependiendo si es del usuario o del asistente
const getMessageClass = (role) => {
    return role == 'user' ? 'is-align-self-end ' : 'is-align-self-start'
}

// Manejar el evento de Enter y Shift + Enter
const handleEnterKey = (event) => {
    if (event.shiftKey) {
        // Si Shift está presionado, permite el salto de línea
        return
    } else {
        // Si solo es Enter, se envía el mensaje siempre y cuando no se este generando (loading)
        sendMessage()
    }
}

watch(() => user_message.value, () => {
    nextTick(() => {
        // Desplazarse suavemente al final de la página
        autoScroollTo()
    })
})

watch(() => loading.value, () => {
    nextTick(() => {
        textareaRef.value.focus()
    })
})


onMounted(() => {
    nextTick(() => {
        // Desplazarse suavemente al final de la página
        autoScroollTo()
    })
})

onBeforeUnmount(() => {
    //indica que el componenete se esta desmontando
    // de esta manera no mostramos ningun toast
    is_unmounted.value = true
    generateAudioStatus()
    // si tutor ai esta respondiendo detenemos
    if (abort_tutor_ai_request.value != null) {
        abort_tutor_ai_request.value.abort()
    }
})
</script>

<template>
<!--   <HistoryChatDrawer /> -->
  
    <BarControls :p_generate_audio_status="generate_audio_status" @toGenerateAudioStatus="generateAudioStatus"
        @toNewChat="newChat" @toOpenHelpDialog="openHelpDialog" />

    <!-- Chat menssages -->
    <div class="chat-container">
        <v-list class="is-flex">
            <!-- Mensajes del Chat -->
            <v-list-item v-for="(message, index) in messages" :key="index" :class="getMessageClass(message.role)">
                <v-card :append-icon="message.role == 'user' ? 'mdi-account' : null" class="pa-2"
                    :variant="message.role == 'user' ? 'tonal' : null">
                    <p v-html="formatTextINHtml(message.content)" class="text-body-1"></p>
                </v-card>
            </v-list-item>
            <v-list-item v-if="loading_typing_indicator">
                <TypingIndicator :p_is_typing="true" />
            </v-list-item>
        </v-list>
    </div>

    <!-- Input para escribir mensajes -->
    <v-footer app>
        <div class="textarea-user-message">
            <v-textarea v-model="user_message" placeholder="Escribe tu mensaje..." clearable :disabled="loading"
                rows="2" color="cyan-darken-1" ref="textareaRef" @keyup.enter="handleEnterKey" auto-grow :max-rows="6"
                variant="outlined" class="text-center"
                :messages="'TutorAI puede cometer errores. Considere verificar la informacion proporcionada.'"
                @input="checkWordCount" :error-messages="word_count_message" :maxlength="max_words" counter>
            </v-textarea>
            <v-btn class="ma-1" color="cyan-darken-1" icon="mdi-send" @click="sendMessage"
                :disabled="loading || !user_message" :loading="loading" />
        </div>
    </v-footer>

    <v-dialog v-model="dialog_help" max-width="1000px" scrollable>
        <HelpDialog @toCloseHelpDialog="closeHelpDialog" />
    </v-dialog>

</template>

<style scoped>
.textarea-user-message {
    display: flex;
    justify-content: center;
    margin: auto;
    align-items: center;
    flex-wrap: wrap;
    width: 70%;
}

.is-flex {
    display: flex;
    flex-direction: column;
    margin: 2px;
    background-color: transparent !important;
}

.is-align-self-end {
    align-self: end;
}

.is-align-self-start {
    align-self: start;
}


.chat-container {
    margin: 0px 100px;
}

/* Para dispositivos con un ancho de pantalla máximo de 1000px */
@media only screen and (max-width: 1000px) {
    .textarea-user-message {
        width: 100%;
    }

    .chat-container {
        margin: 0px 40px;
    }

}

/* Para dispositivos con un ancho de pantalla máximo de 1000px */
@media only screen and (max-width: 800px) {
    .controls-tutor-ai {
        flex-direction: row;
    }

    .chat-container {
        margin: 40px 0px;
    }
}
</style>
