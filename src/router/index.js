import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "landing",
    component: () => import("@/views/LandingView.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/auth/LoginView.vue"),
  },
  {
    path: "/register",
    name: "register",
    component: () => import("@/views/auth/RegisterView.vue"),
  },
  {
    path: "/world",
    name: "world",
    component: () => import("@/views/world/WorldView.vue"),
    meta: { requiresAuth: true }, // kasnije ćemo ovo stvarno koristiti
  },
  {
    path: "/book",
    name: "book",
    component: () => import("@/views/book/BookView.vue"),
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const isAuthed = !!localStorage.getItem("access_token");

  if (to.meta.requiresAuth && !isAuthed) {
    return {
      path: "/login",
      query: { redirect: to.fullPath },
    };
  }
});

export default router;
