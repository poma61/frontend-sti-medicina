import { createRouter, createWebHistory } from "vue-router";

import { middleware } from "@/http/middleware/middleware";
import authTokenExpiration from "@/http/middleware/authTokenExpiration";
import redirectIfAuthenticated from "@/http/middleware/redirectIfAuthenticated";
import authenticate from "@/http/middleware/authenticate";

// import checkRole from '@/http/middleware/checkRole';

//views
import LoginView from "@/views/LoginView.vue";
import NotFoundView from "@/views/NotFoundView.vue";
import ProfileView from "@/views/ProfileView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "n-login",
      component: LoginView,
      meta: {
        requireAuth: false,
      },
      beforeEnter: [middleware(redirectIfAuthenticated)],
    },
    {
      path: "/perfil",
      name: "n-perfil",
      component: ProfileView,
      meta: {
        requireAuth: true,
      },
      beforeEnter: [
       middleware(authTokenExpiration), // primero verifica si el token expiro
        middleware(authenticate),
      ],
    },
    {
      path: "/:pathMatch(.*)*",
      component: NotFoundView,
      meta: {
        requireAuth: true,
      },
      beforeEnter: [
        middleware(authTokenExpiration), // primero verifica si el token expiro
        middleware(authenticate),
      ],
    },
    {
      path: "/home",
      name: "n-home",
      component: () =>
        import(/* webpackChunkName: "HomeView" */ "@/views/HomeView.vue"),
      meta: {
        requireAuth: true,
      },
      beforeEnter: [
        middleware(authTokenExpiration),
        middleware(authenticate),
      ],
    },
    {
      path: "/estudiante",
      name: "n-estudiante",
      component: () => import(/* webpackChunkName "EstudianteView"*/ "@/views/EstudianteView.vue"),
      meta:{
        requireAuth:true,
      },
      beforeEnter:[
        middleware(authTokenExpiration),
        middleware(authenticate)
      ]
    }
  ], //routes
});

export default router;
