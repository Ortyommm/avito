import { describe, expect, it } from 'vitest'
import { formatDate } from './formatDate'

const dateFormatOptions: Intl.DateTimeFormatOptions = {
  day: 'numeric',
  month: 'long',
  hour: '2-digit',
  minute: '2-digit',
}

describe('formatDate', () => {
  it('форматирует ISO-строку в локали ru-RU', () => {
    const input = '2024-01-15T10:05:00.000Z'
    const expected = new Intl.DateTimeFormat('ru-RU', dateFormatOptions)
      .format(new Date(input))
      .replace(',', '')

    expect(formatDate(input)).toBe(expected)
  })

  it('форматирует экземпляр Date', () => {
    const input = new Date('2025-07-20T18:30:00.000Z')
    const expected = new Intl.DateTimeFormat('ru-RU', dateFormatOptions)
      .format(input)
      .replace(',', '')

    expect(formatDate(input)).toBe(expected)
  })

  it('возвращает пустую строку для невалидной даты', () => {
    expect(formatDate('not-a-date')).toBe('')
  })
})
