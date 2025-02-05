import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Layer2 } from '../../types'
import { Badge } from '../badges'
import { opStackL2 } from './templates/opStack'

const discovery = new ProjectDiscovery('mint')

export const mint: Layer2 = opStackL2({
  addedAt: new UnixTime(1695904849), // 2023-09-28T12:40:49Z
  discovery,
  additionalBadges: [Badge.RaaS.Conduit],
  additionalPurposes: ['NFT'],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.NO_PROOFS],
  display: {
    name: 'Mint',
    slug: 'mint',
    description: 'Mint Blockchain is a Layer 2 network for NFTs.',
    links: {
      websites: ['https://mintchain.io/'],
      apps: ['https://bridge.mintchain.io/', 'https://mintchain.io/faucet'],
      documentation: ['https://docs.mintchain.io/'],
      explorers: ['https://explorer.mintchain.io'],
      repositories: ['https://github.com/Mint-Blockchain'],
      socialMedia: [
        'https://twitter.com/Mint_Blockchain',
        'https://discord.gg/mint-blockchain',
        'https://t.me/MintBlockchain',
        'https://mirror.xyz/mintchain.eth',
        'https://community.mintchain.io',
      ],
    },
  },
  chainConfig: {
    name: 'mint',
    chainId: 185,
    explorerUrl: 'https://explorer.mintchain.io',
    explorerApi: {
      url: 'https://explorer.mintchain.io/api',
      type: 'blockscout',
    },
    multicallContracts: [
      {
        sinceBlock: 19861572,
        batchSize: 150,
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        version: '3',
      },
    ],
    minTimestampForTvl: UnixTime.fromDate(new Date('2024-05-13T14:02:11Z')),
  },
  transactionApi: {
    type: 'rpc',
    defaultUrl: 'https://rpc.mintchain.io',
    startBlock: 1,
    defaultCallsPerMinute: 800,
    adjustCount: { type: 'SubtractOne' },
  },
  isNodeAvailable: true,
  genesisTimestamp: new UnixTime(1715608931),
  milestones: [
    {
      title: 'Mint Mainnet Launch',
      url: 'https://mirror.xyz/mintchain.eth/HYbutKDjAKkphS_3_93AFh93JGWDUKtrz1lH6NpUybM',
      date: '2024-05-14T00:00:00Z',
      description: 'Mint Mainnet is now live.',
      type: 'general',
    },
  ],
})
