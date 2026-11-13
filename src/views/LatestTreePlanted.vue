<template>
  <main class="plantings-page">
    <section class="hero" aria-labelledby="page-title">
      <div class="hero-copy">
        <p class="eyebrow">Gemeinsam wächst Zukunft</p>
        <h1 id="page-title">Neueste Pflanzungen</h1>
        <p class="intro">
          Entdecke die zuletzt eingetragenen Baumpflanzungen und ihren Beitrag zu einer grüneren
          Zukunft.
        </p>
      </div>
      <div class="hero-stat" aria-label="Bäume insgesamt">
        <span class="stat-icon" aria-hidden="true">🌱</span>
        <strong>{{ totalTrees.toLocaleString('de-DE') }}</strong>
        <span>Bäume gepflanzt</span>
      </div>
    </section>

    <section class="overview" aria-label="Übersicht der Pflanzungen">
      <article class="overview-card">
        <span class="overview-icon current-icon" aria-hidden="true">↗</span>
        <div>
          <strong>{{ plantings.length }}</strong
          ><span>Pflanzungen erfasst</span>
        </div>
      </article>
      <article class="overview-card">
        <span class="overview-icon completed-icon" aria-hidden="true">✓</span>
        <div>
          <strong>{{ totalTrees.toLocaleString('de-DE') }}</strong
          ><span>Bäume gepflanzt</span>
        </div>
      </article>
      <article class="overview-card">
        <span class="overview-icon tree-icon" aria-hidden="true">♧</span>
        <div>
          <strong>{{ uniqueLocations }}</strong
          ><span>Standorte</span>
        </div>
      </article>
    </section>

    <section class="list-section" aria-labelledby="list-title">
      <div class="list-heading">
        <div>
          <p class="eyebrow">Von neu nach alt</p>
          <h2 id="list-title">Die neuesten Einträge</h2>
        </div>
      </div>

      <p v-if="isLoading" class="empty-state" role="status">Pflanzungen werden geladen ...</p>
      <p v-else-if="error" class="empty-state" role="alert">{{ error }}</p>
      <div v-else-if="plantings.length" class="planting-list">
        <article v-for="planting in plantings" :key="planting.id" class="planting-card">
          <div class="card-main">
            <div class="location-mark" aria-hidden="true">🌱</div>
            <div class="planting-info">
              <div class="title-row">
                <h3>{{ planting.locationName }}</h3>
                <span class="status completed">
                  <span class="status-dot" aria-hidden="true"></span>
                  Gepflanzt
                </span>
              </div>
              <p class="location">{{ planting.username }} · {{ planting.date }}</p>
              <p class="description">{{ planting.message }}</p>
              <div class="meta">
                <span><span aria-hidden="true">▦</span> {{ planting.date }}</span>
                <span><span aria-hidden="true">♧</span> {{ planting.username }}</span>
              </div>
            </div>
          </div>

          <div class="card-result">
            <strong>{{ planting.trees.toLocaleString('de-DE') }}</strong>
            <span>{{ planting.trees === 1 ? 'Baum gepflanzt' : 'Bäume gepflanzt' }}</span>
          </div>
        </article>
      </div>
      <p v-else class="empty-state">Es wurden noch keine Pflanzungen eingetragen.</p>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { PlantedTree } from '@/models/planted_tree'
import { TreePlantingService } from '@/services/treePlantingService'

interface PlantingViewModel {
  id: string | number
  locationName: string
  username: string
  date: string
  message: string
  trees: number
  locationId: string | number | undefined
}

const treePlantingService = new TreePlantingService()
const plantings = ref<PlantingViewModel[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)

const totalTrees = computed(() =>
  plantings.value.reduce((total, planting) => total + planting.trees, 0),
)
const uniqueLocations = computed(
  () => new Set(plantings.value.map((planting) => planting.locationId).filter(Boolean)).size,
)

onMounted(async () => {
  try {
    const response = await treePlantingService.getLatestPlantings(50)
    plantings.value = response.list.map((planting: PlantedTree) => ({
      id: planting.id,
      locationName: planting.location?.name || 'Standort nicht angegeben',
      username: planting.users?.[0]?.username || 'Unbekannt',
      date: formatDate(planting.created_at),
      message: planting.message || 'Eine neue Pflanzung für eine grünere Zukunft.',
      trees: Number(planting.amount) || 0,
      locationId: planting.location?.id,
    }))
  } catch (cause) {
    console.error('Fehler beim Laden der neuesten Pflanzungen:', cause)
    error.value = 'Die Pflanzungen konnten nicht geladen werden. Bitte versuche es später erneut.'
  } finally {
    isLoading.value = false
  }
})

function formatDate(date: Date | string): string {
  const parsedDate = new Date(date)
  if (Number.isNaN(parsedDate.getTime())) return 'Datum nicht angegeben'

  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(parsedDate)
}
</script>

<style scoped>
:global(*) {
  box-sizing: border-box;
}

.plantings-page {
  --forest: #174b35;
  --leaf: #397c55;
  --muted: #64736a;
  --line: #e4ebe5;
  min-height: 100vh;
  padding: clamp(1.5rem, 5vw, 4.5rem) max(1.25rem, calc((100% - 1120px) / 2));
  color: #203229;
  background: #f7faf7;
  font-family: inherit;
}

.hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  padding: clamp(1.75rem, 5vw, 3.5rem);
  border-radius: 24px;
  background: linear-gradient(120deg, #e7f2e8 0%, #f1f7ed 62%, #e1efe4 100%);
}

