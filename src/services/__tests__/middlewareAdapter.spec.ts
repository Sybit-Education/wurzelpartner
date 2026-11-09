import { describe, expect, it } from 'vitest'
import { adaptMiddlewareListResponse } from '../middlewareAdapter'

describe('adaptMiddlewareListResponse', () => {
  it('maps middleware pagination to the frontend contract', () => {
    expect(
      adaptMiddlewareListResponse({
        data: [{ id: 26 }],
        meta: { page: 2, take: 25, total: 26 },
      }),
    ).toEqual({
      list: [{ id: 26 }],
      pageInfo: {
        totalRows: 26,
        page: 2,
        pageSize: 25,
        isFirstPage: false,
        isLastPage: true,
      },
    })
  })

  it('marks an empty response as the last page even when take is zero', () => {
    const response = adaptMiddlewareListResponse({
      data: [],
      meta: { page: 1, take: 0, total: 0 },
    })

    expect(response.pageInfo.isFirstPage).toBe(true)
    expect(response.pageInfo.isLastPage).toBe(true)
  })
})
