import { readFile } from 'node:fs/promises'
import { describe, expect, it, vi } from 'vitest'
import {
  GeomType,
  Index,
  LineLabelSymbolizer,
  PmtilesSource,
  PolygonSymbolizer,
  type LabelRule,
} from 'protomaps-leaflet'
import { addStreetLevelDetails } from '../offlineBasemapStyle'

describe('offline map archive', () => {
  it('places and draws a house number from a real address point', async () => {
    const archive = await readFile(
      new URL('../../../../public/maps/radolfzell.pmtiles', import.meta.url),
    )
    const fetchArchive = vi
      .spyOn(globalThis, 'fetch')
      .mockImplementation(async (_input, options) => {
        const range = new Headers(options?.headers).get('range')
        const match = range?.match(/^bytes=(\d+)-(\d+)$/)
        if (!match) throw new Error('Expected a byte range for the local map archive')

        const start = Number(match[1])
        const end = Math.min(Number(match[2]), archive.length - 1)
        return new Response(new Uint8Array(archive.subarray(start, end + 1)), {
          status: 206,
          headers: { 'Content-Range': `bytes ${start}-${end}/${archive.length}` },
        })
      })

    try {
      const source = new PmtilesSource('http://local.invalid/radolfzell.pmtiles', false)
      const tile = await source.get({ z: 15, x: 17200, y: 11426 }, 256)
      const address = tile
        .get('buildings')
        ?.find(
          (feature) =>
            feature.geomType === GeomType.Point &&
            typeof feature.props.addr_housenumber === 'string',
        )
      if (!address) throw new Error('The city-center tile contains no address point')

      const labels: LabelRule[] = [
        {
          dataLayer: 'roads',
          minzoom: 16,
          symbolizer: new LineLabelSymbolizer({ labelProps: ['name:de', 'name'] }),
        },
      ]
      addStreetLevelDetails(
        [{ dataLayer: 'buildings', symbolizer: new PolygonSymbolizer({}) }],
        labels,
      )
      const houseNumberRule = labels.find((rule) => rule.dataLayer === 'buildings')
      if (!houseNumberRule) throw new Error('The house-number label rule was not installed')
      expect(houseNumberRule.filter?.(17, address)).toBe(true)

      const fillText = vi.fn()
      const scratch: Pick<
        CanvasRenderingContext2D,
        'font' | 'measureText' | 'translate' | 'fillText' | 'strokeText'
      > = {
        font: '',
        measureText: vi.fn(() => ({
          width: 12,
          actualBoundingBoxAscent: 8,
          actualBoundingBoxDescent: 2,
          actualBoundingBoxLeft: 0,
          actualBoundingBoxRight: 12,
          alphabeticBaseline: 0,
          emHeightAscent: 8,
          emHeightDescent: 2,
          fontBoundingBoxAscent: 8,
          fontBoundingBoxDescent: 2,
          hangingBaseline: 0,
          ideographicBaseline: 0,
        })),
        translate: vi.fn(),
        fillText,
        strokeText: vi.fn(),
      }
      const context = scratch as CanvasRenderingContext2D
      const placed = houseNumberRule.symbolizer.place(
        { index: new Index(1, 1), order: 0, scratch: context, zoom: 17, overzoom: 2 },
        address.geom,
        address,
      )

      expect(placed).toHaveLength(1)
      expect(placed?.[0]?.anchor.x).toBe(address.geom[0]?.[0]?.x)
      expect(placed?.[0]?.anchor.y).toBe(address.geom[0]?.[0]?.y)
      placed?.[0]?.draw(context)
      expect(fillText).toHaveBeenCalledWith(
        address.props.addr_housenumber,
        expect.any(Number),
        expect.any(Number),
      )
    } finally {
      fetchArchive.mockRestore()
    }
  })
})
