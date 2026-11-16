# Theming & Dark Mode Dokumentation

Diese Dokumentation beschreibt, wie das Theme-System in diesem Projekt funktioniert und wie Sie es anpassen können.
Eine Übersicht der empfohlenen Klassen und Abstände finden Sie unter
[CSS-Klassen und Theme](./CSS-KLASSEN.md).

## Übersicht

Das Projekt verwendet **Tailwind CSS 4** mit **Flowbite** für ein flexibles Theme-System, das folgende Features bietet:

- **Light Mode**
- **Dark Mode** (manuell oder automatisch basierend auf System-Einstellung)
- **Anpassbare Farbpaletten** über CSS-Variablen
- **Persistente Benutzer-Präferenzen** via localStorage

Ohne gespeicherte Präferenz folgt die Darstellung der System-Einstellung.

## Dark Mode verwenden

### In Komponenten

Der Dark Mode wird durch die CSS-Klasse `dark` auf dem `<html>`-Element gesteuert.
Semantische Theme-Klassen passen sich automatisch an:

```html
<div class="bg-raised">
  <h1 class="text-heading">Überschrift</h1>
  <p class="text-secondary">Text</p>
</div>
```

Für spezielle Styles kann weiterhin das Tailwind-Präfix `dark:` verwendet werden.

### Theme Toggle verwenden

Die `ThemeToggle`-Komponente kann überall eingebunden werden:

```vue
<script setup>
import ThemeToggle from '@/components/common/ThemeToggle.vue'
</script>

<template>
  <!-- Einfacher Toggle-Button -->
  <ThemeToggle />

  <!-- Mit Dropdown für alle Modi (Light, Dark, System) -->
  <ThemeToggle show-dropdown />
</template>
```

### useTheme Composable

Für programmatische Kontrolle über das Theme:

```vue
<script setup>
import { useTheme } from '@/composables/useTheme'

const { isDark, mode, toggle, setMode } = useTheme()

// Theme wechseln
toggle()

// Spezifisches Theme setzen
setMode('dark') // Immer dunkel
setMode('light') // Immer hell
setMode('system') // System-Präferenz folgen
</script>
```

## Farben anpassen

Die Farbpaletten sind in `src/assets/main.css` als CSS-Variablen definiert:

```css
@theme {
  /* Auszug aus der Markenpalette */
  --color-brand-50: rgb(15, 41, 30);
  --color-brand-500: rgb(35, 110, 74);
  --color-brand-600: rgb(48, 164, 108);
  /* ... weitere Abstufungen ... */
}
```

### Eigene Markenfarben verwenden

Für eigene Markenfarben passen Sie die `--color-brand-*`-Werte und bei Bedarf
die Zuordnung von `--theme-brand-foreground` in `:root` und `.dark` an.

### Farbpalette generieren

Verwenden Sie Tools wie:

- [Tailwind CSS Color Generator](https://uicolors.app/create)
- [Flowbite Color Generator](https://flowbite.com/tools/tailwind-color-generator/)

## Schriftarten anpassen

Die Schriftarten sind ebenfalls als Variablen definiert:

```css
@theme {
  --font-body: Assistant;
  --font-monospace-body: 'Source Sans 3';
}
```

## Flowbite-Vue Komponenten mit Theme

Flowbite-Vue Komponenten unterstützen Dark Mode automatisch. Sie können auch explizite Themes setzen:

```vue
<template>
  <fwb-tooltip theme="light">...</fwb-tooltip>
  <fwb-tooltip theme="dark">...</fwb-tooltip>
</template>
```

Für ein konsistentes Theming mehrerer Komponenten:

```vue
<template>
  <flowbite-themable :theme="'blue'">
    <fwb-button>Blauer Button</fwb-button>
    <fwb-dropdown>...</fwb-dropdown>
  </flowbite-themable>
</template>

<script setup>
import { FlowbiteThemable, FwbButton, FwbDropdown } from 'flowbite-vue'
</script>
```

## Dateistruktur

```
src/
├── assets/
│   └── main.css           # Theme-Variablen & CSS
├── components/
│   └── common/
│       └── ThemeToggle.vue # Toggle-Komponente
├── composables/
│   └── useTheme.ts        # Theme Composable
└── stores/
    └── themeStore.ts      # Pinia Store für Theme
```

## Theme Modi

| Mode     | Beschreibung                               |
| -------- | ------------------------------------------ |
| `light`  | Immer heller Modus                         |
| `dark`   | Immer dunkler Modus                        |
| `system` | Folgt der System-Einstellung des Benutzers |

## Best Practices

1. **Konsistenz**: Verwenden Sie semantische Theme-Klassen; ergänzen Sie `dark:` für spezielle Styles
2. **Kontrast**: Stellen Sie sicher, dass Text im Dark Mode gut lesbar ist (WCAG 2.1 AA)
3. **Bilder**: Verwenden Sie `dark:invert` für Icons oder bieten Sie alternative Bilder an
4. **Formulare**: Flowbite-Komponenten sind bereits für Dark Mode optimiert
5. **Testing**: Testen Sie beide Modi während der Entwicklung

## Troubleshooting

### Styles werden nicht aktualisiert

- Stellen Sie sicher, dass die `dark`-Klasse auf `<html>` ist (nicht auf `<body>`)
- Leeren Sie den Browser-Cache

### Flash of Unstyled Content (FOUC)

Der Theme-Store wird in `src/main.ts` initialisiert. `index.html` enthält
derzeit kein vorgeschaltetes Inline-Skript für das Theme; beim Laden kann daher
kurzzeitig die Standarddarstellung sichtbar sein.

### VSCode zeigt CSS-Fehler

Die `@plugin`, `@source`, `@theme`, und `@custom-variant` Direktiven sind Tailwind CSS 4-spezifisch. Der Vite-Build verarbeitet diese korrekt, auch wenn der Editor sie als Fehler markiert.
