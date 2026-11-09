/**
 * Adapterfunktion(en) zur Übersetzung von Middleware-Responses
 * in das Frontend-interne `ListResponse<T>`-Format.
 */

export interface MiddlewarePaginatedResponse<T> {
  data: T[]
  meta: {
    page: number
    take: number
    total: number
    pageCount?: number
    [key: string]: unknown
  }
}

/**
 * Wandelt das Middleware-Pagination-Format in das Frontend-Format um.
 */
export function adaptMiddlewareListResponse<T>(response: MiddlewarePaginatedResponse<T>): {
  list: T[]
  pageInfo: {
    totalRows: number
    page: number
    pageSize: number
    isFirstPage: boolean
    isLastPage: boolean
  }
} {
  const { data, meta } = response
  const page = meta?.page ?? 1
  const pageSize = meta?.take ?? data.length
  const total = meta?.total ?? data.length
  const pageCount = meta?.pageCount ?? (pageSize > 0 ? Math.ceil(total / pageSize) : 0)

  return {
    list: data,
    pageInfo: {
      totalRows: total,
      page,
      pageSize,
      isFirstPage: page === 1,
      isLastPage: total === 0 || page >= pageCount,
    },
  }
}
