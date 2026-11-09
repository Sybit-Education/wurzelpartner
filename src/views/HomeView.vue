<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import TreeInfoList from '../components/treeinfo/TreeInfoList.vue'
import SponsorMarquee from '@/components/sponsor/SponsorMarquee.vue'
import PartnerMarquee from '@/components/partner/PartnerMarquee.vue'
import type { PlantedTree } from '@/models/planted_tree'
import { TreePlantingService } from '@/services/treePlantingService'

const treePlantingService = new TreePlantingService()
const latestPlantings = ref<PlantedTree[]>([])
const isLoadingPlantings = ref(true)
const plantingError = ref<string | null>(null)

const displayedPlantings = computed(() => {
  if (latestPlantings.value.length > 0) {
    return latestPlantings.value.map((planting) => ({
      id: planting.id,
      username: planting.users?.[0]?.username || 'Unbekannt',
      date: planting.created_at,
      isDemo: false,
    }))
  }

  return [
    {
      id: 'demo-planting',
      username: 'Demo-Nutzer',
      date: new Date(),
      isDemo: true,
    },
  ]
})

onMounted(async () => {
  try {
    const response = await treePlantingService.getLatestPlantings(5)
    latestPlantings.value = response.list
  } catch (error) {
    console.error('Fehler beim Laden der neuesten Pflanzungen:', error)
    plantingError.value =
      'Die neuesten Pflanzungen konnten nicht geladen werden. Bitte versuchen Sie es später erneut.'
  } finally {
    isLoadingPlantings.value = false
  }
})

function formatPlantingDate(date: Date | string): string {
  const parsedDate = new Date(date)
  if (Number.isNaN(parsedDate.getTime())) {
    return 'Kein Datum verfügbar'
  }

  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(parsedDate)
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-10 flex flex-col gap-6">
      <div>
        <h1>Baumarten</h1>
        <p class="mt-5 text-xl text-gray-600 max-w-fit">
          Entdecken Sie die Vielfalt unserer regionalen Bäume und erfahren Sie mehr über ihre Arten.
        </p>
      </div>
    </div>

    <TreeInfoList />

    <section class="mt-12" aria-labelledby="latest-plantings-heading">
      <h2 id="latest-plantings-heading" class="mb-5 text-2xl font-semibold">
        Neuste Pflanzungen
      </h2>

      <div
        v-if="isLoadingPlantings"
        class="rounded-xl border border-gray-200 p-6 text-center text-gray-600 dark:border-gray-700 dark:text-gray-300"
        role="status"
      >
        Pflanzungen werden geladen ...
      </div>
      <div
        v-else-if="plantingError"
        class="rounded-xl bg-red-50 p-4 text-red-700 dark:bg-red-900/20 dark:text-red-300"
        role="alert"
      >
        {{ plantingError }}
      </div>
      <div
        v-else
        class="overflow-hidden rounded-xl border border-gray-200 shadow-sm dark:border-gray-700"
      >
        <table class="w-full text-left text-sm text-gray-700 dark:text-gray-300">
          <thead class="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-800 dark:text-gray-300">
            <tr>
              <th scope="col" class="px-6 py-4">Nutzername</th>
              <th scope="col" class="px-6 py-4">Tag der Pflanzung</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="planting in displayedPlantings"
              :key="planting.id"
              class="border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
            >
              <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">
                {{ planting.username }}
                <span
                  v-if="planting.isDemo"
                  class="ml-2 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900/40 dark:text-green-300"
                >
                  Beispiel
                </span>
              </td>
              <td class="px-6 py-4">
                {{ formatPlantingDate(planting.date) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
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

<style scoped>
.full-bleed {
  width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
}
</style>
