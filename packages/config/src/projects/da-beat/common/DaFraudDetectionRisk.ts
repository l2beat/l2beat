import type { DaRiskViewOptions } from '../types/DaRiskView'

export type DaFraudDetectionRisk =
  | typeof NoFraudDetection
  | typeof ErasureCodingProof
  | ReturnType<typeof DasWithBlobsReconstruction>
  | ReturnType<typeof DasWithNoBlobsReconstruction>

function DasWithBlobsReconstruction(erasureCoding: boolean) {
  return {
    type: 'DasWithBlobsReconstruction',
    value: 'DAS',
    sentiment: erasureCoding ? 'good' : 'warning',
    description: `The DA layer uses data availability sampling (DAS) to protect against data withholding attacks. By relying on a minimum number of light nodes to perform DAS for each block, it ensures that the entire block can be reconstructed even if some data is withheld by an adversarial block producer. The blob reconstruction protocol guarantees that with a sufficient number of honest light nodes sharing their samples, all data can be accurately reconstructed and its integrity verified.`,
    secondLine: 'with blobs reconstruction',
  } as const
}

function DasWithNoBlobsReconstruction(erasureCoding: boolean) {
  return {
    type: 'DasWithNoBlobsReconstruction',
    value: 'DAS',
    sentiment: erasureCoding ? 'warning' : 'bad',
    description: `The DA layer uses data availability sampling (DAS) to protect against data withholding attacks. However, the block reconstruction protocol, which enables the minimum number of light nodes to collectively reconstruct the block, is still under development.`,
    secondLine: '',
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
  value: 'None',
  sentiment: 'bad',
  description:
    'There is no fraud detection mechanism in place. A data withholding attack can only be detected by nodes downloading the full data from the DA layer.',
} as const

export const DaFraudDetectionRisk = {
  NoFraudDetection,
  ErasureCodingProof,
  DasWithBlobsReconstruction,
  DasWithNoBlobsReconstruction,
} satisfies DaRiskViewOptions