.hero-copy {
  max-width: 650px;
}
.eyebrow {
  margin: 0 0 0.65rem;
  color: var(--leaf);
  font-size: 0.76rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
h1,
h2,
h3,
p {
  margin-top: 0;
}
h1 {
  margin-bottom: 0.85rem;
  color: var(--forest);
  font-size: clamp(2.2rem, 5vw, 3.5rem);
  line-height: 1.08;
  letter-spacing: -0.04em;
}
.intro {
  max-width: 570px;
  margin-bottom: 0;
  color: #52665a;
  font-size: 1.05rem;
  line-height: 1.7;
}
.hero-stat {
  display: grid;
  min-width: 170px;
  justify-items: center;
  gap: 0.25rem;
  color: var(--forest);
}
.stat-icon {
  font-size: 1.7rem;
}
.hero-stat strong {
  font-size: 2.3rem;
  line-height: 1.1;
}
.hero-stat > span:last-child {
  color: var(--muted);
  font-size: 0.9rem;
}

.overview {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin: 1.5rem 0 4rem;
}
.overview-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  min-height: 108px;
  padding: 1.25rem;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: #fff;
}
.overview-icon {
  display: grid;
  width: 44px;
  height: 44px;
  flex: 0 0 44px;
  place-items: center;
  border-radius: 13px;
  font-size: 1.3rem;
  font-weight: 800;
}
.current-icon {
  color: #34734a;
  background: #e7f4e9;
}
.completed-icon {
  color: #596e8c;
  background: #edf1f8;
}
.tree-icon {
  color: #a26d26;
  background: #fbf2df;
}
.overview-card div {
  display: grid;
  gap: 0.2rem;
}
.overview-card strong {
  color: var(--forest);
  font-size: 1.45rem;
}
.overview-card div span {
  color: var(--muted);
  font-size: 0.88rem;
}

.list-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.25rem;
}
h2 {
  margin-bottom: 0;
  color: var(--forest);
  font-size: clamp(1.65rem, 3vw, 2.15rem);
  letter-spacing: -0.03em;
}
.filter-select {
  min-width: 170px;
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  border: 1px solid #d8e2d9;
  border-radius: 10px;
  color: #30453a;
  background: white;
  font: inherit;
  cursor: pointer;
}
.planting-list {
  display: grid;
  gap: 0.9rem;
}
.planting-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  padding: 1.5rem;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 4px 16px rgb(34 65 43 / 3%);
}
.card-main {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  min-width: 0;
}
.location-mark {
  display: grid;
  width: 48px;
  height: 48px;
  flex: 0 0 48px;
  place-items: center;
  border-radius: 14px;
  background: #f1f6f1;
  font-size: 1.45rem;
}
.planting-info {
  min-width: 0;
}
.title-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.55rem 0.8rem;
}
h3 {
  margin: 0;
  color: #243a2d;
  font-size: 1.1rem;
}
.status {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.3rem 0.6rem;
  border-radius: 99px;
  font-size: 0.72rem;
  font-weight: 700;
}
.status.current {
  color: #27623e;
  background: #e8f4e9;
}
.status.completed {
  color: #526684;
  background: #edf1f7;
}
.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
}
.location {
  margin: 0.35rem 0 0.55rem;
  color: var(--leaf);
  font-size: 0.86rem;
  font-weight: 650;
}
.description {
  max-width: 660px;
  margin-bottom: 0.8rem;
  color: var(--muted);
  font-size: 0.88rem;
  line-height: 1.55;
}
.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.2rem;
  color: #78857c;
  font-size: 0.78rem;
}
.meta span span {
  margin-right: 0.25rem;
  color: var(--leaf);
}
.card-result {
  display: grid;
  min-width: 145px;
  justify-items: end;
  gap: 0.2rem;
  color: var(--muted);
  font-size: 0.8rem;
  text-align: right;
}
.card-result strong {
  color: var(--forest);
  font-size: 1.6rem;
  line-height: 1.1;
}
.progress-wrap {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  width: 145px;
  margin-top: 0.5rem;
  color: #607466;
  font-size: 0.75rem;
}
.progress-track {
  height: 7px;
  flex: 1;
  overflow: hidden;
  border-radius: 99px;
  background: #e8eee8;
}
.progress-track span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: #4a9561;
}
.result-note {
  margin-top: 0.45rem;
  color: #718078;
}
.empty-state {
  padding: 2.5rem;
  border: 1px dashed #cbd9ce;
  border-radius: 14px;
  color: var(--muted);
  background: white;
  text-align: center;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  clip-path: inset(50%);
}

@media (max-width: 700px) {
  .hero {
    align-items: flex-start;
    flex-direction: column;
  }
  .hero-stat {
    grid-template-columns: auto auto;
    justify-items: start;
    column-gap: 0.55rem;
  }
  .hero-stat > span:last-child {
    grid-column: 2;
  }
  .overview {
    grid-template-columns: 1fr;
    gap: 0.65rem;
    margin-bottom: 3rem;
  }
  .overview-card {
    min-height: 82px;
  }
  .planting-card {
    align-items: flex-start;
    flex-direction: column;
    gap: 1.1rem;
  }
  .card-result {
    grid-template-columns: auto 1fr;
    justify-items: start;
    align-items: baseline;
    column-gap: 0.55rem;
    width: 100%;
    padding-left: 64px;
    text-align: left;
  }
  .card-result strong {
    grid-row: span 2;
  }
  .progress-wrap {
    grid-column: 1 / -1;
    width: min(100%, 240px);
  }
  .result-note {
    margin-top: 0;
  }
}

@media (max-width: 430px) {
  .list-heading {
    align-items: flex-start;
    flex-direction: column;
  }
  .filter-select {
    width: 100%;
  }
  .filter-wrap {
    width: 100%;
  }
  .planting-card {
    padding: 1.1rem;
  }
}
</style>
