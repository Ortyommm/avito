import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { HomeOutlined } from '@ant-design/icons';

export function BackToMainButton() {
  return <Link to="/ads">
    <Button icon={<HomeOutlined />}>На главную</Button>
  </Link>
}