import type { ReactElement } from 'react'
import { Skeleton, Typography } from 'antd'
import { useAds, useAdParams } from '@/entities/ad'
import { pluralize, useErrorNotification } from '@/shared/lib'
import styles from './Header.module.scss'
import { ThemeSwitch } from '@/features/theme-switch'

export function Header(): ReactElement {
  const adParams = useAdParams()
  const { data, isLoading, isError } = useAds(adParams)
  const adsCount = data?.total || 0

  useErrorNotification(
    isError,
    'Не удалось загрузить объявления',
    'ads-load-error',
  )

  return (
    <header className={styles.root}>
      <div>
        <Typography.Title level={2} className={styles.title}>
          Мои объявления
        </Typography.Title>

        {isLoading ? (
          <Skeleton.Input
            active
            size="small"
            className={styles.countSkeleton}
          />
        ) : (
          <Typography.Text type="secondary">
            {adsCount}{' '}
            {pluralize(adsCount, ['объявление', 'объявления', 'объявлений'])}
          </Typography.Text>
        )}
      </div>
      <ThemeSwitch />
    </header>
  )
}
