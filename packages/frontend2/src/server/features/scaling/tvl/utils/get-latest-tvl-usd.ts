import { UnixTime, type ProjectId } from '@l2beat/shared-pure'
import { groupBy, sum } from 'lodash'
import {
  unstable_cache as cache,
  unstable_noStore as noStore,
} from 'next/cache'
import { db } from '~/server/database'
import { sumValuesPerSource } from './sum-values-per-source'

/*
  This function should only be used for ordering projects by TVL.
  We fetch all projects here to avoid cache misses. Difference between
  this approach and fetching all l2s or l3s is negligible.
*/
export async function getLatestTvlUsd() {
  noStore()
  return getCachedLatestTvlUsd()
}

const getCachedLatestTvlUsd = cache(
  async (): Promise<Record<ProjectId, number>> => {
    const values = await db.value.getLatestValues()
    const groupedByProject = groupBy(values, (e) => e.projectId)

    return Object.fromEntries(
      Object.entries(groupedByProject).map(([projectId, records]) => {
        const summedPerSource = sumValuesPerSource(records, {
          forTotal: true,
          excludeAssociatedTokens: false,
        })
        const summed = sum(Object.values(summedPerSource))
        return [projectId, Number(summed) / 100]
      }),
    )
  },
  ['latestTvlUsd'],
  {
    revalidate: 10 * UnixTime.MINUTE,
  },
)
