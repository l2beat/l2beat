import type { AdjustableEconomicSecurityRisk } from '../types'

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
}
