import type { TableReadyValue } from '../../../types'

const OnChainQuantifiable: TableReadyValue = {
  value: 'Staked assets',
  sentiment: 'good',
  description: `There are staked assets on the DA layer that can be slashed in case of a data withholding attack. A dishonest supermajority of validators must collude to finalize a block with missing or invalid data. The invalid block would be added to the chain but rejected by honest full nodes.
    `,
}

function OnChainNotSlashable(token?: string): TableReadyValue {
  const tokenExpression = token ? ` ${token} tokens` : 'tokens'
  const description =
    token === 'EIGEN'
      ? `Node operators are required to stake a minimum of 32 ETH (first quorum) or 1 EIGEN (second quorum) to become members of the DA network. However, there is no slashing mechanism in place for misbehaving nodes. The EIGEN token social forking protocol for intersubjective attributable faults is under active development.`
      : `Although node operators are required to stake ${tokenExpression} to become members of the DA network, there is no slashing mechanism in place for misbehaving nodes.`
  return {
    value: 'No slashing',
    sentiment: 'bad',
    description,
  }
}

const OffChainVerifiable: TableReadyValue = {
  value: 'Public committee',
  sentiment: 'warning',
  description:
    'There are no onchain assets at risk of being slashed in case of a data withholding attack. However, there is indirect economic security derived by the committee members being publicly known, and their reputation is at stake should they behave maliciously.',
}

const Unknown: TableReadyValue = {
  value: 'None',
  sentiment: 'bad',
  description:
    'There are no onchain assets at risk of being slashed in case of a data withholding attack, and the committee members are not publicly known.',
}

const DAChallengesNoFunds: TableReadyValue = {
  value: 'DA Challenges',
  sentiment: 'bad',
  description: `There are no onchain assets at risk of being slashed in case of a data withholding attack. However, there is a mechanism that allows users to challenge unavailability of data. The system is not secure if the malicious sequencer is able to outspend the altruistic challengers, and there is no pool of funds onchain to incentivize challengers.`,
}

export const DaEconomicSecurityRisk = {
  Unknown,
  DAChallengesNoFunds,
  OffChainVerifiable,
  OnChainQuantifiable,
  OnChainNotSlashable,
}
