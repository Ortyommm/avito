/**
 * Конвертирует число в слово с учётом склонения
 *
 * @param {number} count - число, для которого будет производиться склонение
 * @param {string[]} words - массив из трёх форм слова для склонения
 * @returns {string} строка с правильно склоненным словом
 *
 * @example
 *  // вернёт "вакансия"
 * pluralize(1, ['вакансия', 'вакансии', 'вакансий'])
 *  // вернёт "вакансии"
 * pluralize(3, ['вакансия', 'вакансии', 'вакансий'])
 *  // вернёт "вакансий"
 * pluralize(5, ['вакансия', 'вакансии', 'вакансий'])
 */
export function pluralize(count: number, words: string[]): string {
  count = Math.floor(count)
  count = Math.abs(count) % 100
  const remainder = count % 10
  if (count > 10 && count < 20) {
    return words[2]
  }

  if (remainder > 1 && remainder < 5) {
    return words[1]
  }
  if (remainder === 1) {
    return words[0]
  }

  return words[2]
}
