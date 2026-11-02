<template>
  <main class="donation-page">
    <div class="donation-layout">
      <header class="donation-heading">
        <p class="donation-eyebrow"><span aria-hidden="true"></span> Wurzelpartner · Baumpatenschaft</p>
        <h1>Ein Baum für morgen.</h1>
        <p class="donation-intro">
          Wähle eine Baumart und die gewünschte Anzahl. Dein Beitrag wird direkt berechnet.
        </p>
      </header>

      <section class="donation-panel" aria-label="Baumspende berechnen">
        <div class="donation-fields">
          <label class="donation-field" for="tree">
            <span class="field-label">Baumart</span>
            <select id="tree" v-model.number="selectedTreePrice">
              <option v-for="tree in treeTypes" :key="tree.name" :value="tree.price">
                {{ tree.name }} · {{ tree.price }} €
              </option>
            </select>
          </label>

          <label class="donation-field" for="quantity">
            <span class="field-label">Anzahl der Bäume</span>
            <div class="quantity-control">
              <input
                id="quantity"
                v-model.number="quantity"
                type="number"
                min="1"
                step="1"
                inputmode="numeric"
              >
              <span>Bäume</span>
            </div>
          </label>
        </div>

        <div class="donation-total" aria-live="polite">
          <div>
            <p class="total-label">Dein Beitrag</p>
            <p class="total-detail">{{ selectedTreeName }} · {{ treeCount }} {{ treeCount === 1 ? 'Baum' : 'Bäume' }}</p>
          </div>
          <strong>{{ formattedTotal }}</strong>
        </div>

        <div id="purchase-note" class="purchase-notice" role="status">
          <span class="notice-mark" aria-hidden="true">i</span>
          <div>
            <strong>Kaufprozess noch nicht verfügbar</strong>
            <p>Der Kaufprozess muss noch implementiert werden.</p>
          </div>
        </div>

        <button class="purchase-button" type="button" disabled aria-describedby="purchase-note">
          Jetzt kaufen
        </button>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const treeTypes = [
  { name: 'Birke', price: 25 },
  { name: 'Pappel', price: 30 },
  { name: 'Buche', price: 35 },
]

const selectedTreePrice = ref(treeTypes[0].price)
const quantity = ref<number | ''>(1)

const treeCount = computed(() => Math.max(1, Math.floor(Number(quantity.value) || 1)))
const selectedTreeName = computed(
  () => treeTypes.find((tree) => tree.price === selectedTreePrice.value)?.name ?? '',
)
const total = computed(() => selectedTreePrice.value * treeCount.value)

const formattedTotal = computed(() =>
  new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(total.value),
)
</script>

<style scoped>
.donation-page {
  --donation-ink: #20342a;
  --donation-muted: #637267;
  --donation-green: #326b45;
  --donation-border: #dce5d8;
  --donation-paper: #fffefa;
  --donation-surface: #f3f7ef;

  min-height: calc(100vh - 8rem);
  padding: clamp(2.5rem, 7vw, 6rem) 1.25rem;
  color: var(--donation-ink);
  background-color: #f1f5ec;
  background-image:
    linear-gradient(135deg, rgb(255 255 255 / 55%), transparent 58%),
    repeating-linear-gradient(135deg, transparent 0 34px, rgb(50 107 69 / 3%) 34px 35px);
}

.donation-layout {
  width: min(100%, 42rem);
  margin: 0 auto;
}

.donation-heading {
  margin-bottom: 1.75rem;
}

