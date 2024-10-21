import { partition } from 'lodash'

export type RecategorisedScalingEntry<
  T extends { category: string | undefined },
> =
  | {
      type?: never
      entries: T[]
    }
  | {
      type: 'recategorised'
      entries: ReturnType<typeof groupByMainCategories<T>>
    }

export function groupByMainCategories<
  T extends { category: string | undefined },
>(projects: T[]) {
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
