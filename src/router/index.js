import { createRouter, createWebHistory } from "vue-router";

import { middleware } from "@/http/middleware/middleware";
import authVerifyTokenExpiration from "@/http/middleware/authVerifyTokenExpiration";
import redirectIfAuthenticated from "@/http/middleware/redirectIfAuthenticated";
import authenticate from "@/http/middleware/authenticate";
// import checkRole from '@/http/middleware/checkRole';

//views
import LoginView from "@/views/LoginView.vue";
import NotFoundView from "@/views/NotFoundView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "n-login",
      component: LoginView,
      beforeEnter: [
        middleware(redirectIfAuthenticated),
      ],
    },
    {
      path: "/:pathMatch(.*)*",
      component: NotFoundView,
      meta: {
        requireAuth: true,
      },
      beforeEnter: [
        middleware(authVerifyTokenExpiration), // primero verifica si el token expiro
        middleware(authenticate),
      ],
    },
    {
      path: "/home",
      name: "n-home",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "HomeView" */ "@/views/HomeView.vue"),
      meta: {
        requireAuth: true,
      },
      beforeEnter: [
        middleware(authVerifyTokenExpiration),
        middleware(authenticate),
      ],
    },
  ], //routes
});

export default router;
