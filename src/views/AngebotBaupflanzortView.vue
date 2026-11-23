<script setup lang="ts">
import { ref } from 'vue'
import { LocationService } from '@/services/locationService'
import { useAuthStore } from '@/stores/authStore'

const locationService = new LocationService()
const authStore = useAuthStore()

const address = ref('')
const latitude = ref<number | null>(null)
const longitude = ref<number | null>(null)
const specialRequirements = ref('')
const submitting = ref(false)
const errorMessage = ref<string | null>(null)
const successMessage = ref<string | null>(null)

async function submitLocation() {
  errorMessage.value = null
  successMessage.value = null

  const lat = latitude.value
  const lng = longitude.value

  if (!authStore.isAuthenticated) {
    errorMessage.value = 'Bitte melden Sie sich an, um einen Pflanzplatz anzubieten.'
    return
  }

  if (
    !address.value.trim() ||
    lat === null ||
    lng === null ||
    !Number.isFinite(lat) ||
    !Number.isFinite(lng) ||
    lat < -90 ||
    lat > 90 ||
    lng < -180 ||
    lng > 180
  ) {
    errorMessage.value = 'Bitte geben Sie eine Adresse und gültige Geo-Koordinaten ein.'
    return
  }

  submitting.value = true

  try {
    await locationService.createLocation({
      name: address.value.trim(),
      geoLocation: `${lat};${lng}`,
      ...(specialRequirements.value.trim()
        ? { specialRequirements: specialRequirements.value.trim() }
        : {}),
    })

    successMessage.value = 'Vielen Dank! Ihr Baumpflanz-Platz wurde erfolgreich gespeichert.'
    address.value = ''
    latitude.value = null
    longitude.value = null
    specialRequirements.value = ''
  } catch (error) {
    console.error('Fehler beim Anbieten des Pflanzplatzes:', error)
    errorMessage.value =
      'Ihr Pflanzplatz konnte nicht gespeichert werden. Bitte versuchen Sie es später erneut.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <section class="page-section mx-auto w-full max-w-2xl">
    <header class="mb-section-gap">
      <h1 class="text-heading">Baumpflanz-Platz anbieten</h1>
      <p class="text-muted">
        Teilen Sie uns mit, wo ein Baum gepflanzt werden kann und was dabei zu beachten ist.
      </p>
    </header>

    <p
      class="mb-section-gap rounded-lg border border-field-border bg-field p-4 text-secondary"
      role="note"
    >
      Hinweis: Adresse und genaue Geo-Location werden auf der öffentlichen Karte angezeigt.
    </p>

    <form class="form-stack rounded-lg bg-raised p-surface" @submit.prevent="submitLocation">
      <div>
        <label for="address" class="form-label">Adresse</label>
        <input
          id="address"
          v-model="address"
          class="form-input"
          type="text"
          autocomplete="street-address"
          required
        />
      </div>

      <fieldset class="form-stack">
        <legend class="form-label">Geo-Location</legend>
        <p class="text-secondary text-sm">
          Geben Sie die Koordinaten des Pflanzplatzes in Dezimalgrad an.
        </p>
        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label for="latitude" class="form-label">Breitengrad</label>
            <input
              id="latitude"
              v-model.number="latitude"
              class="form-input"
              type="number"
              min="-90"
              max="90"
              step="any"
              inputmode="decimal"
              required
            />
          </div>
          <div>
            <label for="longitude" class="form-label">Längengrad</label>
            <input
              id="longitude"
              v-model.number="longitude"
              class="form-input"
              type="number"
              min="-180"
              max="180"
              step="any"
              inputmode="decimal"
              required
            />
          </div>
        </div>
      </fieldset>

      <div>
        <label for="special-requirements" class="form-label">
          Besondere Wünsche oder Anforderungen
        </label>
        <textarea
          id="special-requirements"
          v-model="specialRequirements"
          class="form-input min-h-28"
          rows="4"
        />
      </div>

      <p v-if="errorMessage" class="form-error" role="alert">{{ errorMessage }}</p>
      <p v-if="successMessage" class="text-center text-brand-foreground" role="status">
        {{ successMessage }}
      </p>

      <button
        type="submit"
        class="auth-submit disabled:cursor-not-allowed disabled:opacity-60"
        :disabled="submitting"
      >
        {{ submitting ? 'Wird gespeichert…' : 'Pflanzplatz anbieten' }}
      </button>
    </form>
  </section>
</template>
