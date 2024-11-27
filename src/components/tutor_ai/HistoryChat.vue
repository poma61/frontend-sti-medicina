<script setup>
import { ref } from 'vue';

const prop = defineProps(["p_generate_audio_status"])
const emit = defineEmits(["toGenerateAudioStatus", "toNewChat", "toOpenHelpDialog",])
const drawer = ref(true)

</script>


<template>
    <!-- 
    <v-navigation-drawer location="right" v-model="drawer" :rail="false" app color="grey-lighten-3" >
        <v-divider></v-divider>
        <v-list density="compact" nav>
            <v-list-item prepend-icon="mdi-message-text" title="Medico" value="home"></v-list-item>
            <v-list-item prepend-icon="mdi-message-text" title="Ayuda" value="account"></v-list-item>
            <v-list-item prepend-icon="mdi-message-text" title="Texto" value="users"></v-list-item>
        </v-list>
    </v-navigation-drawer>
-->
    <v-app-bar elevation="0" app style="background-color: transparent;">
        <v-spacer></v-spacer>

        <v-tooltip text="Audio TutorAI">
            <template v-slot:activator="{ props }">
                <v-btn v-bind="props" class="ma-1"
                    :icon="prop.p_generate_audio_status ? 'mdi-volume-high' : 'mdi-volume-off'" color="indigo-darken-1"
                    variant="elevated" @click="emit('toGenerateAudioStatus')" />
            </template>
        </v-tooltip>

        <v-tooltip text="Ayuda TutorAI">
            <template v-slot:activator="{ props }">
                <v-btn v-bind="props" class="ma-1" icon="mdi-help" color="indigo-darken-1" variant="elevated"
                    @click="emit('toOpenHelpDialog')" />
            </template>
        </v-tooltip>

        <v-tooltip text="Nuevo mensaje">
            <template v-slot:activator="{ props }">
                <v-btn v-bind="props" class="ma-1" icon="mdi-plus" color="indigo-darken-1" variant="elevated"
                    @click="emit('toNewChat')" />
            </template>
        </v-tooltip>
        <v-tooltip text="Chats">
            <template v-slot:activator="{ props }">
                <v-btn v-bind="props" :icon="drawer ? 'mdi-menu-right' : 'mdi-menu-left'" class="ma-1"
                    @click.stop="drawer = !drawer" variant="elevated" color="indigo-darken-1" />
            </template>
        </v-tooltip>

    </v-app-bar>


</template>
