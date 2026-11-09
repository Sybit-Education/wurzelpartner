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

<template>
  <main
    class="min-h-[calc(100vh-8rem)] bg-transparent px-5 py-[clamp(2.5rem,7vw,6rem)] text-[#20342a] max-[35rem]:min-h-[calc(100vh-5rem)] max-[35rem]:px-4 max-[35rem]:py-9 dark:text-[#f4f7f4]"
  >
    <div class="mx-auto w-full max-w-2xl">
      <header class="mb-7">
        <p
          class="mb-[0.8rem] mt-0 flex items-center gap-[0.55rem] text-[0.78rem] font-bold uppercase tracking-[0.08em] text-[#326b45] dark:text-[#b5ddb5]"
        >
          Wurzelpartner · Baumpatenschaft
        </p>
        <h1
          class="m-0 text-[clamp(2rem,5vw,2.8rem)] font-bold leading-[1.1] text-[#20342a] dark:text-[#f4f7f4]"
        >
          Ein Baum für morgen.
        </h1>
        <p
          class="mb-0 mt-[0.85rem] max-w-136 text-base leading-[1.6] text-[#637267] dark:text-[#c6d1c7]"
        >
          Wähle eine Baumart und die gewünschte Anzahl. Dein Beitrag wird direkt berechnet.
        </p>
      </header>

      <section
        class="rounded-lg border border-[#dce5d8] bg-[#fffefa] p-[clamp(1.25rem,4vw,2rem)] shadow-[0_18px_44px_rgb(34_58_39/8%)] dark:border-[#303d33] dark:bg-[#141c16]"
        label="Baumspende berechnen"
      >
        <div
          class="grid grid-cols-[minmax(0,1fr)_minmax(8rem,0.65fr)] gap-5 max-[35rem]:grid-cols-1 max-[35rem]:gap-4"
        >
          <label
            class="grid content-start gap-[0.55rem] text-[#20342a] dark:text-[#f4f7f4]"
            for="tree"
          >
            <span class="text-[0.88rem] font-bold">Baumart</span>
            <select
              id="tree"
              v-model.number="selectedTreePrice"
              class="min-h-13 w-full cursor-pointer rounded-[5px] border border-[#dce5d8] bg-[#fffefa] py-0 pr-10 pl-[0.9rem] font-[inherit] text-[#20342a] focus-visible:border-[#326b45] focus-visible:outline-3 focus-visible:outline-[#326b45]/25 focus-visible:outline-offset-2 dark:border-[#303d33] dark:bg-[#141c16] dark:text-[#f4f7f4] dark:focus-visible:border-[#b5ddb5] dark:focus-visible:outline-[#b5ddb5]/25"
            >
              <option v-for="tree in treeTypes" :key="tree.name" :value="tree.price">
                {{ tree.name }} · {{ tree.price }} €
              </option>
            </select>
          </label>

          <label
            class="grid content-start gap-[0.55rem] text-[#20342a] dark:text-[#f4f7f4]"
            for="quantity"
          >
            <span class="text-[0.88rem] font-bold">Anzahl der Bäume</span>
            <div
              class="flex min-h-13 w-full items-center justify-between rounded-[5px] border border-[#dce5d8] bg-[#fffefa] px-[0.85rem] focus-within:border-[#326b45] focus-within:outline-3 focus-within:outline-[#326b45]/25 focus-within:outline-offset-2 dark:border-[#303d33] dark:bg-[#141c16] dark:focus-within:border-[#b5ddb5] dark:focus-within:outline-[#b5ddb5]/25"
            >
              <input
                id="quantity"
                v-model.number="quantity"
                type="number"
                min="1"
                step="1"
                inputmode="numeric"
                class="w-18 min-w-0 border-0 bg-transparent text-[1.1rem] font-bold text-[#20342a] outline-none dark:text-[#f4f7f4]"
              />
              <span class="text-[0.85rem] text-[#637267] dark:text-[#c6d1c7]">Bäume</span>
            </div>
          </label>
        </div>

        <div
          class="mt-7 flex items-center justify-between gap-4 border-l-4 border-[#d49b36] bg-[#f3f7ef] px-[1.2rem] py-[1.1rem] max-[35rem]:items-start max-[35rem]:p-4 dark:bg-[#1c281f]"
          aria-live="polite"
        >
          <div>
            <p class="m-0 text-[0.9rem] font-bold text-[#20342a] dark:text-[#f4f7f4]">
              Dein Beitrag
            </p>
            <p class="mb-0 mt-[0.2rem] text-[0.8rem] text-[#637267] dark:text-[#c6d1c7]">
              {{ selectedTreeName }} · {{ treeCount }} {{ treeCount === 1 ? 'Baum' : 'Bäume' }}
            </p>
          </div>
          <strong
            class="whitespace-nowrap text-[clamp(1.5rem,5vw,2rem)] tabular-nums text-[#326b45] dark:text-[#b5ddb5]"
          >
            {{ formattedTotal }}
          </strong>
        </div>

        <div
          id="purchase-note"
          class="mt-5 flex items-start gap-3 rounded-[5px] border border-[#ead8a8] bg-[#fff9e9] px-4 py-[0.9rem] text-[#59491e] dark:border-[#53451f] dark:bg-[#292313] dark:text-[#fff1c8]"
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
  </main>
</template>
