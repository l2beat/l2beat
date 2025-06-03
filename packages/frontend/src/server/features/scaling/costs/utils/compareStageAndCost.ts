import { featureFlags } from '~/consts/featureFlags'

interface StageCostComparable {
  stageOrder: number
  costOrder: number
  name: string
}

export function compareStageAndCost(
  a: StageCostComparable,
  b: StageCostComparable,
) {
  if (featureFlags.stageSorting) {
    const stageDiff = b.stageOrder - a.stageOrder
    if (stageDiff !== 0) {
      return stageDiff
    }
  }
  return compareCosts(a, b)
}

interface CostComparable {
  name: string
  costOrder: number
}

export function compareCosts(a: CostComparable, b: CostComparable) {
  const diff = a.costOrder - b.costOrder
  if (diff !== 0) {
    return diff
  }
  return a.name.localeCompare(b.name)
}
