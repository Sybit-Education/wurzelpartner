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
      '<a href="https://protomaps.com">Protomaps</a> © <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
  })
  addStreetLevelDetails(offlineLayer.paintRules, offlineLayer.labelRules)

  // The package declaration omits its runtime Leaflet GridLayer base class.
  const layer = offlineLayer as unknown as Layer

  control.addBaseLayer(layer, 'Protomaps')
  map.addLayer(layer)

  return () => {
    map.removeLayer(layer)
    control.removeLayer(layer)
  }
}
