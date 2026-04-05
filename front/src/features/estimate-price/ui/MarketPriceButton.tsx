import { useState } from 'react'
import { Button, Popover, Typography, Space, Spin, message } from 'antd'
import { BulbOutlined, ReloadOutlined } from '@ant-design/icons'
import { adApi, type UpdateAdDto } from '@/entities/ad'
import { formatPrice } from '@/shared'

interface MarketPriceButtonProps {
  adId: string | number
  onApply: (price: number) => void
  getCurrentValues: () => UpdateAdDto
}

export const MarketPriceButton = ({
                                    adId,
                                    onApply,
                                    getCurrentValues
                                  }: MarketPriceButtonProps) => {
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<{
    price: number
    description: string
  } | null>(null)

  const fetchPrice = async () => {
    setLoading(true)
    try {
      const currentValues = getCurrentValues()
      // Передаем актуальные значения из формы на бэкенд
      const result = await adApi.getMarketPrice(+adId, currentValues)
      setData(result)
    } catch {
      message.error('Не удалось получить рыночную цену')
      setVisible(false)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenChange = (newVisible: boolean) => {
    setVisible(newVisible)
    // Теперь запрашиваем цену всегда при открытии,
    // чтобы учитывать изменения в полях формы без перезагрузки страницы
    if (newVisible) {
      fetchPrice()
    }
  }

  const content = (
    <div style={{ maxWidth: 300 }}>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <Spin tip="Анализируем рынок..." />
        </div>
      ) : data ? (
        <Space direction="vertical" size="middle">
          <Typography.Text style={{ fontSize: '13px', display: 'block' }}>
            {data.description}
          </Typography.Text>
          <Typography.Title level={4} style={{ margin: '8px 0' }}>
            Рекомендуемая цена: {formatPrice(data.price)}
          </Typography.Title>
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <Space>
              <Button
                type="primary"
                size="small"
                onClick={() => {
                  onApply(data.price)
                  setVisible(false)
                }}
              >
                Применить
              </Button>
              <Button size="small" onClick={() => setVisible(false)}>
                Отмена
              </Button>
            </Space>
            {/* Добавляем возможность ручного рефреша внутри поповера */}
            <Button
              type="text"
              icon={<ReloadOutlined />}
              onClick={fetchPrice}
              title="Пересчитать"
            />
          </Space>
        </Space>
      ) : null}
    </div>
  )

  return (
    <Popover
      content={content}
      title="Анализ рыночной цены"
      trigger="click"
      open={visible}
      onOpenChange={handleOpenChange}
      placement="bottomLeft"
    >
      <Button
        type="default"
        icon={<BulbOutlined />}
        style={{
          background: '#FFF7E6',
          color: '#FAAD14',
          borderColor: '#FFE7BA',
        }}
      >
        Узнать рыночную цену
      </Button>
    </Popover>
  )
}