.donation-eyebrow {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  margin: 0 0 0.8rem;
  color: var(--donation-green);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.donation-eyebrow span {
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 2px;
  background: #d49b36;
}

.donation-heading h1 {
  margin: 0;
  color: var(--donation-ink);
  font-size: clamp(2rem, 5vw, 2.8rem);
  font-weight: 700;
  line-height: 1.1;
}

.donation-intro {
  max-width: 34rem;
  margin: 0.85rem 0 0;
  color: var(--donation-muted);
  font-size: 1rem;
  line-height: 1.6;
}

.donation-panel {
  padding: clamp(1.25rem, 4vw, 2rem);
  border: 1px solid var(--donation-border);
  border-radius: 8px;
  background: var(--donation-paper);
  box-shadow: 0 18px 44px rgb(34 58 39 / 8%);
}

.donation-fields {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(8rem, 0.65fr);
  gap: 1.25rem;
}

.donation-field {
  display: grid;
  align-content: start;
  gap: 0.55rem;
  color: var(--donation-ink);
}

.field-label {
  font-size: 0.88rem;
  font-weight: 700;
}

.donation-field select,
.quantity-control {
  width: 100%;
  min-height: 3.25rem;
  border: 1px solid var(--donation-border);
  border-radius: 5px;
  background-color: var(--donation-paper);
  color: var(--donation-ink);
  font: inherit;
}

.donation-field select {
  padding: 0 2.5rem 0 0.9rem;
  cursor: pointer;
}

.quantity-control {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.85rem;
}

.quantity-control input {
  width: 4.5rem;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--donation-ink);
  font: inherit;
  font-size: 1.1rem;
  font-weight: 700;
}

.quantity-control span {
  color: var(--donation-muted);
  font-size: 0.85rem;
}

.donation-field select:focus-visible,
.quantity-control:focus-within {
  outline: 3px solid rgb(50 107 69 / 25%);
  outline-offset: 2px;
  border-color: var(--donation-green);
}

.donation-total {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1.75rem;
  padding: 1.1rem 1.2rem;
  border-left: 4px solid #d49b36;
  background: var(--donation-surface);
}

.total-label,
.total-detail {
  margin: 0;
}

.total-label {
  color: var(--donation-ink);
  font-size: 0.9rem;
  font-weight: 700;
}

.total-detail {
  margin-top: 0.2rem;
  color: var(--donation-muted);
  font-size: 0.8rem;
}

.donation-total strong {
  color: var(--donation-green);
  font-size: clamp(1.5rem, 5vw, 2rem);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.purchase-notice {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-top: 1.25rem;
  padding: 0.9rem 1rem;
  border: 1px solid #ead8a8;
  border-radius: 5px;
  background: #fff9e9;
  color: #59491e;
}

.notice-mark {
  display: grid;
  flex: 0 0 1.35rem;
  width: 1.35rem;
  height: 1.35rem;
  place-items: center;
  border-radius: 50%;
  background: #eed58f;
  color: #59491e;
  font-family: Georgia, serif;
  font-size: 0.85rem;
  font-weight: 700;
}

.purchase-notice strong {
  display: block;
  font-size: 0.87rem;
}

.purchase-notice p {
  margin: 0.18rem 0 0;
  color: #6b5b32;
  font-size: 0.82rem;
  line-height: 1.45;
}

.purchase-button {
  width: 100%;
  min-height: 3rem;
  margin-top: 1rem;
  border: 0;
  border-radius: 5px;
  background: #dce5d8;
  color: #536254;
  font: inherit;
  font-weight: 700;
}

.purchase-button:disabled {
  cursor: not-allowed;
}

:global(.dark) .donation-page {
  --donation-ink: #e8eee8;
  --donation-muted: #b1beb2;
  --donation-green: #9ac99c;
  --donation-border: #3a4b3e;
  --donation-paper: #1c2920;
  --donation-surface: #26372a;

  background-color: #131d17;
  background-image:
    linear-gradient(135deg, rgb(43 67 48 / 25%), transparent 58%),
    repeating-linear-gradient(135deg, transparent 0 34px, rgb(170 206 166 / 3%) 34px 35px);
}

:global(.dark) .purchase-notice {
  border-color: #65552d;
  background: #332d1c;
  color: #f0dfab;
}

:global(.dark) .purchase-notice p {
  color: #ddcca0;
}

:global(.dark) .purchase-button {
  background: #344336;
  color: #aeb9af;
}

@media (max-width: 35rem) {
  .donation-page {
    min-height: calc(100vh - 5rem);
    padding: 2.25rem 1rem;
  }

  .donation-fields {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .donation-total {
    align-items: flex-start;
    padding: 1rem;
  }
}
</style>


