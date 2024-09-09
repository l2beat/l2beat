import { ProofVerification } from '../projects/types'
import { ScalingProjectReference } from './ScalingProjectReference'
import { ScalingProjectRisk } from './ScalingProjectRisk'

type CategoryTitle =
  | 'ZK Circuits'
  | 'Prover Architecture'
  | 'Verification Keys Generation'
  | 'Proven Program'

type ScalingProjectStateValidationCategory = {
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
