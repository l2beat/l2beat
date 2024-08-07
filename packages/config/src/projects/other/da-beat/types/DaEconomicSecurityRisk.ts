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
  description:
    'There are staked assets on the DA layer that can be slashed in case of a data withholding attack.',
} as const

const OnChainNotSlashable = (token?: string) => {
  const tokenExpression = token ? ` ${token} tokens` : 'tokens'
  return {
    type: 'OnChainNotSlashable',
    value: `Staked assets`,
    sentiment: 'bad',
    description: `Although node operators are required to stake ${tokenExpression} to become members of the DA network, there is no slashing mechanism in place for misbehaving nodes.`,
  } as const
}

const OffChainVerifiable = {
  type: 'OffChainVerifiable',
  value: 'Public Committee',
  sentiment: 'warning',
  description: 'There are no onchain assets at risk of being slashed in case of a data withholding attack. The committee members are publicly known, and their reputation is at stake should they behave maliciously.',
} as const

const Unknown = {
  type: 'Unknown',
  value: 'None',
  sentiment: 'bad',
  description: 'There are no onchain assets at risk of being slashed in case of a data withholding attack, and the committee members are not publicly known.',
} as const

export const DaEconomicSecurityRisk = {
  Unknown,
  OffChainVerifiable,
  OnChainQuantifiable,
  OnChainNotSlashable,
} satisfies DaRiskViewOptions
