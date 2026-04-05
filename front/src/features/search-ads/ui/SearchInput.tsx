import { useEffect, useState } from 'react'
import { Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { useSearchParamState } from '@/shared/lib'
import styles from './SearchInput.module.scss'

const SEARCH_DEBOUNCE_MS = 300

export const SearchInput = () => {
  const [search, setSearch] = useSearchParamState<string>('q', '')
  const [draft, setDraft] = useState<string>(search)
  const [page, setPage] = useSearchParamState('page', '1')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDraft(e.target.value)
  }

  useEffect(() => {
    setDraft(search)
  }, [search])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (draft !== search) {
        setSearch(draft)
        if (page !== '1') setPage('1')
      }
    }, SEARCH_DEBOUNCE_MS)

    return () => window.clearTimeout(timeoutId)
  }, [draft, search, setPage, setSearch, page])

  return (
    <Input
      prefix={<SearchOutlined />}
      placeholder="Найти объявление..."
      value={draft}
      onChange={handleChange}
      className={styles.input}
      allowClear
    />
  )
}
