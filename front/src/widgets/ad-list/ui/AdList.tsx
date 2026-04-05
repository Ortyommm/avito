import { useAds, AdCard, useAdParams, PAGE_SIZE } from '@/entities/ad'
import { useErrorNotification, useSearchParamState } from '@/shared/lib'
import { Empty, Row, Col, Pagination, Flex } from 'antd'
import { FullWidthSpinner } from '@/shared'
import styles from './AdList.module.scss'

export const AdList = () => {
  const [viewMode] = useSearchParamState('view', 'grid')

  const adParams = useAdParams()
  const { data, isLoading, isError } = useAds(adParams)
  const [page, setPage] = useSearchParamState<`${number}`>('page', '1')

  useErrorNotification(
    isError,
    'Не удалось загрузить объявления',
    'ads-load-error',
  )

  if (isLoading) return <FullWidthSpinner />

  if (!data?.items.length) {
    return (
      <Empty description="Объявлений не найдено" className={styles.empty} />
    )
  }

  return (
    <Flex vertical gap={24} style={{ width: '100%' }}>
      <Row gutter={[16, 16]}>
        {data.items.map((ad) => (
          <Col key={ad.id} span={viewMode === 'grid' ? 8 : 24}>
            <AdCard data={ad} />
          </Col>
        ))}
      </Row>

      <Flex justify="center" className={styles.pagination}>
        <Pagination
          current={Number(page)}
          total={data.total}
          pageSize={PAGE_SIZE}
          showSizeChanger={false}
          onChange={(newPage) => {
            setPage(String(newPage) as `${number}`)
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
        />
      </Flex>
    </Flex>
  )
}
