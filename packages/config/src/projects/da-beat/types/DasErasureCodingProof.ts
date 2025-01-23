import type { DaAttributes } from './DaLayer'

export type DasErasureCodingProof =
  | typeof ValidityProofs
  | typeof FraudProofs
  | typeof None

const ValidityProofs = {
  type: 'ValidityProofs',
  value: 'Validity proofs',
  description: 'TODO',
} as const

const FraudProofs = {
  type: 'FraudProofs',
  value: 'Fraud proofs',
  description: 'TODO',
} as const

const None = {
  type: 'None',
  value: 'None',
  description: 'TODO',
} as const

export const DasErasureCodingProof = {
  ValidityProofs,
  FraudProofs,
  None,
} satisfies DaAttributes
