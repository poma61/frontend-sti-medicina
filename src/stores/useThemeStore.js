import { defineStore } from "pinia";
import { useTheme } from 'vuetify';

export const useThemeStore = defineStore('theme', () => {
    const use_theme = useTheme();

    // Inicializar el tema
    const init = () => {
        const saved_theme = localStorage.getItem("theme");
        if (saved_theme) {
            setThemeState(JSON.parse(saved_theme));
        } else {
            // Establecer el tema por defecto
            // si esque no tenemos el tema en local storage
            const default_theme = use_theme.global.name.value;
            setThemeState(default_theme)
        }
    }

    const setThemeState = (theme) => {
        localStorage.setItem("theme", JSON.stringify(theme));
        use_theme.global.name.value = theme
    }

    const getThemeState = () => {
        return use_theme.global.name.value
    }

    const toggleTheme = () => {
        const current_Theme = getThemeState() // Obtener el tema actual
        const new_Theme = (current_Theme == 'dark') ? 'light' : 'dark'
        setThemeState(new_Theme); // Guardar el nuevo tema para su persistencia
    }

    init();
    return {getThemeState, toggleTheme };
});
