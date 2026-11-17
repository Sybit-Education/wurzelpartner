import type { Control, Layer, Map } from 'leaflet'
import { leafletLayer } from 'protomaps-leaflet'
import { addStreetLevelDetails } from './offlineBasemapStyle'

export function installOfflineBasemap(
  map: Pick<Map, 'addLayer' | 'removeLayer'>,
  control: Pick<Control.Layers, 'addBaseLayer' | 'removeLayer'>,
): () => void {
  const offlineLayer = leafletLayer({
    url: '/maps/radolfzell.pmtiles',
    flavor: 'light',
    lang: 'de',
    maxDataZoom: 15,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  })
  addStreetLevelDetails(offlineLayer.paintRules, offlineLayer.labelRules)

  // The package declaration omits its runtime Leaflet GridLayer base class.
  const layer = offlineLayer as unknown as Layer

  control.addBaseLayer(layer, 'OpenStreetMap (offline)')
  map.addLayer(layer)

  return () => {
    map.removeLayer(layer)
    control.removeLayer(layer)
  }
}
