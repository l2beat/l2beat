import { featureFlags } from '~/consts/featureFlags'
import { compareTvs } from '../tvs/utils/compareTvs'

interface StageTvsComparable {
  stageOrder: number
  tvsOrder: number
  name: string
}

export function compareStageAndTvs(
  a: StageTvsComparable,
  b: StageTvsComparable,
) {
  if (featureFlags.stageSorting) {
    const stageDiff = b.stageOrder - a.stageOrder
    if (stageDiff !== 0) {
      return stageDiff
    }
  }
  const diff = b.tvsOrder - a.tvsOrder
  if (diff !== 0) {
    return diff
  }
  return compareTvs(a, b)
}
