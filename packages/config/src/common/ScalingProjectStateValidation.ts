type CategoryTitle =
  | 'ZK Circuits'
  | 'Prover Architecture'
  | 'Verification Keys Generation'

type ScalingProjectStateValidationCategory = {
  title: CategoryTitle
  description: string
}

export interface ScalingProjectStateValidation {
  description: string
  categories: ScalingProjectStateValidationCategory[]
}
