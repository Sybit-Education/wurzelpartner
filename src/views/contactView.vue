
<template>
  <article class="mx-auto max-w-4xl py-10 md:py-14">

    <!-- Header -->
    <header class="mb-10">
      <p class="mb-2 text-sm font-semibold uppercase tracking-wide text-brand-700">
        Wurzelpartner · BSZ Radolfzell
      </p>

      <h1 class="mb-4 text-3xl font-bold md:text-4xl">
        Kontakt
      </h1>

      <p class="max-w-3xl text-lg leading-7 text-gray-700 dark:text-gray-300">
        Sie haben Fragen, Anregungen oder möchten mit uns in Kontakt treten?
        Nutzen Sie einfach unser Kontaktformular. Wir freuen uns auf Ihre Nachricht!
      </p>
    </header>

    <!-- Kontaktformular -->
    <section
      aria-labelledby="contact-heading"
      class="mb-10 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900 md:p-8"
    >
      <h2
        id="contact-heading"
        class="mb-6 text-2xl font-semibold"
      >
        Schreiben Sie uns
      </h2>

      <form class="space-y-6">

        <!-- Name -->
        <div>
          <label
            for="name"
            class="mb-2 block text-sm font-medium"
          >
            Vor- und Nachname *
          </label>

          <input
            id="name"
            name="name"
            type="text"
            autocomplete="name"
            placeholder="Ihr Name"
            required
            class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-brand-700 focus:ring-2 focus:ring-brand-700 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
        </div>

        <!-- E-Mail -->
        <div>
          <label
            for="email"
            class="mb-2 block text-sm font-medium"
          >
            E-Mail-Adresse *
          </label>

          <input
            id="email"
            name="email"
            type="email"
            autocomplete="email"
            placeholder="name@beispiel.de"
            required
            class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-brand-700 focus:ring-2 focus:ring-brand-700 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
        </div>

        <!-- Betreff -->
        <div>
          <label
            for="subject"
            class="mb-2 block text-sm font-medium"
          >
            Betreff *
          </label>

          <select
            id="subject"
            name="subject"
            required
            class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-brand-700 focus:ring-2 focus:ring-brand-700 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            <option value="">Bitte auswählen</option>
            <option value="Allgemeine Anfrage">Allgemeine Anfrage</option>
            <option value="Fragen zum Projekt">Fragen zum Projekt</option>
            <option value="Feedback und Anregungen">Feedback und Anregungen</option>
            <option value="Technische Probleme">Technische Probleme</option>
            <option value="Sonstiges">Sonstiges</option>
          </select>
        </div>

        <!-- Nachricht -->
        <div>
          <label
            for="message"
            class="mb-2 block text-sm font-medium"
          >
            Ihre Nachricht *
          </label>

          <textarea
            id="message"
            name="message"
            rows="6"
            placeholder="Schreiben Sie hier Ihre Nachricht ..."
            required
            class="w-full resize-y rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-brand-700 focus:ring-2 focus:ring-brand-700 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          ></textarea>
        </div>

        <!-- Datenschutz -->
        <div class="flex items-start gap-3">
          <input
            id="privacy"
            name="privacy"
            type="checkbox"
            required
            class="mt-1 h-4 w-4 rounded border-gray-300 text-brand-700 focus:ring-brand-700"
          />

          <label
            for="privacy"
            class="text-sm leading-6 text-gray-700 dark:text-gray-300"
          >
            Ich habe die Datenschutzhinweise zur Kenntnis genommen
            und stimme der Verarbeitung meiner Angaben zur Bearbeitung
            meiner Anfrage zu. *
          </label>
        </div>

        <!-- Pflichtfeld Hinweis -->
        <p class="text-sm text-gray-500 dark:text-gray-400">
          * Pflichtfelder
        </p>

        <!-- Absenden -->
        <button
          type="submit"
          class="rounded-lg bg-brand-700 px-7 py-3 font-semibold text-white transition hover:bg-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-700 focus:ring-offset-2"
        >
          Nachricht senden
        </button>

      </form>
    </section>

    <!-- Weitere Kontaktmöglichkeiten -->
    <section aria-labelledby="other-contact-heading" class="mb-10">
      <h2
        id="other-contact-heading"
        class="mb-5 text-2xl font-semibold"
      >
        Weitere Kontaktmöglichkeiten
      </h2>

      <div class="grid gap-5 md:grid-cols-2">

        <!-- E-Mail -->
        <div class="rounded-lg border border-gray-200 p-5 dark:border-gray-700">
          <h3 class="mb-2 text-lg font-semibold">
            E-Mail
          </h3>

          <p class="leading-7 text-gray-700 dark:text-gray-300">
            Sie können uns auch direkt per E-Mail kontaktieren.
          </p>

          <p class="mt-3 font-medium text-brand-700">
            Kontaktadresse wird ergänzt
          </p>
        </div>

        <!-- Standort -->
        <div class="rounded-lg border border-gray-200 p-5 dark:border-gray-700">
          <h3 class="mb-2 text-lg font-semibold">
            Unser Standort
          </h3>

          <p class="leading-7 text-gray-700 dark:text-gray-300">
            Berufsschulzentrum Radolfzell
          </p>

          <p class="mt-3 font-medium text-brand-700">
            Radolfzell am Bodensee
          </p>
        </div>

      </div>
    </section>

    <!-- Hinweis -->
    <section
      class="rounded-lg border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-800"
      role="note"
    >
      <h2 class="mb-2 text-xl font-semibold">
        Hinweis
      </h2>

      <p class="leading-7 text-gray-700 dark:text-gray-300">
        Bitte beachten Sie, dass dieses Kontaktformular erst nach
        Einrichtung einer technischen Versandfunktion Nachrichten
        tatsächlich übermitteln kann. Die Angaben zur Kontaktadresse
        und zum Datenschutz müssen vor der Veröffentlichung ergänzt
        und geprüft werden.
      </p>
    </section>

  </article>
</template>
