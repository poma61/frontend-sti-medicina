<script setup>

import { useRouter } from 'vue-router';

const router = useRouter()

const goBack = () =>{
    router.push({ name:'n-ir-medicina-interna' })
}

</script>

<template>
    <div class="d-flex flex-wrap">
        <v-btn color="deep-purple-lighten-1" variant="elevated" class="ma-1"  rounded @click="goBack">
            <v-icon icon="mdi-arrow-left"></v-icon>
            Regresar
        </v-btn>
    </div>
</template>