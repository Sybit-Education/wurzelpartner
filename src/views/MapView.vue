<script setup lang="ts">
import LocationMap from '../components/map/LocationMap.vue'
</script>

<template>
  <div class="map-view page-section">
    <h1>Kartenansicht</h1>
    <LocationMap />
    <div class="mt-section-gap text-center">
      <RouterLink
        to="/AngebotBaupflanzort"
        class="nav-action nav-action-primary inline-block px-5 py-3"
      >
        Pflanzplatz anbieten
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.map-view {
  width: 100%;
}

.map-view :deep(.map) {
  height: min(70vh, 42rem);
}
</style>
