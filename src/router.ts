import { createRouter, createWebHistory } from "vue-router";
import Home from "./views/Home.vue";
import Signup from "./views/Signup.vue";
import Signin from "./views/Signin.vue";
import Category from "./views/Category.vue";
import NotFound from "./views/NotFound.vue";
import { useUser } from "./store/user";
import { useCatalog } from "./store/catalog";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: Home,
    },
    {
      path: "/signup",
      component: Signup,
      beforeEnter: () => {
        const userStore = useUser();
        if (userStore.isUserConnected) {
          return {
            path: "/",
          };
        }
      },
    },
    {
      path: "/login",
      component: Signin,
      beforeEnter: () => {
        const userStore = useUser();
        if (userStore.isUserConnected) {
          return {
            path: "/",
          };
        }
      },
    },
    {
      path: "/categorie/:slug+/",
      component: Category,
      name: "category",
    },
    {
      path: "/:catchAll(.*)",
      component: NotFound,
    },
  ],
});
