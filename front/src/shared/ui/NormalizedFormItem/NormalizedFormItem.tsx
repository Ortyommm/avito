import { Form } from 'antd'
import type { FormItemProps } from 'antd'

const normalizeOptionalValue = (value: unknown) => {
  if (value === '' || value === undefined || value === null) return undefined
  return value
}

export function NormalizedFormItem(props: FormItemProps) {
  return <Form.Item {...props} normalize={props.normalize ?? normalizeOptionalValue} />
}

