# CSS-Klassen und Theme

Diese Übersicht beschreibt die projektweiten Klassen aus
[`src/assets/main.css`](../src/assets/main.css). Ergänzend können die normalen
Tailwind-CSS-4-Utilities verwendet werden. Für wiederkehrende Farben, Abstände
und Oberflächen sind die hier beschriebenen semantischen Klassen zu bevorzugen.

## Seitenlayout und Abstände

| Klasse                                                | Verwendung                                                                                                                                        |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `page-shell`                                          | Zentriert den Inhalt, begrenzt seine Breite und setzt den responsiven Seitenrand. Wird bereits von Navigation, Hauptbereich und Footer verwendet. |
| `page-section`                                        | Vertikaler Abstand einer Seite innerhalb der Shell.                                                                                               |
| `px-page-gutter`                                      | Horizontaler Seitenrand, wenn eine eigene Shell benötigt wird.                                                                                    |
| `py-page-section`                                     | Vertikaler Seitenabstand; entspricht dem Abstand von `page-section`.                                                                              |
| `gap-section-gap`, `mb-section-gap`, `mt-section-gap` | Responsiver Abstand zwischen größeren Abschnitten.                                                                                                |
| `p-surface`                                           | Responsiver Innenabstand für Karten und andere Oberflächen.                                                                                       |
| `form-stack`                                          | Vertikaler Abstand zwischen direkten Formularelementen: `1rem`, ab `md` `1.5rem`.                                                                 |

Der Hauptbereich in [`App.vue`](../src/App.vue) besitzt bereits `page-shell`.
Eine normale View soll deshalb keinen weiteren `container` oder zusätzlichen
äußeren Seitenrand erhalten:

```vue
<template>
  <div class="page-section">
    <h1>Überschrift</h1>
    <div class="mt-section-gap rounded-lg bg-raised p-surface">Inhalt</div>
  </div>
</template>
```

### Responsive Werte

Die Werte passen sich automatisch an die Fensterbreite an. Bei einer
Standard-Root-Schriftgröße von 16px entsprechen `1rem` und `2rem` 16px und 32px.

| Abstand                                   | Unter `sm` | Ab `sm`  | Ab `md`  | Ab `lg`  |
| ----------------------------------------- | ---------- | -------- | -------- | -------- |
| Seitenrand (`page-gutter`)                | `1rem`     | `1.5rem` | `1.5rem` | `2rem`   |
| Vertikaler Seitenabstand (`page-section`) | `2rem`     | `2rem`   | `3rem`   | `3rem`   |
| Abschnittsabstand (`section-gap`)         | `2rem`     | `2rem`   | `2.5rem` | `2.5rem` |
| Karteninnenabstand (`surface`)            | `1.5rem`   | `2rem`   | `2rem`   | `2rem`   |

Die Tailwind-Breakpoints sind `sm` (40rem), `md` (48rem), `lg` (64rem),
`xl` (80rem) und `2xl` (96rem). Layouts werden mobil zuerst definiert; ein
Präfix wie `md:` gilt ab dem jeweiligen Breakpoint. Die Navigation wechselt
bei `xl` zur Desktop-Ansicht.

## Textseiten

| Klasse             | Verwendung                                                                                                               |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| `reading-page`     | Zentrierte, auf `max-w-4xl` begrenzte Textseite mit automatischem Wortumbruch.                                           |
| `reading-header`   | Kopfbereich einer Textseite mit einheitlichem Abstand zu folgendem Inhalt.                                               |
| `reading-notice`   | Hinweisfläche mit Rahmen und `p-surface`; Farben werden passend zum Inhalt ergänzt.                                      |
| `reading-sections` | Stapelt direkte `section`-Elemente mit `section-gap`; deren direkte Kinder erhalten einen kleineren gemeinsamen Abstand. |

Für direkte Kinder von `reading-header`, `reading-notice` und den Abschnitten
in `reading-sections` werden die vertikalen Standard-Margins zurückgesetzt,
damit der jeweilige `gap` den Abstand bestimmt.

```vue
<template>
  <article class="page-section reading-page">
    <header class="reading-header">
      <h1>Überschrift</h1>
      <p class="text-muted">Zusätzliche Information</p>
    </header>
    <div class="reading-sections">
      <section>
        <h2>Abschnitt</h2>
        <p>Text des Abschnitts.</p>
      </section>
    </div>
  </article>
</template>
```

