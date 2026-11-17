import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Control, Layer, Map } from 'leaflet'

const { offlineLayer, leafletLayer } = vi.hoisted(() => {
  const layer = { id: 'offline-basemap' }
  return {
    offlineLayer: layer,
    leafletLayer: vi.fn(() => layer),
  }
})

vi.mock('protomaps-leaflet', () => ({ leafletLayer }))

import { installOfflineBasemap } from '../offlineBasemap'

describe('installOfflineBasemap', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('registers and activates the local German OSM basemap', () => {
    const map = {
      addLayer: vi.fn(),
      removeLayer: vi.fn(),
    } as unknown as Pick<Map, 'addLayer' | 'removeLayer'>
    const control = {
      addBaseLayer: vi.fn(),
      removeLayer: vi.fn(),
    } as unknown as Pick<Control.Layers, 'addBaseLayer' | 'removeLayer'>

    installOfflineBasemap(map, control)

    expect(leafletLayer).toHaveBeenCalledWith({
      url: '/maps/radolfzell.pmtiles',
      flavor: 'light',
      lang: 'de',
      maxDataZoom: 15,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    })
    expect(control.addBaseLayer).toHaveBeenCalledWith(
      offlineLayer as Layer,
      'OpenStreetMap (offline)',
    )
    expect(map.addLayer).toHaveBeenCalledWith(offlineLayer as Layer)
  })

  it('removes the basemap from both map and layer control on cleanup', () => {
    const map = {
      addLayer: vi.fn(),
      removeLayer: vi.fn(),
    } as unknown as Pick<Map, 'addLayer' | 'removeLayer'>
    const control = {
      addBaseLayer: vi.fn(),
      removeLayer: vi.fn(),
    } as unknown as Pick<Control.Layers, 'addBaseLayer' | 'removeLayer'>

    const cleanup = installOfflineBasemap(map, control)
    cleanup()

    expect(map.removeLayer).toHaveBeenCalledWith(offlineLayer as Layer)
    expect(control.removeLayer).toHaveBeenCalledWith(offlineLayer as Layer)
  })
})
