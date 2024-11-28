import { partition } from 'lodash'
import { env } from '~/env'

export type CategorisedScalingEntries<
  T extends { category: string | undefined; isOther?: boolean },
> = ReturnType<typeof groupByMainCategories<T>>

export function groupByMainCategories<
  T extends { category: string | undefined; isOther?: boolean },
>(projects: T[]) {
  if (env.NEXT_PUBLIC_FEATURE_FLAG_OTHER_PROJECTS === true) {
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
