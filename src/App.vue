<script setup>
import { useThemeStore } from '@/stores/useThemeStore';
import { useRoute } from 'vue-router';

const use_theme = useThemeStore()
const route = useRoute()

</script>

<template>
        <!-- Si estamos en la ruta login entonces el tema debe ser 'light'
         caso contrario el tema del usuario
         Hacemos esto porque el login es modificado el css por esa razon se distorcina cuando el theme es dark -->
        <v-app :theme="route.name == 'n-login' ? 'light' : use_theme.getThemeState()">
                <router-view></router-view>
        </v-app>
</template>
