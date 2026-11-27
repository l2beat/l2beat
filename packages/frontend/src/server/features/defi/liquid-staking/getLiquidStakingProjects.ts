import type { Project } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { ps } from '~/server/projects'

export type LiquidStakingProject = Project<
  'defiInfo' | 'liquidStaking',
  'display' | 'statuses'
>

/** Protocols listed with `liquidStakingListing` have neither display nor statuses. */
export function getLiquidStakingProjects(): Promise<LiquidStakingProject[]> {
  return ps.getProjects({
    select: ['defiInfo', 'liquidStaking'],
    optional: ['display', 'statuses'],
  })
}

/** The indexer snapshots hourly, so a day without one means it is behind. */
const SYNCED_WITHIN = UnixTime.DAY

/**
 * The tracked protocols whose snapshots have caught up with now. One still
 * backfilling, as a newly added one is, has no value on the latest days, and
 * would leave each of them without the total of all protocols.
 */
export async function getSyncedProjectIds(
  projects: Pick<Project<'liquidStaking'>, 'id' | 'liquidStaking'>[],
): Promise<Set<string>> {
  const tracked = projects
    .filter((project) => project.liquidStaking.tracking !== undefined)
    .map((project) => project.id)
  if (env.MOCK) return new Set(tracked)
  const synced =
    await getDb().liquidStakingSnapshot.getProjectIdsWithSnapshotsSince(
      tracked,
      UnixTime(UnixTime.now() - SYNCED_WITHIN),
    )
  return new Set(synced)
}
