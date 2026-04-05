import { Flex, Typography } from 'antd'
import { useAdDetails } from '@/entities/ad'
import { useParams } from 'react-router-dom'
import { BackToMainButton, formatDate, formatPrice } from '@/shared'
import { useErrorNotification } from '@/shared/lib'
import { EditAdButton } from '@/features/edit-ad'
import styles from './HeaderAdDetails.module.scss'

export const HeaderAdDetails = () => {
  const { id } = useParams()
  const adId = Number(id)
  const { data, isLoading, isError } = useAdDetails(adId)

  useErrorNotification(
    isError,
    'Не удалось загрузить объявление',
    `ad-details-load-error-${adId}`,
  )

  if (!id || isLoading || !data) return <div className={styles.skeleton} />

  return (
    <header className={styles.root}>
      <Flex justify="space-between">
        <Flex
          vertical
          justify="space-between"
          align={'flex-start'}
          style={{ height: '100px' }}
        >
          <Typography.Title
            level={2}
            className={styles.title}
            style={{ margin: 0 }}
          >
            {data.title}
          </Typography.Title>

          <Flex gap={10}><BackToMainButton />
            <EditAdButton id={id} /></Flex>
        </Flex>

        <Flex vertical align="end">
          <Typography.Title
            level={2}
            className={styles.title}
            style={{ margin: 0 }}
          >
            {formatPrice(data.price)}
          </Typography.Title>

          <Typography.Text type="secondary">
            Опубликовано: {formatDate(data.createdAt)}
          </Typography.Text>

          <Typography.Text type="secondary">
            Отредактировано: {data.updatedAt ? formatDate(data.updatedAt) : '-'}
          </Typography.Text>
        </Flex>
      </Flex>
    </header>
  )
}
