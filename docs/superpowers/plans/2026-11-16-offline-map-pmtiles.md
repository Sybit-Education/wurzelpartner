# Offline Radolfzell Basemap Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the blocked OSM tile-server dependency with an OSM-derived PMTiles street map served by the application itself.

**Architecture:** Extract a bounded PMTiles archive from a dated Protomaps basemap build and commit it as a static public asset. Add a small Leaflet integration helper that registers the PMTiles layer with the existing layer control and makes it the default; retain Esri imagery as an optional external layer.

**Tech Stack:** Vue 3, TypeScript, Leaflet, `protomaps-leaflet`, PMTiles CLI, Vitest, Vite.

**Spec:** [2026-11-16-offline-map-pmtiles-design.md](../specs/2026-11-16-offline-map-pmtiles-design.md)

## Global Constraints

- Keep Vue 3 Composition API and TypeScript.
- Keep the existing map bounds, zoom limits, markers, boundary overlay, and layer-control UX.
- Do not make runtime tile requests to a third-party host for the street basemap.
- Preserve visible OpenStreetMap attribution; disclose that Esri imagery is still external when selected.
- Use EPSG:3857 for the Leaflet map and both basemap layers.
- Do not commit the generated archive unless it is clipped to the configured Radolfzell map bounds and passes `pmtiles verify`.

---

## File Structure

- `public/maps/radolfzell.pmtiles` — clipped OSM-derived vector tile archive served same-origin.
- `scripts/generate-radolfzell-map.sh` — regenerates the archive from a dated Protomaps basemap build.
- `scripts/__tests__/generate-radolfzell-map.test.sh` — guards invalid source-date handling without network access.
- `docs/MAP-DATA.md` — regeneration requirements, source attribution, and map-network behavior.
- `src/components/map/offlineBasemap.ts` — creates, registers, activates, and removes the PMTiles Leaflet base layer.
- `src/components/map/__tests__/offlineBasemap.spec.ts` — tests layer registration, activation, and cleanup.
- `src/components/map/LocationMap.vue` — installs the offline layer, retains the Esri layer, and uses Web Mercator.
- `src/views/PrivacyPolicyView.vue` — explains same-origin basemap delivery and optional Esri requests.
- `package.json`, `package-lock.json` — add the Protomaps Leaflet runtime dependency, Vitest, and the project test command.

### Task 1: Generate and document the clipped map archive

**Files:**
- Create: `scripts/generate-radolfzell-map.sh`
- Create: `scripts/__tests__/generate-radolfzell-map.test.sh`
- Create: `public/maps/radolfzell.pmtiles`
- Create: `docs/MAP-DATA.md`

**Interfaces:**
- Script input: one required `YYYYMMDD` date argument identifying the source URL `https://build.protomaps.com/YYYYMMDD.pmtiles`.
- Script output: `public/maps/radolfzell.pmtiles`, extracted with the existing map's `8.9,47.71,9.1,47.87` bounding box.
- The script requires the `pmtiles` CLI v1.31.2 to be installed, prints `Usage: <script> YYYYMMDD` and exits non-zero for invalid input, and returns a non-zero status on extraction failure.
- The generated 2026-11-16 archive is 7,919,010 bytes with header bounds `[8.9, 47.71, 9.1, 47.87]` and native maximum zoom 15; the map can continue to zoom to 18 by overzooming vector tiles.

- [x] **Step 1: Write the failing invalid-date test**

Create `scripts/__tests__/generate-radolfzell-map.test.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail

output=$(bash scripts/generate-radolfzell-map.sh invalid 2>&1) && {
  echo "Expected invalid source date to fail" >&2
  exit 1
}
grep -Eq '^Usage: .*YYYYMMDD$' <<<"$output"
```

- [x] **Step 2: Run the test and confirm it fails for the missing feature**

Run `bash scripts/__tests__/generate-radolfzell-map.test.sh`.
Expected: FAIL because the generator does not yet exist, and its error does not match the required usage message.

- [x] **Step 3: Implement the archive-generation script**

Create `scripts/generate-radolfzell-map.sh` with strict shell mode, require exactly one argument, validate it against `^[0-9]{8}$`, create `public/maps/`, and run:

```bash
pmtiles extract \
  "https://build.protomaps.com/${source_date}.pmtiles" \
  public/maps/radolfzell.pmtiles \
  --bbox=8.9,47.71,9.1,47.87
```

Print `Usage: $0 YYYYMMDD` and exit non-zero for invalid input. Do not silently substitute a different source date or map provider.

- [x] **Step 4: Run the test and confirm it passes**

Run `bash scripts/__tests__/generate-radolfzell-map.test.sh`.
Expected: PASS with no network request.

- [x] **Step 5: Generate and verify the archive**

Run `scripts/generate-radolfzell-map.sh YYYYMMDD` with the selected available Protomaps build date, then run:

```bash
pmtiles verify public/maps/radolfzell.pmtiles
pmtiles show public/maps/radolfzell.pmtiles --header-json
stat -c '%s bytes' public/maps/radolfzell.pmtiles
```

