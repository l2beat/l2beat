import { ProjectId, TvlApiChart, TvlApiResponse } from '@l2beat/shared-pure'

import { orderByTvl } from './orderByTvl'

function getOrder<T>(items: T[], check: (a: T, b: T) => boolean | number) {
  const order = [...items]
  order.sort((a, b) => {
    const result = check(a, b)
    if (typeof result === 'boolean') {
      return result ? -1 : 1
    }
    return result
  })
  return order
}

export function getProjectSortingOrder<
  T extends { id: ProjectId; display: { slug: string } },
>(items: T[], check: (a: T, b: T) => boolean | number) {
  return getOrder(items, check).map((item) => item.display.slug)
}

export function getEntrySortingOrder<T extends { slug: string }>(
  items: T[],
  check: (a: T, b: T) => boolean | number,
) {
  return getOrder(items, check).map((item) => item.slug)
}

export function getSortingOrderByTvl<
  T extends { id: ProjectId; display: { slug: string } },
>(
  projects: T[],
  tvlApiResponse: Pick<TvlApiResponse, 'projects'>,
  tvlType: Exclude<TvlApiChart['types'][number], 'timestamp'> = 'valueUsd',
): string[] {
  return orderByTvl(projects, tvlApiResponse, tvlType).map(
    (item) => item.display.slug,
  )
}
