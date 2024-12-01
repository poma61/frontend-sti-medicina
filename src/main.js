import "@/assets/main.css";
import "vue3-toastify/dist/index.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "@/App.vue";
import router from "@/router";
import vuetify from "@/plugins/vuetify";

import "animate.css";

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(vuetify);
app.mount("#app");
