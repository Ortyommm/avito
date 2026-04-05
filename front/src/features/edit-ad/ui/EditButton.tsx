import { Button } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import styles from './EditButton.module.scss'

interface EditAdButtonProps {
  id: string
}

export const EditAdButton = ({ id }: EditAdButtonProps) => {
  const navigate = useNavigate()

  const handleEdit = () => {
    navigate(`/ads/${id}/edit`)
  }

  return (
    <Button
      type="primary"
      icon={<EditOutlined />}
      onClick={handleEdit}
      className={styles.button}
    >
      Редактировать
    </Button>
  )
}
