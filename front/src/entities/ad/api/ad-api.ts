import { apiInstance } from '@/shared/api'
import {
  type AdDetails,
  type AdsQueryParams,
  type GetAdsResponse,
  type UpdateAdDto,
} from '../model/types'
import { BASE_URL } from '@/shared/api/base.ts'

export const adApi = {
  // GET /items
  getAds: async (params: AdsQueryParams) => {
    const response = await apiInstance.get<GetAdsResponse>('/items', {
      params: {
        ...params,
        categories: params.categories?.join(','),
      },
    })
    return response.data
  },

  // GET /items/:id
  getAdById: async (id: number) => {
    const response = await apiInstance.get<AdDetails>(`/items/${id}`)
    return response.data
  },

  // PUT /items/:id
  updateAd: async (id: number, data: UpdateAdDto) => {
    const response = await apiInstance.put<{ success: boolean }>(
      `/items/${id}`,
      data,
    )
    return response.data
  },

  getMarketPrice: async (id: number, currentData: UpdateAdDto) => {
    const response = await fetch(`${BASE_URL}/items/${id}/market-price`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(currentData),
    });
    if (!response.ok) throw new Error('Failed to fetch market price');
    return response.json();
  },

  async getStreamingSummary(id: number | string) {
    const response = await fetch(`${BASE_URL}/items/${id}/streaming-summary`)
    if (!response.ok) throw new Error('Streaming failed')
    return response.body?.getReader()
  },
}
