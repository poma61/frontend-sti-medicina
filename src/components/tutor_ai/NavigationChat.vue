<script setup>
import app from '@/config/app';
import { ref, onMounted  } from 'vue';
import { useUserStore } from "@/stores/useUserStore";
import logo from "@/assets/images/logo-medicina.png";
import { useRouter } from 'vue-router';

// data
const userStore = useUserStore();
const drawer_visible = ref(true) // Estado para controlar la visibilidad de la barra lateral

// Desplazar el chat automáticamente hacia abajo al montarse
onMounted(() => {
    userStore.userAuthData()
})
</script>

<template>
       <!-- Seccion lateral para ver el historial de mensajes -->
       <v-navigation-drawer app v-model="drawer_visible" class="as-navigation-drawer">
        <div class="d-flex flex-column justify-center align-center">
            <v-list-item :prepend-avatar="logo" title="InternAI Tutor" nav />
        </div>
        <v-divider></v-divider>
        <v-list nav>
            <div class="d-flex flex-column justify-center align-center my-2">
                <v-avatar :image="app.BASE_URL + userStore.user.picture" size="80"></v-avatar>
                <p class="text-subtitle-1">
                    {{
                        `${userStore.user.nombres} ${userStore.user.apellido_paterno} ${userStore.user.apellido_materno}`
                    }}
                </p>
            </div>
            <v-divider class="my-3"></v-divider>

            <!-- <v-list-item v-for="(message, index) in messages" :key="index" :value="index">
                <v-list-item-title :class="{ 'font-weight-bold': message.role === 'user' }">
                    {{ message.content }}
                </v-list-item-title>
            </v-list-item> -->

        </v-list>
    </v-navigation-drawer>
</template>

