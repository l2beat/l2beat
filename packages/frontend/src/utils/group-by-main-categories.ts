import { partition } from 'lodash'

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
