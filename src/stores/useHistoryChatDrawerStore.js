import { defineStore } from "pinia";
import { ref } from "vue";

export const useHistoryChatDrawerStore = defineStore("useHistoryChatDrawerStore", () => {
  const drawer = ref(
    JSON.parse(localStorage.getItem("useHistoryChatDrawerState")) ?? true
  );

  const toggleHistoryChatDrawer = () => {
    drawer.value = !drawer.value;
    localStorage.setItem("useHistoryChatDrawerState", JSON.stringify(drawer.value));
  };

  const setHistoryChatDrawer = (state) => {
    drawer.value = state;
    localStorage.setItem("useHistoryChatDrawerState", JSON.stringify(state));
  };

  return { drawer, toggleHistoryChatDrawer, setHistoryChatDrawer };
});
  