import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'
import styles from './AppLayout.module.scss'

const { Content } = Layout

export function AppLayout() {
  return (
    <Layout className={styles.root}>
      <Content className={styles.content}>
        <Outlet />
      </Content>
    </Layout>
  )
}
