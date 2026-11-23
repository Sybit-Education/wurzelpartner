<script setup lang="ts">
import { onMounted, ref } from 'vue'
import TreeInfoList from '@/components/treeinfo/TreeInfoList.vue'
import SponsorMarquee from '@/components/sponsor/SponsorMarquee.vue'
import PartnerMarquee from '@/components/partner/PartnerMarquee.vue'
import type { PlantedTree } from '@/models/planted_tree'
import { TreePlantingService } from '@/services/treePlantingService'

const treePlantingService = new TreePlantingService()
const latestPlantings = ref<PlantedTree[]>([])
const loadingPlantings = ref(true)
const plantingError = ref('')

function formatPlantingDate(value: Date | string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
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

onMounted(async () => {
  try {
    latestPlantings.value = await treePlantingService.getLatestPlantings(5)
  } catch (error) {
    console.error('Fehler beim Laden der neuesten Pflanzungen:', error)
    plantingError.value = 'Die neuesten Pflanzungen konnten nicht geladen werden.'
  } finally {
    loadingPlantings.value = false
  }
})
</script>

<template>
  <div class="page-section">
    <div class="mb-section-gap">
      <h1>Baumarten</h1>
      <p class="mt-4 max-w-fit text-xl text-secondary">
        Entdecken Sie die Vielfalt unserer regionalen Bäume und erfahren Sie mehr über ihre Arten.
      </p>
    </div>

    <TreeInfoList />
  </div>

  <section
    class="mb-section-gap overflow-hidden rounded-lg border border-[#dce5d8] bg-[#f3f7ef] px-5 py-7 dark:border-[#303d33] dark:bg-[#141c16] sm:px-7 md:px-9 md:py-9"
    aria-labelledby="latest-plantings-heading"
  >
    <header class="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p
          class="mb-2 mt-0 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#326b45] dark:text-[#b5ddb5]"
        >
          <span class="h-px w-8 bg-[#326b45] dark:bg-[#b5ddb5]" aria-hidden="true"></span>
          Aktuell gepflanzt
        </p>
        <h2
          id="latest-plantings-heading"
          class="m-0 text-[clamp(1.65rem,4vw,2.35rem)] text-[#20342a] dark:text-[#f4f7f4]"
        >
          Neuste Pflanzungen
        </h2>
      </div>
      <RouterLink
        v-if="!loadingPlantings"
        :to="{ name: 'plantings' }"
        class="group inline-flex min-h-11 items-center gap-2 self-start rounded-full border border-[#cdddc7] bg-white/70 px-4 py-2 text-sm font-bold text-[#326b45] no-underline transition-colors hover:bg-[#326b45] hover:text-white dark:border-[#455848] dark:bg-[#1c281f] dark:text-[#b5ddb5] dark:hover:bg-[#76c58f] dark:hover:text-[#132017]"
      >
        Alle Pflanzungen
        <svg
          class="h-4 w-4 transition-transform group-hover:translate-x-1"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          aria-hidden="true"
        >
          <path d="M4 10h12M11 5l5 5-5 5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </RouterLink>
    </header>

    <div
      v-if="loadingPlantings"
      class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      aria-label="Pflanzungen werden geladen"
    >
      <div
        v-for="index in 3"
        :key="index"
        class="h-52 animate-pulse rounded-lg border border-[#dce5d8] bg-white/70 dark:border-[#303d33] dark:bg-[#1c281f]"
      ></div>
    </div>

    <div
      v-else-if="plantingError"
      class="rounded-lg border border-white bg-white px-5 py-6 text-[#637267] dark:border-green-900/60 dark:bg-[#1c281f] dark:text-[#c6d1c7]"
      role="alert"
    >
      {{ plantingError }}
    </div>

    <div
      v-else-if="latestPlantings.length === 0"
      class="rounded-lg border border-dashed border-[#b9cbb6] px-5 py-10 text-center text-[#637267] dark:border-[#455848] dark:text-[#c6d1c7]"
    >
      Noch keine Pflanzungen vorhanden.
    </div>

    <ul v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-live="polite">
      <li
        v-for="(planting, index) in latestPlantings"
        :key="planting.id"
        class="group relative flex min-h-52 flex-col overflow-hidden rounded-lg border border-[#dce5d8] bg-[#fffefa] p-5 shadow-[0_12px_30px_rgb(34_58_39/6%)] transition-transform duration-200 hover:-translate-y-1 dark:border-[#303d33] dark:bg-[#1c281f] dark:shadow-none"
        :class="{ 'lg:col-span-1': true }"
      >
        <div
          class="absolute inset-y-0 left-0 w-1 bg-[#326b45] opacity-70 transition-opacity group-hover:opacity-100 dark:bg-[#76c58f]"
          aria-hidden="true"
        ></div>

        <div class="flex items-start justify-between gap-3">
          <div class="flex min-w-0 items-center gap-3">
            <span
              class="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[#cdddc7] bg-[#edf5e9] text-sm font-bold text-[#326b45] dark:border-[#455848] dark:bg-[#243527] dark:text-[#b5ddb5]"
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
              <p
                v-if="formatPlantingDate(planting.created_at)"
                class="m-0 mt-1 text-xs text-[#637267] dark:text-[#c6d1c7]"
              >
                {{ formatPlantingDate(planting.created_at) }}
              </p>
            </div>
          </div>
          <span
            class="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#326b45] text-white dark:bg-[#76c58f] dark:text-[#132017]"
            :aria-label="`${planting.amount} gepflanzte ${planting.amount === 1 ? 'Baum' : 'Bäume'}`"
          >
            <svg
              class="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M12 22V10" />
              <path d="M12 16C8.5 16 5 13.5 5 9.5 8.5 9.5 12 12 12 16Z" />
              <path d="M12 12.5C12 8.5 15 5.5 19 5.5c0 4.5-3 7-7 7Z" />
            </svg>
          </span>
        </div>

        <div class="mt-6">
          <p class="m-0 text-[1.7rem] font-bold leading-none text-[#326b45] dark:text-[#b5ddb5]">
            {{ planting.amount }}
          </p>
          <p class="m-0 mt-1 text-sm font-semibold text-[#20342a] dark:text-[#f4f7f4]">
            {{ planting.amount === 1 ? 'Baum gepflanzt' : 'Bäume gepflanzt' }}
          </p>
        </div>

        <p
          v-if="planting.message"
          class="mt-auto mb-0 pt-5 text-sm leading-[1.5] text-[#637267] dark:text-[#c6d1c7]"
        >
          „{{ planting.message }}“
        </p>
        <span class="sr-only">Pflanzung {{ index + 1 }}</span>
      </li>
    </ul>
  </section>

  <div class="flex items-center justify-between gap-4">
    <div>
      <p class="text-sm uppercase tracking-[0.25em]">Gemeinsam mit</p>
      <h2 class="text-2xl font-semibold md:text-3xl">Unsere Partner</h2>
    </div>
  </div>

  <PartnerMarquee />

  <div class="flex items-center justify-between gap-4">
    <div>
      <p class="text-sm uppercase tracking-[0.25em]">Unterstützt von</p>
      <h2 class="text-2xl font-semibold md:text-3xl">Unsere Sponsoren</h2>
    </div>
  </div>
  <SponsorMarquee />
</template>
