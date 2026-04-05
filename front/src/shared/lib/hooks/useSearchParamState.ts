import { useSearchParams } from 'react-router-dom'
import { useCallback } from 'react'

// Хук для управления состоянием, синхронизированным с параметрами поиска в URL
export function useSearchParamState<T extends string>(
  key: string,
  defaultValue: T,
): [T, (newValue: T) => void] {
  const [searchParams, setSearchParams] = useSearchParams()
  const value = (searchParams.get(key) as T) || defaultValue

  const setValue = useCallback(
    (newValue: T) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          if (newValue === defaultValue) {
            next.delete(key)
          } else {
            next.set(key, newValue)
          }
          return next
        },
        { replace: true },
      )
    },
    [key, defaultValue, setSearchParams],
  )

  return [value, setValue]
}

export function useSearchParamArray(
  key: string,
  defaultValue: string[] = [],
): [string[], (newValue: string[]) => void] {
  const [searchParams, setSearchParams] = useSearchParams()

  // "auto,electronics" => ['auto', 'electronics']
  const paramValue = searchParams.get(key)
  const value = paramValue ? paramValue.split(',') : defaultValue

  const setValue = useCallback(
    (newValue: string[]) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          if (newValue.length === 0) {
            next.delete(key)
          } else {
            next.set(key, newValue.join(','))
          }
          next.set('page', '1')
          return next
        },
        { replace: true },
      )
    },
    [key, setSearchParams],
  )

  return [value, setValue]
}

// Когда нужно обновить несколько параметров сразу
export function useSearchParamsManager() {
  const [searchParams, setSearchParams] = useSearchParams()

  const updateParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          Object.entries(updates).forEach(([key, value]) => {
            if (value === undefined || value === '') {
              next.delete(key)
            } else {
              next.set(key, value)
            }
          })
          return next
        },
        { replace: true },
      )
    },
    [setSearchParams],
  )

  return { searchParams, updateParams }
}
