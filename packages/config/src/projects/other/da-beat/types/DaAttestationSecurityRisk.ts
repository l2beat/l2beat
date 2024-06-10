import { DaRiskViewOptions } from './DaRiskView'

export type DaAttestationSecurityRisk =
  | typeof ENSHRINED
  | ReturnType<typeof SIG_VERIFIED>
  | ReturnType<typeof SIG_VERIFIED_ZK>
  | typeof NOT_VERIFIED

const ENSHRINED = {
  type: 'ENSHRIRNED',
  value: 'Enshrined',
  sentiment: 'good',
  description: 'TODO',
} as const

function SIG_VERIFIED(areSignersTracked: boolean) {
  return {
    type: 'SIG_VERIFIED',
    value: 'Signatures verified',
    sentiment: areSignersTracked ? 'good' : 'warning',
    description: 'TODO',
  } as const
}

function SIG_VERIFIED_ZK(areSignersTracked: boolean) {
  return {
    type: 'SIG_VERIFIED',
    value: 'Signatures verified (ZK-Proof)',
    sentiment: areSignersTracked ? 'good' : 'warning',
    description: 'TODO',
  } as const
}

const NOT_VERIFIED = {
  type: 'NOT_VERIFIED',
  value: 'Signatures not verified',
  sentiment: 'bad',
  description: 'TODO',
} as const

export const DaAttestationSecurityRisk = {
  ENSHRINED,
  SIG_VERIFIED,
  SIG_VERIFIED_ZK,
  NOT_VERIFIED,
} satisfies DaRiskViewOptions
