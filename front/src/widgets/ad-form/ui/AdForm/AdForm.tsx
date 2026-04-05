import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Space,
  Card,
  Typography,
  Divider,
  Flex,
  message,
} from 'antd'
import {
  useAdDetails,
  AD_CATEGORY_MAP,
  useUpdateAd,
  type UpdateAdDto,
} from '@/entities/ad'
import { useErrorNotification } from '@/shared/lib'
import { CategorySpecificFields } from '@/widgets/ad-form/ui'
import { MarketPriceButton } from '@/features/estimate-price/ui/MarketPriceButton.tsx'
import { SmartDescriptionButton } from '@/features/generate-description'
import { useFormDraft } from '@/widgets/ad-form'

export const AdForm = ({ id }: { id: number }) => {
  const [form] = Form.useForm()
  const { data: ad, isLoading, isError } = useAdDetails(+id)
  const { mutate: updateAd, isPending: isUpdating } = useUpdateAd()
  const { handleValuesChange, clearDraft } = useFormDraft(+id, form)

  useErrorNotification(
    isError,
    'Не удалось загрузить объявление для редактирования',
    `ad-edit-load-error-${id}`,
  )

  if (isLoading) return <Card loading />

  const onFinish = (values: UpdateAdDto) => {
    updateAd(
      { id: +id, data: values },
      {
        onSuccess: () => {
          message.success('Сохранено')
          clearDraft()
        },
        onError: () => {
          message.error('Произошла ошибка')
        },
      },
    )
  }

  const onMarketPriceApply = (price: number) => {
    form.setFieldValue('price', price)
  }

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={ad}
      onFinish={onFinish}
      requiredMark={true}
      onValuesChange={handleValuesChange}
    >
      <Form.Item label="Категория" name="category" rules={[{ required: true }]}>
        <Select
          options={Object.entries(AD_CATEGORY_MAP).map(([k, v]) => ({
            label: v,
            value: k,
          }))}
        />
      </Form.Item>

      <Form.Item label="Название" name="title" rules={[{ required: true }]}>
        <Input placeholder="MacBook Pro 16" allowClear />
      </Form.Item>

      <Space align="baseline">
        <Flex justify={'space-between'} gap={10} align={'center'}>
          <Form.Item label="Цена" name="price" rules={[{ required: true }]}>
            <InputNumber style={{ width: 200 }} addonAfter="₽" />
          </Form.Item>
          <MarketPriceButton adId={id} onApply={onMarketPriceApply} getCurrentValues={() => form.getFieldsValue()} />
        </Flex>
      </Space>

      <Typography.Title level={5}>Характеристики</Typography.Title>
      <Form.Item
        noStyle
        shouldUpdate={(prev, curr) => prev.category !== curr.category}
      >
        {({ getFieldValue }) => (
          <CategorySpecificFields category={getFieldValue('category')} />
        )}
      </Form.Item>

      <Divider />
      <Form.Item label="Описание" name="description">
        <Input.TextArea rows={4} showCount maxLength={1000} />
      </Form.Item>

      <SmartDescriptionButton
        adId={id}
        onApply={(text) => form.setFieldValue('description', text)}
      />
      <Divider />

      <Space style={{ marginTop: 24 }}>
        <Button type="primary" htmlType="submit" loading={isUpdating}>
          Сохранить
        </Button>
        <Button href={`/ads/${id}`}>Перейти к объвлению</Button>
      </Space>
    </Form>
  )
}
