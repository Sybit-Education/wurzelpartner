<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { treeDonationOptions } from '@/utils/donation'

const route = useRoute()
const requestedTree = typeof route.query.tree === 'string' ? route.query.tree : ''
const requestedQuantity = Number(route.query.quantity)
const minimumTreeQuantity = 1
const maximumTreeQuantity = 10000

function normalizeTreeQuantity(value: number | '' | undefined): number {
  const numericValue = Number(value)
  if (!Number.isFinite(numericValue)) {
    return minimumTreeQuantity
  }

  return Math.min(
    maximumTreeQuantity,
    Math.max(minimumTreeQuantity, Math.floor(numericValue)),
  )
}

const selectedTreePrice = ref(
  treeDonationOptions.find((tree) => tree.name === requestedTree)?.price ??
    treeDonationOptions[0].price,
)
const quantity = ref<number | ''>(normalizeTreeQuantity(requestedQuantity))

const treeCount = computed(() => normalizeTreeQuantity(quantity.value))
const selectedTreeName = computed(
  () => treeDonationOptions.find((tree) => tree.price === selectedTreePrice.value)?.name ?? '',
)
const total = computed(() => selectedTreePrice.value * treeCount.value)
function normalizeQuantityInput() {
  quantity.value = normalizeTreeQuantity(quantity.value)
}

const formattedTotal = computed(() =>
  new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(total.value),
)
</script>

<template>
  <div class="page-section text-donation-text">
    <div class="mx-auto w-full max-w-2xl">
      <header class="mb-section-gap">
        <p
          class="mb-3 mt-0 flex items-center gap-2 text-[0.78rem] font-bold uppercase tracking-[0.08em] text-donation-accent"
        >
          Wurzelpartner · Baumpatenschaft
        </p>
        <h1 class="m-0 text-[clamp(2rem,5vw,2.8rem)] font-bold leading-[1.1] text-donation-text">
          Ein Baum für morgen.
        </h1>
        <p class="mb-0 mt-4 max-w-136 text-base leading-[1.6] text-donation-muted">
          Wähle eine Baumart und die gewünschte Anzahl. Dein Beitrag wird direkt berechnet.
        </p>
      </header>

      <section
        class="rounded-lg border border-donation-border bg-donation-surface p-surface shadow-[0_18px_44px_rgb(34_58_39/8%)]"
        label="Baumspende berechnen"
      >
        <div class="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(8rem,0.65fr)] sm:gap-6">
          <label class="grid content-start gap-2 text-donation-text" for="tree">
            <span class="text-[0.88rem] font-bold">Baumart</span>
            <select
              id="tree"
              v-model.number="selectedTreePrice"
              class="min-h-13 w-full cursor-pointer rounded-[5px] border border-donation-border bg-donation-surface py-0 pr-10 pl-4 font-[inherit] text-donation-text focus-visible:border-donation-accent focus-visible:outline-3 focus-visible:outline-donation-accent/25 focus-visible:outline-offset-2"
            >
              <option v-for="tree in treeDonationOptions" :key="tree.name" :value="tree.price">
                {{ tree.name }} · {{ tree.price }} €
              </option>
            </select>
          </label>

          <label class="grid content-start gap-2 text-donation-text" for="quantity">
            <span class="text-[0.88rem] font-bold">Anzahl der Bäume</span>
            <div
              class="flex min-h-13 w-full items-center justify-between rounded-[5px] border border-donation-border bg-donation-surface px-4 focus-within:border-donation-accent focus-within:outline-3 focus-within:outline-donation-accent/25 focus-within:outline-offset-2"
            >
              <input
                id="quantity"
                v-model.number="quantity"
                type="number"
                min="1"
                max="10000"
                step="1"
                inputmode="numeric"
                required
                aria-describedby="quantity-limit"
                class="w-18 min-w-0 border-0 bg-transparent text-[1.1rem] font-bold text-donation-text outline-none"
                @change="normalizeQuantityInput"
                @blur="normalizeQuantityInput"
              />
              <span class="text-[0.85rem] text-donation-muted">Bäume</span>
            </div>
            <span id="quantity-limit" class="text-[0.78rem] text-donation-muted">
              Möglich sind 1 bis 10.000 Bäume.
            </span>
          </label>
        </div>

        <div
          class="mt-8 flex flex-wrap items-start justify-between gap-4 border-l-4 border-[#d49b36] bg-[#f3f7ef] p-4 dark:bg-[#1c281f] sm:items-center sm:px-5"
          aria-live="polite"
        >
          <div>
            <p class="m-0 text-[0.9rem] font-bold text-donation-text">Dein Beitrag</p>
            <p class="mb-0 mt-[0.2rem] text-[0.8rem] text-donation-muted">
              {{ selectedTreeName }} · {{ treeCount }} {{ treeCount === 1 ? 'Baum' : 'Bäume' }}
            </p>
          </div>
          <strong
            class="min-w-0 wrap-break-word text-[clamp(1.5rem,5vw,2rem)] tabular-nums text-donation-accent"
          >
            {{ formattedTotal }}
          </strong>
        </div>

        <div
          id="purchase-note"
          class="mt-6 flex items-start gap-3 rounded-[5px] border border-[#ead8a8] bg-[#fff9e9] p-4 text-[#59491e] dark:border-[#53451f] dark:bg-[#292313] dark:text-[#fff1c8]"
          role="status"
        >
          <span
            class="grid h-[1.35rem] w-[1.35rem] flex-[0_0_1.35rem] place-items-center rounded-full bg-[#eed58f] font-[Georgia,serif] text-[0.85rem] font-bold text-[#59491e]"
            aria-hidden="true"
          >
            i
          </span>
          <div>
            <strong class="block text-[0.87rem]">Kaufprozess noch nicht verfügbar</strong>
            <p
              class="mb-0 mt-[0.18rem] text-[0.82rem] leading-[1.45] text-[#6b5b32] dark:text-[#efdfb2]"
            >
              Der Kaufprozess muss noch implementiert werden.
            </p>
          </div>
        </div>

        <button
          class="mt-4 min-h-12 w-full cursor-not-allowed rounded-[5px] border-0 bg-[#dce5d8] font-[inherit] font-bold text-[#536254] dark:bg-[#253228] dark:text-[#e0e9df]"
          type="button"
          disabled
          aria-describedby="purchase-note"
        >
          Jetzt kaufen
        </button>
      </section>
    </div>
  </div>
</template>
