<script setup lang="ts">
import TreeInfoList from '../components/treeinfo/TreeInfoList.vue'
</script>

<template>
  <div class="page-section">
    <div class="mb-section-gap">
      <h1 class="text-4xl font-bold text-heading">Übersicht der Baumarten</h1>
      <p class="mt-4 max-w-fit text-xl text-secondary">
        Entdecken Sie die Vielfalt unserer regionalen Bäume und erfahren Sie mehr über ihre Arten.
      </p>
    </div>

    <TreeInfoList class="mx-auto" />
  </div>
</template>
