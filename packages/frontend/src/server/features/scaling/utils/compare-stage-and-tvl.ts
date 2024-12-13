import { featureFlags } from '~/consts/feature-flags'
import { compareTvl } from '../tvl/utils/compare-tvl'

interface StageTvlComparable {
  stageOrder: number
  tvlOrder: number
  name: string
}

export function compareStageAndTvl(
  a: StageTvlComparable,
  b: StageTvlComparable,
) {
  if (featureFlags.stageSorting) {
    const stageDiff = b.stageOrder - a.stageOrder
    if (stageDiff !== 0) {
      return stageDiff
    }
  }
  const diff = b.tvlOrder - a.tvlOrder
  if (diff !== 0) {
    return diff
  }
  return compareTvl(a, b)
}
