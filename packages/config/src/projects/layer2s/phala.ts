import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { subtractOne } from '../../common/assessCount'
import { underReviewL2 } from './templates/underReview'
import type { Layer2 } from './types'

export const phala: Layer2 = underReviewL2({
  id: 'phala',
  createdAt: new UnixTime(1734388655), // Dec-16-2024 10:37:35 PM UTC
  display: {
    name: 'Phala',
    slug: 'phala',
    description: `Phala is cloud computing protocol which aims at offering developers a secure and efficient platform for deploying and managing AI-ready applications in a trusted environment (TEE).
      Phala rollup on Ethereum leverages the Op-Succinct stack, a combination of OP stack contracts and Zero-Knowledge Proofs (ZK) using the SP1 zkVM.`,
    purposes: ['Universal'],
    category: 'ZK Rollup',
    provider: 'OP Stack',
    activityDataSource: 'Blockchain RPC',
    links: {
      websites: ['https://phala.network/'],
      apps: [],
      documentation: ['https://docs.phala.network/'],
      explorers: ['https://explorer.phala.network'],
      repositories: ['https://github.com/Phala-Network/'],
      socialMedia: [
        'https://x.com/PhalaNetwork',
        'https://discord.com/invite/phala-network',
        'https://t.me/phalanetwork',
        'https://phala.network/blog',
      ],
    },
  },
  rpcUrl: 'https://rpc.phala.network/',
  transactionApi: {
    type: 'rpc',
    startBlock: 1,
    defaultUrl: 'https://rpc.phala.network/',
    defaultCallsPerMinute: 1500,
    assessCount: subtractOne,
  },
  escrows: [
    {
      address: EthereumAddress('0x6A3444d11cA2697fe4A19AC8995ABDd8Dd301521'),
      sinceTimestamp: new UnixTime(1734388655),
      tokens: '*',
      chain: 'ethereum',
    },
    {
      address: EthereumAddress('0x96B124841Eff4Ab1b3C1F654D60402a1405fF51A'),
      sinceTimestamp: new UnixTime(1734388655),
      tokens: ['ETH'],
      chain: 'ethereum',
    }
  ],
})
