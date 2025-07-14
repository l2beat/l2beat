import type { AdjustableEconomicSecurityRisk } from '../types'

const OnChainQuantifiable: AdjustableEconomicSecurityRisk = {
  value: {
    value: 'Staked assets',
    sentiment: 'good',
    description: `There are staked assets on the DA layer that can be slashed in case of a data withholding attack. A dishonest supermajority of validators must collude to finalize a block with missing or invalid data. The invalid block would be added to the chain but rejected by honest full nodes.
    `,
  },
  adjustSecurityRisk: true,
}

function OnChainNotSlashable(token?: string): AdjustableEconomicSecurityRisk {
  const tokenExpression = token ? ` ${token} tokens` : 'tokens'
  const description =
    token === 'EIGEN'
      ? 'Node operators are required to stake a minimum of 32 ETH (first quorum) or 1 EIGEN (second quorum) to become members of the DA network. Although slashing is enabled at EigenLayer protocol level, individual AVSs like EigenDA need to activate it by migrating to Operators Sets and defining slashing conditions. Currently, there is no slashing condition in place for misbehaving nodes. The EIGEN token social forking protocol for intersubjective attributable faults is under active development.'
      : `Although node operators are required to stake ${tokenExpression} to become members of the DA network, there is no slashing mechanism in place for misbehaving nodes.`
  return {
    value: {
      value: 'No slashing',
      sentiment: 'bad',
      description,
    },
    adjustSecurityRisk: false,
  }
}

const OffChainVerifiable: AdjustableEconomicSecurityRisk = {
  value: {
    value: 'Public committee',
    sentiment: 'warning',
    description:
      'There are no onchain assets at risk of being slashed in case of a data withholding attack. However, there is indirect economic security derived by the committee members being publicly known, and their reputation is at stake should they behave maliciously.',
  },
  adjustSecurityRisk: false,
}

const Unknown: AdjustableEconomicSecurityRisk = {
  value: {
    value: 'None',
    sentiment: 'bad',
    description:
      'There are no onchain assets at risk of being slashed in case of a data withholding attack, and the committee members are not publicly known.',
  },
  adjustSecurityRisk: false,
}

const DAChallengesNoFunds: AdjustableEconomicSecurityRisk = {
  value: {
    value: 'DA Challenges',
    sentiment: 'bad',
    description:
      'There are no onchain assets at risk of being slashed in case of a data withholding attack. However, there is a mechanism that allows users to challenge unavailability of data. The system is not secure if the malicious sequencer is able to outspend the altruistic challengers, and there is no pool of funds onchain to incentivize challengers.',
  },
  adjustSecurityRisk: false,
}

export const DaEconomicSecurityRisk = {
  Unknown,
  DAChallengesNoFunds,
  OffChainVerifiable,
  OnChainQuantifiable,
  OnChainNotSlashable,
}
