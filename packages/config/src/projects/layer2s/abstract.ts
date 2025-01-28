import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import type { Layer2 } from './types'
import { underReviewL2 } from './templates/underReview'

const genesisTimestamp = new UnixTime(1729881083),

export const abstract: Layer2 = underReviewL2({
  id: 'abstract',
  createdAt: new UnixTime(1724863689), // 2024-08-28T16:48:09Z
  display: {
    name: 'Abstract',
    slug: 'abstract',
    description:
      'Abstract is a ZK Rollup built on top of Ethereum using the ZK stack, designed to securely power consumer-facing blockchain applications at scale with low fees and fast transaction speeds.',
    purposes: ['Universal'],
    category: 'ZK Rollup',
    provider: 'ZK Stack',
    links: {
      websites: ['https://abs.xyz/'],
      apps: ['https://jumper.exchange/?toChain=2741&toToken=0x0000000000000000000000000000000000000000'],
      documentation: ['https://docs.abs.xyz/'],
      explorers: ['https://abscan.org/'],
      repositories: [],
      socialMedia: [
        'https://x.com/abstractchain',
        'https://discord.com/invite/abstractchain',
        'https://x.com/Abstract_Eco',
        'https://t.me/abstract_chain',
      ],
    },
  },
  rpcUrl: 'https://api.mainnet.abs.xyz',
  chainConfig: {
      name: 'abstract',
      chainId: 2741,
      explorerUrl: 'https://abscan.org/',
      explorerApi: {
        url: 'https://api.abscan.org/api',
        type: 'etherscan',
      },
      minTimestampForTvl: genesisTimestamp,
    },
})
