<script setup lang="ts">
import { ref } from 'vue'
import { donationAmounts, formatDonationAmount, type DonationFrequency } from '@/Donations/donation'

const donationAmount = ref<number>(30)
const frequency = ref<DonationFrequency>('once')
const donationMessage = ref('')

function clearDonationMessage() {
  donationMessage.value = ''
}

function submitDonation() {
  if (
    !Number.isFinite(donationAmount.value) ||
    donationAmount.value < 5 ||
    donationAmount.value > 1000
  ) {
    donationMessage.value = 'Bitte wähle einen Betrag zwischen 5 EUR und 1.000 EUR.'
    return
  }

  const interval = frequency.value === 'monthly' ? 'monatlich' : 'einmalig'
  donationMessage.value = `Demo: Deine ${interval}e Spendenabsicht über ${formatDonationAmount(donationAmount.value)} wurde vorgemerkt. Es wurde keine Zahlung ausgelöst.`
}
</script>

<template>
  <div class="donation-page -mx-4">
    <section class="donation-hero px-6 py-16 text-white sm:px-10 sm:py-20">
      <div class="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[1.2fr_0.8fr]">
        <div class="max-w-2xl">
          <p class="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-green-200">
            Gemeinsam Wurzeln schlagen
          </p>
          <h1 class="max-w-xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
            Ein guter Ort wächst mit uns.
          </h1>
          <p class="mt-5 max-w-xl text-lg leading-8 text-green-50">
            Mit deiner Unterstützung pflanzen und pflegen wir Bäume in unserer Region. Jeder Beitrag
            hilft dabei, aus einer guten Idee einen lebendigen Ort zu machen.
          </p>
          <a
            href="#spenden"
            class="bg-black mt-8 inline-flex min-h-12 items-center justify-center rounded-md green-200 px-6 font-semibold text-green-950 transition hover:bg-white focus:outline-none focus:ring-4 focus:ring-green-100/50"
          >
            Jetzt Beitrag wählen
          </a>
        </div>

        <div class="hero-note border-l border-green-200/40 pl-6 sm:pl-8">
          <p class="text-sm font-semibold uppercase tracking-[0.16em] text-green-200">
            Vor Ort verwurzelt
          </p>
          <p class="mt-4 text-2xl font-medium leading-snug text-white">
            Für mehr Grün, das bleibt.
          </p>
          <p class="mt-3 leading-7 text-green-50">
            Deine Spende unterstützt die Arbeit hinter regionalen Pflanzprojekten: von der Planung
            bis zur Pflege junger Bäume.
          </p>
        </div>
      </div>
    </section>

    <section
      id="spenden"
      class="mx-auto grid max-w-6xl gap-12 px-6 py-16 sm:px-10 lg:grid-cols-2 lg:gap-20"
    >
      <div class="self-center">
        <p
          class="text-sm font-semibold uppercase tracking-[0.16em] text-brand-700 dark:text-brand-600"
        >
          Dein Beitrag
        </p>
        <h2 class="mt-3 text-3xl font-semibold text-gray-900 dark:text-white">
          Wachsen lassen, was uns verbindet.
        </h2>
        <p class="mt-4 max-w-xl leading-7 text-gray-600 dark:text-gray-300">
          Wähle einen Betrag, der für dich passt. Ob einmalig oder regelmäßig: Deine Unterstützung
          stärkt unsere gemeinsame Arbeit für mehr Bäume in der Region.
        </p>
        <div class="mt-8 grid gap-5 sm:grid-cols-3">
          <div class="border-t-2 border-brand-600 pt-3">
            <h3 class="text-base font-semibold text-gray-900 dark:text-white">Planen</h3>
            <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-300">
              Geeignete Orte und passende Baumarten finden.
            </p>
          </div>
          <div class="border-t-2 border-brand-600 pt-3">
            <h3 class="text-base font-semibold text-gray-900 dark:text-white">Pflanzen</h3>
            <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-300">
              Neue Pflanzungen gemeinsam möglich machen.
            </p>
          </div>
          <div class="border-t-2 border-brand-600 pt-3">
            <h3 class="text-base font-semibold text-gray-900 dark:text-white">Pflegen</h3>
            <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-300">
              Junge Bäume auf ihrem Weg begleiten.
            </p>
          </div>
        </div>
      </div>

      <form
        class="donation-form rounded-lg border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800 sm:p-8"
        @submit.prevent="submitDonation"
      >
        <fieldset>
          <legend class="text-lg font-semibold text-gray-900 dark:text-white">
            Wie möchtest du helfen?
          </legend>
          <div class="mt-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              class="rounded-md border px-4 py-3 text-sm font-semibold transition focus:outline-none focus:ring-4 focus:ring-brand-100 dark:focus:ring-brand-900"
              :class="
                frequency === 'once'
                  ? 'border-brand-600 bg-brand-50 text-white dark:bg-brand-600'
                  : 'border-gray-300 text-gray-700 hover:border-brand-500 dark:border-gray-600 dark:text-gray-200'
              "
              :aria-pressed="frequency === 'once'"
              @click="
                frequency = 'once'
                clearDonationMessage()
              "
            >
              Einmalig
            </button>
            <button
              type="button"
              class="rounded-md border px-4 py-3 text-sm font-semibold transition focus:outline-none focus:ring-4 focus:ring-brand-100 dark:focus:ring-brand-900"
              :class="
                frequency === 'monthly'
                  ? 'border-brand-600 bg-brand-50 text-white dark:bg-brand-600'
                  : 'border-gray-300 text-gray-700 hover:border-brand-500 dark:border-gray-600 dark:text-gray-200'
              "
              :aria-pressed="frequency === 'monthly'"
              @click="
                frequency = 'monthly'
                clearDonationMessage()
              "
            >
              Monatlich
            </button>
          </div>
        </fieldset>

        <fieldset class="mt-7">
          <legend class="text-sm font-semibold text-gray-900 dark:text-white">
            Betrag auswählen
          </legend>
          <div class="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <button
              v-for="amount in donationAmounts"
              :key="amount"
              type="button"
              class="rounded-md border px-3 py-3 text-sm font-semibold transition focus:outline-none focus:ring-4 focus:ring-brand-100 dark:focus:ring-brand-900"
              :class="
                donationAmount === amount
                  ? 'border-brand-600 bg-brand-50 text-white dark:bg-brand-600'
                  : 'border-gray-300 text-gray-700 hover:border-brand-500 dark:border-gray-600 dark:text-gray-200'
              "
              :aria-pressed="donationAmount === amount"
              @click="
                donationAmount = amount
                clearDonationMessage()
              "
            >
              {{ formatDonationAmount(amount) }}
            </button>
          </div>
        </fieldset>

        <label
          for="donation-amount"
          class="mt-6 block text-sm font-medium text-gray-900 dark:text-white"
        >
          Oder eigenen Betrag eingeben
        </label>
        <div class="relative mt-2">
          <input
            id="donation-amount"
            v-model.number="donationAmount"
            type="number"
            min="5"
            max="1000"
            step="1"
            required
            class="block w-full rounded-md border border-gray-300 bg-white px-4 py-3 pr-14 text-gray-900 focus:border-brand-600 focus:ring-brand-600 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
            aria-describedby="donation-limit"
            @input="clearDonationMessage"
          />
          <span
            class="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm text-gray-500 dark:text-gray-400"
          >
            EUR
          </span>
        </div>
        <p id="donation-limit" class="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Möglich sind Beträge zwischen 5 EUR und 1.000 EUR.
        </p>

        <button
          type="submit"
          class="mt-6 min-h-12 w-full rounded-md bg-brand-600 px-5 py-3 font-semibold text-white transition hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-200 dark:focus:ring-brand-900"
        >
          Spendenabsicht vormerken
        </button>
        <p class="mt-4 text-xs leading-5 text-gray-500 dark:text-gray-400">
          Demo: Die Zahlungsabwicklung ist noch nicht angebunden. Beim Absenden wird keine Zahlung
          ausgelöst.
        </p>
        <p
          v-if="donationMessage"
          class="mt-4 rounded-md border border-brand-200 bg-brand-900 px-4 py-3 text-sm leading-6 text-brand-900 dark:border-brand-700 dark:bg-brand-900/20 dark:text-brand-100"
          role="status"
          aria-live="polite"
        >
          {{ donationMessage }}
        </p>
      </form>
    </section>
  </div>
</template>

<style scoped>
.donation-hero {
  background-color: var(--color-brand-500);
  border-radius: 1rem;
}

.hero-note {
  animation: note-arrive 650ms ease-out both;
}

@keyframes note-arrive {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-note {
    animation: none;
  }
}
</style>
