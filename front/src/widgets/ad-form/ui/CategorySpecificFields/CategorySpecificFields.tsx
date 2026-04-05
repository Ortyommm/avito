import { Input, InputNumber, Select } from 'antd'
import { NormalizedFormItem } from '@/shared'

const electronicsTypeOptions = [
  { value: 'phone', label: 'Телефон' },
  { value: 'laptop', label: 'Ноутбук' },
  { value: 'misc', label: 'Другое' },
]

const electronicsConditionOptions = [
  { value: 'new', label: 'Новый' },
  { value: 'used', label: 'Б/у' },
]

const autoTransmissionOptions = [
  { value: 'automatic', label: 'Автомат' },
  { value: 'manual', label: 'Механика' },
]

const realEstateTypeOptions = [
  { value: 'flat', label: 'Квартира' },
  { value: 'house', label: 'Дом' },
  { value: 'room', label: 'Комната' },
]

export const CategorySpecificFields = ({ category }: { category: string }) => {
  if (category === 'electronics') {
    return (
      <>
        <NormalizedFormItem label="Тип" name={['params', 'type']}>
          <Select options={electronicsTypeOptions} />
        </NormalizedFormItem>
        <NormalizedFormItem label="Бренд" name={['params', 'brand']}>
          <Input allowClear />
        </NormalizedFormItem>
        <NormalizedFormItem label="Модель" name={['params', 'model']}>
          <Input allowClear />
        </NormalizedFormItem>
        <NormalizedFormItem label="Цвет" name={['params', 'color']}>
          <Input allowClear />
        </NormalizedFormItem>
        <NormalizedFormItem label="Состояние" name={['params', 'condition']}>
          <Select options={electronicsConditionOptions} />
        </NormalizedFormItem>
      </>
    )
  }

  if (category === 'auto') {
    return (
      <>
        <NormalizedFormItem label="Бренд" name={['params', 'brand']}>
          <Input allowClear />
        </NormalizedFormItem>
        <NormalizedFormItem label="Модель" name={['params', 'model']}>
          <Input allowClear />
        </NormalizedFormItem>
        <NormalizedFormItem label="Год выпуска" name={['params', 'yearOfManufacture']}>
          <InputNumber min={1900} max={2100} style={{ width: '100%' }} />
        </NormalizedFormItem>
        <NormalizedFormItem label="Коробка передач" name={['params', 'transmission']}>
          <Select options={autoTransmissionOptions} />
        </NormalizedFormItem>
        <NormalizedFormItem label="Пробег" name={['params', 'mileage']}>
          <InputNumber min={1} style={{ width: '100%' }} />
        </NormalizedFormItem>
        <NormalizedFormItem label="Мощность двигателя" name={['params', 'enginePower']}>
          <InputNumber min={1} style={{ width: '100%' }} />
        </NormalizedFormItem>
      </>
    )
  }

  if (category === 'real_estate') {
    return (
      <>
        <NormalizedFormItem label="Тип" name={['params', 'type']}>
          <Select options={realEstateTypeOptions} />
        </NormalizedFormItem>
        <NormalizedFormItem label="Адрес" name={['params', 'address']}>
          <Input allowClear />
        </NormalizedFormItem>
        <NormalizedFormItem label="Площадь" name={['params', 'area']}>
          <InputNumber min={0} step={0.1} style={{ width: '100%' }} />
        </NormalizedFormItem>
        <NormalizedFormItem label="Этаж" name={['params', 'floor']}>
          <InputNumber min={1} style={{ width: '100%' }} />
        </NormalizedFormItem>
      </>
    )
  }

  return null
}
