<template>
  <div class="max-w-4xl mx-auto p-4 sm:p-5 lg:p-6 space-y-4">
    <div class="flex items-center justify-between">
      <button @click="goBack" class="inline-flex items-center gap-2 btn-ghost text-xs sm:text-sm !px-2 sm:!px-3" style="color: var(--rose-primary);">
        <ArrowLeft class="w-4 h-4" />
        Volver
      </button>
      <span v-if="report" :class="report.status === 'resolved' ? 'badge badge-resolved' : report.status === 'in_progress' ? 'badge badge-progress' : 'badge badge-pending'" class="text-[10px] sm:text-xs">
        {{ statusLabel }}
      </span>
    </div>

    <div v-if="loading" class="space-y-3">
      <div class="card p-4 space-y-3"><div class="skeleton h-6 w-48 rounded"></div><div class="skeleton h-4 w-40 rounded"></div><div class="skeleton h-20 w-full rounded"></div></div>
    </div>

    <template v-else-if="report">
      <!-- Compact header card -->
      <div class="card p-3 sm:p-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0"
               :style="{ background: platformColor + '18', border: '1px solid ' + platformColor + '30' }">
            <Icon :icon="platformIconId" class="w-5 h-5 sm:w-6 sm:h-6" :style="{ color: platformColor }" />
          </div>
          <div class="flex-1 min-w-0">
            <h1 class="text-sm sm:text-base font-bold" style="color: var(--text-primary);">{{ report.platform }}</h1>
            <p class="text-[11px] sm:text-xs truncate" style="color: var(--text-muted);">{{ report.mail }}</p>
          </div>
          <div class="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button v-if="authStore.isAdmin && report.status !== 'resolved'" @click="openResolveModal"
                    class="btn-primary text-[11px] sm:text-xs !py-1.5 !px-2.5 sm:!px-3">
              <CheckCircle class="w-3.5 h-3.5" />
              Resolver
            </button>
            <button v-if="authStore.isAdmin && report.status !== 'resolved'" @click="toggleStatus" :disabled="statusLoading"
                    class="text-[11px] sm:text-xs inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl font-semibold transition-all"
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

      <!-- Progress bar -->
      <div class="card p-3 sm:p-4">
        <div class="flex items-center w-full">
          <template v-for="(step, i) in timeline" :key="i">
            <div class="flex flex-col items-center" :class="i < timeline.length - 1 ? 'flex-1' : ''">
              <div class="flex items-center w-full">
                <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold border-2 shrink-0 transition-all"
                     :style="{
                       borderColor: step.done ? 'var(--success)' : step.active ? 'var(--rose-primary)' : 'var(--border-color)',
                       background: step.done ? 'var(--success)' : step.active ? 'var(--bg-card)' : 'var(--bg-page)',
                       color: step.done ? 'white' : step.active ? 'var(--rose-primary)' : 'var(--text-muted)',
                     }">
                  <Check v-if="step.done" class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span v-else>{{ i + 1 }}</span>
                </div>
                <div v-if="i < timeline.length - 1" class="flex-1 h-[2px] mx-1.5 sm:mx-2 rounded-full transition-all"
                     :style="{ background: timeline[i+1].done ? 'var(--success)' : 'var(--border-color)' }"></div>
              </div>
              <div class="mt-1.5 text-center" :class="i < timeline.length - 1 ? 'flex-1 w-full' : ''">
                <p class="text-[9px] sm:text-[10px] font-semibold" :style="{ color: step.done ? 'var(--success)' : step.active ? 'var(--text-primary)' : 'var(--text-muted)' }">{{ step.label }}</p>
                <p v-if="step.date" class="text-[8px] sm:text-[9px]" style="color: var(--text-muted);">{{ formatDateShort(step.date) }}</p>
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- Platform + Duration + Type row -->
      <div class="card p-3 sm:p-4">
        <div class="grid grid-cols-3 gap-2 sm:gap-2.5">
          <div class="rounded-xl p-2.5" style="background: var(--bg-surface);">
            <p class="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider mb-0.5 flex items-center gap-1.5" style="color: var(--text-muted);">
              <Package class="w-3 h-3" /> Plataforma
            </p>
            <p class="text-xs sm:text-sm font-medium truncate" style="color: var(--text-primary);">{{ report.platform }}</p>
          </div>
          <div class="rounded-xl p-2.5" style="background: var(--bg-surface);">
            <p class="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider mb-0.5 flex items-center gap-1.5" style="color: var(--text-muted);">
              <Clock class="w-3 h-3" /> Duración
            </p>
            <p class="text-xs sm:text-sm font-medium" style="color: var(--text-primary);">{{ report.account_duration > 1 ? `${report.account_duration} meses` : '1 mes' }}</p>
          </div>
          <div class="rounded-xl p-2.5" style="background: var(--bg-surface);">
            <p class="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider mb-0.5 flex items-center gap-1.5" style="color: var(--text-muted);">
              <Info class="w-3 h-3" /> Tipo
            </p>
            <p class="text-xs sm:text-sm font-medium" style="color: var(--text-primary);">{{ report.platform_type === 'profile' ? 'Perfil' : 'Cuenta' }}</p>
          </div>
        </div>
      </div>

      <!-- Account info -->
      <div class="card p-3 sm:p-4">
        <p class="text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-2.5 flex items-center gap-2" style="color: var(--rose-primary);">
          <Key class="w-3.5 h-3.5" />
          Cuenta
        </p>

        <template v-if="!report.is_batch">
          <div class="rounded-xl p-2.5 mb-2" style="background: var(--bg-surface);">
            <p class="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider mb-0.5" style="color: var(--text-muted);">Email</p>
            <div class="flex items-center gap-1.5">
              <p class="text-xs sm:text-sm font-medium truncate font-mono" style="color: var(--text-primary);">{{ report.mail }}</p>
              <button @click="copyToClipboard(report.mail)" class="btn-ghost shrink-0 !p-0.5 rounded" style="color: var(--rose-primary);">
                <Copy class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div class="rounded-xl p-2.5" style="background: var(--bg-surface);">
            <p class="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider mb-0.5" style="color: var(--text-muted);">Contraseña</p>
            <div class="flex items-center gap-1.5">
              <p class="text-xs sm:text-sm font-medium truncate font-mono" style="color: var(--text-primary);">{{ showReportPassword ? report.password : '••••••' }}</p>
              <button @click="showReportPassword = !showReportPassword" class="btn-ghost shrink-0 !p-0.5 rounded" style="color: var(--rose-primary);">
                <EyeOff v-if="showReportPassword" class="w-3.5 h-3.5" />
                <Eye v-else class="w-3.5 h-3.5" />
              </button>
              <button @click="copyToClipboard(report.password)" class="btn-ghost shrink-0 !p-0.5 rounded" style="color: var(--rose-primary);">
                <Copy class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </template>

        <template v-else>
          <div class="flex items-center gap-2 mb-3">
            <span class="rounded-xl px-2.5 py-1 text-[10px] sm:text-xs font-semibold" style="background: var(--warning-bg); color: var(--warning); border: 1px solid var(--warning);">
              Lote — {{ (report.batch_emails || []).length + 1 }} cuentas
            </span>
          </div>
          <div class="rounded-xl p-2.5 mb-2" style="background: var(--bg-surface);">
            <p class="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider mb-1.5" style="color: var(--text-muted);">Emails</p>
            <div class="space-y-1">
              <div class="flex items-center gap-1.5">
                <p class="text-xs sm:text-sm font-medium truncate font-mono" style="color: var(--text-primary);">{{ report.mail }}</p>
                <button @click="copyToClipboard(report.mail)" class="btn-ghost shrink-0 !p-0.5 rounded" style="color: var(--rose-primary);">
                  <Copy class="w-3.5 h-3.5" />
                </button>
              </div>
              <div v-for="(email, idx) in (report.batch_emails || [])" :key="idx" class="flex items-center gap-1.5">
                <p class="text-xs sm:text-sm font-medium truncate font-mono" style="color: var(--text-primary);">{{ email }}</p>
                <button @click="copyToClipboard(email)" class="btn-ghost shrink-0 !p-0.5 rounded" style="color: var(--rose-primary);">
                  <Copy class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
          <div class="rounded-xl p-2.5" style="background: var(--bg-surface);">
            <p class="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider mb-0.5" style="color: var(--text-muted);">Contraseña</p>
            <div class="flex items-center gap-1.5">
              <p class="text-xs sm:text-sm font-medium truncate font-mono" style="color: var(--text-primary);">{{ showReportPassword ? report.password : '••••••' }}</p>
              <button @click="showReportPassword = !showReportPassword" class="btn-ghost shrink-0 !p-0.5 rounded" style="color: var(--rose-primary);">
                <EyeOff v-if="showReportPassword" class="w-3.5 h-3.5" />
                <Eye v-else class="w-3.5 h-3.5" />
              </button>
              <button @click="copyToClipboard(report.password)" class="btn-ghost shrink-0 !p-0.5 rounded" style="color: var(--rose-primary);">
                <Copy class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </template>
      </div>

      <!-- Delivery + Report dates -->
      <div class="card p-3 sm:p-4">
        <div class="grid grid-cols-2 gap-2 sm:gap-2.5">
          <div class="rounded-xl p-2.5" style="background: var(--bg-surface);">
            <p class="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider mb-0.5 flex items-center gap-1.5" style="color: var(--text-muted);">
              <Calendar class="w-3 h-3" /> Fecha de entrega
            </p>
            <p class="text-xs sm:text-sm font-medium" style="color: var(--text-primary);">{{ formatDate(report.delivery_date) }}</p>
          </div>
          <div class="rounded-xl p-2.5" style="background: var(--bg-surface);">
            <p class="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider mb-0.5 flex items-center gap-1.5" style="color: var(--text-muted);">
              <Calendar class="w-3 h-3" /> Fecha de reporte
            </p>
            <p class="text-xs sm:text-sm font-medium" style="color: var(--text-primary);">{{ formatDate(report.createdAt) }}</p>
          </div>
        </div>
      </div>

      <!-- Reported by -->
      <div class="card p-3 sm:p-4">
        <p class="text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-2.5 flex items-center gap-2" style="color: var(--rose-primary);">
          <Users class="w-3.5 h-3.5" />
          Reportado por
        </p>
        <div class="rounded-xl p-2.5" style="background: var(--bg-surface);">
          <router-link v-if="authStore.isAdmin && report.user?._id" :to="`/app/admin/users/${report.user._id}`"
                       class="text-xs sm:text-sm font-semibold hover:underline" style="color: var(--rose-primary);">
            {{ report.user?.username || '—' }}
          </router-link>
          <p v-else class="text-xs sm:text-sm font-semibold" style="color: var(--text-primary);">{{ report.user?.username || '—' }}</p>
          <p v-if="report.user?.phone" class="text-[10px] sm:text-xs mt-0.5 flex items-center gap-1.5" style="color: var(--text-muted);">
            <Phone class="w-3 h-3" />
            {{ report.user.phone }}
          </p>
        </div>
      </div>

      <!-- Description -->
      <div v-if="report.description" class="card p-3 sm:p-4">
        <p class="text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-2" style="color: var(--rose-primary);">
          <FileText class="w-3.5 h-3.5" />
          Descripción
        </p>
        <div class="rounded-xl p-3" style="background: var(--bg-surface);">
          <p class="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap" style="color: var(--text-secondary);">{{ report.description }}</p>
        </div>
      </div>

      <!-- Evidences -->
      <div class="card p-3 sm:p-4">
        <p class="text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-2" style="color: var(--rose-primary);">
          <Image class="w-3.5 h-3.5" />
          Evidencias
        </p>
        <div class="grid grid-cols-2 gap-2.5">
          <div class="rounded-xl border overflow-hidden cursor-pointer transition-colors hover:border-[var(--rose-light)]" :style="{ borderColor: 'var(--border-color)' }" @click="openLightbox('fail')">
            <div class="px-2.5 py-1.5 border-b text-[10px] font-medium" :style="{ borderColor: 'var(--border-color)', color: 'var(--text-muted)', background: 'var(--bg-surface)' }">Falla</div>
            <img v-if="report.fail_evidence" :src="getUploadUrl(report.fail_evidence)" class="w-full h-28 sm:h-32 object-cover" @error="onImgError($event)" />
            <div v-else class="h-28 sm:h-32 flex items-center justify-center text-[10px]" style="color: var(--text-muted);">Sin evidencia</div>
          </div>
          <div class="rounded-xl border overflow-hidden cursor-pointer transition-colors hover:border-[var(--rose-light)]" :style="{ borderColor: 'var(--border-color)' }" @click="openLightbox('delivery')">
            <div class="px-2.5 py-1.5 border-b text-[10px] font-medium" :style="{ borderColor: 'var(--border-color)', color: 'var(--text-muted)', background: 'var(--bg-surface)' }">Entrega</div>
            <img v-if="report.delivery_evidence" :src="getUploadUrl(report.delivery_evidence)" class="w-full h-28 sm:h-32 object-cover" @error="onImgError($event)" />
            <div v-else class="h-28 sm:h-32 flex items-center justify-center text-[10px]" style="color: var(--text-muted);">Sin evidencia</div>
          </div>
        </div>
      </div>

      <!-- Resolution block -->
      <div v-if="report.status === 'resolved' && report.resolution" class="card p-3 sm:p-4">
        <p class="text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-2.5 flex items-center gap-2" style="color: var(--success);">
          <CheckCircle class="w-3.5 h-3.5" />
          Resolución
        </p>
        <div class="rounded-xl border p-3 sm:p-4" :style="{ borderColor: 'var(--border-color)', background: 'var(--success-bg)' }">
          <div class="flex items-center gap-2.5 mb-3">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background: var(--success);">
              <CheckCircle class="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 class="text-sm sm:text-base font-bold">Reporte Resuelto</h2>
              <p class="text-[10px]" style="color: var(--text-muted);">{{ formatDate(report.resolution.resolvedAt) }}</p>
            </div>
          </div>

          <div class="flex items-center gap-2 mb-3">
            <div class="rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 text-xs font-semibold" :style="{
              background: report.resolution.type === 'replace' ? 'var(--info-bg)' : report.resolution.type === 'credit' ? 'var(--success-bg)' : 'var(--error-bg)',
              color: report.resolution.type === 'replace' ? 'var(--info)' : report.resolution.type === 'credit' ? 'var(--success)' : 'var(--error)',
              border: '1px solid ' + (report.resolution.type === 'replace' ? 'var(--info)' : report.resolution.type === 'credit' ? 'var(--success)' : 'var(--error)'),
            }">
              <CheckCircle v-if="report.resolution.type === 'replace'" class="w-3.5 h-3.5" />
              <Package v-else-if="report.resolution.type === 'credit'" class="w-3.5 h-3.5" />
              <AlertTriangle v-else class="w-3.5 h-3.5" />
              {{ report.resolution.type === 'replace' ? 'Reemplazo' : report.resolution.type === 'credit' ? 'Credito' : 'Rechazado' }}
            </div>
          </div>

          <div v-if="report.resolution.text" class="rounded-lg p-2.5 mb-2.5 text-xs" style="background: var(--bg-card); color: var(--text-secondary);">{{ report.resolution.text }}</div>

          <!-- RESTORE: replaced credentials when type is replace -->
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

          <!-- Credit amount -->
          <div v-if="report.resolution.type === 'credit' && report.resolution.credit_amount > 0" class="rounded-lg p-2.5 mb-2.5 text-xs" style="background: var(--bg-card);">
            <span style="color: var(--success);">Saldo a favor: <strong>${{ report.resolution.credit_amount.toFixed(2) }}</strong></span>
          </div>

          <div v-if="report.resolution.resolvedBy && authStore.isAdmin" class="rounded-lg p-2.5 flex items-center gap-2.5 text-xs" style="background: var(--bg-card);">
            <div class="w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold shrink-0" style="background: var(--rose-gradient); color: white;">{{ (report.resolution.resolvedBy?.username || '?').charAt(0).toUpperCase() }}</div>
            <span style="color: var(--text-muted);">Resuelto por <strong style="color: var(--text-primary);">{{ report.resolution.resolvedBy?.username }}</strong></span>
          </div>
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
import { usePlatformsStore } from '../../store/platforms'
import { Icon } from '@iconify/vue'
import { ArrowLeft, Check, Info, Clock, FileText, Image, Shield, Edit, Trash2, Eye, EyeOff, Copy, Users, Phone, Calendar, Key, AlertTriangle, Package, CheckCircle } from '@lucide/vue'
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

const statusLabel = computed(() => {
  const s = report.value?.status
  if (s === 'resolved') return 'Resuelto'
  if (s === 'in_progress') return 'En proceso'
  return 'Pendiente'
})

const timeline = computed(() => [
  { label: 'Reportado', done: true, date: report.value?.createdAt },
  { label: 'En proceso', done: report.value?.status === 'in_progress' || report.value?.status === 'resolved', active: report.value?.status === 'pending', date: (report.value?.status === 'in_progress' || report.value?.status === 'resolved') ? report.value?.updatedAt : null },
  { label: 'Resuelto', done: report.value?.status === 'resolved', active: false, date: report.value?.resolution?.resolvedAt },
])

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

function formatDateShort(date) {
  if (!date) return ''
  return new Date(date).toLocaleDateString(LOCALE, { month: 'short', day: 'numeric' })
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
