import { Card, Button, Typography, Divider } from 'antd'
import { CategoryFilter } from '@/features/filter-by-category'
import { RevisionToggle } from '@/features/filter-by-revision'
import { useSearchParamsManager } from '@/shared'
import styles from './FilterPanel.module.scss'

export const FilterPanel = () => {
  const { updateParams } = useSearchParamsManager()

  const handleReset = () => {
    updateParams({ page: '1', categories: '', needsRevision: '', q: '' })
  }

  return (
    <Card className={styles.panel} classNames={{ body: styles.panelBody }}>
      <Typography.Title level={4} className={styles.title}>
        Фильтры
      </Typography.Title>

      <Divider className={styles.divider} />

      <CategoryFilter />
      <RevisionToggle />

      <Button
        block
        danger
        type="text"
        onClick={handleReset}
        className={styles.resetButton}
      >
        Сбросить всё
      </Button>
    </Card>
  )
}
