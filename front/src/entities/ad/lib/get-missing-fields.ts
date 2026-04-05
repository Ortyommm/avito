import type { AdCategory } from '../model/types'

type AdParamKey =
  | 'type'
  | 'brand'
  | 'model'
  | 'condition'
  | 'color'
  | 'yearOfManufacture'
  | 'transmission'
  | 'mileage'
  | 'enginePower'
  | 'address'
  | 'area'
  | 'floor'

type AdParams = Partial<Record<AdParamKey, unknown>>

export const FIELD_LABELS: Record<AdParamKey, string> = {
  type: 'Тип',
  brand: 'Бренд',
  model: 'Модель',
  condition: 'Состояние',
  color: 'Цвет',
  yearOfManufacture: 'Год выпуска',
  transmission: 'Коробка передач',
  mileage: 'Пробег',
  enginePower: 'Мощность двигателя',
  address: 'Адрес',
  area: 'Площадь',
  floor: 'Этаж',
}

export function getValueByKey(key: AdParamKey, value: string): string {
  if (key === 'condition') return value === 'new' ? 'Новый' : 'Б/У'
  return value
}

const REQUIRED_KEYS: Record<AdCategory, AdParamKey[]> = {
  electronics: ['type', 'brand', 'model', 'condition', 'color'],
  auto: [
    'brand',
    'model',
    'yearOfManufacture',
    'transmission',
    'mileage',
    'enginePower',
  ],
  real_estate: ['type', 'address', 'area', 'floor'],
}

const isMissing = (value: unknown): boolean => {
  if (value === null || value === undefined) return true
  if (typeof value === 'string') return value.trim() === ''
  if (Array.isArray(value)) return value.length === 0
  return false
}

export const getMissingFields = (
  category: AdCategory,
  params: AdParams = {},
): string[] => {
  return REQUIRED_KEYS[category]
    .filter((key) => isMissing(params[key]))
    .map((key) => FIELD_LABELS[key])
}
