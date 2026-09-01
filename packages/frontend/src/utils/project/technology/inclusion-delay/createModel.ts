import type { ProjectInclusionDelayChart } from '@l2beat/config'
import { createCommitteeLikeModel } from './committeeLike'
import { createEthereumLikeModel } from './ethereumLike'
import { createSpanLikeModel } from './spanLike'
import type { InclusionDelayModel } from './types'

export function createInclusionDelayModel(
  chart: ProjectInclusionDelayChart,
): InclusionDelayModel {
  switch (chart.type) {
    case 'ethereumlike':
      return createEthereumLikeModel(chart)
    case 'spanlike':
      return createSpanLikeModel(chart)
    case 'committeelike':
      return createCommitteeLikeModel(chart)
  }
}
