
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { VNoSsr } from 'vuetify/lib/components/index.mjs';

export const useTimerStore = defineStore('timer', () => {
    const seconds = ref(0);
    const is_running = ref(false);
    let timer = null;

    // Inicializar el tiempo desde localStorage
    const initializeTimer = () => {
        const savedSeconds = localStorage.getItem('cronometro');
        if (savedSeconds) {
            seconds.value = parseInt(savedSeconds, 10);
        }
    }

    const startTimer = () => {
        if (!is_running.value) {
            is_running.value = true;
            const startTime = Date.now() - seconds.value * 1000;

            timer = setInterval(() => {
                seconds.value = Math.floor((Date.now() - startTime) / 1000);
                localStorage.setItem('cronometro', seconds.value);
            }, 1000);
        }
    }

    const stopTimer = () => {
        is_running.value = false
        seconds.value = 0
        clearInterval(timer)
        localStorage.removeItem('cronometro')
    }

    // Función para obtener el tiempo en formato HH:MM:SS
    const formatTime = () => {
        const hrs = String(Math.floor(seconds.value / 3600)).padStart(2, '0');
        const mins = String(Math.floor((seconds.value % 3600) / 60)).padStart(2, '0');
        const secs = String(seconds.value % 60).padStart(2, '0');
        return `${hrs}:${mins}:${secs}`;
    }

    initializeTimer()

    return { seconds, is_running, startTimer, stopTimer, formatTime }
})
