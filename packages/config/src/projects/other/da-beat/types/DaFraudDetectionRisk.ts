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
    description: `
      The DA layer uses data availability sampling (DAS) to protect against data withholding attacks. 
      By relying on a minimum number of light nodes to perform DAS for each block, it ensures that the entire block can be reconstructed even if some data is withheld by an adversarial block producer. 
      The blob reconstruction protocol guarantees that with a sufficient number of honest light nodes sharing their samples, all data can be accurately reconstructed and its integrity verified.
    `,
  } as const
}

function DasWithNoBlobsReconstruction(erasureCoding: boolean) {
  return {
    type: 'DasWithNoBlobsReconstruction',
    value: 'DAS with no reconstruction',
    sentiment: erasureCoding ? 'warning' : 'bad',
    description: `
    The DA layer uses data availability sampling (DAS) to protect against data withholding attacks. However, there is no mechanism in place to reconstruct the data if some of it is withheld or the minimum number of light nodes
    required to perform DAS is not available. This means that the data may be lost if a block producer withholds data or if there are not enough honest light nodes to perform DAS.
    `,
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
