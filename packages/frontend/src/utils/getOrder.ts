import { Layer2 } from '@l2beat/config'
import { TvlApiChart, TvlApiResponse } from '@l2beat/shared-pure'

import { orderByTvl } from './orderByTvl'

export function getSortingOrder<T extends { slug: string }>(
  items: T[],
  check: (a: T, b: T) => boolean | number,
) {
  const order = [...items]
  order.sort((a, b) => {
    const result = check(a, b)
    if (typeof result === 'boolean') {
      return result ? -1 : 1
    }
    return result
  })
  return order.map((item) => item.slug)
}

export function getSortingOrderByTvl(
  projects: Layer2[],
  tvlApiResponse: Pick<TvlApiResponse, 'projects'>,
  tvlType: Exclude<TvlApiChart['types'][number], 'timestamp'> = 'valueUsd',
): string[] {
  return orderByTvl(projects, tvlApiResponse, tvlType).map(
    (item) => item.display.slug,
  )
}
