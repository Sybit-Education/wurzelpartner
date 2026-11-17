import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { describe, expect, it, vi } from 'vitest'

vi.mock('leaflet', () => ({
  latLngBounds: (bounds: unknown) => bounds,
}))

vi.mock('@/services/locationService', () => ({
  LocationService: class {},
}))

vi.mock('@vue-leaflet/vue-leaflet', async () => {
  const { defineComponent, h } = await import('vue')
  const Container = defineComponent({
    setup(_props, { slots }) {
      return () => h('div', slots.default?.())
    },
  })
  const TileLayer = defineComponent({
    props: {
      name: String,
      url: String,
      attribution: String,
      layerType: String,
      visible: { type: Boolean, default: true },
    },
    setup(props) {
      return () =>
        h('div', {
          'data-layer-name': props.name,
          'data-layer-url': props.url,
          'data-layer-attribution': props.attribution,
          'data-layer-type': props.layerType,
          'data-layer-visible': String(props.visible),
        })
    },
  })

  return {
    LMap: Container,
    LControlLayers: Container,
    LTileLayer: TileLayer,
    LMarker: Container,
    LPopup: Container,
    LIcon: Container,
    LGeoJson: Container,
  }
})

import LocationMap from '../LocationMap.vue'

describe('LocationMap', () => {
  it('offers the online OSM layer without loading it by default', async () => {
    const html = await renderToString(createSSRApp(LocationMap))
    const onlineLayer = html.match(/<div[^>]*data-layer-name="OpenStreetMap \(online\)"[^>]*>/)?.[0]

    expect(onlineLayer).toBeDefined()
    expect(onlineLayer).toContain('data-layer-url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"')
    expect(onlineLayer).toContain('data-layer-type="base"')
    expect(onlineLayer).toContain('data-layer-visible="false"')
    expect(onlineLayer).toContain('openstreetmap.org/copyright')
    expect(onlineLayer).toContain('contributors')
  })
})