Confirm the bounds are clipped around Radolfzell and record the source date, archive size, and source/license attribution in `docs/MAP-DATA.md`. If extraction fails, the bounds are wrong, or the archive is impractically large, stop and report the concrete blocker rather than adding an external runtime fallback.

- [x] **Step 6: Document regeneration and runtime requirements**

Document installing the pinned PMTiles CLI v1.31.2, running the script with a source date, verifying the output, the OpenStreetMap attribution, same-origin range requests, and that selecting Esri imagery still contacts Esri.

- [x] **Step 7: Verify the data task**

Run `pmtiles verify public/maps/radolfzell.pmtiles` again after documentation and confirm `public/maps/radolfzell.pmtiles` exists. This task is complete only if the archive is valid and its measured size is recorded.

### Task 2: Add a testable PMTiles Leaflet layer helper

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `src/components/map/offlineBasemap.ts`
- Create: `src/components/map/__tests__/offlineBasemap.spec.ts`

**Interfaces:**
- `installOfflineBasemap(map: Pick<Map, 'addLayer' | 'removeLayer'>, control: Pick<Control.Layers, 'addBaseLayer' | 'removeLayer'>): () => void`
- The helper creates a `protomaps-leaflet` vector layer from `/maps/radolfzell.pmtiles`, with the German light flavor, `maxDataZoom: 15`, and OSM attribution; registers it as `OpenStreetMap (offline)`, activates it, and returns cleanup that removes it from both map and control.

- [x] **Step 1: Write failing helper tests**

Mock `protomaps-leaflet`'s `leafletLayer` to return a sentinel layer. Use fake map and layer-control objects to test that `installOfflineBasemap` registers and activates that same layer and that its returned cleanup removes the same layer from both objects. Assert that the renderer receives the same-origin PMTiles URL, German language, native maximum zoom 15, and OSM attribution.

- [x] **Step 2: Add the test runner and map renderer dependencies**

Add `"test": "vitest run"` to `package.json`, install Vitest as a dev dependency and `protomaps-leaflet` as a runtime dependency, and update the lockfile. Do not create the production helper yet.

- [x] **Step 3: Run the focused test and confirm it fails**

Run `npm test -- src/components/map/__tests__/offlineBasemap.spec.ts`.
Expected: FAIL because `offlineBasemap.ts` does not yet exist.

- [x] **Step 4: Add the helper**

Implement `installOfflineBasemap` in `src/components/map/offlineBasemap.ts`. Use Leaflet's `Map`, `Control.Layers`, and `Layer` types; do not introduce untyped global layer state.

- [x] **Step 5: Run the focused test and confirm it passes**

Run `npm test -- src/components/map/__tests__/offlineBasemap.spec.ts`.
Expected: PASS for registration, activation, renderer configuration, and cleanup.

### Task 3: Install the offline layer and update map disclosures

**Files:**
- Modify: `src/components/map/LocationMap.vue`
- Modify: `src/views/PrivacyPolicyView.vue`
- Modify: `src/components/map/__tests__/offlineBasemap.spec.ts` only if a lifecycle regression requires a focused test.

**Interfaces:**
- `LocationMap.vue` calls `installOfflineBasemap` after both the map and layer-control Leaflet objects exist, and calls the returned cleanup before unmount.
- The local OSM base layer is active by default. Esri remains selectable and retains its attribution.
- The Esri layer starts hidden, because Vue-Leaflet adds visible base layers to the map before the user chooses one; selecting Esri from the control still activates it.

- [x] **Step 1: Integrate the helper and Web Mercator CRS**

Remove the remote OSM `l-tile-layer`. Set the Esri layer's `:visible="false"` so it is only requested after selection. In `mapLoaded`, install the PMTiles layer using the map and layer-control refs; retain the cleanup function and call it in `onBeforeUnmount`. Change `crs="EPSG:4326"` to `crs="EPSG:3857"`. Keep all location, boundary, bounds, and zoom behavior unchanged.

- [x] **Step 2: Update the privacy notice**

Revise section 7 of `PrivacyPolicyView.vue` to state that the street basemap archive is served by this application and that external requests to Esri occur only when users select the satellite layer. Keep the existing provider privacy links for Esri and OSM attribution.

- [x] **Step 3: Run focused and project validation**

Run:

```bash
npx vitest run src/components/map/__tests__/offlineBasemap.spec.ts
npm run build
```

Expected: the focused helper tests pass, Vue type-check succeeds, and Vite production build includes `maps/radolfzell.pmtiles`.

- [x] **Step 4: Verify the production asset supports range requests**

Run the production preview on a local port, then send a bounded range request to `/maps/radolfzell.pmtiles`. Confirm the response is `206 Partial Content` with a valid `Content-Range`; stop the preview process after verification.

- [x] **Step 5: Review and commit the feature changes**

Review the diff to confirm the unrelated current-checkout edits are absent, then commit the feature changes on `feat/offline-map-pmtiles`. After the final whole-branch review, push the branch and open a PR against `main` describing the local basemap, generated archive size/source date, tests, and the remaining optional Esri network dependency.
