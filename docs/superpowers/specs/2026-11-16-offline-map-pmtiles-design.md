# Design: Self-hosted offline basemap

## Intent

School computers block the public OpenStreetMap tile host, so the location map
needs a street basemap that does not request tiles from a third-party host.
Keep the existing Vue-Leaflet map and serve a small OpenStreetMap-derived
PMTiles archive from the application's own static assets.

## Current state

`LocationMap.vue` displays an external OSM raster layer and an Esri satellite
layer. The map is bounded to Radolfzell and currently permits zoom levels 11
through 18. The city boundary is already bundled as GeoJSON. The map declares
`EPSG:4326`, while the existing satellite tiles and proposed PMTiles basemap
use Web Mercator (`EPSG:3857`).

## Approaches

- **Switch tile provider:** simplest change, but school filters may block that
  provider too.
- **Proxy tile requests:** keeps runtime dependence on a third-party tile
  service and adds proxy operations and caching obligations.
- **Self-host a clipped PMTiles archive (selected):** avoids third-party
  requests for the street basemap and is limited to the application's map
  area. It requires a generated data asset and documented regeneration steps.

## Goals and scope

- Render an OSM-derived street basemap from a PMTiles file served same-origin.
- Cover the current Radolfzell map bounds and zoom range, subject to a practical
  archive size.
- Keep the existing location markers, boundary overlay, zoom/bounds, and layer
  control behavior.
- Keep the Esri satellite layer as an optional external layer; choosing it will
  still contact Esri.
- Include OSM attribution and update the privacy notice to distinguish the
  local basemap from the optional external imagery.
- Use Web Mercator for the Leaflet map so both basemap layers align correctly.

## Non-goals

- This does not make the entire application or its satellite imagery available
  without a network connection.
- No tile proxy, service worker, new map UI, or replacement map framework.
- No broad offline synchronization of location data.

## Implementation calls

- Add a same-origin PMTiles asset under `public/` and render it with a
  Leaflet-compatible PMTiles integration.
- Make the local street map the default base layer; preserve satellite imagery
  as an explicitly selected alternative.
- Include a reproducible script or documented command to regenerate the archive
  from an appropriately clipped OpenStreetMap extract, retaining required
  attribution and source/license information.
- Confirm static hosting can serve the PMTiles range requests needed by the
  renderer. If the generated archive is too large for the repository or the
  host cannot support range requests, stop and present the measured constraint
  rather than silently switching to an external tile service.
- The 2026-11-16 Protomaps source archive yields a 7,919,010-byte clipped file
  with native zooms through 15. The existing map may retain zoom 18 by
  overzooming the vector tiles.

## Validation

- Build and type-check the Vue application.
- Test that the map configures the same-origin PMTiles basemap and keeps the
  expected map controls and overlays.
- Verify the generated archive covers the configured Radolfzell bounds and
  supported zoom range, and measure its size.
- Verify the production build includes the PMTiles asset and that the static
  preview can retrieve byte ranges from it.
