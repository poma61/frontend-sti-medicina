<script setup>
import NavigationDrawer from '@/layouts/NavigationDrawer.vue';
import { usePermission, useUser } from '@/stores/useAuthenticateStore';
import { onBeforeMount } from 'vue';

const user_store = useUser()
const permission_store = usePermission()

onBeforeMount(async () => {
    // Cargamos recursos
    await permission_store.userPermission()
    await user_store.isUser()
})

</script>

<template>
    <!-- KeepAlive => Guarda en cache algunos valores del commponente para volver  NO volver a renderizar desde cero -->
    <!-- al llegar a max:10 libera cache 
 -->
    <KeepAlive :max="10">
        <component :is="NavigationDrawer" />
    </KeepAlive>

    <v-main class="ma-3">
        <slot></slot>
    </v-main>

</template>
