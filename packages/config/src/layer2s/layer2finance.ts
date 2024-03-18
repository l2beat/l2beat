import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { TECHNOLOGY, UNDER_REVIEW_RISK_VIEW } from '../common'
import { Layer2 } from './types'

export const layer2finance: Layer2 = {
  isArchived: true,
  type: 'layer2',
  id: ProjectId('layer2finance'),
  display: {
    name: 'Layer2.Finance',
    slug: 'layer2finance',
    warning:
      'Currently the TVL is calculated incorrectly, because it does not take assets locked in DeFi into account.',
    description:
      'Layer2.Finance aims to democratize access to DeFi protocols for everyone. Users can aggregate their DeFi usage and save on Ethereum fees.',
    purposes: ['DeFi'],
    category: 'Optimistic Rollup',

    links: {
      websites: ['https://layer2.finance/'],
      apps: ['https://app.l2.finance/'],
      documentation: ['https://docs.l2.finance/'],
      explorers: [],
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
        sinceTimestamp: new UnixTime(1619011215),
        tokens: ['BUSD', 'DAI', 'USDC', 'USDT', 'WETH'],
      },
    ],
  },
  riskView: UNDER_REVIEW_RISK_VIEW,
  stage: {
    stage: 'UnderReview',
  },
  technology: TECHNOLOGY.UNDER_REVIEW,
  contracts: {
    isUnderReview: true,
    addresses: [
      {
        name: 'RollupChain',
        address: EthereumAddress('0xf86FD6735f88d5b6aa709B357AD5Be22CEDf1A05'),
      },
      {
        name: 'TransitionDisputer',
        address: EthereumAddress('0x5D3c0F4cA5EE99f8E8F59Ff9A5fAb04F6a7e007f'),
      },
      {
        name: 'Registry',
        address: EthereumAddress('0xFe81ab6930A30BdaE731fe7b6C6ABFbEAFc014a8'),
      },
    ],
    risks: [
      {
        category: 'Funds can be stolen if',
        text: 'the owner calls owner-only functions that pause the contract and drain funds.',
        isCritical: true,
      },
    ],
    references: [
      {
        text: 'RollupChain.sol#L460-L496 - Layer2.Finance source code',
        href: 'https://github.com/celer-network/layer2-finance-contracts/blob/61ed0f17a15e8ba06778776ade1a82956a9de842/contracts/RollupChain.sol#L460-L496',
      },
    ],
  },
}
