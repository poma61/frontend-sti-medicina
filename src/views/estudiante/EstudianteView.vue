<script>
// Option API
import BaseTemplate from '@/layouts/BaseTemplate.vue';
import { defineComponent } from 'vue';
import ContentEstudiante from '@/components/estudiante/ContentEstudiante.vue';
export default defineComponent({
    components: { BaseTemplate, ContentEstudiante },

})
</script>
<template>
    <BaseTemplate>
        <h1 class="text-h6 my-3 pa-1 bg-blue-grey-lighten-1 as-box-shadow">
            <v-icon icon="mdi-account-school"></v-icon>
            Estudiantes
        </h1>
        <ContentEstudiante />
    </BaseTemplate>
</template>
