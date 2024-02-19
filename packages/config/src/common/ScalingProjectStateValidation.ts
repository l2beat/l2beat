type CategoryTitle =
  | 'ZK Circuits'
  | 'Prover Architecture'
  | 'Verification Keys Generation'

type ScalingProjectStateValidationCategory = {
  title: CategoryTitle
  description: string
}

export type ScalingProjectStateValidation = {
  description: string
  categories: ScalingProjectStateValidationCategory[]
}
