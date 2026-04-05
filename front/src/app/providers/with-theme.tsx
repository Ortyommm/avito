import { ConfigProvider, theme } from 'antd';
import { type ReactNode, useEffect } from 'react'
import { useThemeStore } from '@/features/theme-switch';
import locale from 'antd/locale/ru_RU';

const validateMessages = {
  required: "Пожалуйста, введите '${label}'",
}

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const { mode } = useThemeStore();

  // Синхронизация с кастомными CSS-стилями (через data-атрибут)
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  return (
    <ConfigProvider
      locale={locale}
      form={{validateMessages}}
      theme={{
        algorithm: mode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <div className={`app-wrapper ${mode}-theme`}>
        {children}
      </div>
    </ConfigProvider>
  );
};