import { describe, expect, it } from 'vitest'
import { pluralize } from './pluralize'

const forms = ['объявление', 'объявления', 'объявлений']

describe('pluralize', () => {
  it('возвращает форму единственного числа для 1 и 21', () => {
    expect(pluralize(1, forms)).toBe('объявление')
    expect(pluralize(21, forms)).toBe('объявление')
  })

  it('возвращает форму для 2-4, исключая 12-14', () => {
    expect(pluralize(2, forms)).toBe('объявления')
    expect(pluralize(4, forms)).toBe('объявления')
    expect(pluralize(22, forms)).toBe('объявления')
  })

  it('возвращает форму множественного числа для 0, 5-20 и 11-14', () => {
    expect(pluralize(0, forms)).toBe('объявлений')
    expect(pluralize(5, forms)).toBe('объявлений')
    expect(pluralize(11, forms)).toBe('объявлений')
    expect(pluralize(14, forms)).toBe('объявлений')
  })

  it('корректно обрабатывает отрицательные и дробные значения', () => {
    expect(pluralize(-2, forms)).toBe('объявления')
    expect(pluralize(2.9, forms)).toBe('объявления')
  })
})
