import { ScalingProjectRisk } from './ScalingProjectRisk'

type CategoryTitle =
  | 'ZK Circuits'
  | 'Prover Architecture'
  | 'Verification Keys Generation'

type ScalingProjectStateValidationCategory = {
  title: CategoryTitle
  description: string
  risks?: ScalingProjectRisk[]
}

export interface ScalingProjectStateValidation {
  description: string
  categories: ScalingProjectStateValidationCategory[]
}
