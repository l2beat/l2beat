import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import {
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
  TECHNOLOGY,
  UNDER_REVIEW_RISK_VIEW,
} from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'

const discovery = new ProjectDiscovery('layer2finance')

export const layer2finance: ScalingProject = {
  type: 'layer2',
  id: ProjectId('layer2finance'),
  addedAt: UnixTime(1623153328), // 2021-06-08T11:55:28Z
  archivedAt: UnixTime(1695686400), // 2023-09-26T00:00:00.000Z,
  capability: 'universal',
  display: {
    name: 'Layer2.Finance',
    slug: 'layer2finance',
    warning:
      'Currently the TVS is calculated incorrectly, because it does not take assets locked in DeFi into account.',
    description:
      'Layer2.Finance aims to democratize access to DeFi protocols for everyone. Users can aggregate their DeFi usage and save on Ethereum fees.',
    purposes: ['Exchange'],
    links: {
      websites: ['https://layer2.finance/'],
      bridges: ['https://app.l2.finance/'],
      documentation: ['https://docs.l2.finance/'],
      repositories: [
        'https://github.com/celer-network/layer2-finance-contracts',
      ],
      socialMedia: [
        'https://discord.gg/uGx4fjQ',
        'https://t.me/celernetwork',
        'https://twitter.com/CelerNetwork',
      ],
    },
  },
  proofSystem: {
    type: 'Optimistic',
  },
  dataAvailability: {
    layer: DA_LAYERS.ETH_CALLDATA,
    bridge: DA_BRIDGES.ENSHRINED,
    mode: DA_MODES.TRANSACTION_DATA,
  },
  config: {
    escrows: [
      {
        address: EthereumAddress('0xf86FD6735f88d5b6aa709B357AD5Be22CEDf1A05'),
        sinceTimestamp: UnixTime(1619011215),
        tokens: ['BUSD', 'DAI', 'USDC', 'USDT', 'WETH'],
        chain: 'ethereum',
      },
    ],
  },
  riskView: UNDER_REVIEW_RISK_VIEW,
  stage: {
    stage: 'UnderReview',
  },
  technology: TECHNOLOGY.UNDER_REVIEW,
  contracts: {
    addresses: {
      ethereum: [
        discovery.getContractDetails('RollupChain', {
          references: [
            {
              title: 'RollupChain.sol#L460-L496 - Layer2.Finance source code',
              url: 'https://github.com/celer-network/layer2-finance-contracts/blob/61ed0f17a15e8ba06778776ade1a82956a9de842/contracts/RollupChain.sol#L460-L496',
            },
          ],
        }),
        discovery.getContractDetails('TransitionDisputer'),
        discovery.getContractDetails('Registry'),
      ],
    },
    risks: [
      {
        category: 'Funds can be stolen if',
        text: 'the owner calls owner-only functions that pause the contract and drain funds.',
        isCritical: true,
      },
    ],
  },
  discoveryInfo: getDiscoveryInfo([discovery]),
}
