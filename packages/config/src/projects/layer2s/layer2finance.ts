import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { TECHNOLOGY, UNDER_REVIEW_RISK_VIEW } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'

const discovery = new ProjectDiscovery('layer2finance')

export const layer2finance: ScalingProject = {
  isArchived: true,
  type: 'layer2',
  id: ProjectId('layer2finance'),
  capability: 'universal',
  addedAt: UnixTime(1623153328), // 2021-06-08T11:55:28Z
  display: {
    name: 'ScalingProject.Finance',
    slug: 'layer2finance',
    warning:
      'Currently the TVS is calculated incorrectly, because it does not take assets locked in DeFi into account.',
    description:
      'ScalingProject.Finance aims to democratize access to DeFi protocols for everyone. Users can aggregate their DeFi usage and save on Ethereum fees.',
    purposes: ['Exchange'],
    category: 'Optimistic Rollup',
    links: {
      websites: ['https://layer2.finance/'],
      apps: ['https://app.l2.finance/'],
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
      [discovery.chain]: [
        discovery.getContractDetails('RollupChain', {
          references: [
            {
              title:
                'RollupChain.sol#L460-L496 - ScalingProject.Finance source code',
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
}
