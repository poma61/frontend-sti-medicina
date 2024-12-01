<script setup>
import { useHistoryChatDrawerStore } from '@/stores/useHistoryChatDrawerStore';

const history_chat_drawer_store = useHistoryChatDrawerStore()

</script>

<template>

    <v-navigation-drawer location="right" v-model="history_chat_drawer_store.drawer" app color="grey-lighten-1"
        @update:model-value="history_chat_drawer_store.setHistoryChatDrawer($event)">
        <v-divider></v-divider>
        <v-list density="compact" nav>
            <v-list-item prepend-icon="mdi-message-text" title="Medico" value="home"></v-list-item>
            <v-list-item prepend-icon="mdi-message-text" title="Ayuda" value="account"></v-list-item>
            <v-list-item prepend-icon="mdi-message-text" title="Texto" value="users"></v-list-item>
        </v-list>
    </v-navigation-drawer>

</template>