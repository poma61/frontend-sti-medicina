import { createRouter, createWebHistory } from "vue-router";

import { middleware } from "@/http/middleware/middleware";
import authTokenExpiration from "@/http/middleware/authTokenExpiration";
import redirectIfAuthenticated from "@/http/middleware/redirectIfAuthenticated";
import authenticate from "@/http/middleware/authenticate";


// import checkRole from '@/http/middleware/checkRole';

//views
import LoginView from "@/views/auth/LoginView.vue"

/**
 * El orden de los middleware afecta se debe verificar primero si el token expiro
 */

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
      component: () => import(/* webpackChunkName "ProfileView"*/ "@/views/auth/ProfileView.vue"),
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
      component: () => import(/* webpackChunkName "NotFoundView"*/ "@/views/common/NotFoundView.vue"),
      meta: {
        requireAuth: true,
      },
      beforeEnter: [
        middleware(authTokenExpiration), 
        middleware(authenticate),
      ],
    },
    {
      path: "/home",
      name: "n-home",
      component: () =>
        import(/* webpackChunkName: "HomeView" */ "@/views/common/HomeView.vue"),
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
      component: () => import(/* webpackChunkName "EstudianteView"*/ "@/views/estudiante/EstudianteView.vue"),
      meta: {
        requireAuth: true,
      },
      beforeEnter: [
        middleware(authTokenExpiration),
        middleware(authenticate)
      ]
    },
    {
      path: "/personal-institucional",
      name: "n-personal-institucional",
      component: () => import(/* webpackChunkName "PersonalInstitucionalView"*/ "@/views/personal_institucional/PersonalInstitucionalView.vue"),
      meta: {
        requireAuth: true,
      },
      beforeEnter: [
        middleware(authTokenExpiration),
        middleware(authenticate),
      ]
    },

    {
      path: "/tutorai",
      name: "n-tutorai",
      component: () => import(/* webpackChunkName "TutorAIView"*/ "@/views/tutor_ai/TutorAIView.vue"),
      meta: {
        requireAuth: true,
      },
      beforeEnter: [
        middleware(authTokenExpiration),
        middleware(authenticate),
      ]
    },
    {
      path: "/area-internado-rotatorio/medicina-interna",
      name: "n-ir-medicina-interna",
      component: () => import(/* webpackChunkName "MedicinaInternaView"*/ "@/views/areas_intenado_rotatorio/MedicinaInternaView.vue"),
      meta: {
        requireAuth: true,
      },
      beforeEnter: [
        middleware(authTokenExpiration),
        middleware(authenticate),
      ]
    },
    {
      path: "/area-internado-rotatorio/cirurgia",
      name: "n-ir-cirurgia",
      component: () => import(/* webpackChunkName "CirurgiaView"*/ "@/views/areas_intenado_rotatorio/CirurgiaView.vue"),
      meta: {
        requireAuth: true,
      },
      beforeEnter: [
        middleware(authTokenExpiration),
        middleware(authenticate),
      ]
    },
    {
      path: "/area-internado-rotatorio/pediatria",
      name: "n-ir-pediatria",
      component: () => import(/* webpackChunkName "PediatriaView"*/ "@/views/areas_intenado_rotatorio/PediatriaView.vue"),
      meta: {
        requireAuth: true,
      },
      beforeEnter: [
        middleware(authTokenExpiration),
        middleware(authenticate),
      ]
    },
    {
      path: "/area-internado-rotatorio/ginecologia-obstetricia",
      name: "n-ir-ginecologia-obstetricia",
      component: () => import(/* webpackChunkName "GinecologiaObstetriciaView"*/ "@/views/areas_intenado_rotatorio/GinecologiaObstetriciaView.vue"),
      meta: {
        requireAuth: true,
      },
      beforeEnter: [
        middleware(authTokenExpiration),
        middleware(authenticate),
      ]
    },
    {
      path: "/area-internado-rotatorio/salud-publica",
      name: "n-ir-salud-publica",
      component: () => import(/* webpackChunkName "SaludPublicaView"*/ "@/views/areas_intenado_rotatorio/SaludPublicaView.vue"),
      meta: {
        requireAuth: true,
      },
      beforeEnter: [
        middleware(authTokenExpiration),
        middleware(authenticate),
      ]
    },
    {
      path: "/area-internado-rotatorio/:area/:uuid",
      name: "n-view-tema",
      component: () => import(/* webpackChunkName "TemaView"*/ "@/views/areas_intenado_rotatorio/TemaView.vue"),
      meta: {
        requireAuth: true,
      },
      beforeEnter: [
        middleware(authTokenExpiration),
        middleware(authenticate),
      ]
    },

  ], //routes
});

export default router;
