<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { PlantedTree } from '@/models/planted_tree'
import { TreePlantingService } from '@/services/treePlantingService'

const treePlantingService = new TreePlantingService()
const plantings = ref<PlantedTree[]>([])
const loading = ref(true)
const errorMessage = ref('')
const searchQuery = ref('')
const filtersOpen = ref(false)
const startDate = ref('')
const endDate = ref('')
const selectedTree = ref('')

function formatPlantingDate(value: Date | string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Datum unbekannt'

  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

function getAccountNames(planting: PlantedTree): string {
  return (
    planting.users
      ?.map((user) => user.username)
      .filter(Boolean)
      .join(', ') || 'Unbekannter Account'
  )
}

function getInitials(planting: PlantedTree): string {
  const names = getAccountNames(planting)
  if (names === 'Unbekannter Account') return '?'

  return names
    .split(/[\s,]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((name) => name[0]?.toUpperCase())
    .join('')
}

function getTreeName(planting: PlantedTree): string {
  const treeInfo = planting.treeInfo
  if (Array.isArray(treeInfo)) {
    return (
      treeInfo
        .map((tree) => tree.name)
        .filter(Boolean)
        .join(', ') || 'Baumart unbekannt'
    )
  }

  return treeInfo?.name || 'Baumart unbekannt'
}

function getPlantingDateValue(value: Date | string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  return date.toISOString().slice(0, 10)
}

const treeSpecies = computed(() =>
  [
    ...new Set(plantings.value.map(getTreeName).filter((name) => name !== 'Baumart unbekannt')),
  ].sort((first, second) => first.localeCompare(second, 'de-DE')),
)

const filteredPlantings = computed(() => {
  const query = searchQuery.value.trim().toLocaleLowerCase('de-DE')
  return plantings.value.filter((planting) => {
    const plantingDate = getPlantingDateValue(planting.created_at)
    const matchesSearch =
      !query ||
      [getAccountNames(planting), planting.message, planting.location?.name, getTreeName(planting)]
        .filter(Boolean)
        .some((value) => value?.toLocaleLowerCase('de-DE').includes(query))
    const matchesStartDate = !startDate.value || plantingDate >= startDate.value
    const matchesEndDate = !endDate.value || plantingDate <= endDate.value
    const matchesTree = !selectedTree.value || getTreeName(planting) === selectedTree.value

    return matchesSearch && matchesStartDate && matchesEndDate && matchesTree
  })
})

function clearFilters() {
  startDate.value = ''
  endDate.value = ''
  selectedTree.value = ''
}

const activeFilterCount = computed(
  () =>
    Number(Boolean(startDate.value)) +
    Number(Boolean(endDate.value)) +
    Number(Boolean(selectedTree.value)),
)

const totalTrees = computed(() =>
  plantings.value.reduce((sum, planting) => sum + (Number(planting.amount) || 0), 0),
)

onMounted(async () => {
  try {
    plantings.value = await treePlantingService.getLatestPlantings(100)
  } catch (error) {
    console.error('Fehler beim Laden der Pflanzungen:', error)
    errorMessage.value = 'Die Pflanzungen konnten nicht geladen werden.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="page-section">
    <header class="mb-section-gap">
      <RouterLink
        :to="{ name: 'home' }"
        class="mb-5 inline-flex items-center gap-2 text-sm font-bold text-[#326b45] no-underline hover:text-[#20342a] dark:text-[#b5ddb5] dark:hover:text-white"
      >
        <svg
          class="h-4 w-4"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          aria-hidden="true"
        >
          <path d="M16 10H4M9 5l-5 5 5 5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        Zurück zur Startseite
      </RouterLink>

      <p
        class="mb-2 mt-0 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#326b45] dark:text-[#b5ddb5]"
      >
        <span class="h-px w-8 bg-[#326b45] dark:bg-[#b5ddb5]" aria-hidden="true"></span>
        Gemeinschaftsprojekt
      </p>
      <h1 class="m-0 text-[clamp(2rem,6vw,3.5rem)] text-[#20342a] dark:text-[#f4f7f4]">
        Pflanzungen
      </h1>
      <p class="mb-0 mt-4 max-w-2xl text-base leading-relaxed text-[#637267] dark:text-[#c6d1c7]">
        Entdecke alle aktuellen Einträge und die Menschen, die gemeinsam mit Wurzelpartner eine
        grüneren Zukunft gestalten.
      </p>
    </header>

    <section class="mb-section-gap grid gap-3 sm:grid-cols-3" aria-label="Pflanzungsübersicht">
      <div
        class="rounded-lg border border-[#dce5d8] bg-[#f3f7ef] px-5 py-4 dark:border-[#303d33] dark:bg-[#141c16]"
      >
        <p
          class="m-0 text-xs font-bold uppercase tracking-[0.12em] text-[#637267] dark:text-[#c6d1c7]"
        >
          Gepflanzt
        </p>
        <p class="m-0 mt-1 text-3xl font-bold text-[#326b45] dark:text-[#b5ddb5]">
          {{ loading ? '–' : totalTrees }}
        </p>
      </div>
      <div
        class="rounded-lg border border-[#dce5d8] bg-[#f3f7ef] px-5 py-4 dark:border-[#303d33] dark:bg-[#141c16]"
      >
        <p
          class="m-0 text-xs font-bold uppercase tracking-[0.12em] text-[#637267] dark:text-[#c6d1c7]"
        >
          Einträge
        </p>
        <p class="m-0 mt-1 text-3xl font-bold text-[#326b45] dark:text-[#b5ddb5]">
          {{ loading ? '–' : plantings.length }}
        </p>
      </div>
      <div
        class="rounded-lg border border-[#dce5d8] bg-[#f3f7ef] px-5 py-4 dark:border-[#303d33] dark:bg-[#141c16]"
      >
        <p
          class="m-0 text-xs font-bold uppercase tracking-[0.12em] text-[#637267] dark:text-[#c6d1c7]"
        >
          Aktiv
        </p>
        <p class="m-0 mt-1 text-lg font-bold text-[#20342a] dark:text-[#f4f7f4]">
          {{ loading ? 'Wird geladen…' : 'Gemeinsam wachsen' }}
        </p>
      </div>
    </section>

    <div
      class="mb-5 flex flex-col gap-3 rounded-lg border border-[#dce5d8] bg-[#fffefa] p-3 dark:border-[#303d33] dark:bg-[#1c281f] sm:flex-row sm:items-center"
    >
      <label for="planting-search" class="sr-only">Pflanzungen durchsuchen</label>
      <div class="relative flex-1">
        <svg
          class="pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-[#637267] dark:text-[#c6d1c7]"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          aria-hidden="true"
        >
          <circle cx="8.5" cy="8.5" r="5" />
          <path d="m12.5 12.5 4 4" stroke-linecap="round" />
        </svg>
        <input
          id="planting-search"
          v-model="searchQuery"
          type="search"
          placeholder="Nach Name oder Nachricht suchen"
          class="min-h-11 w-full rounded-md border border-[#dce5d8] bg-white py-2 pr-4 pl-10 text-sm text-[#20342a] outline-none placeholder:text-[#839087] focus:border-[#326b45] focus:ring-3 focus:ring-[#326b45]/15 dark:border-[#455848] dark:bg-[#141c16] dark:text-[#f4f7f4] dark:focus:border-[#b5ddb5]"
        />
      </div>
      <p class="m-0 px-2 text-sm text-[#637267] dark:text-[#c6d1c7]" aria-live="polite">
        {{ filteredPlantings.length }} {{ filteredPlantings.length === 1 ? 'Eintrag' : 'Einträge' }}
      </p>
      <button
        type="button"
        class="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-[#cdddc7] bg-[#f3f7ef] px-4 text-sm font-bold text-[#326b45] transition-colors hover:bg-[#e6f0e1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#326b45] dark:border-[#455848] dark:bg-[#243527] dark:text-[#b5ddb5] dark:hover:bg-[#304432]"
        :aria-expanded="filtersOpen"
        aria-controls="planting-filters"
        @click="filtersOpen = !filtersOpen"
      >
        <svg
          class="h-4 w-4"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          aria-hidden="true"
        >
          <path d="M3 5h14M5.5 10h9M8 15h4" stroke-linecap="round" />
        </svg>
        Filtern
        <span
          v-if="activeFilterCount"
          class="grid h-5 min-w-5 place-items-center rounded-full bg-[#326b45] px-1 text-xs text-white dark:bg-[#76c58f] dark:text-[#132017]"
        >
          {{ activeFilterCount }}
        </span>
      </button>
    </div>

    <div
      v-if="filtersOpen"
      id="planting-filters"
      class="mb-5 grid gap-4 rounded-lg border border-[#dce5d8] bg-[#f3f7ef] p-4 dark:border-[#303d33] dark:bg-[#141c16] sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto]"
    >
      <label class="grid gap-1.5 text-sm font-semibold text-[#20342a] dark:text-[#f4f7f4]">
        Von
        <input
          v-model="startDate"
          type="date"
          :max="endDate || undefined"
          class="min-h-11 rounded-md border border-[#cdddc7] bg-white px-3 text-sm font-normal text-[#20342a] focus:border-[#326b45] focus:outline-none focus:ring-3 focus:ring-[#326b45]/15 dark:border-[#455848] dark:bg-[#1c281f] dark:text-[#f4f7f4]"
        />
      </label>
      <label class="grid gap-1.5 text-sm font-semibold text-[#20342a] dark:text-[#f4f7f4]">
        Bis
        <input
          v-model="endDate"
          type="date"
          :min="startDate || undefined"
          class="min-h-11 rounded-md border border-[#cdddc7] bg-white px-3 text-sm font-normal text-[#20342a] focus:border-[#326b45] focus:outline-none focus:ring-3 focus:ring-[#326b45]/15 dark:border-[#455848] dark:bg-[#1c281f] dark:text-[#f4f7f4]"
        />
      </label>
      <label class="grid gap-1.5 text-sm font-semibold text-[#20342a] dark:text-[#f4f7f4]">
        Baumart
        <select
          v-model="selectedTree"
          class="min-h-11 rounded-md border border-[#cdddc7] bg-white px-3 text-sm font-normal text-[#20342a] focus:border-[#326b45] focus:outline-none focus:ring-3 focus:ring-[#326b45]/15 dark:border-[#455848] dark:bg-[#1c281f] dark:text-[#f4f7f4]"
        >
          <option value="">Alle Baumarten</option>
          <option v-for="treeName in treeSpecies" :key="treeName" :value="treeName">
            {{ treeName }}
          </option>
        </select>
      </label>
      <button
        type="button"
        class="min-h-11 self-end rounded-md px-3 text-sm font-semibold text-[#326b45] underline-offset-2 hover:underline disabled:cursor-not-allowed disabled:opacity-50 dark:text-[#b5ddb5]"
        :disabled="activeFilterCount === 0"
        @click="clearFilters"
      >
        Filter zurücksetzen
      </button>
    </div>

    <div
      v-if="loading"
      class="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
      aria-label="Pflanzungen werden geladen"
    >
      <div
        v-for="index in 6"
        :key="index"
        class="h-64 animate-pulse rounded-lg border border-[#dce5d8] bg-[#f3f7ef] dark:border-[#303d33] dark:bg-[#141c16]"
      ></div>
    </div>

    <div
      v-else-if="errorMessage"
      class="rounded-lg border border-red-200 bg-red-50 px-5 py-6 text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300"
      role="alert"
    >
      {{ errorMessage }}
    </div>

    <div
      v-else-if="filteredPlantings.length === 0"
      class="rounded-lg border border-dashed border-[#b9cbb6] px-5 py-12 text-center text-[#637267] dark:border-[#455848] dark:text-[#c6d1c7]"
    >
      Keine Pflanzungen gefunden.
    </div>

    <ul v-else class="grid gap-4 md:grid-cols-2 xl:grid-cols-3" aria-live="polite">
      <li
        v-for="(planting, index) in filteredPlantings"
        :key="planting.id"
        class="group flex min-h-64 flex-col rounded-lg border border-[#dce5d8] bg-[#fffefa] p-5 shadow-[0_12px_30px_rgb(34_58_39/6%)] transition-transform duration-200 hover:-translate-y-1 dark:border-[#303d33] dark:bg-[#1c281f] dark:shadow-none"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="flex min-w-0 items-center gap-3">
            <span
              class="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-[#cdddc7] bg-[#edf5e9] text-sm font-bold text-[#326b45] dark:border-[#455848] dark:bg-[#243527] dark:text-[#b5ddb5]"
              aria-hidden="true"
            >
              {{ getInitials(planting) }}
            </span>
            <div class="min-w-0">
              <p
                class="m-0 truncate text-sm font-bold text-[#20342a] dark:text-[#f4f7f4]"
                :title="getAccountNames(planting)"
              >
                {{ getAccountNames(planting) }}
              </p>
              <p class="m-0 mt-1 text-xs text-[#637267] dark:text-[#c6d1c7]">
                {{ formatPlantingDate(planting.created_at) }}
              </p>
            </div>
          </div>
          <span
            class="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#edf5e9] text-[#326b45] dark:bg-[#243527] dark:text-[#b5ddb5]"
            aria-hidden="true"
          >
            {{ index + 1 }}
          </span>
        </div>

        <div class="mt-6 border-l-3 border-[#326b45] pl-4 dark:border-[#76c58f]">
          <p class="m-0 text-[2.25rem] font-bold leading-none text-[#326b45] dark:text-[#b5ddb5]">
            {{ planting.amount }}
          </p>
          <p class="m-0 mt-1 text-sm font-semibold text-[#20342a] dark:text-[#f4f7f4]">
            {{ planting.amount === 1 ? 'Baum gepflanzt' : 'Bäume gepflanzt' }}
          </p>
        </div>

        <p
          v-if="getTreeName(planting) !== 'Baumart unbekannt'"
          class="m-0 mt-4 text-sm font-semibold text-[#326b45] dark:text-[#b5ddb5]"
        >
          {{ getTreeName(planting) }}
        </p>

        <p
          v-if="planting.location?.name"
          class="m-0 mt-5 text-xs font-bold uppercase tracking-[0.08em] text-[#637267] dark:text-[#c6d1c7]"
        >
          Standort: {{ planting.location.name }}
        </p>
        <blockquote
          v-if="planting.message"
          class="mt-auto mb-0 border-t border-[#dce5d8] pt-4 text-sm leading-[1.55] text-[#637267] dark:border-[#303d33] dark:text-[#c6d1c7]"
        >
          „{{ planting.message }}“
        </blockquote>
      </li>
    </ul>
  </div>
</template>
