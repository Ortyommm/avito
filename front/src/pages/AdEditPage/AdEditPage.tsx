import { AdForm } from '@/widgets/ad-form/ui'
import { useParams } from 'react-router-dom'

export function AdEditPage() {
  const { id } = useParams()

  return (
    <>
      <AdForm id={+id!} />
    </>
  )
}
