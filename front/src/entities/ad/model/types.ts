export type SortColumn = 'title' | 'createdAt' | 'price' | undefined

export type SortDirection = 'asc' | 'desc' | undefined

export type AdsQueryParams = {
  q?: string
  limit?: number
  skip?: number
  categories?: string[]
  needsRevision?: boolean
  sortColumn?: SortColumn
  sortDirection?: SortDirection
}

export interface GetAdsResponse {
  items: AdItemShort[]
  total: number
}

export type AdCategory = 'auto' | 'real_estate' | 'electronics'

// Базовые поля, которые есть у всех
interface BaseAd {
  id: number
  title: string
  description?: string
  price: number
  createdAt: string
  updatedAt?: string
  needsRevision: boolean
  image?: string
}

export interface AutoAd extends BaseAd {
  category: 'auto'
  params: {
    brand: string
    model: string
    year: number
    mileage?: number
  }
}

export interface RealEstateAd extends BaseAd {
  category: 'real_estate'
  params: {
    type: string
    area: number
    rooms: number
    pricePerMeter?: number
  }
}

export interface ElectronicsAd extends BaseAd {
  category: 'electronics'
  params: {
    brand: string
    deviceType: string
    condition: 'new' | 'used'
  }
}

// Итоговый тип для страницы просмотра
export type AdDetails = AutoAd | RealEstateAd | ElectronicsAd

// Короткий тип для карточки в списке (из GET /items)
export interface AdItemShort {
  id: number
  title: string
  price: number
  category: AdCategory
  needsRevision: boolean
  image?: string
}

export type UpdateAdDto =
  | Partial<Omit<AutoAd, 'id' | 'createdAt' | 'needsRevision'>>
  | Partial<Omit<RealEstateAd, 'id' | 'createdAt' | 'needsRevision'>>
  | Partial<Omit<ElectronicsAd, 'id' | 'createdAt' | 'needsRevision'>>
