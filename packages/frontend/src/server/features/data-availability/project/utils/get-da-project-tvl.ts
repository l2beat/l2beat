import { type ProjectId } from '@l2beat/shared-pure'
import {
  unstable_cache as cache,
  unstable_noStore as noStore,
} from 'next/cache'
import { env } from '~/env'
import { db } from '~/server/database'
import { sumValuesPerSource } from '../../../scaling/tvl/utils/sum-values-per-source'

export async function getDaProjectTvl<T extends string>(
  bridgeUsedIn: Record<T, ProjectId[]>,
) {
  if (env.MOCK) {
    return getMockDaProjectTvl(bridgeUsedIn)
  }
  noStore()
  return await getCachedDaProjectTvl(bridgeUsedIn)
}

const getCachedDaProjectTvl = cache(
  async <T extends string>(bridgeUsedIn: Record<T, ProjectId[]>) => {
    const projectIds = [
      ...new Set(Object.values(bridgeUsedIn).flat()),
    ] as ProjectId[]

    const allValues =
      projectIds.length === 0 ? [] : await db.value.getLatestValues(projectIds)

    return (Object.keys(bridgeUsedIn) as T[]).reduce(
      (acc, curr) => {
        const projectIds = bridgeUsedIn[curr]
        if (projectIds.length === 0) {
          acc[curr] = 0
          return acc
        }

        const values = allValues.filter((value) =>
          projectIds.includes(value.projectId),
        )
        const { canonical, external, native } = sumValuesPerSource(values, {
          forTotal: true,
          excludeAssociatedTokens: false,
        })

        const tvl = canonical + external + native

        // Fiat denomination to cents
        acc[curr] = Number(tvl) / 100
        return acc
      },
      {} as Record<T, number>,
    )
  },
)

const getMockDaProjectTvl = <T extends string>(
  bridgeUsedIn: Record<T, ProjectId[]>,
) => {
  return Object.fromEntries(
    (
      Object.entries(bridgeUsedIn) as [keyof typeof bridgeUsedIn, ProjectId[]][]
    ).map(([bridge, projectIds]) => [bridge, projectIds.length * 1000]),
  )
}
