import { describe, expect, it } from 'vitest'
import { formatPrice } from './formatPrice'

const currencyFormatOptions: Intl.NumberFormatOptions = {
  style: 'currency',
  currency: 'RUB',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
}

describe('formatPrice', () => {
  it('форматирует числовые значения в валюту RUB', () => {
    const input = 1_250_500
    const expected = new Intl.NumberFormat('ru-RU', currencyFormatOptions).format(
      input,
    )

    expect(formatPrice(input)).toBe(expected)
  })

  it('форматирует числовые строки', () => {
    const input = '1000.9'
    const expected = new Intl.NumberFormat('ru-RU', currencyFormatOptions).format(
      1000.9,
    )

    expect(formatPrice(input)).toBe(expected)
  })

  it('возвращает значение по умолчанию для NaN-входа', () => {
    expect(formatPrice('abc')).toBe('0 ₽')
  })
})
