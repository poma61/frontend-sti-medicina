<script setup>
import BaseTemplate from '@/layouts/BaseTemplate.vue';
import ContentCirurgia from '@/components/internado_rotatorio/ContentCirurgia.vue';

</script>
<template>
    <BaseTemplate>
        <h1 class="text-h6 my-1 pa-1 bg-indigo-darken-1 as-box-shadow">
            <v-icon icon="mdi-account-group" start></v-icon>
            Cirurgia
        </h1>
        <ContentCirurgia />
    </BaseTemplate>
</template>

