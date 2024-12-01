import { defineStore } from "pinia";
import { ref } from "vue";

export const useNavigationDrawerStore = defineStore(
  "useNavigationDrawerStore",
  () => {
    const drawer = ref(true);

    const init = () => {
      if (localStorage.getItem("navigationDrawerState")) {
        drawer.value = JSON.parse(
          localStorage.getItem("navigationDrawerState")
        );
      }
    };
    init();

    const toggleNavigationDrawer = () => {
      drawer.value = !drawer.value;
      localStorage.setItem(
        "navigationDrawerState",
        JSON.stringify(drawer.value)
      );
    };

    const setNavigationDrawer = (state) => {
      drawer.value = state;
      localStorage.setItem("navigationDrawerState", JSON.stringify(state));
    };

    return { drawer, toggleNavigationDrawer, setNavigationDrawer };
  }
);
