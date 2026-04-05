import { Select } from 'antd'
import { useSearchParamState } from '@/shared/lib'
import styles from './SortSelect.module.scss'

export const SortSelect = () => {
  const [sort, setSort] = useSearchParamState('sort', 'createdAt_desc')

  return (
    <Select value={sort} onChange={setSort} className={styles.select}>
      <Select.Option value="createdAt_desc">Сначала новые</Select.Option>
      <Select.Option value="createdAt_asc">Сначала старые</Select.Option>
      <Select.Option value="price_desc">Дороже</Select.Option>
      <Select.Option value="price_asc">Дешевле</Select.Option>
      <Select.Option value="title_asc">А-Я</Select.Option>
      <Select.Option value="title_desc">Я-А</Select.Option>
    </Select>
  )
}
