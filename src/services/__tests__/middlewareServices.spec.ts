import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MiddlewareClient } from '../middlewareClient'
import { TreeInfoService } from '../treeInfoService'
import { LocationService } from '../locationService'
import { PartnerSponsorService } from '../partnerSponsorService'

const originalAdapter = axios.defaults.adapter
const requests: InternalAxiosRequestConfig[] = []
const trees = Array.from({ length: 60 }, (_, index) => ({
  id: index + 1,
  name: `Tree ${index + 1}`,
  picture: [{ signedUrl: `https://images.example/${index + 1}.jpg` }],
}))
const locations = Array.from({ length: 125 }, (_, index) => ({
  id: index + 1,
  name: `Location ${index + 1}`,
  geoLocation: '47.74;8.97',
}))
const partners = Array.from({ length: 55 }, (_, index) => ({
  id: index + 1,
  name: `Partner ${index + 1}`,
  type: 'Partner',
  logo: [{ thumbnails: { card_cover: { signedUrl: 'https://images.example/logo.png' } } }],
}))

describe('public middleware services', () => {
  let client: MiddlewareClient

  beforeEach(() => {
    requests.length = 0
    axios.defaults.adapter = async (config) => {
      requests.push(config)
      const path = config.url ?? ''
      const source = path.includes('tree-info')
        ? trees
        : path.includes('locations')
          ? locations
          : partners
      const detailId = path.match(/\/(\d+)$/)?.[1]
      if (detailId) {
        return {
          data: source.find((item) => item.id === Number(detailId)),
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        }
      }
      const page = Number(config.params?.page ?? 1)
      const take = Number(config.params?.take ?? 25)
      if (take > 50) throw new AxiosError('take must not exceed 50')
      return {
        data: {
          data: source.slice((page - 1) * take, page * take),
          meta: { page, take, total: source.length, pageCount: Math.ceil(source.length / take) },
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      }
    }
    client = new MiddlewareClient({ baseURL: 'http://middleware.example', timeout: 1234 })
  })

  afterEach(() => {
    axios.defaults.adapter = originalAdapter
    localStorage.clear()
  })

  it('uses the middleware URL and omits database and login credentials', async () => {
    localStorage.setItem('auth_token', 'browser-demo-token')
    localStorage.setItem('csrf_token', 'browser-csrf-token')
    const response = await new TreeInfoService(undefined, client).getAllTrees(25, 25)

    expect(response.list[0]?.id).toBe(26)
    expect(response.pageInfo).toEqual({
      totalRows: 60,
      page: 2,
      pageSize: 25,
      isFirstPage: false,
      isLastPage: false,
    })
    expect(requests[0]?.url).toBe('/api/public/tree-info')
    expect(requests[0]?.baseURL).toBe('http://middleware.example')
    expect(requests[0]?.timeout).toBe(1234)
    expect(requests[0]?.params).toEqual({ page: 2, take: 25 })
    expect(requests[0]?.headers.has('xc-token')).toBe(false)
    expect(requests[0]?.headers.has('Authorization')).toBe(false)
    expect(requests[0]?.headers.has('X-CSRF-Token')).toBe(false)
  })

  it('loads the map request of 100 locations in server-sized pages', async () => {
    const response = await new LocationService(undefined, client).getAllLocations(100, 0)

    expect(response.list).toHaveLength(100)
    expect(response.list[99]?.id).toBe(100)
    expect(response.list[0]?.latLang).toEqual({ lat: 47.74, lng: 8.97 })
    expect(response.pageInfo).toEqual({
      totalRows: 125,
      page: 1,
      pageSize: 100,
      isFirstPage: true,
      isLastPage: false,
    })
    expect(requests.map((request) => request.params)).toEqual([
      { page: 1, take: 50 },
      { page: 2, take: 50 },
    ])
  })

  it('preserves offsets that are not page boundaries', async () => {
    const response = await new TreeInfoService(undefined, client).getAllTrees(25, 35)

    expect(response.list.map((tree) => tree.id)).toEqual(
      Array.from({ length: 25 }, (_, index) => index + 36),
    )
    expect(response.pageInfo.isFirstPage).toBe(false)
    expect(response.pageInfo.isLastPage).toBe(true)
    expect(requests.map((request) => request.params)).toEqual([
      { page: 2, take: 25 },
      { page: 3, take: 25 },
    ])
  })

  it('loads all partner pages when no limit is provided and keeps logo extraction', async () => {
    const response = await new PartnerSponsorService(undefined, client).getPartners()

    expect(response.list).toHaveLength(55)
    expect(response.list[0]?.displayUrl).toBe('https://images.example/logo.png')
    expect(response.pageInfo.isLastPage).toBe(true)
    expect(requests.map((request) => request.params)).toEqual([
      { type: 'Partner', page: 1, take: 50 },
      { type: 'Partner', page: 2, take: 50 },
    ])
  })

  it('passes the sponsor filter without accepting an arbitrary table', async () => {
    await new PartnerSponsorService(undefined, client).getSponsors(10, 0)
    expect(requests[0]?.url).toBe('/api/public/partner-sponsors')
    expect(requests[0]?.params).toEqual({ type: 'Sponsor', page: 1, take: 10 })
  })

  it('reads details through the public endpoint and preserves images', async () => {
    const tree = await new TreeInfoService(undefined, client).getTreeById(1)
    const location = await new LocationService(undefined, client).getLocationById(1)
    const partner = await new PartnerSponsorService(undefined, client).getPartnerById(1)

    expect(tree.picture[0]?.signedUrl).toBe('https://images.example/1.jpg')
    expect(location.latLang).toEqual({ lat: 47.74, lng: 8.97 })
    expect(partner?.displayUrl).toBe('https://images.example/logo.png')
    expect(requests.map((request) => request.url)).toEqual([
      '/api/public/tree-info/1',
      '/api/public/locations/1',
      '/api/public/partner-sponsors/1',
    ])
  })

  it('reads tree pictures through the same public detail contract', async () => {
    const pictures = await new TreeInfoService(undefined, client).getTreePictures(1)
    expect(pictures).toEqual([{ signedUrl: 'https://images.example/1.jpg' }])
    expect(requests[0]?.url).toBe('/api/public/tree-info/1')
  })

  it('counts public records without a direct database request', async () => {
    expect(await new TreeInfoService(undefined, client).countTrees()).toBe(60)
    expect(await new LocationService(undefined, client).countLocations()).toBe(125)
    expect(requests).toHaveLength(2)
    expect(requests.every((request) => request.params.take === 1)).toBe(true)
  })

  it.each([
    [0, 0],
    [-1, 0],
    [1.5, 0],
    [25, -1],
    [25, 1.5],
  ])('rejects invalid limit %s / offset %s before issuing a request', async (limit, offset) => {
    await expect(new TreeInfoService(undefined, client).getAllTrees(limit, offset)).rejects.toThrow(
      RangeError,
    )
    expect(requests).toHaveLength(0)
  })

  it('propagates transport errors instead of falling back to direct NocoDB', async () => {
    const failure = new AxiosError('Offline', 'ERR_NETWORK')
    axios.defaults.adapter = async () => {
      throw failure
    }
    client = new MiddlewareClient({ baseURL: 'http://middleware.example' })
    vi.spyOn(console, 'error').mockImplementation(() => {})

    await expect(new TreeInfoService(undefined, client).getAllTrees(25, 0)).rejects.toBe(failure)
  })
})
