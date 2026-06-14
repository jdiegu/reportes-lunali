import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),

  scrollBehavior() {
    return { top: 0 };
  },

  routes: [
    // ─────────────────────────────
    // LOGIN
    // ─────────────────────────────

    {
      path: "/login",
      name: "Login",
      component: () => import("../views/auth/Loginview.vue"),
      meta: {
        guest: true,
      },
    },

    // ─────────────────────────────
    // APP
    // ─────────────────────────────

    {
      path: "/",
      component: () => import("../components/layout/AppLayout.vue"),
      meta: {
        requiresAuth: true,
      },

      children: [
        {
          path: "",
          name: "Dashboard",
          component: () => import("../views/admin/DashboardView.vue"),
        },
        {
          path: "reports",
          name: "Reports",
          component: () => import("../views/admin/ReportsView.vue"),
        },
        {
          path: "reports/new",
          name: "NewReport",
          component: () => import("../views/user/NewReportView.vue"),
          meta: {
            userOnly: true,
          },
        },
        {
          path: "reports/:id",
          name: "ReportDetail",
          component: () => import("../views/user/ReportDetailView.vue"),
        },
        {
          path: "admin",
          name: "Admin",
          component: () => import("../views/admin/AdminView.vue"),
          meta: {
            adminOnly: true,
          },
        },
      ],
    },

    // ─────────────────────────────
    // NOT FOUND
    // ─────────────────────────────

    {
      path: "/:pathMatch(.*)*",

      redirect: "/",
    },
  ],
});

// ─────────────────────────────────────────────
// AUTH GUARD
// ─────────────────────────────────────────────

router.beforeEach((to) => {
  // Obtener datos DIRECTO del localStorage
  // porque Pinia aún no hidrata al cargar

  const token = localStorage.getItem("lunali_token");

  const user = JSON.parse(localStorage.getItem("lunali_user") || "null");

  const isLoggedIn = !!token && !!user;

  const isAdmin = ["admin", "superadmin", "boss"].includes(user?.role);

  // ─────────────────────────────
  // Requiere login
  // ─────────────────────────────

  if (to.meta.requiresAuth && !isLoggedIn) {
    return "/login";
  }

  // ─────────────────────────────
  // Página guest
  // ─────────────────────────────

  if (to.meta.guest && isLoggedIn) {
    return "/";
  }

  // ─────────────────────────────
  // Solo admins
  // ─────────────────────────────

  if (to.meta.adminOnly && !isAdmin) {
    return "/";
  }

  // ─────────────────────────────
  // Solo users normales
  // ─────────────────────────────

  if (to.meta.userOnly && isAdmin) {
    return "/reports";
  }

  return true;
});

export default router;
