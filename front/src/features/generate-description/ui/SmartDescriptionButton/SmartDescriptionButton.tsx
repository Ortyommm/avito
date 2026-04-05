import { useState } from 'react'
import { Button, Modal, message, Space } from 'antd'
import { RobotOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { adApi } from '@/entities/ad'

interface SmartDescriptionButtonProps {
  adId: string | number
  onApply: (text: string) => void
}

export const SmartDescriptionButton = ({
  adId,
  onApply,
}: SmartDescriptionButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedText, setGeneratedText] = useState('')

  const handleGenerate = async () => {
    setIsModalOpen(true)
    setIsGenerating(true)
    setGeneratedText('')

    try {
      const reader = await adApi.getStreamingSummary(adId)
      if (!reader) return

      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const strJson = line.replace('data: ', '')
              const json = JSON.parse(strJson)
              // Накапливаем текст шаг за шагом
              setGeneratedText((prev) => prev + json.content)
            } catch {
              // Игнорируем битые чанки
            }
          }
        }
      }
    } catch (error) {
      message.error('Не удалось сгенерировать описание')
      console.error(error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <>
      <Button
        type="default"
        icon={<RobotOutlined />}
        onClick={handleGenerate}
        style={{
          background: '#FFF7E6',
          color: '#FAAD14',
          borderColor: '#FFE7BA',
          marginTop: 8,
        }}
      >
        Улучшить описание с ИИ
      </Button>

      <Modal
        title={
          <Space>
            <RobotOutlined style={{ color: '#FAAD14' }} />
            <span>ИИ-помощник: Генерация описания</span>
          </Space>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        width={700}
        maskClosable={false}
        footer={[
          <Button
            key="cancel"
            onClick={() => setIsModalOpen(false)}
            icon={<CloseOutlined />}
          >
            Отмена
          </Button>,
          <Button
            key="apply"
            type="primary"
            disabled={isGenerating || !generatedText}
            onClick={() => {
              onApply(generatedText)
              setIsModalOpen(false)
            }}
            icon={<CheckOutlined />}
          >
            Применить
          </Button>,
        ]}
      >
        <div
          style={{
            minHeight: '250px',
            maxHeight: '500px',
            overflowY: 'auto',
            padding: '16px',
            background: 'var(--antd-background-color)',
            border: '1px solid #f0f0f0',
            borderRadius: '8px',
          }}
        >
          <div className="markdown-body">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {generatedText || (isGenerating ? 'Загрузка контекста...' : '')}
            </ReactMarkdown>
            {isGenerating && <span className="streaming-cursor">|</span>}
          </div>
        </div>
      </Modal>
    </>
  )
}
