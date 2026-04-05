import { Select, Typography } from 'antd'
import { useSearchParamArray } from '@/shared/lib'
import { AD_CATEGORY_MAP } from '@/entities/ad'
import styles from './CategoryFilter.module.scss'

export const CategoryFilter = () => {
  const [categories, setCategories] = useSearchParamArray('categories', [])

  const options = Object.entries(AD_CATEGORY_MAP).map(([value, label]) => ({
    label,
    value,
  }))

  return (
    <div className={styles.root}>
      <Typography.Text type="secondary" strong className={styles.label}>
        Категории
      </Typography.Text>
      <Select
        mode="multiple" // Включаем множественный выбор
        allowClear
        className={styles.select}
        placeholder="Выберите категории"
        value={categories}
        onChange={setCategories} // Теперь принимает string[]
        options={options}
        maxTagCount="responsive" // Чтобы длинный список не раздувал селект
      />
    </div>
  )
}
