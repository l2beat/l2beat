import { ChainSpecificAddress, UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ESPRESSO } from '../../common/sequencing'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { orbitStackL3 } from '../../templates/orbitStack'

const discovery = new ProjectDiscovery('rari')

export const rari: ScalingProject = orbitStackL3({
  addedAt: UnixTime(1706285474), // 2024-01-26T16:11:14Z
  additionalBadges: [BADGES.L3ParentChain.Arbitrum, BADGES.RaaS.Caldera],
  additionalPurposes: ['NFT'],
  hostChain: 'arbitrum',
  discovery,
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.CLOSED_PROOFS],
  display: {
    name: 'RARI Chain',
    slug: 'rari',
    description:
      'RARI Chain embeds royalties on the node level to guarantee royalty payments. A secure, low-cost, decentralized Ethereum L3 blockchain powered by Arbitrum.',
    links: {
      websites: ['https://rarichain.org/'],
      bridges: [
        'https://bridge.arbitrum.io/?destinationChain=rari-mainnet&sourceChain=arbitrum-one',
      ],
      documentation: ['https://rari.docs.caldera.dev/'],
      explorers: ['https://mainnet.explorer.rarichain.org/'],
      repositories: ['https://github.com/OffchainLabs/nitro'],
      socialMedia: ['https://twitter.com/RariChain'],
    },
  },
  celestiaDa: {
    sinceBlock: 0, // Edge Case: config added @ DA Module start  },
    namespace: 'AAAAAAAAAAAAAAAAAAAAAAAAAMod4SqHjry4i0U=',
  },
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      includeInTotal: false,
      address: ChainSpecificAddress(
        'arb1:0x46406c88285AD9BE2fB23D9aD96Cb578d824cAb6',
      ),
      tokens: '*',
      description:
        'Main entry point for users depositing ERC20 tokens. Upon depositing, on L2 a generic, "wrapped" token will be minted.',
    }),
    discovery.getEscrowDetails({
      includeInTotal: false,
      address: ChainSpecificAddress(
        'arb1:0x8bE956aB42274056ef4471BEb211b33e258b7324',
      ),
      tokens: '*',
      description:
        'Main entry point for users depositing ERC20 tokens that require minting custom token on L2.',
    }),
  ],
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  chainConfig: {
    name: 'rari',
    chainId: 1380012617,
    explorerUrl: 'https://mainnet.explorer.rarichain.org',
    sinceTimestamp: UnixTime(1705716145),
    apis: [
      {
        type: 'rpc',
        url: 'https://mainnet.rpc.rarichain.org/http',
        callsPerMinute: 1500,
      },
      { type: 'blockscout', url: 'https://rari.calderaexplorer.xyz/api' },
      { type: 'blockscoutV2', url: 'https://rari.calderaexplorer.xyz/api/v2' },
    ],
  },
  nonTemplateTechnology: {
    sequencing: ESPRESSO,
  },
  milestones: [
    {
      title: 'RARI Chain Mainnet Launch',
      url: 'https://x.com/RariChain/status/1750157295466824066',
      date: '2024-01-24T00:00:00.00Z',
      description: 'RARI Chain launches on Arbitrum One.',
      type: 'general',
    },
    {
      title: 'RARI integrates Celestia Blobstream',
      url: 'https://x.com/RariChain/status/1871209215324496336',
      date: '2024-12-19T00:00:00.00Z',
      description:
        'RARI is the first chain to integrate Celestia Blobstream DA bridge.',
      type: 'general',
    },
    {
      title: 'RARI integrates Espresso sequencer',
      url: 'https://x.com/EspressoSys/status/1884970716199895376',
      date: '2025-01-30T00:00:00.00Z',
      description:
        'RARI is the first chain to integrate Espresso TEE sequencer.',
      type: 'general',
    },
    {
      title: 'RARI disables proof system',
      url: 'https://app.blocksec.com/explorer/tx/arbitrum/0x4eacd17837407047b65635abdfb9d2693b58efa4040f33baca7b9d27271b0a2c?line=36',
      date: '2025-05-05T00:00:00.00Z',
      description:
        'Proof system and reference to Blobstream are disabled due to an incompatibility with Pectra.',
      type: 'incident',
    },
    {
      title: 'RARI re-enables proof system',
      url: 'https://app.blocksec.com/explorer/tx/arbitrum/0x1ff1a74aaa6a58e0a3389de2761ed84c9051a4ffea080265aae0d62aaf9df75c?line=36',
      date: '2025-05-20T00:00:00.00Z',
      description:
        'The proof system and blobstream reference are fully re-enabled.',
      type: 'general',
    },
  ],
})
