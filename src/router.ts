import { createRouter, createWebHistory } from "vue-router";
import Home from "./views/Home.vue";
import Signup from "./views/Signup.vue";
import Login from "./views/Login.vue";
import { useUser } from "./store/user";

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
        if (userStore.userData) {
          return {
            path: "/",
          };
        }
      },
    },
    {
      path: "/login",
      component: Login,
      beforeEnter: () => {
        const userStore = useUser();
        if (userStore.userData) {
          return {
            path: "/",
          };
        }
      },
    },
  ],
});
