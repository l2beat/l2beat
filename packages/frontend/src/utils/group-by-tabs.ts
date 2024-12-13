import { PROJECT_COUNTDOWNS } from '@l2beat/config'
import { env } from '~/env'
import { type CommonScalingEntry } from '~/server/features/scaling/get-common-scaling-entry'
import { isInPast } from '~/server/features/utils/is-in-past'

export type TabbedScalingEntries<T extends CommonScalingEntry> = {
  rollups: T[]
  validiumsAndOptimiums: T[]
  others: T[] | undefined
}

export function groupByTabs<T extends CommonScalingEntry>(
  projects: T[],
): TabbedScalingEntries<T> {
  return {
    rollups: projects.filter((p) => p.tab === 'Rollups'),
    validiumsAndOptimiums: projects.filter(
      (p) => p.tab === 'ValidiumsAndOptimiums',
    ),
    others:
      env.NEXT_PUBLIC_FEATURE_FLAG_OTHER_PROJECTS &&
      isInPast(PROJECT_COUNTDOWNS.otherMigration.expiresAt.toNumber())
        ? projects.filter((p) => p.tab === 'Others')
        : undefined,
  }
}
