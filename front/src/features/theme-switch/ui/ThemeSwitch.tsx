import { Button } from 'antd';
import { SunOutlined, MoonOutlined } from '@ant-design/icons';
import { useThemeStore } from '../model/theme-store';

export const ThemeSwitch = () => {
  const { mode, toggleTheme } = useThemeStore();

  return (
    <Button
      type="text"
      icon={mode === 'light' ? <MoonOutlined /> : <SunOutlined />}
      onClick={toggleTheme}
      style={{ fontSize: '18px', color: 'var(--text-main)' }}
    />
  );
};