import type { ProjectId } from '@l2beat/shared-pure'
import type { ScalingProject, ScalingProjectRiskView } from '../../../types'

export interface Layer3 extends ScalingProject {
  type: 'layer3'
  /** ProjectId of hostChain */
  hostChain: ProjectId
  /** Stacked risk view values for this layer3 and it's base chain */
  stackedRiskView: ScalingProjectRiskView
}
