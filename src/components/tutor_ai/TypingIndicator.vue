<script setup>
const props = defineProps(['p_is_typing']);
</script>

<template>
    <div v-if="props.p_is_typing" class="typing-indicator">
        <span class="text-body-1 text-success">Escribiendo</span>
        <span class="dot bg-success"></span>
        <span class="dot bg-success"></span>
        <span class="dot bg-success"></span>
    </div>
</template>

<style scoped>
.typing-indicator {
    display: flex;
    align-items: center;
}

.dot {
    width: 7px; /* Aumenta el tamaño del punto */
    height: 7px; /* Aumenta el tamaño del punto */
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
