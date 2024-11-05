import { assert } from '@l2beat/shared-pure'
import { clamp } from 'lodash'
import { defaultLimits } from './shared'

export function getServerPagination({
  count,
  limits = defaultLimits,
  searchParams,
}: {
  count: number
  limits?: number[]
  searchParams: Record<string, string | string[] | undefined>
}) {
  assert(limits[0], 'No limits provided')

  // These two can still be NaN
  const urlPage =
    typeof searchParams.page === 'string'
      ? parseInt(searchParams.page)
      : undefined
  const urlLimit =
    typeof searchParams.limit === 'string'
      ? parseInt(searchParams.limit)
      : undefined

  const limit = clamp(
    urlLimit ? urlLimit : limits[0],
    limits[0],
    limits[limits.length - 1]!,
  )
  const pageCount = Math.ceil(count / limit)

  const page = clamp(urlPage ? urlPage : 1, 1, pageCount)

  return {
    skip: (page - 1) * limit,
    take: limit,
  }
}
