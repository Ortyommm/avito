import { Checkbox, Typography } from 'antd'
import { useSearchParamState } from '@/shared/lib'
import styles from './RevisionToggle.module.scss'

export const RevisionToggle = () => {
  const [needsRevision, setNeedsRevision] = useSearchParamState<
    'true' | 'false' | ''
  >('needsRevision', '')
  const [, setPage] = useSearchParamState('page', '1')

  const handleChange = (checked: boolean) => {
    setPage('1')
    setNeedsRevision(checked ? 'true' : '')
  }

  return (
    <div className={styles.root}>
      <Checkbox
        checked={needsRevision === 'true'}
        onChange={(e) => handleChange(e.target.checked)}
      >
        <Typography.Text>Только требующие правки</Typography.Text>
      </Checkbox>
    </div>
  )
}
