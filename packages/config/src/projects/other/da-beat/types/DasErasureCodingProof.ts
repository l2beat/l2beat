import { DaAttributes } from './DaAttribute'

export type DasErasureCodingProof = typeof ValidityProofs | typeof FraudProofs

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

export const DasErasureCodingProof = {
  ValidityProofs,
  FraudProofs,
} satisfies DaAttributes
