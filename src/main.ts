import { createApp } from "vue";
import "bulma/css/bulma.css";
import "./scss/styles.scss";
import App from "./App.vue";
import { router } from "./router";
import { createPinia } from "pinia";
import { useMenus } from "./store/menus";
import { useCatalog } from "./store/catalog";

const app = createApp(App);
app.use(createPinia());

const menusStore = useMenus();
const catalogStore = useCatalog();

Promise.all([menusStore.fetchMenu(40), catalogStore.getCategories(), catalogStore.getAttributesAndTerms()]).then(() => {
  app.use(router);
  app.mount("#app");
});
