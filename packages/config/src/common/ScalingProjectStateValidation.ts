import type { ProofVerification } from '../projects/types'
import type { ScalingProjectReference } from './ScalingProjectReference'
import type { ScalingProjectRisk } from './ScalingProjectRisk'

type CategoryTitle =
  // ZK
  | 'ZK Circuits'
  | 'Prover Architecture'
  | 'Verification Keys Generation'
  | 'Proven Program'
  // Optimistic
  | 'State root proposals'
  | 'Challenges'
  | 'Fast confirmations'

export type ScalingProjectStateValidationCategory = {
  title: CategoryTitle
  description: string
  risks?: ScalingProjectRisk[]
  references?: ScalingProjectReference[]
}

export interface ScalingProjectStateValidation {
  description: string
  categories: ScalingProjectStateValidationCategory[]
  proofVerification?: ProofVerification
}
