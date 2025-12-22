import { ChainSpecificAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { DA_LAYERS, REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ZK_PROGRAM_HASHES } from '../../common/zkProgramHashes'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { EIGENDA_DA_PROVIDER, opStackL2 } from '../../templates/opStack'

const discovery = new ProjectDiscovery('megaeth')

export const megaeth: ScalingProject = opStackL2({
  addedAt: UnixTime(1764143601),
  discovery,
  daProvider: EIGENDA_DA_PROVIDER(false, DA_LAYERS.ETH_BLOBS),
  additionalBadges: [BADGES.Stack.OPKailua],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.NO_DA_ORACLE],
  nonTemplateProofSystem: {
    type: 'Optimistic',
    name: 'OP Kailua',
    zkCatalogId: ProjectId('risc0'),
    challengeProtocol: 'Single-step',
  },
  nonTemplateZkProgramHashes: [
    ZK_PROGRAM_HASHES(
      discovery.getContractValue<string>('KailuaTreasury', 'FPVM_IMAGE_ID'),
    ),
  ],
  display: {
    name: 'MegaETH',
    slug: 'megaeth',
    description:
      'MegaETH is a real-time blockchain based on the OP Stack architecture and the hybrid Kailua proof system, targeting sub-millisecond latency and over 100,000 transactions per second.',
    links: {
      websites: ['https://megaeth.com/'],
      bridges: ['https://predeposit.megaeth.com/'],
      documentation: ['https://docs.megaeth.com/'],
      explorers: ['https://megaexplorer.xyz/'],
      repositories: ['https://github.com/megaeth-labs'],
      socialMedia: [
        'https://x.com/megaeth',
        'https://discord.com/invite/megaeth',
        'https://t.me/megaeth_labs',
        'https://megaeth.com/blog-news',
      ],
    },
  },
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: ChainSpecificAddress(
        'eth:0x46D6Eba3AECD215a3e703cdA963820d4520b45D6',
      ),
      tokens: ['USDC'],
      description:
        'Predeposit escrow for USDC that can only be deposited to after passing KYC and only be withdrawn to a single address.',
    }),
    discovery.getEscrowDetails({
      address: ChainSpecificAddress(
        'eth:0xCB264DEf50D166d4aE7cF60188eC0038819fb719',
      ),
      tokens: ['USDC'],
      description: "Multisig currently designated as the 'Treasury'.",
    }),
  ],
  genesisTimestamp: UnixTime(1762797011),
  isNodeAvailable: 'UnderReview',
  chainConfig: {
    name: 'megaeth',
    chainId: 4326,
    explorerUrl: 'https://megaexplorer.xyz',
    sinceTimestamp: UnixTime(1762797011),
    apis: [
      {
        type: 'rpc',
        url: 'https://alpha.megaeth.com/rpc',
        callsPerMinute: 300,
      },
      { type: 'blockscout', url: 'https://megaeth.blockscout.com/api' },
    ],
  },
})
