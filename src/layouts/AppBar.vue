<script setup>
import { ref } from 'vue'
import { useAuth } from '@/stores/useAuthenticateStore'
import { useRouter } from 'vue-router'
import { toastError } from '@/composables/toastify'
import app from '@/config/app'
import { useThemeStore } from '@/stores/useThemeStore'
import { useTime } from 'vue-timer-hook'
import { useNavigationDrawerStore } from "@/stores/useNavigationDrawerStore";


//data
const loading_logout = ref(false)
const emit = defineEmits(['byHiddenNavigationDrawerEmit'])
const props = defineProps(['p_user'])
const menu = ref(false)
const dialog = ref(false)
const router = useRouter()
const theme_store = useThemeStore()
const time = useTime()


const authLogout = () => {
    dialog.value = false
    loading_logout.value = true
    setTimeout(async () => {
        const use_auth = useAuth()
        const response = await use_auth.logoutUser()
        loading_logout.value = false

        if (!response.api_status) {
            toastError(response.detail)
        }
        // Aunque la peticion dee error en store se cierra la sesion resetando valorews de useAuth
        router.push('/')

    }, 200)
}


const drawer_store = useNavigationDrawerStore()

const reloadPage = () => {
    //recargar la pagina completa
    router.go(0)

}

const formatTime = (unit) => {
    return unit.value.toString().padStart(2, '0')
}
</script>

<template>
    <v-app-bar app color="cyan-darken-3" height="50" :elevation="10" >
        <v-app-bar-nav-icon @click.stop="drawer_store.toggleNavigationDrawer()"></v-app-bar-nav-icon>
        <v-spacer></v-spacer>

        <v-chip label class="mx-1 text-body-1" color="">
            <v-icon icon="mdi-clock" start></v-icon>
            {{ formatTime(time.hours) }}:{{ formatTime(time.minutes) }}:{{ formatTime(time.seconds) }}
        </v-chip>

        <v-btn :icon="theme_store.getThemeState() == 'dark' ? 'mdi-weather-night' : 'mdi-weather-sunny'"
            @click="theme_store.toggleTheme" />

        <v-btn icon="mdi-refresh" @click="reloadPage" />
        <!-- Otros elementos del app bar si es necesario -->
        <!-- <v-badge :content="1" color="cyan-darken-1">
            <v-icon icon="mdi-bell"></v-icon>
        </v-badge> -->

        <v-menu v-model="menu" :close-on-content-click="false" location="bottom" class="float-sm-end">

            <template v-slot:activator="{ props }">
                <v-btn v-bind="props" icon="mdi-dots-vertical"></v-btn>
            </template>

            <v-card min-width="250">
                <v-list>
                    <v-list-item :prepend-avatar="app.BASE_URL + props.p_user.picture"
                        :title="`${props.p_user.nombres} ${props.p_user.apellido_paterno} ${props.p_user.apellido_materno}`"
                        :subtitle="`${props.p_user.user_type}`">
                    </v-list-item>
                </v-list>

                <v-list>
                    <v-list-item :to="{ name: 'n-perfil' }">
                        <v-icon icon="mdi-account" color="success" start></v-icon>
                        <span>Perfil</span>
                    </v-list-item>

                    <v-list-item @click="dialog = true">
                        <v-icon icon="mdi-close" color="red" start></v-icon>
                        <span>Salir</span>
                    </v-list-item>

                </v-list>
            </v-card>
        </v-menu>
    </v-app-bar>

    <v-dialog v-model="dialog" persistent width="auto">
        <v-card class="px-5 py-5">
            <v-card-text class="text-center">
                <v-icon icon="mdi-lock-outline" size="100" color="red"
                    class="animate__animated animate__infinite animate__bounce"></v-icon>
            </v-card-text>
            <p class="text-h6 text-center">
                ¿Esta seguro de salir del sistema?
            </p>
            <div class="d-flex justify-center">
                <v-btn color="red" variant="tonal" @click="dialog = false" class="ma-1">
                    <v-icon icon="mdi-cancel" start></v-icon>
                    Cancelar
                </v-btn>
                <v-btn color="green-darken-1" variant="tonal" class="ma-1" @click="authLogout()">
                    <v-icon icon="mdi-check-circle-outline" start></v-icon>
                    Si
                </v-btn>
            </div>
        </v-card>
    </v-dialog>

    <v-overlay v-model="loading_logout" class="d-flex align-center justify-center">
        <div class="text-center">
            <v-progress-circular color="cyan-darken-1" indeterminate size="100"></v-progress-circular>
            <p class="text-h6 text-white">Cerrando todos los modulos del sistema...</p>
        </div>
    </v-overlay>
</template>
