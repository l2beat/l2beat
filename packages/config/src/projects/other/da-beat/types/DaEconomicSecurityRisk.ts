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
  description: `There are staked assets on the DA layer that can be slashed in case of a data withholding attack. A dishonest majority of validators must collude to validate a block with missing or invalid data. The invalid block would be added to the chain but rejected by honest full nodes.
    `,
} as const

const OnChainNotSlashable = (token?: string) => {
  const tokenExpression = token ? ` ${token} tokens` : 'tokens';
  const description = token === 'EIGEN'
    ? `Node operators are required to stake a minimum of 32 ETH (first quorum) or 1 EIGEN (second quorum) to become members of the DA network. However, there is no slashing mechanism in place for misbehaving nodes. The EIGEN token social forking protocol for intersubjective attributable faults is under active development.`
    : `Although node operators are required to stake ${tokenExpression} to become members of the DA network, there is no slashing mechanism in place for misbehaving nodes.`;

  const value = token === 'EIGEN'
    ? `Slashing under development`
    : `No slashing`;

  return {
    type: 'OnChainNotSlashable',
    value,
    sentiment: 'bad',
    description,
  } as const;
};

const OffChainVerifiable = {
  type: 'OffChainVerifiable',
  value: 'Public committee',
  sentiment: 'warning',
  description:
    'There are no onchain assets at risk of being slashed in case of a data withholding attack. The committee members are publicly known, and their reputation is at stake should they behave maliciously.',
} as const

const Unknown = {
  type: 'Unknown',
  value: 'None',
  sentiment: 'bad',
  description:
    'There are no onchain assets at risk of being slashed in case of a data withholding attack, and the committee members are not publicly known.',
} as const

export const DaEconomicSecurityRisk = {
  Unknown,
  OffChainVerifiable,
  OnChainQuantifiable,
  OnChainNotSlashable,
} satisfies DaRiskViewOptions
