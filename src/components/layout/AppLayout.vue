<template>
  <div class="flex h-screen overflow-hidden" style="background: var(--bg-page)">
    <Transition name="sidebar-mobile">
      <aside
        v-show="mobileOpen"
        class="fixed inset-y-0 left-0 z-50 flex flex-col border-r overflow-hidden lg:hidden"
        :style="{ width: '16rem', background: 'var(--sidebar-bg)', borderColor: 'var(--sidebar-border)' }"
      >
        <SidebarContent :expanded="true" @toggle-theme="toggleTheme" :is-dark="isDark" :user-initial="userInitial" :display-name="displayName" :role-label="roleLabel" @logout="logout" :nav-items="navItems" />
      </aside>
    </Transition>

    <aside
      :class="['hidden lg:flex inset-y-0 left-0 z-50 flex-col border-r overflow-hidden transition-all duration-300 ease-in-out', desktopExpanded ? 'lg:relative lg:w-64' : 'lg:relative lg:w-[4.25rem]']"
      :style="{ background: 'var(--sidebar-bg)', borderColor: 'var(--sidebar-border)' }"
    >
      <SidebarContent :expanded="desktopExpanded" @toggle-theme="toggleTheme" :is-dark="isDark" :user-initial="userInitial" :display-name="displayName" :role-label="roleLabel" @logout="logout" :nav-items="navItems" />
    </aside>

    <div class="flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out">
      <header class="h-14 sm:h-16 flex items-center gap-3 px-4 lg:px-6 border-b shrink-0 sticky top-0 z-30"
              :style="{ background: 'var(--header-bg)', borderColor: 'var(--sidebar-border)', backdropFilter: 'blur(16px)' }">
        <button @click="toggleSidebar" class="btn-icon !w-9 !h-9" style="color: var(--rose-primary)">
          <Menu class="w-5 h-5" />
        </button>

        <div class="flex-1 min-w-0">
          <p class="text-sm sm:text-base font-display font-bold truncate" style="color: var(--text-primary)">{{ pageTitle }}</p>
        </div>

        <div class="flex items-center gap-1.5">
          <button v-if="!authStore.isAdmin" @click="router.push('/app/reports/new')" class="btn-primary text-xs sm:text-sm !py-2 !px-3 sm:!px-4">
            <Plus class="w-4 h-4" />
            <span class="hidden sm:inline">Nuevo</span>
          </button>

          <div class="relative">
            <button @click="showNotifications = !showNotifications" class="btn-icon relative" style="color: var(--rose-primary)">
              <Bell class="w-5 h-5" />
              <span v-if="unreadCount > 0" class="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center text-white" style="background: var(--error);">{{ unreadCount > 9 ? '9+' : unreadCount }}</span>
            </button>
            <Transition name="overlay">
              <div v-if="showNotifications" class="fixed inset-0 z-[60]" @click="showNotifications = false"></div>
            </Transition>
            <Transition name="slide-down">
              <div v-if="showNotifications" class="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto rounded-xl border shadow-xl z-[70]"
                   style="background: var(--bg-card); border-color: var(--border-color);">
                <div class="p-3 border-b flex items-center justify-between" :style="{ borderColor: 'var(--border-color)' }">
                  <p class="text-sm font-semibold" style="color: var(--text-primary);">Notificaciones</p>
                  <button @click="markAllRead" class="text-[10px] font-medium" style="color: var(--rose-primary);">Marcar todas leidas</button>
                </div>
                <div v-if="notifications.length === 0" class="p-6 text-center">
                  <p class="text-xs" style="color: var(--text-muted);">Sin notificaciones</p>
                </div>
                <div v-else>
                  <div v-for="n in notifications" :key="n._id"
                       @click="handleNotificationClick(n)"
                       class="p-3 border-b cursor-pointer transition-colors"
                       :style="{ borderColor: 'var(--border-color)', background: n.read ? 'transparent' : 'var(--bg-surface)' }">
                    <div class="flex items-start gap-2">
                      <div class="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                           :style="{ background: n.type === 'success' ? 'var(--success-bg)' : 'var(--info-bg)' }">
                        <CheckCircle v-if="n.type === 'success'" class="w-3.5 h-3.5" style="color: var(--success);" />
                        <Info v-else class="w-3.5 h-3.5" style="color: var(--info);" />
                      </div>
                      <div class="min-w-0 flex-1">
                        <p class="text-xs font-semibold" style="color: var(--text-primary);">{{ n.title }}</p>
                        <p class="text-[11px] mt-0.5" style="color: var(--text-muted);">{{ n.message }}</p>
                        <p class="text-[9px] mt-1" style="color: var(--text-muted);">{{ formatNotifDate(n.createdAt) }}</p>
                      </div>
                      <ChevronRight class="w-3.5 h-3.5 shrink-0 mt-1" style="color: var(--text-muted);" />
                    </div>
                  </div>
                </div>
              </div>
            </Transition>
          </div>

          <button @click="toggleTheme" class="btn-icon hidden sm:flex" :title="isDark ? 'Modo claro' : 'Modo oscuro'" style="color: var(--rose-primary)">
            <Moon v-if="isDark" class="w-4 h-4" />
            <Sun v-else class="w-4 h-4" />
          </button>

          <button @click="logout" class="hidden sm:flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl transition-colors btn-ghost" style="color: var(--error);" title="Cerrar sesion">
            <LogOut class="w-4 h-4" />
            <span>Salir</span>
          </button>

          <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold sm:hidden shrink-0" style="background: var(--rose-gradient); color: white">
            {{ userInitial }}
          </div>
        </div>
      </header>

      <main class="flex-1 overflow-y-auto flex flex-col">
        <div class="flex-1">
          <RouterView />
        </div>
        <footer class="border-t shrink-0" :style="{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }">
          <div class="px-4 py-4 sm:py-5">
            <div class="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div class="flex items-center gap-2.5">
                <div class="w-5 h-5 rounded-full overflow-hidden shrink-0 ring-2" :style="{ '--tw-ring-color': 'var(--rose-primary)' }">
                  <img src="/icon.png" alt="Lunali" class="w-full h-full object-cover" />
                </div>
                <span class="font-semibold text-xs" style="color: var(--rose-primary)">Lunali Streaming</span>
              </div>
              <a :href="whatsappLink" target="_blank" rel="noopener" class="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full no-underline transition-all hover:scale-105"
                 :style="{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Contacto por WhatsApp
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>

    <Transition name="overlay">
      <div v-if="mobileOpen" @click="mobileOpen = false" class="fixed inset-0 z-40 lg:hidden" style="background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(4px)"></div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter, RouterView } from "vue-router";
