import {
  CenteredTextSymbolizer,
  GeomType,
  LineLabelSymbolizer,
  PolygonSymbolizer,
  type LabelRule,
  type PaintRule,
} from 'protomaps-leaflet'

export function addStreetLevelDetails(paintRules: PaintRule[], labelRules: LabelRule[]): void {
  const buildingIndex = paintRules.findIndex((rule) => rule.dataLayer === 'buildings')
  if (buildingIndex === -1) {
    console.error('Die Gebäuderegel der Offline-Karte wurde nicht gefunden.')
  } else {
    paintRules.splice(buildingIndex + 1, 0, {
      dataLayer: 'buildings',
      minzoom: 16,
      symbolizer: new PolygonSymbolizer({
        fill: '#c8c3bd',
        stroke: '#a29b94',
        width: 0.7,
      }),
      filter: (_zoom, feature) => feature.geomType === GeomType.Polygon,
    })
  }

  let roadLabelsUpdated = false
  for (const rule of labelRules) {
    if (
      rule.dataLayer === 'roads' &&
      rule.minzoom === 16 &&
      rule.symbolizer instanceof LineLabelSymbolizer
    ) {
      rule.minzoom = 15
      rule.symbolizer = new LineLabelSymbolizer({
        labelProps: ['name:de', 'name'],
        fill: '#514a45',
        font: '500 12px sans-serif',
        stroke: '#ffffff',
        width: 2,
      })
      roadLabelsUpdated = true
    }
  }
  if (!roadLabelsUpdated) {
    console.error('Die Straßenbeschriftungsregel der Offline-Karte wurde nicht gefunden.')
  }

  labelRules.push({
    dataLayer: 'buildings',
    minzoom: 17,
    symbolizer: new CenteredTextSymbolizer({
      labelProps: ['addr_housenumber'],
      fill: '#49433e',
      font: '500 11px sans-serif',
      stroke: '#ffffff',
      width: 2,
    }),
    filter: (_zoom, feature) =>
      feature.geomType === GeomType.Point &&
      typeof feature.props.addr_housenumber === 'string' &&
      feature.props.addr_housenumber.trim().length > 0,
  })
}
