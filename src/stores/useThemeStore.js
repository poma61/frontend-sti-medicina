import { defineStore } from "pinia"
import { ref } from "vue"

export const useThemeStore = defineStore('theme', () => {
    const theme = ref('light')

    // Inicializar el tema
    const init = () => {
        const saved_theme = localStorage.getItem("theme");
        if (saved_theme) {
            setThemeState(JSON.parse(saved_theme));
        } else {
            // Establecer el tema por defecto
            // si esque no tenemos el tema en local storage
            setThemeState(theme.value)
        }
    }

    const setThemeState = (is_theme) => {
        localStorage.setItem("theme", JSON.stringify(is_theme));
        theme.value = is_theme
    }

    const getThemeState = () => {
        return theme.value
    }

    const toggleTheme = () => {
        const current_Theme = getThemeState() // Obtener el tema actual
        const new_Theme = (current_Theme == 'dark') ? 'light' : 'dark'
        setThemeState(new_Theme); // Guardar el nuevo tema para su persistencia
    }

    init()
    return {getThemeState, toggleTheme }
});
