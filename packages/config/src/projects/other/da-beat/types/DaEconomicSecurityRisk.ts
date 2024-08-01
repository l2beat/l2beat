import { DaRiskViewOptions } from './DaRiskView'

export type DaEconomicSecurityRisk =
  | ReturnType<typeof OnChainNotSlashable>
  | typeof OnChainQuantifiable
  | typeof OffChainVerifiable
  | typeof Unknown

const OnChainQuantifiable = {
  type: 'OnChainQuantifiable',
  value: 'Staked assets',
  sentiment: 'good',
  description: 'TODO',
} as const

const OnChainNotSlashable = (token?: string) => {
  const tokenExpression = token ? ` ${token} tokens` : 'tokens'
  return {
    type: 'OnChainNotSlashable',
    value: `Staked assets - Not Slashable`,
    sentiment: 'bad',
    description: `Although node operators are required to stake ${tokenExpression} to become members of the DA network, there is no slashing mechanism in place for misbehaving nodes.`,
  } as const
}

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
  OnChainNotSlashable,
} satisfies DaRiskViewOptions
