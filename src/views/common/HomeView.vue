<script setup>
import BaseTemplate from '@/layouts/BaseTemplate.vue'

import ContentHome from '@/components/home/ContentHome.vue';

</script>

<template>
  <BaseTemplate>
    <h1 class="text-h6 my-1 pa-1 bg-cyan-darken-1 as-box-shadow">
      <v-icon icon="mdi-view-dashboard" start></v-icon>&nbsp;Inicio
    </h1>

    <ContentHome />

  </BaseTemplate>
</template>

<style scoped>
.as-img-home {
  width: 350px;
  height: 350px;
}
</style>