## Farben für Hell- und Dunkelmodus

Die folgenden Utilities verwenden semantische Theme-Farben und passen sich
automatisch an die `dark`-Klasse auf `<html>` an. Verwende sie vorzugsweise
statt separater heller und dunkler Farbwerte:

| Klassen                                                             | Verwendung                                             |
| ------------------------------------------------------------------- | ------------------------------------------------------ |
| `bg-page-surface`, `text-page-text`                                 | Allgemeiner Seitenhintergrund und Standardtextfarbe.   |
| `text-heading`                                                      | Überschriften und hervorgehobene Texte.                |
| `text-muted`, `text-secondary`                                      | Zurückgenommene beziehungsweise sekundäre Texte.       |
| `text-brand-foreground`, `text-error-foreground`                    | Markenakzent beziehungsweise Fehlermeldungen als Text. |
| `bg-raised`                                                         | Abgesetzte Oberfläche, etwa eine Karte.                |
| `bg-field`, `border-field-border`                                   | Hintergrund und Rahmen eines Eingabefelds.             |
| `hover:bg-hover-surface`                                            | Hintergrund für einen Hover-Zustand.                   |
| `text-donation-text`, `text-donation-muted`, `text-donation-accent` | Text-, Neben- und Akzentfarbe der Spendenansichten.    |
| `bg-donation-surface`, `border-donation-border`                     | Oberfläche und Rahmen der Spendenansichten.            |

Absätze und Überschriften erhalten eigene Standardfarben in der Tailwind-
Basisebene; bei abweichenden Farben die gewünschte `text-*`-Klasse direkt am
Element setzen. Für Links gilt außerdem eine globale Linkfarbe. Wenn diese in
einem Ausnahmefall übersteuert werden muss, verwendet Tailwind 4 das Suffix
`!`, zum Beispiel `text-heading!`. Dieses nur verwenden, wenn es nötig ist.
Kontrast von Text und Hintergrund in beiden Themes prüfen.

Für Absätze und Überschriften setzen globale Regeln außerdem Schriftgrößen;
für Absätze setzen sie einen unteren Außenabstand. Diese Regeln können
Tailwind-Utilities übersteuern. Wenn eine gezielte Ausnahme nötig ist, kann
beispielsweise `mb-0!` den unteren Absatzabstand zurücksetzen.

Die Farbwerte und responsiven Abstandstokens werden zentral in
[`main.css`](../src/assets/main.css) angepasst. Weitere Informationen zum
Theme-Schalter stehen in [THEMING.md](./THEMING.md).

## Formulare und Navigation

| Klasse                                                            | Verwendung                                                                                                 |
| ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `auth-card`                                                       | Zentrierte Oberfläche für Anmeldung und Registrierung; Innenabstand separat mit `p-surface` setzen.        |
| `form-stack`                                                      | Einheitliche Abstände zwischen Formularfeldern.                                                            |
| `form-label`                                                      | Beschriftung eines Eingabefelds.                                                                           |
| `form-input`                                                      | Breites Eingabefeld mit Theme-Farben, Rahmen und Fokus-Styling.                                            |
| `form-error`                                                      | Zentrierte Fehlermeldung in der semantischen Fehlerfarbe.                                                  |
| `auth-submit`                                                     | Primärer, über die verfügbare Breite reichender Formularbutton.                                            |
| `nav-action`                                                      | Gemeinsame Basis für eine Navigationsaktion.                                                               |
| `nav-action-primary`, `nav-action-secondary`, `nav-action-danger` | Farbvarianten für eine Navigationsaktion; zusammen mit `nav-action` verwenden.                             |
| `theme-toggle-button`                                             | Gemeinsames Aussehen des Theme-Schalters; normalerweise die vorhandene `ThemeToggle`-Komponente verwenden. |

```vue
<template>
  <div class="auth-card">
    <div class="p-surface">
      <form class="form-stack">
        <div>
          <label for="email" class="form-label">E-Mail</label>
          <input id="email" type="email" class="form-input" required />
        </div>
        <button type="submit" class="auth-submit">Anmelden</button>
      </form>
    </div>
  </div>
</template>
```

Abstände und Textgrößen einer Navigationsaktion werden nach Bedarf ergänzt:

```vue
<RouterLink to="/login" class="nav-action nav-action-primary px-4 py-2 text-sm">
  Anmelden
</RouterLink>
```
