'use client'

import { parseAsInteger, useQueryState } from 'nuqs'
import { useMemo } from 'react'
import { defaultLimits } from './shared'
import { clamp } from 'lodash'

export function useServerPagination(
  count: number,
  limits: number[] = defaultLimits,
) {
  const [urlPage, setPage] = useQueryState(
    'page',
    parseAsInteger.withDefault(1).withOptions({
      shallow: false,
      clearOnDefault: true,
    }),
  )

  const [urlLimit, setLimit] = useQueryState(
    'limit',
    parseAsInteger.withDefault(10).withOptions({
      shallow: false,
      clearOnDefault: true,
    }),
  )

  const limit = useMemo(
    () => clamp(urlLimit ?? 10, limits[0] ?? 1, limits[limits.length - 1] ?? 1),
    [urlLimit, limits],
  )

  const pageCount = useMemo(() => Math.ceil(count / limit), [count, limits])
  const page = useMemo(() => Math.max(urlPage ?? 1, 1), [urlPage])

  return {
    page,
    setPage,
    limit,
    setLimit,
    pageCount,
  }
}
