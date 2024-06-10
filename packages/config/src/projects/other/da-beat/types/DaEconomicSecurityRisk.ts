import { DaRiskViewOptions } from './DaRiskView'

export type DaEconomicSecurityRisk =
  | typeof ONCHAIN_QUANTIFIABLE
  | typeof OFFCHAIN_VERIFIABLE
  | typeof UNKNOWN

const ONCHAIN_QUANTIFIABLE = {
  type: 'ONCHAIN_QUANTIFIABLE',
  value: 'Staked assets',
  sentiment: 'good',
  description: 'TODO',
} as const

const OFFCHAIN_VERIFIABLE = {
  type: 'OFFCHAIN_VERIFIABLE',
  value: 'Public Committee',
  sentiment: 'warning',
  description: 'TODO',
} as const

const UNKNOWN = {
  type: 'UNKNOWN',
  value: 'None',
  sentiment: 'bad',
  description: 'TODO',
} as const

export const DaEconomicSecurityRisk = {
  ONCHAIN_QUANTIFIABLE,
  OFFCHAIN_VERIFIABLE,
  UNKNOWN,
} satisfies DaRiskViewOptions
