import { Card, Tag, Typography, Flex } from 'antd'
import type { AdItemShort } from '../../model/types'
import { formatPrice } from '@/shared'
import { useSearchParamState } from '@/shared/lib'
import type { ReactNode } from 'react'
import { AD_CATEGORY_MAP } from '../../model/constants'
import styles from './AdCard.module.scss'
import { Link } from 'react-router-dom'

const FALLBACK_IMAGE = 'https://placehold.co/600x400?text=Нет+фото'

interface AdCardProps {
  data: AdItemShort
  onClick?: () => void
  action?: ReactNode
}

export const AdCard = ({ data, onClick, action }: AdCardProps) => {
  const [viewMode] = useSearchParamState('view', 'grid')
  const isList = viewMode !== 'grid'

  const renderImage = (className: string) => (
    <img
      alt={data.title}
      src={data.image || FALLBACK_IMAGE}
      className={className}
      onError={(e) => {
        ;(e.target as HTMLImageElement).src = FALLBACK_IMAGE
      }}
    />
  )

  return (
    <Link to={`/ads/${data.id}`}>
      <Card
        hoverable
        onClick={onClick}
        cover={
          !isList ? renderImage(`${styles.image} ${styles.imageGrid}`) : null
        }
        className={isList ? styles.cardList : undefined}
        actions={action ? [action] : []}
      >
        <Flex vertical={!isList} align={isList ? 'stretch' : 'flex-start'}>
          {isList && renderImage(`${styles.image} ${styles.imageList}`)}

          <div
            className={`${styles.content} ${isList ? styles.contentList : ''}`}
          >
            <Tag color="blue" className={styles.categoryTag}>
              {AD_CATEGORY_MAP[data.category]}
            </Tag>

            <Typography.Title level={5} className={styles.title}>
              {data.title}
            </Typography.Title>

            <Typography.Text type="danger" strong className={styles.price}>
              {formatPrice(data.price)}
            </Typography.Text>

            {data.needsRevision && (
              <Typography.Text
                type="warning"
                strong
                className={styles.revision}
              >
                ⚠️ Нужны правки
              </Typography.Text>
            )}
          </div>
        </Flex>
      </Card>
    </Link>
  )
}
