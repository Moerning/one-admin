import { createApp, provide, h } from "vue"
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import { useMainStore } from "@/stores/main.js";
import { useStyleStore } from "@/stores/style.js";
import { darkModeKey, styleKey } from "@/config.js";
import { DefaultApolloClient } from "@vue/apollo-composable"
import { apolloClient } from "./apollo-client"

import "./css/main.css";


/* Init Pinia */
const pinia = createPinia();

/* Create Vue app */
const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient)
  },
  render: () => h(App),
})

app.use(router).use(pinia).mount("#app");

/* Init Pinia stores */
const mainStore = useMainStore(pinia);
const styleStore = useStyleStore(pinia);

/* Fetch sample data */
mainStore.fetch("clients");
mainStore.fetch("history");

/* App style */
styleStore.setStyle(localStorage[styleKey] ?? "basic");

/* Dark mode */
if (
  (!localStorage[darkModeKey] &&
    window.matchMedia("(prefers-color-scheme: dark)").matches) ||
  localStorage[darkModeKey] === "1"
) {
  styleStore.setDarkMode(true);
}

/* Default title tag */
const defaultDocumentTitle = "پنل اینترنت اشیاء";

/* Set document title from route meta */
router.afterEach((to) => {
  document.title = to.meta?.title
    ? `${to.meta.title} — ${defaultDocumentTitle}`
    : defaultDocumentTitle;
});
