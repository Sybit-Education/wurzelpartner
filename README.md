# bk2wi-2025

This template should help get you started developing with Vue 3 in Vite.

## Sicherheitsfeatures

### Passwort-Verschlüsselung

Das Projekt verwendet bcrypt für die sichere Verschlüsselung von Passwörtern. Um ein Passwort-Hash für Testzwecke zu generieren, kann folgender Befehl verwendet werden:

```sh
npm run generate-password -- MeinPasswort123
```

Dies erzeugt einen Hash, der mit dem in der Anwendung verwendeten Algorithmus kompatibel ist.

### Passwort-Anforderungen

Passwörter müssen folgende Kriterien erfüllen:
- Mindestens 8 Zeichen lang
- Mindestens ein Großbuchstabe
- Mindestens ein Kleinbuchstabe
- Mindestens eine Zahl
- Mindestens ein Sonderzeichen (@$!%*?&)

### Sicherheitsmaßnahmen

Die Anwendung implementiert folgende Sicherheitsmaßnahmen:
- CSRF-Schutz durch Token-Validierung
- Rate Limiting für Login-Versuche (max. 5 Versuche in 15 Minuten)
- Sichere Speicherung von Benutzerinformationen
- JWT-basierte Authentifizierung

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) 
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup for development

### Theme und wiederverwendbare Styles

Eine Übersicht der Klassen mit Beispielen und Breakpoints steht in
[CSS-Klassen und Theme](docs/CSS-KLASSEN.md).

Das Theme in `src/assets/main.css` definiert semantische Farben für Hell- und
Dunkelmodus. Verwende beispielsweise `bg-page-surface`, `text-heading`,
`text-muted`, `text-brand-foreground`, `text-error-foreground` und
`border-field-border`, statt beide Modi einzeln anzugeben.
Für wiederkehrende Oberflächen stehen `auth-card`, `form-label`, `form-input`,
`form-error`, `auth-submit` sowie `nav-action` mit den Varianten `nav-action-primary`,
`nav-action-secondary` und `nav-action-danger` zur Verfügung. Der Theme-Schalter
verwendet `theme-toggle-button`.
Die Standardfarben für Absätze und Überschriften liegen in der Tailwind-Basisebene,
damit semantische oder spezifische `text-*`-Utilities sie übersteuern können.

Für Seitenlayouts gelten die Abstände aus `src/assets/main.css`:

- `page-shell` richtet Navigation, Seiteninhalt und Footer aus und stellt den
  gemeinsamen horizontalen Seitenrand bereit. Ansichten innerhalb der Shell
  benötigen keinen zusätzlichen `container` oder eigenen Seitenrand.
- `page-section` definiert den vertikalen Seitenabstand; `reading-page`
  begrenzt die Breite von Textseiten. `reading-header`, `reading-notice` und
  `reading-sections` vereinheitlichen deren Abstände.
- `px-page-gutter`, `py-page-section`, `gap-section-gap` und `p-surface`
  sind semantische Tailwind-Utilities für Seitenränder, Seitenabstände,
  Abschnittsabstände und Innenabstände von Karten. `form-stack` sorgt für
  einheitliche Abstände zwischen Formularfeldern.

Es gelten die Tailwind-Breakpoints `sm` (40rem), `md` (48rem), `lg` (64rem),
`xl` (80rem) und `2xl` (96rem). Ab `sm` werden Seitenränder und Karten größer,
ab `md` die Seiten- und Abschnittsabstände, ab `lg` nochmals die Seitenränder.
Die Navigation wechselt bei `xl` zur Desktop-Ansicht.

### Install node dependencies

```sh
npm install
```

### Configure your enviroment

Copy the `.env.local.example` to `.env.local` and fill it with your NocoDB URL and API key

### Compile and Hot-Reload for Development

```sh
npm run dev
```

## For production

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

## Helpful commands

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

### Generate Password Hash for Testing

```sh
npm run generate-password -- YourPassword
```
