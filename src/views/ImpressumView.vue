
<template>
  <main class="min-h-screen bg-[#f5f7f2] text-gray-800 dark:bg-gray-950 dark:text-gray-100">

    <!-- Hero -->
    <section class="relative overflow-hidden bg-[#173d30] px-6 py-20 text-white">
      <div class="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-green-400/10 blur-3xl"></div>
      <div class="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-lime-300/10 blur-3xl"></div>

      <div class="relative mx-auto max-w-5xl">
        <div class="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-green-100">
          <span>🌱</span>
          Transparenz & Vertrauen
        </div>

        <h1 class="mb-5 text-4xl font-bold tracking-tight md:text-6xl">
          Impressum
        </h1>

        <p class="max-w-2xl text-base leading-8 text-green-100 md:text-lg">
          Hier findest du alle wichtigen Informationen über
          Wurzelpartner und die Verantwortlichen hinter unserem Projekt.
        </p>

        <div class="mt-8 h-1 w-20 rounded-full bg-lime-300"></div>
      </div>
    </section>

    <!-- Content -->
    <section class="px-6 py-16">
      <div class="mx-auto max-w-4xl">

        <div class="mb-8 rounded-2xl border border-green-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 md:p-9">
          <div class="mb-6 flex items-center gap-4">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-2xl dark:bg-green-900/40">
              🏢
            </div>
            <div>
              <h2 class="text-xl font-bold">Angaben zum Betreiber</h2>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Angaben gemäß § 5 DDG
              </p>
            </div>
          </div>

          <div class="space-y-2 leading-7 text-gray-600 dark:text-gray-300">
            <p class="font-semibold text-gray-900 dark:text-white">
              Wurzelpartner
            </p>
            <p>
              [Vollständiger Name des Betreibers]<br />
              [Straße und Hausnummer]<br />
              [PLZ und Ort]<br />
              Deutschland
            </p>
          </div>
        </div>

        <div class="mb-8 rounded-2xl border border-green-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 md:p-9">
          <div class="mb-6 flex items-center gap-4">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-2xl dark:bg-green-900/40">
              ✉️
            </div>
            <div>
              <h2 class="text-xl font-bold">Kontakt</h2>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Wir sind für dich erreichbar
              </p>
            </div>
          </div>

          <div class="space-y-4 text-gray-600 dark:text-gray-300">
            <p>
              <span class="font-semibold text-gray-900 dark:text-white">
                E-Mail:
              </span>
              [Deine E-Mail-Adresse]
            </p>
            <p>
              <span class="font-semibold text-gray-900 dark:text-white">
                Telefon:
              </span>
              [Telefonnummer, falls vorhanden]
            </p>
          </div>
        </div>

        <div class="mb-8 rounded-2xl border border-green-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 md:p-9">
          <div class="mb-6 flex items-center gap-4">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-2xl dark:bg-green-900/40">
              👤
            </div>
            <div>
              <h2 class="text-xl font-bold">
                Inhaltlich verantwortlich
              </h2>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Verantwortlichkeit gemäß § 18 Abs. 2 MStV
              </p>
            </div>
          </div>

          <p class="leading-7 text-gray-600 dark:text-gray-300">
            [Name und vollständige Anschrift der verantwortlichen Person,
            soweit erforderlich]
          </p>
        </div>

        <div class="rounded-2xl border border-green-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 md:p-9">
          <div class="mb-6 flex items-center gap-4">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-2xl dark:bg-green-900/40">
              ⚖️
            </div>
            <div>
              <h2 class="text-xl font-bold">Weitere Angaben</h2>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Rechtliche Informationen
              </p>
            </div>
          </div>

          <p class="leading-7 text-gray-600 dark:text-gray-300">
            Weitere gesetzlich erforderliche Angaben, beispielsweise
            Registereintrag, Umsatzsteuer-Identifikationsnummer oder
            Angaben zur zuständigen Aufsichtsbehörde, werden hier
            ergänzt, sofern sie für den Betreiber zutreffen.
          </p>
        </div>

        <!-- Footer Note -->
        <div class="mt-12 text-center">
          <div class="mb-3 text-3xl">🌱</div>
          <p class="font-semibold text-[#315b40] dark:text-green-300">
            Wurzelpartner – Gemeinsam wachsen.
          </p>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Danke für dein Interesse an unserem Projekt.
          </p>
        </div>

      </div>
    </section>
  </main>
</template>

