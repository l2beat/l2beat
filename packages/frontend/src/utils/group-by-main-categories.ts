import { PROJECT_COUNTDOWNS } from '@l2beat/config/build/src/common/projectCountdowns'
import { partition } from 'lodash'
import { env } from '~/env'
import { isInPast } from '~/server/features/utils/is-in-past'

export type CategorisedScalingEntries<
  T extends { category: string | undefined; isOther?: boolean },
> = ReturnType<typeof groupByMainCategories<T>>

export function groupByMainCategories<
  T extends { category: string | undefined; isOther?: boolean },
>(projects: T[]) {
  if (
    env.NEXT_PUBLIC_FEATURE_FLAG_OTHER_PROJECTS &&
    isInPast(PROJECT_COUNTDOWNS.otherMigration.expiresAt.toNumber())
  ) {
    const [others, rest] = partition(projects, (project) => project.isOther)
    const [rollups, validiumsAndOptimiums] = partition(
      rest,
      (project) =>
        project.category === 'ZK Rollup' ||
        project.category === 'Optimistic Rollup',
    )
    return {
      rollups,
      validiumsAndOptimiums,
      others,
    }
  }
  const [rollups, validiumsAndOptimiums] = partition(
    projects,
    (project) =>
      project.category === 'ZK Rollup' ||
      project.category === 'Optimistic Rollup',
  )

  return {
    rollups,
    validiumsAndOptimiums,
  }
}
