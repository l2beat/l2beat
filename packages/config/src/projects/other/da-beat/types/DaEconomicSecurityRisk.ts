import { DaRiskViewOptions } from './DaRiskView'

export type DaEconomicSecurityRisk =
  | typeof Unknown
  | typeof OffChainVerifiable
  | typeof OnChainQuantifiable

const OnChainQuantifiable = {
  type: 'OnChainQuantifiable',
  value: 'Staked assets',
  sentiment: 'good',
  description: 'TODO',
} as const

const OffChainVerifiable = {
  type: 'OffChainVerifiable',
  value: 'Public Committee',
  sentiment: 'warning',
  description: 'TODO',
} as const

const Unknown = {
  type: 'Unknown',
  value: 'None',
  sentiment: 'bad',
  description: 'TODO',
} as const

export const DaEconomicSecurityRisk = {
  Unknown,
  OffChainVerifiable,
  OnChainQuantifiable,
} satisfies DaRiskViewOptions
