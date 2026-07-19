import { createRouter, createWebHistory } from "vue-router";
import { STORAGE_KEYS } from "../config/constants";

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior() { return { top: 0 }; },
  routes: [
    {
      path: "/",
      redirect: "/login",
    },
    {
      path: "/login",
      name: "Login",
      component: () => import("../views/auth/Loginview.vue"),
      meta: { guest: true },
    },
    {
      path: "/app",
      component: () => import("../components/layout/AppLayout.vue"),
      meta: { requiresAuth: true },
      children: [
        { path: "", name: "Dashboard", component: () => import("../views/admin/DashboardView.vue") },
        { path: "reports", name: "Reports", component: () => import("../views/admin/ReportsView.vue") },
        { path: "reports/new", name: "NewReport", component: () => import("../views/user/NewReportView.vue"), meta: { userOnly: true } },
        { path: "reports/:id", name: "ReportDetail", component: () => import("../views/user/ReportDetailView.vue") },
        { path: "admin", name: "Admin", component: () => import("../views/admin/AdminView.vue"), meta: { adminOnly: true } },
        { path: "admin/users/:id", name: "UserBalance", component: () => import("../views/admin/UserBalanceView.vue"), meta: { adminOnly: true } },
        { path: "balance", name: "Balance", component: () => import("../views/user/BalanceView.vue") },
      ],
    },
    { path: "/:pathMatch(.*)*", redirect: "/login" },
  ],
});

router.beforeEach((to) => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || "null");
  const isLoggedIn = !!token && !!user;
  const isAdmin = user?.role === "admin" || user?.role === "boss";

  if (to.meta.requiresAuth && !isLoggedIn) return "/login";
  if (to.meta.guest && isLoggedIn) return "/app";
  if (to.meta.adminOnly && !isAdmin) return "/app";
  if (to.meta.userOnly && isAdmin) return "/app/reports";
  return true;
});

export default router;
