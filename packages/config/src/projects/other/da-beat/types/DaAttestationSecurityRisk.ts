import { DaRiskViewOptions } from './DaRiskView'

export type DaAttestationSecurityRisk =
  | typeof NoBridge
  | typeof Enshrined
  | typeof NotVerified
  | ReturnType<typeof SigVerified>
  | ReturnType<typeof SigVerifiedZK>

const Enshrined = {
  type: 'Enshrined',
  value: 'Enshrined',
  sentiment: 'good',
  description:
    'Validators and full nodes directly validate blobs data availability. On the consensus layer, block validity rules ensure that blobs are retrievable and their KZG proofs are verified, while execution clients validate blob gas values and transaction parameters.',
} as const

const NoBridge = {
  type: 'NoBridge',
  value: 'None',
  sentiment: 'bad',
  description: 'No data availability attestations are posted to Ethereum.',
} as const

function SigVerified(areSignersTracked: boolean) {
  return {
    type: 'SigVerified',
    value: 'Signatures verified',
    sentiment: areSignersTracked ? 'good' : 'warning',
    description:
      'Data availability attestations are posted to Ethereum with the signatures of the DA layer operators. The signatures are verified onchain against the set quorum of signers.',
  } as const
}

function SigVerifiedZK(areSignersTracked: boolean) {
  return {
    type: 'SigVerifiedZK',
    value: 'Signatures verified (ZK-Proof)',
    sentiment: areSignersTracked ? 'good' : 'warning',
    description:
      'Data availability attestations are posted to Ethereum in the form of a zero-knowledge proof. The proof includes the signatures of the committee members verification, which are verified onchain against the set quorum of signers.',
  } as const
}

const NotVerified = {
  type: 'NotVerified',
  value: 'Signatures not verified',
  sentiment: 'bad',
  description:
    'Data availability attestations are posted to Ethereum without the signatures of the committee members. The signatures are not verified onchain.',
} as const

export const DaAttestationSecurityRisk = {
  NoBridge,
  Enshrined,
  NotVerified,
  SigVerified,
  SigVerifiedZK,
} satisfies DaRiskViewOptions
