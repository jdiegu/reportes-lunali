<template>
  <div class="min-h-screen" style="background: var(--bg-page);">
    <header class="fixed top-0 left-0 right-0 z-50 glass border-b" style="border-color: var(--border-color);">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <RouterLink to="/" class="flex items-center gap-2.5 no-underline">
            <div class="w-9 h-9 rounded-xl flex items-center justify-center" style="background: linear-gradient(135deg, var(--rose-400), var(--rose-500));">
              <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"/>
              </svg>
            </div>
            <span class="font-display text-xl font-bold" style="color: var(--text-primary);">Lunali</span>
          </RouterLink>

          <nav class="hidden md:flex items-center gap-8">
            <a href="#features" class="text-sm font-medium no-underline transition-colors" style="color: var(--text-muted);">Características</a>
            <a href="#how-it-works" class="text-sm font-medium no-underline transition-colors" style="color: var(--text-muted);">Cómo funciona</a>
            <a href="#cta" class="text-sm font-medium no-underline transition-colors" style="color: var(--text-muted);">Contacto</a>
          </nav>

          <div class="flex items-center gap-3">
            <button @click="toggleTheme" class="btn-icon" :title="isDark ? 'Modo claro' : 'Modo oscuro'">
              <svg v-if="isDark" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
              </svg>
              <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
              </svg>
            </button>
            <RouterLink to="/login" class="btn-secondary text-sm hidden sm:inline-flex">Iniciar sesión</RouterLink>
            <RouterLink to="/login?register=true" class="btn-primary text-sm">Comenzar</RouterLink>
          </div>
        </div>
      </div>
    </header>

    <section class="hero-gradient min-h-screen flex items-center pt-16 overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div class="relative z-10">
            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6 border"
                 style="background: var(--rose-lighter); color: var(--rose-primary); border-color: var(--rose-light);">
              <span class="w-1.5 h-1.5 rounded-full" style="background: var(--rose-primary);"></span>
              Gestión de reportes para streaming
            </div>
            <h1 class="text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6" style="color: var(--text-primary);">
              Reportes simples,
              <span style="color: var(--rose-primary);">soluciones rápidas</span>
            </h1>
            <p class="text-base sm:text-lg max-w-lg mb-8" style="color: var(--text-muted);">
              La forma más fácil de reportar y dar seguimiento a problemas en tus plataformas de streaming favoritas.
            </p>
            <div class="flex flex-wrap items-center gap-4">
              <RouterLink to="/login?register=true" class="btn-primary text-base px-6 py-3">
                Crear cuenta gratis
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              </RouterLink>
              <RouterLink to="/login" class="btn-secondary text-base px-6 py-3">
                Ya tengo cuenta
              </RouterLink>
            </div>
            <div class="flex items-center gap-6 mt-8 pt-8 border-t" style="border-color: var(--border-color);">
              <div>
                <p class="text-2xl font-display font-bold" style="color: var(--text-primary);">500+</p>
                <p class="text-xs" style="color: var(--text-muted);">Reportes resueltos</p>
              </div>
              <div>
                <p class="text-2xl font-display font-bold" style="color: var(--text-primary);">98%</p>
                <p class="text-xs" style="color: var(--text-muted);">Satisfacción</p>
              </div>
              <div>
                <p class="text-2xl font-display font-bold" style="color: var(--text-primary);">8</p>
                <p class="text-xs" style="color: var(--text-muted);">Plataformas</p>
              </div>
            </div>
          </div>

          <div class="relative lg:ml-auto">
            <div class="absolute inset-0 rounded-3xl opacity-30 blur-3xl" style="background: radial-gradient(ellipse at center, var(--rose-300) 0%, transparent 70%);"></div>
            <div class="relative rounded-3xl overflow-hidden shadow-2xl border" style="background: var(--bg-card); border-color: var(--border-color);">
              <div class="aspect-[4/3] flex items-center justify-center" style="background: linear-gradient(135deg, var(--rose-lighter), var(--rose-light));">
                <div class="text-center p-8">
                  <div class="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4"
                       style="background: linear-gradient(135deg, var(--rose-400), var(--rose-500));">
                    <svg class="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"/>
                    </svg>
                  </div>
                  <p class="text-sm font-medium" style="color: var(--text-muted);">[Hero Image Placeholder]</p>
                  <p class="text-xs mt-1" style="color: var(--text-muted); opacity: 0.6;">Dashboard preview</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="features" class="py-20 lg:py-28" style="border-top: 1px solid var(--border-color);">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-2xl mx-auto mb-16">
          <p class="text-sm font-semibold tracking-wider uppercase mb-3" style="color: var(--rose-primary);">Características</p>
          <h2 class="text-3xl sm:text-4xl mb-4">Todo lo que necesitas</h2>
          <p class="text-base" style="color: var(--text-muted);">
            Gestiona tus reportes de forma eficiente con herramientas diseñadas para ti y tu equipo.
          </p>
        </div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="feature in features" :key="feature.title" class="card p-6 lg:p-8 text-center group cursor-default">
            <div class="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 transition-transform duration-300 group-hover:scale-110"
                 :style="{ background: feature.bg }">
              <svg class="w-6 h-6" :style="{ color: feature.color }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" :d="feature.icon" />
              </svg>
            </div>
            <h3 class="text-lg mb-2 font-display" style="color: var(--text-primary);">{{ feature.title }}</h3>
            <p class="text-sm leading-relaxed" style="color: var(--text-muted);">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <section id="how-it-works" class="py-20 lg:py-28" style="border-top: 1px solid var(--border-color);">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-2xl mx-auto mb-16">
          <p class="text-sm font-semibold tracking-wider uppercase mb-3" style="color: var(--rose-primary);">Cómo funciona</p>
          <h2 class="text-3xl sm:text-4xl mb-4">Tres pasos simples</h2>
          <p class="text-base" style="color: var(--text-muted);">
            Reportar un problema nunca fue tan fácil. En minutos puedes crear y dar seguimiento.
          </p>
        </div>
        <div class="grid sm:grid-cols-3 gap-8 lg:gap-12">
          <div v-for="(step, i) in steps" :key="i" class="relative text-center">
            <div class="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                 style="background: linear-gradient(135deg, var(--rose-lighter), var(--rose-light));">
              <span class="text-2xl font-display font-bold" style="color: var(--rose-primary);">{{ i + 1 }}</span>
            </div>
            <h3 class="text-lg mb-2 font-display" style="color: var(--text-primary);">{{ step.title }}</h3>
            <p class="text-sm leading-relaxed" style="color: var(--text-muted);">{{ step.description }}</p>
            <div v-if="i < steps.length - 1" class="hidden sm:block absolute top-8 left-[60%] w-[calc(80%)] h-px border-t border-dashed" style="border-color: var(--rose-200);"></div>
          </div>
        </div>
      </div>
    </section>

    <section id="cta" class="py-20 lg:py-28" style="border-top: 1px solid var(--border-color);">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div class="card p-10 lg:p-16 relative overflow-hidden">
          <div class="absolute -top-24 -right-24 w-64 h-64 rounded-full opacity-20" style="background: var(--rose-primary); filter: blur(60px);"></div>
          <div class="absolute -bottom-24 -left-24 w-64 h-64 rounded-full opacity-20" style="background: var(--rose-400); filter: blur(60px);"></div>
          <div class="relative z-10">
            <h2 class="text-3xl sm:text-4xl mb-4">¿Listo para empezar?</h2>
            <p class="text-base max-w-lg mx-auto mb-8" style="color: var(--text-muted);">
              Únete a cientos de usuarios que ya gestionan sus reportes de forma rápida y sencilla.
            </p>
            <RouterLink to="/login?register=true" class="btn-primary text-base px-8 py-3.5">
              Crear cuenta gratis
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
              </svg>
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <footer style="border-top: 1px solid var(--border-color); background: var(--bg-card);">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background: linear-gradient(135deg, var(--rose-400), var(--rose-500));">
              <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"/>
              </svg>
            </div>
            <span class="font-display font-bold" style="color: var(--text-primary);">Lunali</span>
          </div>
          <p class="text-xs" style="color: var(--text-muted);">
            &copy; {{ new Date().getFullYear() }} Lunali Streaming. Todos los derechos reservados.
          </p>
          <div class="flex items-center gap-4">
            <a href="#" class="text-xs no-underline transition-colors" style="color: var(--text-muted);">Términos</a>
            <a href="#" class="text-xs no-underline transition-colors" style="color: var(--text-muted);">Privacidad</a>
            <button @click="toggleTheme" class="btn-icon" :title="isDark ? 'Modo claro' : 'Modo oscuro'">
              <svg v-if="isDark" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
              </svg>
              <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { useTheme } from '../composables/useTheme'

