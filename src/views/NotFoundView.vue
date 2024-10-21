<script setup>
import BaseTemplate from '@/layouts/BaseTemplate.vue';
import logo from '@/assets/images/logo-medicina.png'
</script>

<template>
    <BaseTemplate>
        <v-empty-state headline="Ups, 404" title="Recurso no encontrada." text="El recurso que estabas buscando no existe."
            :image="logo"></v-empty-state>
    </BaseTemplate>
</template>