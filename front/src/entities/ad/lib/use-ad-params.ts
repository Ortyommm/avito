import { useSearchParamArray, useSearchParamState } from '@/shared/lib'
import type { AdsQueryParams, SortColumn, SortDirection } from '../model/types'
import { PAGE_SIZE } from '@/entities/ad/model'

export const useAdParams = () => {
  const [search] = useSearchParamState('q', '')
  const [sort] = useSearchParamState('sort', 'createdAt_desc')
  const [page] = useSearchParamState('page', '1')
  const [needsRevision] = useSearchParamState<'true' | 'false' | ''>(
    'needsRevision',
    '',
  )
  const [categories] = useSearchParamArray('categories', [])

  const [column, direction] = sort.split('_')

  const queryParams: AdsQueryParams = {
    q: search || undefined,
    sortColumn: column as SortColumn,
    sortDirection: direction as SortDirection,
    limit: PAGE_SIZE,
    skip: (Number(page) - 1) * PAGE_SIZE,
    categories: categories.length > 0 ? categories : undefined,
    needsRevision: needsRevision === 'true',
  }

  return queryParams
}
