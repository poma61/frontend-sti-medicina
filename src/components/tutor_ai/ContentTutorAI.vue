<script setup>
import { useThemeStore } from '@/stores/useThemeStore';
import { ref, onMounted, nextTick, watch, } from 'vue';
import { useUserStore } from "@/stores/useUserStore";
import { useRouter } from 'vue-router';
import DOMPurify from 'dompurify';
import { toastError } from '@/composables/toastify';


/**
 * NOTA importante: 
 * Todo el codigo del tutorAI  esta aqui, el navigation chat NO se esta aqui
 */
// data
const router = useRouter()
const userStore = useUserStore();
const messages = ref([
    { role: 'assistant', content: 'Hola, soy tu tutor inteligente. ¿En qué puedo ayudarte hoy?' }
])
const use_theme = useThemeStore()
const user_message = ref('')
const loading = ref(false)
const chatContainerRef = ref(null)
const drawer_visible = ref(true) // Estado para controlar la visibilidad de la barra lateral
const textareaRef = ref(null); // Ref para el textarea
// Añadimos un mensaje vacío inicialmente del asistente
const assistant_message = ref({})

const returnMainMenu = () => {
    router.push({ name: 'n-home' })
}

// **************************************
// Función para manejar el envío de mensajes
const sendMessage = async () => {
    if (!user_message.value.trim()) return;

    // Agregar el mensaje del usuario al chat
    messages.value.push({ role: 'user', content: user_message.value })
    const message_to_send = user_message.value
    user_message.value = ''
    loading.value = true

    // const url = "http://127.0.0.1:8000/api/gen-ai/interaccion-tutorai/"
    const url = "http://192.168.0.200:8000/api/gen-ai/interaccion-tutorai/"
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_message: message_to_send  // Enviar el mensaje del usuario al backend
            })
        });

        if (!response.ok) {
            throw new Error("Error en la respuesta de la API");
        }

        const reader = response.body.getReader()
        const decoder = new TextDecoder("utf-8")
        let result = "";  // Acumulador de la respuesta del asistente

        // Añadimos un mensaje vacío inicialmente del asistente
        assistant_message.value = { role: 'assistant', content: '' }
        messages.value.push(assistant_message.value)

        const v = true
        let fragment
        while (v) {
            const { value, done } = await reader.read()
            if (done) break;

            // Decodificar el fragmento
            fragment = decoder.decode(value, { stream: true })
            result += fragment;  // Acumulamos el fragmento

            // Actualizamos el mensaje del asistente 
            // la ui se actualiza por la reactividad de vue
            assistant_message.value.content = result
            nextTick(() => {
                chatContainerRef.value.scrollTop = chatContainerRef.value.scrollHeight;
            })
        }
        loading.value = false;

    } catch (error) {
        nextTick(() => {
            textareaRef.value.focus()
        })
        toastError(error + "")
        loading.value = false;
    }
}

const formatMessage = (content) => {
    const formattedContent = content
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') // Para **
        .replace(/\n/g, '<br/>');// Para \n

    return DOMPurify.sanitize(formattedContent); // Sanitiza el contenido
}

/// ******************************
// Clase para los mensajes, dependiendo si es del usuario o del asistente
const getMessageClass = (role) => {
    return role === 'user' ? 'is-align-self-end ' : 'is-align-self-start'
}

// Manejar el evento de Enter y Shift + Enter
const handleEnterKey = (event) => {
    if (event.shiftKey) {
        // Si Shift está presionado, permite el salto de línea
        return;
    }
    // Si solo es Enter, se envía el mensaje
    event.preventDefault(); // Evita el comportamiento por defecto de Enter
    sendMessage();
}


watch(() => user_message.value, () => {
    nextTick(() => {
        chatContainerRef.value.scrollTop = chatContainerRef.value.scrollHeight;
    })
})

watch(() => loading.value, () => {
    nextTick(() => {
        textareaRef.value.focus()
    })
})

// Desplazar el chat automáticamente hacia abajo al montarse
onMounted(() => {
    nextTick(() => {
        chatContainerRef.value.scrollTop = chatContainerRef.value.scrollHeight;
    })
    userStore.userAuthData()
})


</script>

<template>
    <!--app bar, titulo -->
    <v-app-bar app color="light-blue-darken-3" height="50">
        <v-app-bar-nav-icon :icon="drawer_visible ? 'mdi-chevron-left' : 'mdi-chevron-right'"
            @click.stop="drawer_visible = !drawer_visible"> </v-app-bar-nav-icon>
        <v-toolbar-title>TutorAI</v-toolbar-title>
        <v-spacer></v-spacer>

        <v-btn :icon="use_theme.getThemeState() == 'dark' ? 'mdi-brightness-5' : 'mdi-brightness-3'"
            @click="use_theme.toggleTheme" />
        <v-btn icon="mdi-backburger" @click="returnMainMenu">

        </v-btn>
    </v-app-bar>

    <!-- Chat menssages -->
    <div ref="chatContainerRef" class="chat-container">
        <v-container>
            <v-main>

                <v-list class="is-flex">
                    <!-- Mensajes del Chat -->
                    <v-list-item v-for="(message, index) in messages" :key="index"
                        :class="getMessageClass(message.role)">
                        <v-card :prepend-icon="message.role == 'assistant' ? 'mdi-atom-variant' : null"
                            :append-icon="message.role == 'user' ? 'mdi-account' : null" class="pa-2"
                            :variant="message.role == 'user' ? 'tonal' : null">
                            <p v-html="formatMessage(message.content)"></p>
                        </v-card>
                    </v-list-item>
                </v-list>

                <!-- Input para escribir mensajes -->
                <v-footer app>
                    <div class="textarea-user-message">
                        <v-textarea v-model="user_message" placeholder="Escribe tu mensaje..." clearable
                            :disabled="loading" rows="2" color="cyan-darken-1" ref="textareaRef"
                            @keyup.enter="handleEnterKey" auto-grow :max-rows="6" variant="outlined" class="text-center"
                            :messages="'TutorAI puede cometer errores. Considere verificar la informacion proporcionada.'">
                        </v-textarea>
                        <v-btn class="ma-1" color="cyan-darken-1" icon="mdi-send" @click="sendMessage"
                            :disabled="loading || !user_message" :loading="loading" />
                    </div>
                </v-footer>
            </v-main>
        </v-container>
    </div>

</template>

<style scoped>
.textarea-user-message {
    display: flex;
    justify-content: center;
    flex-grow: 0.9;
    margin: auto;
    align-items: center;
    flex-wrap: wrap;
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
    max-height: 100vh;
    overflow-y: auto;
}
</style>
