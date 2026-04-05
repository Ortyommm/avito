import styles from './FullWidthSpinner.module.scss'
import { Spin } from 'antd'

export function FullWidthSpinner() {
  return (
    <div className={styles.root}>
      <Spin size="large" />
    </div>
  )
}
