<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { LocationService } from '@/services/locationService'
import type { Location } from '@/models/location'

const locationService = new LocationService()
const locations = ref<Location[]>([])
const isLoading = ref(true)
const errorMessage = ref<string | null>(null)

function formatCoordinates(geoLocation: string): string | null {
  const [latitudeValue, longitudeValue] = geoLocation.split(';')
  const latitude = Number(latitudeValue)
  const longitude = Number(longitudeValue)

  if (!geoLocation || !Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null
  }

  return `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`
}

async function loadLocations() {
  isLoading.value = true
  errorMessage.value = null

  try {
    const loadedLocations: Location[] = []
    let totalRows = Number.POSITIVE_INFINITY
    const pageSize = 100

    while (loadedLocations.length < totalRows) {
      const response = await locationService.getAllLocations(pageSize, loadedLocations.length)
      loadedLocations.push(...response.list)
      totalRows = response.pageInfo.totalRows

      if (response.list.length === 0) {
        break
      }
    }

    locations.value = loadedLocations
  } catch (error) {
    console.error('Fehler beim Laden der Pflanzorte:', error)
    errorMessage.value =
      'Die verfügbaren Pflanzorte konnten nicht geladen werden. Bitte versuchen Sie es später erneut.'
  } finally {
    isLoading.value = false
  }
}

onMounted(loadLocations)
</script>

<template>
  <section class="page-section">
    <header class="mb-section-gap">
      <h1 class="text-4xl font-bold text-heading">Verfügbare Pflanzorte</h1>
      <p class="mt-4 max-w-3xl text-lg text-secondary">
        Entdecken Sie unsere Pflanzorte und unterstützen Sie die Bepflanzung direkt mit einer
        Baumspende.
      </p>
    </header>

    <p v-if="isLoading" class="text-muted" role="status">Pflanzorte werden geladen ...</p>

    <p v-else-if="errorMessage" class="text-error-foreground" role="alert">
      {{ errorMessage }}
    </p>

    <p v-else-if="locations.length === 0" class="text-muted">
      Zurzeit sind keine Pflanzorte verfügbar.
    </p>

    <ul v-else class="grid list-none gap-section-gap p-0 sm:grid-cols-2 xl:grid-cols-3">
      <li
        v-for="location in locations"
        :key="location.id ?? location.name"
        class="flex flex-col rounded-lg border border-field-border bg-raised p-surface"
      >
        <h2 class="text-2xl font-semibold text-heading">{{ location.name }}</h2>
        <p class="mt-3 text-sm text-muted">
          <span class="font-medium text-heading">Koordinaten:</span>
          {{ formatCoordinates(location.geoLocation) ?? 'Keine Koordinaten hinterlegt' }}
        </p>
        <RouterLink
          to="/spendenvonbaume"
          class="nav-action nav-action-primary mt-auto self-start px-4 py-2 text-sm font-medium"
        >
          Zur Baumspende
        </RouterLink>
      </li>
    </ul>
  </section>
</template>
