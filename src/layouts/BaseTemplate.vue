<script setup>
import NavigationDrawer from '@/layouts/NavigationDrawer.vue';

</script>

<template>
    <!-- KeepAlive => Guarda en cache algunos valores del commponente para volver  NO volver a renderizar desde cero -->
    <!-- al llegar a max:10 libera cache -->
    <KeepAlive :max="10">
        <NavigationDrawer />
    </KeepAlive>
    <v-main class="ma-3">
        <slot></slot>
    </v-main>
    
</template>
