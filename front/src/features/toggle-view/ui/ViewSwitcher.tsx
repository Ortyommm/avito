import { Button } from 'antd'
import { AppstoreOutlined, BarsOutlined } from '@ant-design/icons'
import { useSearchParamState } from '@/shared/lib'

export const ViewSwitcher = () => {
  const [view, setView] = useSearchParamState<'grid' | 'list'>('view', 'grid')

  return (
    <Button.Group>
      <Button
        icon={<AppstoreOutlined />}
        type={view === 'grid' ? 'primary' : 'default'}
        onClick={() => setView('grid')}
      />
      <Button
        icon={<BarsOutlined />}
        type={view === 'list' ? 'primary' : 'default'}
        onClick={() => setView('list')}
      />
    </Button.Group>
  )
}