import { useAuthStore } from "../../store/auth";
import { useTheme } from "../../composables/useTheme";
import { useToastStore } from "../../store/toast";
import { WHATSAPP_PHONE } from "../../config/constants";
import { notificationsApi } from "../../api/axios";
import SidebarContent from "./SidebarContent.vue";
import { Menu, Plus, Bell, Sun, Moon, X, CheckCircle, Info, ChevronRight, LogOut } from "@lucide/vue";

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const { isDark, toggleTheme } = useTheme();
const toast = useToastStore();

const mobileOpen = ref(false);
const desktopExpanded = ref(true);
const showNotifications = ref(false);
const notifications = ref([]);
const unreadCount = ref(0);
const prevUnreadCount = ref(0);

const whatsappLink = computed(() => `https://wa.me/${WHATSAPP_PHONE}`);

function toggleSidebar() {
  if (window.innerWidth < 1024) {
    mobileOpen.value = !mobileOpen.value;
  } else {
    desktopExpanded.value = !desktopExpanded.value;
  }
}

const userInitial = computed(() => authStore.user?.name?.charAt(0).toUpperCase() || authStore.user?.username?.charAt(0).toUpperCase() || "?");
const displayName = computed(() => authStore.user?.name || authStore.user?.username || "Usuario");
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
    UserDetail: "Detalle del Usuario",
    Balance: "Mi saldo",
    Platforms: "Plataformas",
    Profile: "Mi perfil",
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
    base.push({ to: "/app/admin/platforms", label: "Plataformas", icon: "apps" });
  }
  base.push({ to: "/app/profile", label: "Mi perfil", icon: "user" });
  return base;
});

async function loadNotifications() {
  try {
    const [notifRes, countRes] = await Promise.all([notificationsApi.list(), notificationsApi.unreadCount()]);
    const newNotifications = notifRes.data || [];
    const newCount = countRes.data.count || 0;

    if (prevUnreadCount.value > 0 && newCount > prevUnreadCount.value) {
      const freshCount = newCount - prevUnreadCount.value;
      const fresh = newNotifications.filter(n => !n.read).slice(0, freshCount);
      fresh.forEach(n => {
        toast.info(n.title || 'Notificacion', n.message || '', 6000);
      });
    }

    notifications.value = newNotifications;
    unreadCount.value = newCount;
    prevUnreadCount.value = newCount;
  } catch {}
}

async function markAllRead() {
  try {
    await notificationsApi.markAllRead();
    notifications.value.forEach(n => n.read = true);
    unreadCount.value = 0;
  } catch {}
}

function handleNotificationClick(n) {
  if (!n.read) {
    notificationsApi.markRead(n._id);
    n.read = true;
    unreadCount.value = Math.max(0, unreadCount.value - 1);
  }
  showNotifications.value = false;
  if (n.report) router.push(`/app/reports/${n.report._id || n.report}`);
}

function formatNotifDate(d) {
  if (!d) return '';
  const diff = Date.now() - new Date(d).getTime();
  if (diff < 60000) return 'Ahora';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
  return `${Math.floor(diff / 86400000)}d`;
}

let notifInterval;
onMounted(() => {
  loadNotifications();
  notifInterval = setInterval(loadNotifications, 30000);
});
onUnmounted(() => clearInterval(notifInterval));

function logout() {
  mobileOpen.value = false;
  authStore.logout();
  router.push("/");
}
</script>

<style scoped>
.sidebar-mobile-enter-active { transition: transform 0.3s cubic-bezier(0.21, 1.02, 0.73, 1); }
.sidebar-mobile-leave-active { transition: transform 0.2s ease; }
.sidebar-mobile-enter-from, .sidebar-mobile-leave-to { transform: translateX(-100%); }

.overlay-enter-active { transition: opacity 0.25s ease; }
.overlay-leave-active { transition: opacity 0.15s ease; }
.overlay-enter-from, .overlay-leave-to { opacity: 0; }

.slide-down-enter-active { transition: all 0.2s cubic-bezier(0.21, 1.02, 0.73, 1); }
.slide-down-leave-active { transition: all 0.15s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-8px); }
</style>
