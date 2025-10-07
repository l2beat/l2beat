import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { DERIVATION, REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { opStackL2 } from '../../templates/opStack'

const discovery = new ProjectDiscovery('mint')

export const mint: ScalingProject = opStackL2({
  ecosystemInfo: {
    id: ProjectId('superchain'),
    isPartOfSuperchain: true,
  },
  addedAt: UnixTime(1715644800), // 2024-05-14T00:00:00Z
  discovery,
  additionalBadges: [BADGES.RaaS.Conduit],
  additionalPurposes: ['NFT'],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.CLOSED_PROOFS],
  isPartOfSuperchain: true,
  display: {
    name: 'Mint',
    slug: 'mint',
    description: 'Mint Blockchain is a Layer 2 network for NFTs.',
    links: {
      websites: ['https://mintchain.io/'],
      bridges: ['https://bridge.mintchain.io/', 'https://mintchain.io/faucet'],
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
    coingeckoPlatform: 'mint',
    multicallContracts: [
      {
        sinceBlock: 19861572,
        batchSize: 150,
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        version: '3',
      },
    ],
    sinceTimestamp: UnixTime.fromDate(new Date('2024-05-13T14:02:11Z')),
    apis: [
      { type: 'rpc', url: 'https://rpc.mintchain.io', callsPerMinute: 800 },
      { type: 'blockscout', url: 'https://explorer.mintchain.io/api' },
    ],
  },
  activityConfig: {
    type: 'block',
    startBlock: 1,
    adjustCount: { type: 'SubtractOne' },
  },
  isNodeAvailable: true,
  nodeSourceLink:
    'https://github.com/ethereum-optimism/optimism/tree/develop/op-node',
  stateDerivation: DERIVATION.OPSTACK('MINT'),
  genesisTimestamp: UnixTime(1715608931),
  milestones: [
    {
      title: 'Mainnet Launch',
      url: 'https://mirror.xyz/mintchain.eth/HYbutKDjAKkphS_3_93AFh93JGWDUKtrz1lH6NpUybM',
      date: '2024-05-14T00:00:00Z',
      description: 'Mint Mainnet is now live.',
      type: 'general',
    },
  ],
})
