import type { PartnerSponsorType } from '@/models/partnerSponsor'
import type { ListResponse } from './nocodbService'
import { MiddlewareClient } from './middlewareClient'
import { adaptMiddlewareListResponse, type MiddlewarePaginatedResponse } from './middlewareAdapter'

type PublicResource = 'tree-info' | 'locations' | 'partner-sponsors'

export class MiddlewareService {
  constructor(private readonly client: MiddlewareClient = new MiddlewareClient()) {}

  async getList<T>(
    resource: PublicResource,
    limit?: number,
    offset = 0,
    filters: { type?: PartnerSponsorType } = {},
  ): Promise<ListResponse<T>> {
    if (limit !== undefined && (!Number.isSafeInteger(limit) || limit < 1)) {
      throw new RangeError('limit must be a positive integer')
    }
    if (!Number.isSafeInteger(offset) || offset < 0) {
      throw new RangeError('offset must be a non-negative integer')
    }

    const take = Math.min(limit ?? 50, 50)
    let page = Math.floor(offset / take) + 1
    let skip = offset % take
    let total = 0
    const list: T[] = []

    while (true) {
      const response = await this.client.get<MiddlewarePaginatedResponse<T>>(
        `/api/public/${resource}`,
        { params: { ...filters, page, take } },
      )
      total = response.meta.total
      const available = response.data.slice(skip)
      list.push(...(limit === undefined ? available : available.slice(0, limit - list.length)))
      if (
        response.data.length === 0 ||
        page * take >= total ||
        (limit !== undefined && list.length >= limit)
      ) {
        break
      }
      skip = 0
      page += 1
    }

    const pageSize = limit ?? list.length
    const result = adaptMiddlewareListResponse({
      data: list,
      meta: { page: Math.floor(offset / (pageSize || 1)) + 1, take: pageSize, total },
    })
    result.pageInfo.isFirstPage = offset === 0
    result.pageInfo.isLastPage = offset + list.length >= total
    return result
  }

  getRecord<T>(resource: PublicResource, id: string | number): Promise<T> {
    return this.client.get<T>(`/api/public/${resource}/${encodeURIComponent(String(id))}`)
  }
}
