import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  GeomType,
  LineLabelSymbolizer,
  LineSymbolizer,
  PolygonSymbolizer,
  type Feature,
  type LabelRule,
  type PaintRule,
} from 'protomaps-leaflet'

const { offlineLayer, leafletLayer } = vi.hoisted(() => {
  const paintRules: PaintRule[] = []
  const labelRules: LabelRule[] = []
  const layer = { id: 'offline-basemap', paintRules, labelRules }
  return {
    offlineLayer: layer,
    leafletLayer: vi.fn(() => layer),
  }
})

vi.mock('protomaps-leaflet', async (importOriginal) => ({
  ...(await importOriginal<typeof import('protomaps-leaflet')>()),
  leafletLayer,
}))

import { installOfflineBasemap } from '../offlineBasemap'

describe('installOfflineBasemap', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    offlineLayer.paintRules.splice(
      0,
      offlineLayer.paintRules.length,
      { dataLayer: 'buildings', symbolizer: new PolygonSymbolizer({ fill: '#ccc', opacity: 0.5 }) },
      { dataLayer: 'roads', symbolizer: new LineSymbolizer({ color: '#fff' }) },
    )
    offlineLayer.labelRules.splice(0, offlineLayer.labelRules.length, {
      dataLayer: 'roads',
      minzoom: 16,
      symbolizer: new LineLabelSymbolizer({ labelProps: ['name:de', 'name'] }),
    })
  })

  it('registers and activates the local German OSM basemap', () => {
    const map = {
      addLayer: vi.fn(),
      removeLayer: vi.fn(),
    }
    const control = {
      addBaseLayer: vi.fn(),
      removeLayer: vi.fn(),
    }

    installOfflineBasemap(map, control)

    expect(leafletLayer).toHaveBeenCalledWith({
      url: '/maps/radolfzell.pmtiles',
      flavor: 'light',
      lang: 'de',
      maxDataZoom: 15,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    })
    expect(control.addBaseLayer).toHaveBeenCalledWith(offlineLayer, 'OpenStreetMap (offline)')
    expect(map.addLayer).toHaveBeenCalledWith(offlineLayer)
  })

  it('removes the basemap from both map and layer control on cleanup', () => {
    const map = {
      addLayer: vi.fn(),
      removeLayer: vi.fn(),
    }
    const control = {
      addBaseLayer: vi.fn(),
      removeLayer: vi.fn(),
    }

    const cleanup = installOfflineBasemap(map, control)
    cleanup()

    expect(map.removeLayer).toHaveBeenCalledWith(offlineLayer)
    expect(control.removeLayer).toHaveBeenCalledWith(offlineLayer)
  })

  it('adds street-level building detail without painting over roads', () => {
    const map = { addLayer: vi.fn(), removeLayer: vi.fn() }
    const control = { addBaseLayer: vi.fn(), removeLayer: vi.fn() }

    installOfflineBasemap(map, control)

    const buildingRules = offlineLayer.paintRules.filter((rule) => rule.dataLayer === 'buildings')
    const streetDetail = buildingRules[1]
    const roadRule = offlineLayer.paintRules.find((rule) => rule.dataLayer === 'roads')

    expect(buildingRules).toHaveLength(2)
    expect(streetDetail?.minzoom).toBe(16)
    expect(offlineLayer.paintRules.indexOf(streetDetail!)).toBeLessThan(
      offlineLayer.paintRules.indexOf(roadRule!),
    )
  })

  it('prioritizes readable road names over house numbers at street-level zoom', () => {
    const map = { addLayer: vi.fn(), removeLayer: vi.fn() }
    const control = { addBaseLayer: vi.fn(), removeLayer: vi.fn() }

    installOfflineBasemap(map, control)

    const roadRule = offlineLayer.labelRules.find((rule) => rule.dataLayer === 'roads')
    const houseNumberRule = offlineLayer.labelRules.find((rule) => rule.dataLayer === 'buildings')
    const address: Feature = {
      geomType: GeomType.Point,
      geom: [],
      bbox: { minX: 0, minY: 0, maxX: 0, maxY: 0 },
      numVertices: 0,
      props: { addr_housenumber: '12a' },
    }

    expect(roadRule?.minzoom).toBe(15)
    expect(houseNumberRule?.minzoom).toBe(17)
    expect(offlineLayer.labelRules.indexOf(roadRule!)).toBeLessThan(
      offlineLayer.labelRules.indexOf(houseNumberRule!),
    )
    expect(houseNumberRule?.filter?.(17, address)).toBe(true)
    expect(houseNumberRule?.filter?.(17, { ...address, props: { addr_housenumber: '  ' } })).toBe(
      false,
    )
    expect(houseNumberRule?.filter?.(17, { ...address, props: {} })).toBe(false)
    expect(houseNumberRule?.filter?.(17, { ...address, geomType: GeomType.Polygon })).toBe(false)
  })

  it('reports when the default road label style cannot be enhanced', () => {
    const reportError = vi.spyOn(console, 'error').mockImplementation(() => {})
    offlineLayer.labelRules.length = 0

    try {
      installOfflineBasemap(
        { addLayer: vi.fn(), removeLayer: vi.fn() },
        { addBaseLayer: vi.fn(), removeLayer: vi.fn() },
      )

      expect(reportError).toHaveBeenCalledWith(
        'Die Straßenbeschriftungsregel der Offline-Karte wurde nicht gefunden.',
      )
    } finally {
      reportError.mockRestore()
    }
  })
})
