<script setup>
import { ref, onMounted, nextTick } from 'vue';
import ActividadTema from '@/http/api/ActividadTema';
import { toastError } from '@/composables/toastify';

const loading_overlay = ref(false);
const props = defineProps(['p_all_questions'])
const result = ref("") 

const isEvaluateQuestionsAI = async () => {
    try {
        loading_overlay.value = true
        let fragment
        let v = true
        const actividad_tema = new ActividadTema()

        const { reader, decoder } = await actividad_tema.evaluateQuestionsAI(props.p_all_questions);
        // si ya recibimos el stream desabilitamos el overlay
        loading_overlay.value = false

        while (v) {
            const { value: chunk, done } = await reader.read();
            if (done) {
                break;
            }
            // Decodificar el fragmento
            fragment = decoder.decode(chunk, { stream: true })
            result.value += fragment
          
            nextTick(() => {
                scrollToBottom()
            })
        }

    } catch (error) {
        loading_overlay.value = false
        toastError(error)
    }
}

const scrollToBottom = () => {
    // Desplazarse suavemente al final de la página
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
    })
}
onMounted(()=>{
    isEvaluateQuestionsAI()
 console.log(props.p_all_questions)

})
</script>

<template>
    <v-card max-width="1000px" min-height="85vh" class="pa-4 mx-auto" :elevation="2">
        <v-card-subtitle class="text-h6 text-indigo-darken-3">
            <v-icon icon="mdi-pencil-box-outline"></v-icon>
            Evaluar cuestionario
            <v-divider color="indigo-lighten-1" opacity="0.7"></v-divider>
        </v-card-subtitle>
        <v-card-text>
            {{ result }}
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


