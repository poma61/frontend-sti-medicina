<script setup>
import BaseTemplate from '@/layouts/BaseTemplate.vue';
import ContentMedicinaInterna from '@/components/internado_rotatorio/ContentMedicinaInterna.vue';

</script>
<template>
    <BaseTemplate>
        <h1 class="text-h6 my-1 pa-1 bg-deep-purple-lighten-1 as-box-shadow">
            <v-icon icon="mdi-account-group" start></v-icon>
            Medicina Interna
        </h1>
        <ContentMedicinaInterna />
    </BaseTemplate>
</template>
