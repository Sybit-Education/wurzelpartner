import type { LatLng } from 'leaflet'

export interface Location {
  id?: string | number
  name: string
  geoLocation: string
  specialRequirements?: string
  latLang: LatLng
}

export type NewLocation = Omit<Location, 'id' | 'latLang'>
