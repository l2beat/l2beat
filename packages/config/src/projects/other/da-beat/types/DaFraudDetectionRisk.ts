import { DaRiskViewOptions } from './DaRiskView'

export type DaFraudDetectionRisk =
  | ReturnType<typeof DAS_WITH_BLOCK_RECONSTRUCTION>
  | ReturnType<typeof DAS_WITH_NO_BLOCK_RECONSTRUCTION>
  | typeof ERASURE_CODING_PROOF
  | typeof NO_FRAUD_DETECTION

function DAS_WITH_BLOCK_RECONSTRUCTION(erasureCoding: boolean) {
  return {
    type: 'DAS_WITH_BLOCK_RECONSTRUCTION',
    value: 'DAS with block reconstruction',
    sentiment: erasureCoding ? 'good' : 'warning',
    description: 'TODO',
  } as const
}

function DAS_WITH_NO_BLOCK_RECONSTRUCTION(erasureCoding: boolean) {
  return {
    type: 'DAS_WITH_NO_BLOCK_RECONSTRUCTION',
    value: 'DAS with no block reconstruction',
    sentiment: erasureCoding ? 'good' : 'warning',
    description: 'TODO',
  } as const
}

const ERASURE_CODING_PROOF = {
  type: 'ERASURE_CODING_PROOF',
  value: 'Erasure coding proof',
  sentiment: 'bad',
  description: 'TODO',
} as const

const NO_FRAUD_DETECTION = {
  type: 'NO_FRAUD_DETECTION',
  value: 'No fraud detection',
  sentiment: 'bad',
  description: 'TODO',
} as const

export const DaFraudDetectionRisk = {
  DAS_WITH_BLOCK_RECONSTRUCTION,
  DAS_WITH_NO_BLOCK_RECONSTRUCTION,
  ERASURE_CODING_PROOF,
  NO_FRAUD_DETECTION,
} satisfies DaRiskViewOptions
