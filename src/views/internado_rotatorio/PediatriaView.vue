<script setup>
import BaseTemplate from '@/layouts/BaseTemplate.vue';
import ContentPediatria from '@/components/internado_rotatorio/ContentPediatria.vue';

</script>
<template>
    <BaseTemplate>
        <h1 class="text-h6 my-1 pa-1 bg-cyan-darken-1 as-box-shadow">
            <v-icon icon="mdi-account-group" start></v-icon>
            Pediatria
        </h1>
        <ContentPediatria />
    </BaseTemplate>
</template>

