import { Alert, List } from 'antd'
import { getMissingFields } from '@/entities/ad'
import type { AutoAd, ElectronicsAd, RealEstateAd } from '@/entities/ad'
import styles from './AdRevisions.module.scss'

export const AdRevisions = ({
  ad,
}: {
  ad: AutoAd | RealEstateAd | ElectronicsAd
}) => {
  const missingFields = getMissingFields(ad.category, ad.params)

  if (missingFields.length === 0) return null

  return (
    <Alert
      type="warning"
      showIcon
      message="Требуются доработки"
      description={
        <div>
          <div className={styles.caption}>У объявления не заполнены поля:</div>
          <List
            size="small"
            dataSource={missingFields}
            renderItem={(item) => (
              <List.Item className={styles.item}>• {item}</List.Item>
            )}
          />
        </div>
      }
      className={styles.alert}
    />
  )
}
