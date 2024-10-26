<script setup>
import BaseTemplate from '@/layouts/BaseTemplate.vue';
import ContentSaludPublica from '@/components/areas_internado_rotatorio/ContentSaludPublica.vue';

</script>
<template>
    <BaseTemplate>
        <h1 class="text-h6 my-1 pa-1 bg-teal-darken-1 as-box-shadow">
            <v-icon icon="mdi-account-group"></v-icon>
            Salud Publica
        </h1>
        <ContentSaludPublica />
    </BaseTemplate>
</template>

