import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AdsQueryParams, UpdateAdDto } from './types'
import { adApi } from '../api/ad-api'

// Получение списка
export const useAds = (params: AdsQueryParams) => {
  return useQuery({
    queryKey: ['ads', params],
    queryFn: () => adApi.getAds(params),
  })
}

//  Получение одного объявления
export const useAdDetails = (id: number) => {
  return useQuery({
    queryKey: ['ad', id],
    queryFn: () => adApi.getAdById(id),
  })
}
//  Обновление
export const useUpdateAd = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAdDto }) =>
      adApi.updateAd(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ads'] })
      queryClient.invalidateQueries({ queryKey: ['ad'] })
    },
  })
}
