<script setup>
import { defineProps } from 'vue';
const props = defineProps(['p_is_typing']);
</script>

<template>
    <div v-if="props.p_is_typing" class="typing-indicator">
        <span class="text-body-1">Escribiendo</span>
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
    </div>
</template>

<style scoped>
.typing-indicator {
    display: flex;
    margin: 10px 0; /* Añade un poco de margen vertical */
    align-items: center;
}

.dot {
    width: 8px; /* Aumenta el tamaño del punto */
    height: 8px; /* Aumenta el tamaño del punto */
    background-color: #000000; /* Color del punto */
    border-radius: 50%; /* Hace que los puntos sean circulares */
    animation: blink 1s infinite; /* Añade la animación */
    margin: 0 4px; /* Espaciado entre puntos */
}

.dot:nth-child(1) {
    animation-delay: 0s; /* Retraso para el primer punto */
}

.dot:nth-child(2) {
    animation-delay: 0.2s; /* Retraso para el segundo punto */
}

.dot:nth-child(3) {
    animation-delay: 0.4s; /* Retraso para el tercer punto */
}

@keyframes blink {
    0%, 20% { opacity: 1; }
    80%, 100% { opacity: 0; }
}
</style>