const { isDark, toggleTheme } = useTheme()

const features = [
  {
    title: 'Reportes Rápidos',
    description: 'Crea reportes en segundos con nuestra interfaz intuitiva. Adjunta capturas y describe el problema fácilmente.',
    icon: 'M12 4v16m8-8H4',
    bg: 'var(--rose-lighter)',
    color: 'var(--rose-primary)',
  },
  {
    title: 'Seguimiento en Tiempo Real',
    description: 'Da seguimiento a tus reportes con actualizaciones en tiempo real. Sabrás cuando tu problema sea resuelto.',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    bg: '#e8f5e9',
    color: '#4bb574',
  },
  {
    title: 'Gestión de Credenciales',
    description: 'Cuando tu cuenta requiera reemplazo, recibe las nuevas credenciales de forma segura y organizada.',
    icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
    bg: '#e3f2fd',
    color: '#4a90d9',
  },
  {
    title: 'Multiplataforma',
    description: 'Soporte para Netflix, Spotify, HBO, Disney+, Prime Video y más plataformas de streaming.',
    icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z',
    bg: '#f3e5f5',
    color: '#9c27b0',
  },
  {
    title: 'Panel Administrativo',
    description: 'Los administradores tienen un panel completo para gestionar todos los reportes y usuarios del sistema.',
    icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
    bg: '#fff3e0',
    color: '#f0a030',
  },
  {
    title: 'Notificaciones',
    description: 'Recibe notificaciones instantáneas cuando tu reporte sea actualizado o resuelto por el equipo.',
    icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
    bg: '#fce4ec',
    color: '#e91e63',
  },
]

const steps = [
  {
    title: 'Crea tu reporte',
    description: 'Selecciona la plataforma, describe el problema y adjunta una captura de pantalla si es necesario.',
  },
  {
    title: 'Seguimiento',
    description: 'El equipo revisa tu reporte y lo actualiza en tiempo real. Recibirás notificaciones de cada cambio.',
  },
  {
    title: 'Solución',
    description: 'Cuando el problema sea resuelto, recibirás los detalles y las nuevas credenciales si aplica.',
  },
]
</script>
