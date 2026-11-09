import { NocoDBService, type ListResponse } from './nocodbService'
import type { PartnerSponsor, PartnerSponsorType } from '@/models/partnerSponsor'
import { MiddlewareClient } from './middlewareClient'
import { MiddlewareService } from './middlewareService'

/**
 * Service für den Zugriff auf die PARTNER_SPONSOR Tabelle
 */
export class PartnerSponsorService {
  readonly nocoDBService: NocoDBService
  readonly middlewareClient: MiddlewareClient
  readonly middlewareService: MiddlewareService
  private readonly tableName = 'PARTNER_SPONSOR'

  private extractFirstLogo(value: unknown): string | undefined {
    if (!value) return undefined
    if (Array.isArray(value)) return this.extractFirstLogo(value[0])
    if (typeof value === 'string') return value

    if (typeof value === 'object') {
      const obj = value as Record<string, unknown>

      const thumbnails = obj.thumbnails as Record<string, unknown> | undefined
      const cardCoverThumb = thumbnails?.card_cover as Record<string, unknown> | undefined
      if (cardCoverThumb) {
        if (typeof cardCoverThumb.signedUrl === 'string') return cardCoverThumb.signedUrl
        if (typeof cardCoverThumb.url === 'string') return cardCoverThumb.url
      }

      const cardCover = obj.card_cover as Record<string, unknown> | string | undefined
      if (typeof cardCover === 'string') return cardCover
      if (cardCover && typeof cardCover === 'object') {
        if (typeof cardCover.signedUrl === 'string') return cardCover.signedUrl
        if (typeof cardCover.url === 'string') return cardCover.url
      }

      if (typeof obj.signedUrl === 'string') return obj.signedUrl
      if (typeof obj.url === 'string') return obj.url
      if (typeof obj.path === 'string') return obj.path
    }

    return undefined
  }

  constructor(nocoDBService?: NocoDBService, middlewareClient?: MiddlewareClient) {
    this.nocoDBService = nocoDBService || new NocoDBService()
    this.middlewareClient = middlewareClient || new MiddlewareClient()
    this.middlewareService = new MiddlewareService(this.middlewareClient)
    this.nocoDBService.registerTable(this.tableName, 'm0syxl6tq6ufvgi')
  }

  /**
   * Liefert alle Einträge eines Typs (Partner oder Sponsor)
   * @param type Tabellenwert des Feldes Typ
   * @param limit Maximale Anzahl der Datensätze
   * @param offset Offset für Paging
   */
  async getByType(
    type: PartnerSponsorType,
    limit?: number,
    offset?: number,
  ): Promise<ListResponse<PartnerSponsor>> {
    const adaptedResponse = await this.middlewareService.getList<PartnerSponsor>(
      'partner-sponsors',
      limit,
      offset,
      { type },
    )

    adaptedResponse.list = (adaptedResponse.list ?? []).map((item) => ({
      ...item,
      displayUrl: this.extractFirstLogo(item.logo) ?? null,
    }))

    return adaptedResponse
  }

  /**
   * Liefert alle Partner
   */
  async getPartners(limit?: number, offset?: number): Promise<ListResponse<PartnerSponsor>> {
    return this.getByType('Partner', limit, offset)
  }

  /**
   * Liefert einen Partner anhand seiner ID
   */
  async getPartnerById(id: string | number): Promise<PartnerSponsor | null> {
    try {
      const record = await this.middlewareService.getRecord<PartnerSponsor>('partner-sponsors', id)
      if (!record) return null

      return {
        ...record,
        displayUrl: this.extractFirstLogo(record.logo) ?? null,
      }
    } catch (error) {
      console.error(`Fehler beim Abrufen des Partners ${id}:`, error)
      return null
    }
  }

  /**
   * Liefert alle Sponsoren
   */
  async getSponsors(limit?: number, offset?: number): Promise<ListResponse<PartnerSponsor>> {
    return this.getByType('Sponsor', limit, offset)
  }

  /**
   * Hilfsmethode, die aus einem Datensatz (oder via ID) das erste Logo extrahiert.
   * Bevorzugt die card_cover-Thumbnail-Variante.
   */
  async getLogo(recordOrId: PartnerSponsor | string | number): Promise<string | undefined> {
    try {
      if (typeof recordOrId === 'object') {
        return this.extractFirstLogo((recordOrId as PartnerSponsor).logo)
      }

      const record = await this.middlewareService.getRecord<PartnerSponsor>(
        'partner-sponsors',
        recordOrId,
      )
      return this.extractFirstLogo((record as PartnerSponsor | undefined)?.logo)
    } catch (error) {
      console.error(`Fehler beim Abrufen der Logos für Sponsor/Partner ${recordOrId}:`, error)
      return undefined
    }
  }
}
