import type { AdCategory } from './types'

export const AD_CATEGORY_MAP: Record<AdCategory, string> = {
  real_estate: 'Недвижимость',
  auto: 'Авто',
  electronics: 'Электроника',
} as const

export const PAGE_SIZE = 10
