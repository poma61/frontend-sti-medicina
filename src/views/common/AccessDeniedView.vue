<script setup>
import logo from '@/assets/images/logo-medicina.png'
import BaseTemplate from '@/layouts/BaseTemplate.vue';
</script>

<template>
    <BaseTemplate>
        <v-empty-state headline="Ups" title="Usted no tiene permiso para realizar esta acción."
            text="Acceso denegado" :image="logo"></v-empty-state>
    </BaseTemplate>
</template>