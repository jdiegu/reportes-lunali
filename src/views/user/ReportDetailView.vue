<template>
  <div class="mx-auto w-full max-w-[1440px] p-4 sm:p-5 lg:p-6 space-y-4 sm:space-y-5">
    <!-- Breadcrumb + back -->
    <div class="flex items-center justify-between gap-3">
      <div class="flex items-center gap-1.5 text-[11px] sm:text-xs min-w-0" style="color: var(--text-muted);">
        <RouterLink to="/app/reports" class="truncate hover:underline" style="color: var(--text-secondary);">Reportes</RouterLink>
        <ChevronRight class="w-3.5 h-3.5 shrink-0" />
        <span class="truncate">Detalle del Reporte</span>
      </div>
      <button @click="goBack" class="text-[11px] sm:text-xs inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl font-medium transition-colors shrink-0"
              style="color: var(--rose-primary); border: 1px solid var(--border-color); background: var(--bg-card);">
        <ArrowLeft class="w-3.5 h-3.5" />
        Volver a reportes
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="space-y-4 sm:space-y-5">
      <div class="card p-4 sm:p-6">
        <div class="flex items-center gap-4">
          <div class="skeleton w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-2xl shrink-0"></div>
          <div class="flex-1 space-y-2.5">
            <div class="skeleton h-6 w-40 rounded"></div>
            <div class="skeleton h-3.5 w-64 rounded"></div>
            <div class="skeleton h-5 w-52 rounded"></div>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        <div class="lg:col-span-2 card p-4 sm:p-5 space-y-3">
          <div class="skeleton h-5 w-48 rounded"></div>
          <div class="grid grid-cols-3 gap-3">
            <div v-for="i in 3" :key="i" class="skeleton h-16 rounded-xl"></div>
          </div>
          <div class="skeleton h-14 rounded-xl"></div>
          <div class="skeleton h-14 rounded-xl"></div>
          <div class="skeleton h-24 rounded-xl"></div>
        </div>
        <div class="space-y-4 sm:space-y-5">
          <div class="card p-4 sm:p-5"><div class="skeleton h-24 rounded-xl"></div></div>
          <div class="card p-4 sm:p-5"><div class="skeleton h-16 rounded-xl"></div></div>
          <div class="card p-4 sm:p-5"><div class="skeleton h-28 rounded-xl"></div></div>
        </div>
      </div>
    </div>

    <template v-else-if="report">
      <!-- Hero -->
      <div class="relative overflow-hidden rounded-2xl border" :style="{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }">
        <div class="pointer-events-none absolute inset-y-0 right-0 w-2/3 sm:w-1/2"
             :style="{ background: `radial-gradient(ellipse at 80% 50%, ${platformColor}22 0%, transparent 68%)` }"></div>
        <div class="pointer-events-none absolute -right-8 -bottom-14 opacity-[0.05]">
          <Icon :icon="platformIconId" class="w-64 h-64" :style="{ color: platformColor }" />
        </div>

        <div class="relative flex flex-col lg:flex-row lg:items-center gap-4 sm:gap-5 p-4 sm:p-5 lg:p-6">
          <div class="flex items-start sm:items-center gap-3.5 sm:gap-4 min-w-0 flex-1">
            <div class="w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-2xl flex items-center justify-center shrink-0"
                 :style="{ background: platformColor + '16', border: '1px solid ' + platformColor + '38', boxShadow: '0 8px 24px ' + platformColor + '18' }">
              <Icon :icon="platformIconId" class="w-8 h-8 sm:w-10 sm:h-10" :style="{ color: platformColor }" />
            </div>
            <div class="min-w-0">
              <h1 class="text-xl sm:text-2xl lg:text-[26px] font-bold leading-tight truncate" style="color: var(--text-primary);">{{ report.platform }}</h1>
              <div class="flex items-center gap-1.5 mt-0.5 min-w-0">
                <p class="text-xs sm:text-sm truncate" style="color: var(--text-secondary);">
                  {{ report.is_batch ? `${batchMails.length} cuentas en lote` : report.mail }}
                </p>
                <button v-if="!report.is_batch" @click="copyToClipboard(report.mail)"
                        class="shrink-0 transition-colors hover:opacity-80" style="color: var(--rose-primary);" title="Copiar email">
                  <Copy class="w-3.5 h-3.5" />
                </button>
              </div>
              <div class="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-2.5">
                <span class="tag-pill tag-pill-accent">{{ typeLabel }}</span>
                <span class="tag-pill">{{ durationLabel }}</span>
                <span class="tag-pill">ID: #{{ shortId }}</span>
              </div>
            </div>
          </div>

          <div class="flex flex-col items-start lg:items-end gap-3 shrink-0">
            <div class="flex flex-col items-start lg:items-end gap-1">
              <span class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] sm:text-xs font-semibold"
                    :style="{ background: statusInfo.bg, color: statusInfo.color, border: '1px solid ' + statusInfo.border }">
                <span class="w-1.5 h-1.5 rounded-full" :style="{ background: statusInfo.color }"></span>
                {{ statusLabel }}
              </span>
              <span class="text-[10px] sm:text-[11px]" style="color: var(--text-muted);">Reportado el {{ formatDateLong(report.createdAt) }}</span>
            </div>

            <div class="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <button v-if="authStore.isAdmin && report.status !== 'resolved'" @click="openResolveModal"
                      class="btn-primary text-[11px] sm:text-xs !py-1.5 !px-2.5 sm:!px-3">
                <CheckCircle class="w-3.5 h-3.5" />
                Resolver
              </button>
              <button v-if="authStore.isAdmin && report.status !== 'resolved'" @click="toggleStatus" :disabled="statusLoading"
                      class="text-[11px] sm:text-xs inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl font-semibold transition-all disabled:opacity-60"
                      :style="report.status === 'pending'
                        ? { background: 'var(--info-bg)', color: 'var(--info)', border: '1px solid var(--info)' }
                        : { background: 'var(--warning-bg)', color: 'var(--warning)', border: '1px solid var(--warning)' }">
                <Clock class="w-3.5 h-3.5" />
                {{ report.status === 'pending' ? 'En proceso' : 'Pendiente' }}
              </button>
              <button v-if="authStore.isAdmin && report.status === 'resolved'" @click="openEditResolution"
                      class="btn-secondary text-[11px] sm:text-xs !py-1.5 !px-2.5">
                <Edit class="w-3.5 h-3.5" />
                Editar
              </button>
              <button v-if="authStore.isAdmin" @click="openDeleteConfirm"
                      class="text-[11px] sm:text-xs inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl font-semibold transition-all"
                      style="background: var(--error-bg); color: var(--error); border: 1px solid var(--error);">
                <Trash2 class="w-3.5 h-3.5" />
                Eliminar
              </button>
              <button v-if="!authStore.isAdmin && report.status === 'pending'" @click="goEdit"
                      class="btn-secondary text-[11px] sm:text-xs !py-1.5 !px-2.5">
                <Edit class="w-3.5 h-3.5" />
                Editar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Content grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        <!-- Main column -->
        <div class="lg:col-span-2 space-y-4 sm:space-y-5 min-w-0 flex flex-col">
          <!-- Account info -->
          <section class="card flex-1 flex flex-col p-4 sm:p-5">
            <div class="flex items-center gap-2.5 mb-4">
              <div class="section-icon"><Key class="w-4 h-4" /></div>
              <h2 class="text-sm sm:text-base font-semibold" style="color: var(--text-primary);">Información de la cuenta</h2>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
              <div class="info-tile col-span-2 sm:col-span-1">
                <div class="tile-icon" :style="{ background: platformColor + '18', border: '1px solid ' + platformColor + '30' }">
                  <Icon :icon="platformIconId" class="w-4 h-4" :style="{ color: platformColor }" />
                </div>
                <div class="min-w-0">
                  <p class="tile-label">Plataforma</p>
                  <p class="tile-value truncate">{{ report.platform }}</p>
                </div>
              </div>
              <div class="info-tile info-tile-stack">
                <div class="tile-icon" style="background: var(--rose-lighter); border: 1px solid var(--rose-light);">
                  <User class="w-4 h-4" style="color: var(--rose-primary);" />
                </div>
                <div class="min-w-0">
                  <p class="tile-label">Tipo de cuenta</p>
                  <p class="tile-value truncate">{{ typeLabel }}</p>
                </div>
              </div>
              <div class="info-tile info-tile-stack">
                <div class="tile-icon" style="background: var(--info-bg); border: 1px solid rgba(74,128,184,0.18);">
                  <Clock class="w-4 h-4" style="color: var(--info);" />
                </div>
                <div class="min-w-0">
                  <p class="tile-label">Duración</p>
                  <p class="tile-value truncate">{{ durationLabel }}</p>
                </div>
              </div>
            </div>

            <!-- Email(s) -->
            <div class="info-row mt-2.5 sm:mt-3">
              <div class="section-icon !w-9 !h-9 shrink-0"><Mail class="w-4 h-4" /></div>
              <div class="flex-1 min-w-0">
                <p class="tile-label">{{ report.is_batch ? `Emails (${batchMails.length})` : 'Email' }}</p>
                <div v-if="!report.is_batch" class="flex items-center gap-2 min-w-0">
                  <p class="tile-value font-mono truncate">{{ report.mail }}</p>
                </div>
                <div v-else class="space-y-1 mt-0.5 max-h-32 overflow-y-auto pr-1">
                  <div v-for="(email, idx) in batchMails" :key="idx" class="flex items-center gap-2 min-w-0">
                    <p class="tile-value font-mono truncate">{{ email }}</p>
                    <button @click="copyToClipboard(email)" class="shrink-0 hover:opacity-80" style="color: var(--rose-primary);" title="Copiar email">
                      <Copy class="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
              <button v-if="!report.is_batch" @click="copyToClipboard(report.mail)" class="row-action" title="Copiar email">
                <Copy class="w-4 h-4" />
              </button>
            </div>

            <!-- Password -->
            <div class="info-row mt-2.5">
              <div class="section-icon !w-9 !h-9 shrink-0"><Lock class="w-4 h-4" /></div>
              <div class="flex-1 min-w-0">
                <p class="tile-label">Contraseña</p>
                <p class="tile-value font-mono truncate">{{ showReportPassword ? report.password : '••••••' }}</p>
              </div>
              <div class="flex items-center gap-0.5 shrink-0">
                <button @click="showReportPassword = !showReportPassword" class="row-action" :title="showReportPassword ? 'Ocultar' : 'Mostrar'">
                  <EyeOff v-if="showReportPassword" class="w-4 h-4" />
                  <Eye v-else class="w-4 h-4" />
                </button>
                <button @click="copyToClipboard(report.password)" class="row-action" title="Copiar contraseña">
                  <Copy class="w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- Dates -->
            <div class="grid grid-cols-2 gap-2.5 sm:gap-3 mt-2.5 sm:mt-3">
              <div class="info-tile info-tile-stack">
                <div class="section-icon !w-9 !h-9 shrink-0"><Calendar class="w-4 h-4" /></div>
                <div class="min-w-0">
                  <p class="tile-label">Fecha de entrega</p>
                  <p class="tile-value">{{ formatDateOnly(report.delivery_date) }}</p>
                </div>
              </div>
              <div class="info-tile info-tile-stack">
                <div class="section-icon !w-9 !h-9 shrink-0"><Calendar class="w-4 h-4" /></div>
                <div class="min-w-0">
                  <p class="tile-label">Fecha de reporte</p>
                  <p class="tile-value">{{ formatDate(report.createdAt) }}</p>
                </div>
              </div>
            </div>

            <!-- Description -->
            <div class="mt-3 rounded-xl border p-3 sm:p-3.5 flex-1" style="background: var(--bg-surface); border-color: var(--border-color);">
              <div class="flex items-center gap-2 mb-1.5">
                <FileText class="w-3.5 h-3.5" style="color: var(--rose-primary);" />
                <p class="text-[11px] sm:text-xs font-semibold" style="color: var(--text-secondary);">Descripción del reporte</p>
              </div>
              <p class="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap" style="color: var(--text-secondary);">
                {{ report.description || 'Sin descripción.' }}
              </p>
            </div>
          </section>
        </div>

        <!-- Resolution -->
        <section v-if="report.status === 'resolved' && report.resolution" class="card order-last p-4 sm:p-5 lg:col-span-3">
            <div class="flex items-center gap-2.5 mb-4">
              <div class="section-icon" style="background: var(--success-bg); color: var(--success);"><CheckCircle class="w-4 h-4" /></div>
              <h2 class="text-sm sm:text-base font-semibold" style="color: var(--text-primary);">Resolución</h2>
            </div>

            <div class="rounded-xl border p-3 sm:p-4" :style="{ borderColor: 'var(--border-color)', background: 'var(--success-bg)' }">
              <div class="flex items-center gap-2.5 mb-3">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background: var(--success);">
                  <CheckCircle class="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 class="text-sm sm:text-base font-bold" style="color: var(--text-primary);">Reporte Resuelto</h3>
                  <p class="text-[10px]" style="color: var(--text-muted);">{{ formatDate(report.resolution.resolvedAt) }}</p>
                </div>
              </div>

              <div class="flex items-center gap-2 mb-3">
                <div class="rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 text-xs font-semibold" :style="{
                  background: report.resolution.type === 'replace' ? 'var(--info-bg)' : report.resolution.type === 'credit' || report.resolution.type === 'reactivated' ? 'var(--success-bg)' : 'var(--error-bg)',
                  color: report.resolution.type === 'replace' ? 'var(--info)' : report.resolution.type === 'credit' || report.resolution.type === 'reactivated' ? 'var(--success)' : 'var(--error)',
                  border: '1px solid ' + (report.resolution.type === 'replace' ? 'var(--info)' : report.resolution.type === 'credit' || report.resolution.type === 'reactivated' ? 'var(--success)' : 'var(--error)'),
                }">
                  <CheckCircle v-if="report.resolution.type === 'replace'" class="w-3.5 h-3.5" />
                  <Package v-else-if="report.resolution.type === 'credit'" class="w-3.5 h-3.5" />
                  <RotateCcw v-else-if="report.resolution.type === 'reactivated'" class="w-3.5 h-3.5" />
                  <AlertTriangle v-else class="w-3.5 h-3.5" />
                  {{ report.resolution.type === 'replace' ? 'Reemplazo' : report.resolution.type === 'credit' ? 'Credito' : report.resolution.type === 'reactivated' ? 'Reactivada' : 'Rechazado' }}
                </div>
              </div>

              <div v-if="report.resolution.text" class="rounded-lg p-2.5 mb-2.5 text-xs" style="background: var(--bg-card); color: var(--text-secondary);">{{ report.resolution.text }}</div>

              <div v-if="report.resolution.type === 'replace'" class="mb-2.5">
                <template v-if="!report.is_batch && report.resolution.replaced_mail">
                  <div class="rounded-lg p-2.5 mb-1.5 text-xs" style="background: var(--bg-card);">
                    <p class="font-semibold mb-0.5" style="color: var(--text-muted);">Nuevo email</p>
                    <div class="flex items-center gap-1.5">
                      <span class="font-mono font-medium" style="color: var(--text-primary);">{{ report.resolution.replaced_mail }}</span>
                      <button @click="copyToClipboard(report.resolution.replaced_mail)" class="btn-ghost shrink-0 !p-0.5 rounded" style="color: var(--rose-primary);">
                        <Copy class="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <div v-if="report.resolution.replaced_password" class="rounded-lg p-2.5 text-xs" style="background: var(--bg-card);">
                    <p class="font-semibold mb-0.5" style="color: var(--text-muted);">Nueva contraseña</p>
                    <div class="flex items-center gap-1.5">
                      <span class="font-mono font-medium" style="color: var(--text-primary);">{{ showReplacedPassword ? report.resolution.replaced_password : '••••••' }}</span>
                      <button @click="showReplacedPassword = !showReplacedPassword" class="btn-ghost shrink-0 !p-0.5 rounded" style="color: var(--rose-primary);">
                        <EyeOff v-if="showReplacedPassword" class="w-3 h-3" />
                        <Eye v-else class="w-3 h-3" />
                      </button>
                      <button @click="copyToClipboard(report.resolution.replaced_password)" class="btn-ghost shrink-0 !p-0.5 rounded" style="color: var(--rose-primary);">
                        <Copy class="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </template>

                <template v-else-if="report.is_batch && report.resolution.replaced_mails?.length">
                  <div class="rounded-lg p-2.5 mb-1.5 text-xs" style="background: var(--bg-card);">
                    <p class="font-semibold mb-1" style="color: var(--text-muted);">Nuevos emails ({{ report.resolution.replaced_mails.length }})</p>
                    <div class="space-y-1">
                      <div v-for="(mail, idx) in report.resolution.replaced_mails" :key="idx" class="flex items-center gap-1.5">
                        <span class="font-mono font-medium" style="color: var(--text-primary);">{{ mail }}</span>
                        <button @click="copyToClipboard(mail)" class="btn-ghost shrink-0 !p-0.5 rounded" style="color: var(--rose-primary);">
                          <Copy class="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div v-if="report.resolution.replaced_password" class="rounded-lg p-2.5 text-xs" style="background: var(--bg-card);">
                    <p class="font-semibold mb-0.5" style="color: var(--text-muted);">Nueva contraseña</p>
                    <div class="flex items-center gap-1.5">
                      <span class="font-mono font-medium" style="color: var(--text-primary);">{{ showReplacedPassword ? report.resolution.replaced_password : '••••••' }}</span>
                      <button @click="showReplacedPassword = !showReplacedPassword" class="btn-ghost shrink-0 !p-0.5 rounded" style="color: var(--rose-primary);">
                        <EyeOff v-if="showReplacedPassword" class="w-3 h-3" />
                        <Eye v-else class="w-3 h-3" />
                      </button>
                      <button @click="copyToClipboard(report.resolution.replaced_password)" class="btn-ghost shrink-0 !p-0.5 rounded" style="color: var(--rose-primary);">
                        <Copy class="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </template>
              </div>

              <div v-if="report.resolution.type === 'credit' && report.resolution.credit_amount > 0" class="rounded-lg p-2.5 mb-2.5 text-xs" style="background: var(--bg-card);">
                <span style="color: var(--success);">Saldo a favor: <strong>${{ report.resolution.credit_amount.toFixed(2) }}</strong></span>
              </div>

              <div v-if="report.resolution.resolvedBy && authStore.isAdmin" class="rounded-lg p-2.5 flex items-center gap-2.5 text-xs" style="background: var(--bg-card);">
                <div class="w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold shrink-0" style="background: var(--rose-gradient); color: white;">{{ (report.resolution.resolvedBy?.username || '?').charAt(0).toUpperCase() }}</div>
                <span style="color: var(--text-muted);">Resuelto por <strong style="color: var(--text-primary);">{{ report.resolution.resolvedBy?.username }}</strong></span>
              </div>
            </div>
          </section>

        <!-- Side column -->
        <div class="space-y-4 sm:space-y-5 min-w-0">
          <!-- Status timeline -->
          <section class="card p-4 sm:p-5">
            <div class="flex items-center gap-2.5 mb-5 sm:mb-6">
              <div class="section-icon"><CircleUser class="w-4 h-4" /></div>
              <h2 class="text-sm sm:text-base font-semibold" style="color: var(--text-primary);">Estado del reporte</h2>
            </div>

            <div class="flex items-start">
              <div v-for="(step, i) in timelineSteps" :key="i" class="flex-1 flex flex-col items-center relative min-w-0">
                <div v-if="i < timelineSteps.length - 1" class="absolute top-[13px] left-1/2 w-full h-[2px]"
                     :style="{ background: timelineSteps[i + 1].state !== 'todo' ? 'var(--rose-primary)' : 'var(--border-color)' }"></div>
                <div class="relative z-10 w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold border-2 transition-all"
                     :style="step.state === 'done'
                       ? { background: 'var(--rose-primary)', borderColor: 'var(--rose-primary)', color: 'white' }
                       : step.state === 'active'
                         ? { background: 'var(--bg-card)', borderColor: 'var(--rose-primary)', color: 'var(--rose-primary)' }
                         : { background: 'var(--bg-page)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }">
                  <Check v-if="step.state === 'done'" class="w-3.5 h-3.5" />
                  <span v-else>{{ i + 1 }}</span>
                </div>
                <p class="mt-2 text-center text-[11px] sm:text-xs font-semibold leading-tight"
                   :style="{ color: step.state === 'todo' ? 'var(--text-muted)' : 'var(--text-primary)' }">
                  {{ step.label }}
                </p>
                <p class="mt-0.5 text-center text-[9px] sm:text-[10px] leading-tight px-0.5"
                   :style="{ color: step.state === 'active' ? 'var(--text-secondary)' : 'var(--text-muted)' }">
                  {{ step.hint }}
                </p>
              </div>
            </div>
          </section>

          <!-- Reported by -->
          <section class="card p-4 sm:p-5">
            <div class="flex items-center gap-2.5 mb-3.5">
              <div class="section-icon"><Users class="w-4 h-4" /></div>
              <h2 class="text-sm sm:text-base font-semibold" style="color: var(--text-primary);">Reportado por</h2>
            </div>
            <div class="flex items-center gap-3 rounded-xl p-3" style="background: var(--bg-surface); border: 1px solid var(--border-color);">
              <div class="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                   style="background: var(--rose-gradient); color: white;">
                {{ reportedByInitials }}
              </div>
              <div class="min-w-0 flex-1">
                <RouterLink v-if="authStore.isAdmin && report.user?._id" :to="`/app/admin/users/${report.user._id}`"
                            class="text-sm font-semibold hover:underline truncate block" style="color: var(--text-primary);">
                  {{ report.user?.name || report.user?.username || '—' }}
                </RouterLink>
                <p v-else class="text-sm font-semibold truncate" style="color: var(--text-primary);">{{ report.user?.name || report.user?.username || '—' }}</p>
                <p v-if="report.user?.phone" class="text-[11px] mt-0.5 flex items-center gap-1.5" style="color: var(--text-muted);">
                  <Phone class="w-3 h-3" />
                  {{ report.user.phone }}
                </p>
              </div>
            </div>
          </section>

          <!-- Attachments / evidences -->
          <section class="card p-4 sm:p-5">
            <div class="flex items-center gap-2.5 mb-3.5">
              <div class="section-icon"><Paperclip class="w-4 h-4" /></div>
              <h2 class="text-sm sm:text-base font-semibold" style="color: var(--text-primary);">Archivos adjuntos</h2>
            </div>

            <div class="rounded-xl border border-dashed p-3" style="border-color: var(--border-color);">
              <div v-if="hasEvidence" class="grid grid-cols-2 gap-2.5">
                <button v-for="ev in evidences" :key="ev.type" @click="openLightbox(ev.type)"
                        class="group relative rounded-lg border overflow-hidden text-left transition-colors hover:border-[var(--rose-primary)]"
                        :style="{ borderColor: 'var(--border-color)' }">
                  <img :src="getUploadUrl(ev.path)" class="w-full h-24 object-cover transition-transform duration-300 group-hover:scale-105" @error="onImgError($event)" />
                  <span class="absolute bottom-0 inset-x-0 px-2 py-1 text-[10px] font-medium text-white" style="background: rgba(0,0,0,0.55);">{{ ev.label }}</span>
                </button>
              </div>

              <div v-else class="flex flex-col items-center justify-center text-center py-6 px-3">
                <div class="w-10 h-10 rounded-xl flex items-center justify-center mb-2.5" style="background: var(--rose-lighter);">
                  <Upload class="w-5 h-5" style="color: var(--rose-primary);" />
                </div>
                <p class="text-xs font-medium" style="color: var(--text-secondary);">Sin archivos adjuntos</p>
                <p class="text-[10px] mt-0.5" style="color: var(--text-muted);">Las evidencias del reporte aparecerán aquí</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </template>

    <div v-else class="text-center py-16 sm:py-20">
      <p class="text-sm" style="color: var(--text-muted);">Reporte no encontrado</p>
    </div>

    <Teleport to="body">
      <div v-if="lightboxSrc" class="fixed inset-0 z-[300] flex items-center justify-center p-4" style="background: rgba(0,0,0,0.85);" @click="lightboxSrc = null">
        <img :src="lightboxSrc" class="max-w-full max-h-[85vh] sm:max-h-[90vh] rounded-xl sm:rounded-2xl shadow-2xl" @click.stop />
      </div>
    </Teleport>

    <ResolvModal :visible="showResolveModal" :report="report" @close="showResolveModal = false" @resolved="handleResolved" />
    <ResolvModal :visible="showEditModal" :report="report" :editing-resolution="report?.resolution" @close="showEditModal = false" @resolved="handleResolved" />
    <ConfirmDialog :visible="showDeleteConfirm" title="Eliminar reporte" message="Estas seguro de eliminar este reporte?" confirmText="Eliminar" type="danger" :loading="deleteLoading" @confirm="confirmDelete" @cancel="showDeleteConfirm = false" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../store/auth'
import { useReportsStore } from '../../store/reports'
import { useToastStore } from '../../store/toast'
import { LOCALE } from '../../config/constants'
import { parseDateOnly } from '../../utils/dates'
import { usePlatformsStore } from '../../store/platforms'
import { Icon } from '@iconify/vue'
import { ArrowLeft, ChevronRight, Check, Clock, FileText, Edit, Trash2, Eye, EyeOff, Copy, Users, Phone, Calendar, Key, Mail, Lock, Paperclip, Upload, CircleUser, AlertTriangle, Package, CheckCircle, RotateCcw } from '@lucide/vue'
import ResolvModal from '../../components/reports/ResolvModal.vue'
import ConfirmDialog from '../../components/ui/ConfirmDialog.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const reportsStore = useReportsStore()
const toast = useToastStore()
const platformsStore = usePlatformsStore()

const loading = ref(true)
const showReportPassword = ref(false)
const showReplacedPassword = ref(false)
const lightboxSrc = ref(null)
const showResolveModal = ref(false)
const showEditModal = ref(false)
const showDeleteConfirm = ref(false)
const statusLoading = ref(false)
const deleteLoading = ref(false)

const report = computed(() => reportsStore.currentReport)
const platformIconId = computed(() => platformsStore.getIconId(report.value?.platform))
const platformColor = computed(() => platformsStore.getColor(report.value?.platform))

const batchMails = computed(() => {
  const r = report.value
  if (!r?.is_batch) return []
  const emails = [...(r.batch_emails || [])]
  const mail = r.mail
  if (mail && !emails.includes(mail)) emails.unshift(mail)
  return emails
})

const statusLabel = computed(() => {
  const s = report.value?.status
  if (s === 'resolved') return 'Resuelto'
  if (s === 'in_progress') return 'En proceso'
  return 'Pendiente'
})

const statusInfo = computed(() => {
  const s = report.value?.status
  if (s === 'resolved') return { color: 'var(--success)', bg: 'var(--success-bg)', border: 'rgba(45,157,92,0.35)' }
  if (s === 'in_progress') return { color: 'var(--info)', bg: 'var(--info-bg)', border: 'rgba(74,128,184,0.35)' }
  return { color: 'var(--warning)', bg: 'var(--warning-bg)', border: 'rgba(212,148,10,0.35)' }
})

const typeLabel = computed(() => report.value?.platform_type === 'profile' ? 'Perfil' : 'Cuenta')
const durationLabel = computed(() => (report.value?.account_duration > 1 ? `${report.value.account_duration} meses` : '1 mes'))
const shortId = computed(() => (report.value?._id || '').slice(-5))

const reportedByInitials = computed(() => {
  const u = report.value?.user
  const source = (u?.name || u?.username || '?').trim()
  const parts = source.split(/\s+/)
  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase() || '?'
})

const hasEvidence = computed(() => !!(report.value?.fail_evidence || report.value?.delivery_evidence))

const evidences = computed(() => {
  const r = report.value
  if (!r) return []
  return [
    { type: 'fail', label: 'Falla', path: r.fail_evidence },
    { type: 'delivery', label: 'Entrega', path: r.delivery_evidence },
  ].filter(ev => ev.path)
})

const timelineSteps = computed(() => {
  const r = report.value
  const s = r?.status
  return [
    {
      label: 'Reportado',
      state: 'done',
      hint: formatDateShort(r?.createdAt),
    },
    {
      label: 'En proceso',
      state: s === 'resolved' ? 'done' : 'active',
      hint: s === 'in_progress' || s === 'resolved' ? formatDateShort(r?.updatedAt) : 'En revisión',
    },
    {
      label: 'Resuelto',
      state: s === 'resolved' ? 'done' : 'todo',
      hint: r?.resolution?.resolvedAt ? formatDateShort(r.resolution.resolvedAt) : '',
    },
  ]
})

function getUploadUrl(path) {
  if (!path) return ''
  if (path.startsWith('http')) return path
  const apiBase = import.meta.env.VITE_API_BASE_URL || '/api'
  const serverBase = apiBase.replace(/\/api\/?$/, '')
  const cleanPath = path.replace(/\\/g, '/').split('/').pop()
  return `${serverBase}/uploads/${cleanPath}`
}

function onImgError(e) { e.target.style.display = 'none' }

function formatDate(date) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString(LOCALE, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function formatDateOnly(date) {
  if (!date) return '—'
  return parseDateOnly(date).toLocaleDateString(LOCALE, { year: 'numeric', month: 'short', day: 'numeric' })
}

function formatDateLong(date) {
  if (!date) return '—'
  return new Date(date).toLocaleString(LOCALE, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function formatDateShort(date) {
  if (!date) return ''
  return new Date(date).toLocaleString(LOCALE, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

function copyToClipboard(text) { navigator.clipboard.writeText(text).then(() => toast.success('Copiado', 'Copiado al portapapeles')) }

function goBack() { router.push('/app/reports') }
function goEdit() { router.push(`/app/reports/new?edit=${report.value._id}`) }
function openLightbox(type) {
  const path = type === 'fail' ? report.value?.fail_evidence : report.value?.delivery_evidence
  if (path) lightboxSrc.value = getUploadUrl(path)
}
function openResolveModal() { showResolveModal.value = true }
function openEditResolution() { showEditModal.value = true }

async function handleResolved() {
  try { await reportsStore.fetchReport(route.params.id) } catch { }
}

async function toggleStatus() {
  statusLoading.value = true
  try {
    const newStatus = report.value.status === 'pending' ? 'in_progress' : 'pending'
    await reportsStore.updateStatus(report.value._id, newStatus)
    toast.success('Estado actualizado', `Marcado como "${newStatus === 'in_progress' ? 'En proceso' : 'Pendiente'}"`)
    await reportsStore.fetchReport(route.params.id)
  } catch {
    toast.error('Error', 'No se pudo actualizar el estado')
  } finally {
    statusLoading.value = false
  }
}

function openDeleteConfirm() { showDeleteConfirm.value = true }

async function confirmDelete() {
  deleteLoading.value = true
  try {
    await reportsStore.deleteReport(report.value._id)
    toast.success('Eliminado', 'Reporte eliminado')
    router.push('/app/reports')
  } catch {
    toast.error('Error', 'No se pudo eliminar')
  } finally {
    deleteLoading.value = false
    showDeleteConfirm.value = false
  }
}

onMounted(() => {
  loading.value = true
  platformsStore.fetch()
  reportsStore.fetchReport(route.params.id).finally(() => loading.value = false)
})
</script>

<style scoped>
.tag-pill {
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.6rem;
  border-radius: 9999px;
  font-size: 10px;
  font-weight: 600;
  line-height: 1.5;
  letter-spacing: 0.01em;
  color: var(--text-secondary);
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  white-space: nowrap;
}
@media (min-width: 640px) {
  .tag-pill { font-size: 11px; }
}
.tag-pill-accent {
  background: var(--rose-lighter);
  border-color: var(--rose-light);
  color: var(--rose-primary);
}
.section-icon {
  width: 2rem;
  height: 2rem;
  border-radius: 0.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: var(--rose-lighter);
  color: var(--rose-primary);
  border: 1px solid var(--rose-light);
}
.info-tile {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  min-width: 0;
  padding: 0.7rem 0.75rem;
  border-radius: 0.75rem;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
}
.info-tile-stack {
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
}
@media (min-width: 640px) {
  .info-tile-stack {
    flex-direction: row;
    align-items: center;
    gap: 0.65rem;
  }
}
.tile-icon {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.65rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: var(--rose-lighter);
}
.tile-label {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--text-muted);
  margin-bottom: 1px;
}
.tile-value {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.4;
}
@media (min-width: 640px) {
  .tile-value { font-size: 13px; }
}
.info-row {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.7rem 0.75rem;
  border-radius: 0.75rem;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
}
.row-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.9rem;
  height: 1.9rem;
  border-radius: 0.5rem;
  color: var(--rose-primary);
  transition: background 0.15s ease;
  flex-shrink: 0;
}
.row-action:hover { background: var(--rose-light); }
</style>
