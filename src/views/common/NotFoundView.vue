<script setup>
import logo from '@/assets/images/logo-medicina.png'
import BaseTemplate from '@/layouts/BaseTemplate.vue';
</script>

<template>
    <BaseTemplate>
        <v-empty-state headline="Ups, 404" title="Recurso no encontrada."
            text="El recurso que estabas buscando no existe." :image="logo"></v-empty-state>
    </BaseTemplate>
</template>