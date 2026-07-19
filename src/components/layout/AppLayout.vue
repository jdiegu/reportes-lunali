<template>
  <div class="flex h-screen overflow-hidden" style="background: var(--bg-page)">
    <Transition name="sidebar-mobile">
      <aside
        v-show="mobileOpen"
        class="fixed inset-y-0 left-0 z-50 flex flex-col border-r overflow-hidden lg:hidden"
        :style="{
          width: '16rem',
          background: 'var(--sidebar-bg)',
          borderColor: 'var(--sidebar-border)',
        }"
      >
        <SidebarContent
          :expanded="true"
          @toggle-theme="toggleTheme"
          :is-dark="isDark"
          :user-initial="userInitial"
          :display-name="displayName"
          :role-label="roleLabel"
          @logout="logout"
          :nav-items="navItems"
        />
      </aside>
    </Transition>

    <aside
      :class="[
        'hidden lg:flex inset-y-0 left-0 z-50 flex-col border-r overflow-hidden transition-all duration-300 ease-in-out',
        desktopExpanded ? 'lg:relative lg:w-64' : 'lg:relative lg:w-[4.25rem]',
      ]"
      :style="{
        background: 'var(--sidebar-bg)',
        borderColor: 'var(--sidebar-border)',
      }"
    >
      <SidebarContent
        :expanded="desktopExpanded"
        @toggle-theme="toggleTheme"
        :is-dark="isDark"
        :user-initial="userInitial"
        :display-name="displayName"
        :role-label="roleLabel"
        @logout="logout"
        :nav-items="navItems"
      />
    </aside>

    <div
      :class="[
        'flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out',
        desktopExpanded ? 'lg:ml-0' : 'lg:ml-0',
      ]"
    >
      <header
        class="h-14 sm:h-16 flex items-center gap-3 px-4 lg:px-6 border-b shrink-0 sticky top-0 z-30"
        :style="{
          background: 'var(--header-bg)',
          borderColor: 'var(--sidebar-border)',
          backdropFilter: 'blur(16px)',
        }"
      >
        <button
          @click="toggleSidebar"
          class="btn-icon !w-9 !h-9"
          style="color: var(--rose-primary)"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <div class="flex-1 min-w-0">
          <p
            class="text-sm sm:text-base font-display font-bold truncate"
            style="color: var(--text-primary)"
          >
            {{ pageTitle }}
          </p>
        </div>

        <div class="flex items-center gap-1.5">
          <button
            v-if="!authStore.isAdmin"
            @click="router.push('/app/reports/new')"
            class="btn-primary text-xs sm:text-sm !py-2 !px-3 sm:!px-4"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span class="hidden sm:inline">Nuevo</span>
          </button>

          <button
            @click="toggleTheme"
            class="btn-icon hidden sm:flex"
            :title="isDark ? 'Modo claro' : 'Modo oscuro'"
            style="color: var(--rose-primary)"
          >
            <svg
              v-if="isDark"
              class="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <svg
              v-else
              class="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          </button>

          <div
            class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold sm:hidden shrink-0"
            style="background: var(--rose-gradient); color: white"
          >
            {{ userInitial }}
          </div>
        </div>
      </header>

      <main class="flex-1 overflow-y-auto flex flex-col">
        <div class="flex-1">
          <RouterView />
        </div>
        <footer
          class="border-t shrink-0"
          :style="{
            borderColor: 'var(--border-color)',
            background: 'var(--bg-card)',
          }"
        >
          <div class="px-4 py-4 sm:py-5">
            <div
              class="flex flex-col sm:flex-row items-center justify-between gap-3"
            >
              <div class="flex items-center gap-2.5">
                <div
                  class="w-5 h-5 rounded-full overflow-hidden shrink-0 ring-2"
                  :style="{ '--tw-ring-color': 'var(--rose-primary)' }"
                >
                  <img
                    src="/icon.png"
                    alt="Lunali"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div
                  class="flex items-center gap-2 text-xs"
                  style="color: var(--text-muted)"
                >
                  <span class="font-semibold" style="color: var(--rose-primary)"
                    >Lunali Streaming</span
                  >
                </div>
              </div>
              <div
                class="flex items-center gap-2 text-xs px-2.5 py-1 rounded-full"
                :style="{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                }"
              >
                <span class="opacity-40">·</span>
                <span
                  >Desarrollado por
                  <span
                    class="font-semibold"
                    style="color: var(--text-secondary)"
                    >jdiegu</span
                  ></span
                >
                <span class="opacity-40">·</span>
                <svg
                  class="w-3 h-3"
                  style="color: var(--rose-primary)"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span style="color: var(--text-secondary)"
                  >+52 271 141 0542</span
                >
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>

    <Transition name="overlay">
      <div
        v-if="mobileOpen"
        @click="mobileOpen = false"
        class="fixed inset-0 z-40 lg:hidden"
        style="background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(4px)"
      ></div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter, RouterView } from "vue-router";
import { useAuthStore } from "../../store/auth";
import { useTheme } from "../../composables/useTheme";
import SidebarContent from "./SidebarContent.vue";

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const { isDark, toggleTheme } = useTheme();

const mobileOpen = ref(false);
const desktopExpanded = ref(true);

function toggleSidebar() {
  if (window.innerWidth < 1024) {
    mobileOpen.value = !mobileOpen.value;
  } else {
    desktopExpanded.value = !desktopExpanded.value;
  }
}

const userInitial = computed(
  () =>
    authStore.user?.name?.charAt(0).toUpperCase() ||
    authStore.user?.username?.charAt(0).toUpperCase() ||
    "?",
);
const displayName = computed(
  () => authStore.user?.name || authStore.user?.username || "Usuario",
);

const roleLabel = computed(() => {
  if (authStore.user?.role === "boss") return "Super Admin";
  if (authStore.user?.role === "admin") return "Administrador";
  return "Usuario";
});

const pageTitle = computed(() => {
  const map = {
    Dashboard: "Inicio",
    Reports: "Reportes",
    NewReport: "Nuevo Reporte",
    ReportDetail: "Detalle del Reporte",
    Admin: "Administracion",
    UserBalance: "Gestionar Saldo",
    Balance: "Mi saldo",
  };
  return map[route.name] || "Lunali";
});

const navItems = computed(() => {
  const base = [
    { to: "/app", label: "Inicio", icon: "home", exact: true },
    { to: "/app/reports", label: "Reportes", icon: "ticket" },
  ];
  if (!authStore.isAdmin) {
    base.push({ to: "/app/reports/new", label: "Nuevo", icon: "plus-circle" });
    base.push({ to: "/app/balance", label: "Mi saldo", icon: "wallet" });
  }
  if (authStore.isAdmin) {
    base.push({ to: "/app/admin", label: "Admin", icon: "shield" });
  }
  return base;
});

function logout() {
  mobileOpen.value = false;
  authStore.logout();
  router.push("/");
}
</script>

<style scoped>
.sidebar-mobile-enter-active {
  transition: transform 0.3s cubic-bezier(0.21, 1.02, 0.73, 1);
}
.sidebar-mobile-leave-active {
  transition: transform 0.2s ease;
}
.sidebar-mobile-enter-from,
.sidebar-mobile-leave-to {
  transform: translateX(-100%);
}

.overlay-enter-active {
  transition: opacity 0.25s ease;
}
.overlay-leave-active {
  transition: opacity 0.15s ease;
}
.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}
</style>
