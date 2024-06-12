import { DaRiskViewOptions } from './DaRiskView'

export type DaFraudDetectionRisk =
  | typeof NoFraudDetection
  | typeof ErasureCodingProof
  | ReturnType<typeof DasWithBlockReconstruction>
  | ReturnType<typeof DasWithNoBlockReconstruction>

function DasWithBlockReconstruction(erasureCoding: boolean) {
  return {
    type: 'DasWithBlockReconstruction',
    value: 'DAS with block reconstruction',
    sentiment: erasureCoding ? 'good' : 'warning',
    description: 'TODO',
  } as const
}

function DasWithNoBlockReconstruction(erasureCoding: boolean) {
  return {
    type: 'DasWithNoBlockReconstruction',
    value: 'DAS with no block reconstruction',
    sentiment: erasureCoding ? 'good' : 'warning',
    description: 'TODO',
  } as const
}

const ErasureCodingProof = {
  type: 'ErasureCodingProof',
  value: 'Erasure coding proof',
  sentiment: 'bad',
  description: 'TODO',
} as const

const NoFraudDetection = {
  type: 'NoFraudDetection',
  value: 'No fraud detection',
  sentiment: 'bad',
  description: 'TODO',
} as const

export const DaFraudDetectionRisk = {
  NoFraudDetection,
  ErasureCodingProof,
  DasWithBlockReconstruction,
  DasWithNoBlockReconstruction,
} satisfies DaRiskViewOptions
