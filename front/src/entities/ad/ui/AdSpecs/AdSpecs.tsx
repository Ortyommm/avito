import { Descriptions } from 'antd'
import { FIELD_LABELS, getValueByKey } from '@/entities/ad'
import styles from './AdSpecs.module.scss'

type AdSpecsProps = {
  ad: {
    params?: Record<string, unknown>
  }
}

export const AdSpecs = ({ ad }: AdSpecsProps) => {
  const params = ad.params ?? {}

  const items = Object.entries(params).map(([key, value]) => ({
    key,
    label: FIELD_LABELS[key as keyof typeof FIELD_LABELS] ?? key,
    children: getValueByKey(key as keyof typeof FIELD_LABELS, String(value)),
  }))

  if (!items.length) {
    return null
  }

  return (
    <div className={styles.root}>
      <Descriptions
        title="Характеристики"
        column={1}
        items={items}
        classNames={{ label: styles.label, content: styles.content }}
      />
    </div>
  )
}
