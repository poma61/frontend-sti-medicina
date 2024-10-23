<script>
// Option API
import { defineComponent } from 'vue';
import ContentPersonalInstitucional from '@/components/personal_institucional/ContentPersonalInstitucional.vue';
import BaseTemplate from '@/layouts/BaseTemplate.vue';
export default defineComponent({
    components: {BaseTemplate, ContentPersonalInstitucional },

})
</script>
<template>
      <BaseTemplate>
        <h1 class="text-h6 my-3 pa-1 bg-cyan-darken-1 as-box-shadow">
            <v-icon icon="mdi-home-city-outline"></v-icon>
            Personal institucional
        </h1>
        <ContentPersonalInstitucional />
    </BaseTemplate>
</template>
