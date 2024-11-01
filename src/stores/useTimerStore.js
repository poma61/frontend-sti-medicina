
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useTimerStore = defineStore('useTimerStore', () => {
    const is_running = ref(false);
    let timer = null
    const hours = ref(0)
    const minutes = ref(0)
    const seconds = ref(0)
    const date_now_seconds = ref(0)

    // Inicializar el tiempo desde localStorage
    const initializeTimer = () => {
        const saved_seconds = localStorage.getItem('savedSeconds')
        if (saved_seconds) {
            date_now_seconds.value = parseInt(saved_seconds)
        }
    }

    const startTimer = () => {
        initializeTimer()
        if (!is_running.value) {
            is_running.value = true
            const start_time = Date.now() - date_now_seconds.value * 1000

            timer = setInterval(() => {
                date_now_seconds.value = Math.floor((Date.now() - start_time) / 1000)
                localStorage.setItem('savedSeconds', date_now_seconds.value) 
            }, 1000);
        }
    }

    const stopTimer = () => {
        is_running.value = false
        clearInterval(timer)
        date_now_seconds.value = 0
        localStorage.removeItem('savedSeconds')
    }

    const toTimer = () => {
        hours.value = String(Math.floor(date_now_seconds.value / 3600)).padStart(2, '0')
        minutes.value = String(Math.floor((date_now_seconds.value % 3600) / 60)).padStart(2, '0')
        seconds.value = String(date_now_seconds.value % 60).padStart(2, '0')
        return `${hours.value}:${minutes.value}:${seconds.value}`
    }

    return { startTimer, stopTimer, toTimer }
})
