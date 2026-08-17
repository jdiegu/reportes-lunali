import { createRouter, createWebHistory } from "vue-router";
import { STORAGE_KEYS } from "../config/constants";
import { siteSettingsApi } from "../api/axios";

function safeParseJSON(key) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw || raw === 'undefined' || raw === 'null') return null
    return JSON.parse(raw)
  } catch {
    localStorage.removeItem(key)
    return null
  }
}

let cachedSiteStatus = null
let cacheTimestamp = 0
const CACHE_TTL = 30000

async function getSiteStatus() {
  const now = Date.now()
  if (cachedSiteStatus && (now - cacheTimestamp) < CACHE_TTL) {
    return cachedSiteStatus
  }
  try {
    const { data } = await siteSettingsApi.status()
    cachedSiteStatus = data
    cacheTimestamp = now
    return data
  } catch {
    return cachedSiteStatus || { restrictAccess: false, siteClosed: false, allowedRoles: ['admin', 'boss'] }
  }
}

export function invalidateSiteCache() {
  cachedSiteStatus = null
  cacheTimestamp = 0
}

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
      path: "/unavailable",
      name: "SiteUnavailable",
      component: () => import("../views/SiteUnavailableView.vue"),
    },
    {
      path: "/app",
      component: () => import("../components/layout/AppLayout.vue"),
      meta: { requiresAuth: true },
      children: [
        { path: "", name: "Dashboard", component: () => import("../views/admin/DashboardView.vue") },
        { path: "reports", name: "Reports", component: () => import("../views/admin/ReportsView.vue") },
        { path: "stats", name: "Stats", component: () => import("../views/admin/StatsView.vue"), meta: { adminOnly: true } },
        { path: "reports/new", name: "NewReport", component: () => import("../views/user/NewReportView.vue"), meta: { userOnly: true } },
        { path: "reports/:id", name: "ReportDetail", component: () => import("../views/user/ReportDetailView.vue") },
        { path: "admin", name: "Admin", component: () => import("../views/admin/AdminView.vue"), meta: { adminOnly: true } },
        { path: "admin/users/:id", name: "UserDetail", component: () => import("../views/admin/UserBalanceView.vue"), meta: { adminOnly: true } },
        { path: "admin/platforms", name: "Platforms", component: () => import("../views/admin/PlatformsView.vue"), meta: { adminOnly: true } },
        { path: "settings", name: "Settings", component: () => import("../views/boss/SettingsView.vue"), meta: { bossOnly: true } },
        { path: "balance", name: "Balance", component: () => import("../views/user/BalanceView.vue") },
        { path: "profile", name: "Profile", component: () => import("../views/user/ProfileView.vue") },
      ],
    },
    { path: "/:pathMatch(.*)*", redirect: "/login" },
  ],
});

router.beforeEach(async (to) => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  const user = safeParseJSON(STORAGE_KEYS.USER);
  const isLoggedIn = !!token && !!user;
  const isAdmin = user?.role === "admin" || user?.role === "boss";
  const isBoss = user?.role === "boss";

  if (to.meta.requiresAuth && !isLoggedIn) return "/login";
  if (to.meta.guest && isLoggedIn) return "/app";
  if (to.meta.adminOnly && !isAdmin) return "/app";
  if (to.meta.bossOnly && !isBoss) return "/app";
  if (to.meta.userOnly && isAdmin) return "/app/reports";

  if (isLoggedIn && to.path !== "/unavailable" && to.path !== "/login") {
    const status = await getSiteStatus()
    const userRole = user?.role
    const allowedRoles = status.allowedRoles || ['admin', 'boss']

    const shouldBlock =
      (status.restrictAccess || status.siteClosed) && !allowedRoles.includes(userRole)

    if (shouldBlock) return "/unavailable"
  }

  return true;
});

export default router;
