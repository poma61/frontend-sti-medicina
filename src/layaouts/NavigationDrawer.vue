<template>
    <v-app>
        <v-navigation-drawer v-model="drawer" app class="as-navigation-drawer">
            <div class="d-flex flex-column justify-center align-center">
                <v-list-item :prepend-avatar="require('@/assets/images/logo-empresa.jpeg')" title="ADMINISTRACION" nav>
                </v-list-item>
            </div>
            <v-divider></v-divider>

            <v-list density="compact" nav>
                <div class="d-flex flex-column justify-center align-center my-2">
                    <v-avatar :image="app.BASE_URL + user.foto_image_path" size="80"></v-avatar>
                    <p class="text-subtitle-1">{{ `${user.nombres} ${user.apellido_paterno} ${user.apellido_materno}` }}</p>
                </div>

                <v-divider class="border-opacity-25 my-2"></v-divider>
                <p class="text-subtitle-1 font-weight-bold">EMPRESA</p>
                <v-list-item prepend-icon="mdi-view-dashboard" title="Inicio" value="Inicio" :to="{ name: 'n-inicio' }" />

                <v-divider class="border-opacity-25 my-2"></v-divider>
                <p class="text-subtitle-1 font-weight-bold">ALMACEN</p>

                <v-list-item prepend-icon="mdi-cart-outline" title="Compras" value="Compras"
                    :to="{ name: 'n-compra', params: { ciudad: 'la-paz' } }"
                    :class="{ 'v-list-item--active': route.name == 'n-compra' }" />

                <v-list-item prepend-icon="mdi-store" title="Depositos" value="Depositos"
                    :to="{ name: 'n-deposito', params: { ciudad: 'la-paz' } }"
                    :class="{ 'v-list-item--active': route.name == 'n-deposito' }" />

                <v-list-item prepend-icon="mdi-list-box-outline" title="Productos" value="Productos"
                    :to="{ name: 'n-producto' }" />

                <v-divider class="border-opacity-25 my-2"></v-divider>
                <p class="text-subtitle-1 font-weight-bold">CONSUMIDOR</p>
                <v-list-item prepend-icon="mdi-select-group" title="Grupos" value="Grupos"
                    :to="{ name: 'n-grupo', params: { ciudad: 'la-paz' } }"
                    :class="{ 'v-list-item--active': route.name == 'n-grupo' }" />

                <v-list-item prepend-icon="mdi-account-group" title="Clientes" value="Clientes"
                    :to="{ name: 'n-cliente', params: { ciudad: 'la-paz' } }"
                    :class="{ 'v-list-item--active': route.name == 'n-cliente' }" />

                <v-divider class="border-opacity-25 my-2"></v-divider>
                <p class="text-subtitle-1 font-weight-bold">ADMINISTRACION</p>
                <v-list-item prepend-icon="mdi-home-account" title="Personal" value="Personal"
                    :to="{ name: 'n-personal', params: { ciudad: 'la-paz' } }"
                    :class="{ 'v-list-item--active': route.name == 'n-personal' }" />

                <v-list-item prepend-icon="mdi-account-circle-outline" title="Usuarios" value="Usuarios"
                    :to="{ name: 'n-usuario', params: { ciudad: 'la-paz' } }"
                    :class="{ 'v-list-item--active': route.name == 'n-usuario' }" />
            </v-list>
        </v-navigation-drawer>

        <AppBar @openByCloseNavigationDrawerEmit="openByCloseNavigationDrawer" :p_user="user" />
        <v-main class="ma-3">
            <slot></slot>
        </v-main>
    </v-app>
</template>

<script setup>
import { useRoute } from 'vue-router';
import AppBar from '@/layouts/AppBar.vue';
import { ref, onMounted, nextTick } from 'vue';
import { useAuth } from '@/stores/useAuth';
import toastify from '@/composables/toastify';
import app from '@/config/app';
const route = useRoute();

//data
const drawer = ref(true);
const user = ref({
    user: "",
    rol_name: "",
    nombres: "",
    apellido_paterno: "",
    apellido_materno: "",
    foto: "",
});

//methods
const openByCloseNavigationDrawer = () => {
    drawer.value = !drawer.value;
}

const auth = async () => {
    const auth = useAuth();
    const response = await auth.user();
    if (response.status) {
        user.value = response.record;
    } else {
        toastify('danger', response.message);
    }
};

onMounted(async () => {
    auth();
});
</script>