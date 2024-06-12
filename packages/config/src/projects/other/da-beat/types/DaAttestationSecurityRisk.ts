import { DaRiskViewOptions } from './DaRiskView'

export type DaAttestationSecurityRisk =
  | typeof NoBridge
  | typeof Enshrined
  | typeof NotVerified
  | ReturnType<typeof SigVerified>
  | ReturnType<typeof SigVerifiedZK>

const Enshrined = {
  type: 'Enshirned',
  value: 'Enshrined',
  sentiment: 'good',
  description: 'TODO',
} as const

const NoBridge = {
  type: 'NoBridge',
  value: 'No bridge',
  sentiment: 'bad',
  description: 'TODO',
} as const

function SigVerified(areSignersTracked: boolean) {
  return {
    type: 'SigVerified',
    value: 'Signatures verified',
    sentiment: areSignersTracked ? 'good' : 'warning',
    description: 'TODO',
  } as const
}

function SigVerifiedZK(areSignersTracked: boolean) {
  return {
    type: 'SigVerifiedZK',
    value: 'Signatures verified (ZK-Proof)',
    sentiment: areSignersTracked ? 'good' : 'warning',
    description: 'TODO',
  } as const
}

const NotVerified = {
  type: 'NotVerified',
  value: 'Signatures not verified',
  sentiment: 'bad',
  description: 'TODO',
} as const

export const DaAttestationSecurityRisk = {
  NoBridge,
  Enshrined,
  NotVerified,
  SigVerified,
  SigVerifiedZK,
} satisfies DaRiskViewOptions
