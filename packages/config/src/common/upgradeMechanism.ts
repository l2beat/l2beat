import { formatSeconds } from '@l2beat/shared-pure'
import type { ProjectTechnologyChoice } from '../types'

function ARBITRUM_DAO(
  l1Delay: number,
  challengeWindow: number,
  challengeGracePeriodSeconds: number,
  l2Delay: number,
): ProjectTechnologyChoice {
  const noChallengeTotalDelay = l1Delay + challengeWindow + l2Delay
  return {
    name: 'Arbitrum DAO is in charge of upgrades',
    description: `Arbitrum DAO allows $ARB token holders to propose and vote on changes to the organization and the technologies it governs. The governance smart contracts are implemented on Arbitrum One rollup chain. The DAO can upgrade the Arbitrum One contracts on L2 with ${formatSeconds(
      l2Delay,
    )} delay and - using L2 --> L1 Governance Relay, update contracts on L1 with additional ${formatSeconds(
      l1Delay,
    )} delay + ${formatSeconds(
      challengeWindow,
    )} delay for all L2 --> L1 messages (in total a delay of ${formatSeconds(
      noChallengeTotalDelay,
    )}), with an additional ${formatSeconds(challengeGracePeriodSeconds)} if a challenge has been present in the state root that relays the message. The Security Council can upgrade the contracts without any delay. It can also cancel any upgrades initiated by the DAO.`,
    risks: [],
    references: [
      {
        title: 'Arbitrum DAO',
        url: 'https://docs.arbitrum.foundation/concepts/arbitrum-dao',
      },
    ],
  }
}

export const UPGRADE_MECHANISM = {
  ARBITRUM_DAO,
}
