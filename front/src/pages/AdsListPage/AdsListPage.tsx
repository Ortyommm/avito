import { Header } from '@/widgets/header-ads'
import { SearchBar } from '@/widgets/search-bar'
import { AdList } from '@/widgets/ad-list'
import { FilterPanel } from '@/widgets/filter-panel'
import styles from './AdsListPage.module.scss'

export function AdsListPage() {
  return (
    <div>
      <Header />
      <SearchBar />

      <div className={styles.content}>
        <FilterPanel />
        <AdList />
      </div>
    </div>
  )
}
