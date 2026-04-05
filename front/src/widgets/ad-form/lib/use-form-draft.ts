import { useEffect } from 'react'
import type { FormInstance } from 'antd'

export const useFormDraft = (id: number, form: FormInstance) => {
  const DRAFT_KEY = `ad-draft-${id}`

  // 1. При инициализации проверяем наличие черновика
  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_KEY)
    if (savedDraft) {
      try {
        const parsedDraft = JSON.parse(savedDraft)
        form.setFieldsValue(parsedDraft)
      } catch (e) {
        console.error('Failed to parse draft', e)
      }
    }
  }, [id, form, DRAFT_KEY])

  // 2. Метод для очистки (вызовем после успешного сабмита)
  const clearDraft = () => localStorage.removeItem(DRAFT_KEY)

  // 3. Обработчик изменений
  const handleValuesChange = (_: unknown, allValues: unknown) => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(allValues))
  }

  return { handleValuesChange, clearDraft }
}