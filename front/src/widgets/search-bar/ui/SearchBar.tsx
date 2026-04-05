import { Space } from 'antd'
import { SearchInput } from '@/features/search-ads'
import { ViewSwitcher } from '@/features/toggle-view'
import { SortSelect } from '@/features/sort-ads'
import styles from './SearchBar.module.scss'

export function SearchBar() {
  return (
    <div className={styles.root}>
      <SearchInput />

      <Space>
        <ViewSwitcher />

        <SortSelect />
      </Space>
    </div>
  )
}
