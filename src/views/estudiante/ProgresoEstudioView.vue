<script setup>
import BaseTemplate from '@/layouts/BaseTemplate.vue';
import ContentProgresoEstudio from '@/components/estudiante/progreso_estudio/ContentProgresoEstudio.vue';
</script>
<template>
    <BaseTemplate>
        <h1 class="text-h6 my-1 pa-1 bg-indigo-darken-1 as-box-shadow">
            <v-icon icon="mdi-progress-clock" start></v-icon>
            Progreso de Estudio
        </h1>
        <ContentProgresoEstudio />
    </BaseTemplate>
</template>
