<template>
  <div class="min-h-screen flex flex-col bg-pink-100 dark:bg-gray-900">
    <!-- HEADER -->
    <header class="bg-pink-500 shadow-lg">
      <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 class="text-xl font-bold text-white tracking-wide">
          Lunali Streaming
        </h1>

        <nav class="flex items-center gap-3">
          <RouterLink
            to="/login"
            class="px-4 py-2 rounded-xl bg-white text-pink-600 font-semibold hover:bg-pink-100 transition"
          >
            Iniciar sesión
          </RouterLink>

          <RouterLink
            to="/register"
            class="px-4 py-2 rounded-xl border border-white text-white hover:bg-white hover:text-pink-600 transition"
          >
            Registrarse
          </RouterLink>
        </nav>
      </div>
    </header>

    <!-- HERO -->
    <main class="flex-1 flex items-center">
      <div class="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
        
        <!-- TEXTO -->
        <div>
          <h2 class="text-4xl md:text-5xl font-extrabold text-pink-600 mb-6">
            Panel de Reportes
          </h2>

          <p class="text-gray-700 dark:text-gray-300 text-lg mb-8">
            Gestiona, revisa y da seguimiento a los reportes de usuarios en 
            Lunali Streaming. Una plataforma simple, rápida y eficiente 
            para administradores.
          </p>

          <div class="flex flex-col sm:flex-row gap-4">
            <RouterLink
              to="/login"
              class="px-6 py-3 rounded-xl text-base font-semibold bg-pink-500 text-white hover:bg-pink-600 shadow-md transition"
            >
              Entrar al sistema
            </RouterLink>

            <RouterLink
              to="/register"
              class="px-6 py-3 rounded-xl text-base font-semibold border border-pink-500 text-pink-600 hover:bg-pink-200 transition"
            >
              Crear cuenta
            </RouterLink>
          </div>
        </div>

        <!-- TARJETA VISUAL -->
        <div class="bg-pink-400 rounded-3xl shadow-xl p-8 text-center text-white">
          <img
            src="https://i.imgur.com/your-image.png"
            alt="Lunali"
            class="w-32 h-32 mx-auto mb-4 rounded-xl shadow"
          />

          <h3 class="text-2xl font-bold mb-2">
            Lunali Reports
          </h3>

          <p class="text-sm opacity-90 mb-6">
            Control total de incidencias en tu plataforma de streaming
          </p>

          <RouterLink
            to="/register"
            class="px-5 py-2 rounded-full bg-white text-pink-500 font-semibold hover:bg-pink-100 transition"
          >
            Comenzar
          </RouterLink>
        </div>
      </div>
    </main>

    <!-- FEATURES -->
    <section class="bg-white dark:bg-gray-800 py-16">
      <div class="max-w-6xl mx-auto px-6 text-center">
        <h3 class="text-3xl font-bold text-pink-600 mb-10">
          Funcionalidades
        </h3>

        <div class="grid md:grid-cols-3 gap-8">
          <div class="p-6 rounded-2xl bg-pink-50 shadow">
            <h4 class="font-bold text-lg text-pink-600 mb-2">
              Gestión de reportes
            </h4>
            <p class="text-gray-600">
              Administra incidencias de usuarios de forma organizada.
            </p>
          </div>

          <div class="p-6 rounded-2xl bg-pink-50 shadow">
            <h4 class="font-bold text-lg text-pink-600 mb-2">
              Seguimiento en tiempo real
            </h4>
            <p class="text-gray-600">
              Monitorea el estado de cada reporte fácilmente.
            </p>
          </div>

          <div class="p-6 rounded-2xl bg-pink-50 shadow">
            <h4 class="font-bold text-lg text-pink-600 mb-2">
              Panel administrativo
            </h4>
            <p class="text-gray-600">
              Interfaz intuitiva para moderadores y admins.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="bg-pink-500 text-white">
      <div class="max-w-7xl mx-auto px-6 py-4 text-center text-sm">
        © {{ new Date().getFullYear() }} Lunali Streaming. Todos los derechos reservados.
      </div>
    </footer>
  </div>
</template>