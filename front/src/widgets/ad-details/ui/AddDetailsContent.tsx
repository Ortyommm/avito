import { Row, Col, Typography } from 'antd'
import { AdRevisions, AdSpecs, useAdDetails } from '@/entities/ad'
import { useParams } from 'react-router-dom'
import { FullWidthSpinner } from '@/shared'
import { useErrorNotification } from '@/shared/lib'
import styles from './AddDetailsContent.module.scss'

export const AdDetailsContent = () => {
  const { id } = useParams()
  const adId = Number(id)
  const { data, isLoading, isError } = useAdDetails(adId)

  useErrorNotification(
    isError,
    'Не удалось загрузить объявление',
    `ad-details-load-error-${adId}`,
  )

  if (!id || isLoading || !data) return <FullWidthSpinner />

  return (
    <div className={styles.root}>
      <Row gutter={48}>
        <Col span={12}>
          <div className={styles.imageWrap}>
            <img
              src={'https://placehold.co/600x400?text=Нет+фото'}
              alt={data.title}
              className={styles.image}
            />
          </div>
        </Col>

        <Col span={12}>
          <AdRevisions ad={data} />
          <AdSpecs ad={data} />
        </Col>
      </Row>

      <div className={styles.description}>
        <Typography.Title level={4}>Описание</Typography.Title>
        <Typography.Paragraph className={styles.text}>
          {data.description || (
            <Typography.Text type={'secondary'}>
              Описание отсутствует
            </Typography.Text>
          )}
        </Typography.Paragraph>
      </div>
    </div>
  )
}
