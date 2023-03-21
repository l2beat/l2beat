import { ProjectTechnologyChoice } from '../../common'
import { CONTRACTS } from './contracts'

const ARBITRUM_DAO: ProjectTechnologyChoice = {
  name: 'Arbitrum DAO is in charge of upgrades',
  description:
    'Arbitrum DAO allows $ARB token holders to propose and vote on changes to the organization and the technologies it governs. The governance smart contracts are implemented on Arbitrum One rollup chain. The DAO can upgrade the Arbitrum One contracts on L2 with 3 days delay and - using L2 --> L1 Governance Relay, update contracts on L1 with additional 3 day delay + 7 days delay for all L2 --> L1 messages (in total a delay of 13 days). The Security Council can upgrade the contracts without any delay. It can also cancel any upgrades initiated by the DAO.',
  risks: [CONTRACTS.UPGRADE_WITH_DELAY_RISK('13 days')],
  references: [
    {
      text: 'Arbitrum DAO',
      href: 'https://docs.arbitrum.foundation/concepts/arbitrum-dao',
    },
  ],
}

export const UPGRADE_MECHANISM = {
  ARBITRUM_DAO,
}
