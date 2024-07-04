import { type ProjectId } from '@l2beat/shared-pure'
import {
  unstable_cache as cache,
  unstable_noStore as noStore,
} from 'next/cache'
import { db } from '~/server/database'

export async function getDaProjectTvl(projectIds: ProjectId[]) {
  noStore()
  return await getCachedDaProjectTvl(projectIds)
}

const getCachedDaProjectTvl = cache(async (projectIds: ProjectId[]) => {
  if (projectIds.length === 0) return 0

  const values = await db.value.getLatestValuesForProjects(projectIds)

  const { canonical, external, native } = values.reduce(
    (acc, value) => {
      acc.canonical += value.canonical
      acc.external += value.external
      acc.native += value.native

      return acc
    },
    { canonical: 0n, external: 0n, native: 0n },
  )

  const tvl = canonical + external + native

  // Fiat denomination to cents
  return Number(tvl) / 100
})
