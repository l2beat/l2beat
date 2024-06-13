import { DaRiskViewOptions } from './DaRiskView'

export type DaFraudDetectionRisk =
  | typeof NoFraudDetection
  | typeof ErasureCodingProof
  | ReturnType<typeof DasWithBlobsReconstruction>
  | ReturnType<typeof DasWithNoBlobsReconstruction>

function DasWithBlobsReconstruction(erasureCoding: boolean) {
  return {
    type: 'DasWithBlobsReconstruction',
    value: 'DAS with blobs reconstruction',
    sentiment: erasureCoding ? 'good' : 'warning',
    description: 'TODO',
  } as const
}

function DasWithNoBlobsReconstruction(erasureCoding: boolean) {
  return {
    type: 'DasWithNoBlobsReconstruction',
    value: 'DAS with no blobs reconstruction',
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
  DasWithBlobsReconstruction,
  DasWithNoBlobsReconstruction,
} satisfies DaRiskViewOptions
