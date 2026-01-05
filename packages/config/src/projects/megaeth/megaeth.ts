import { ChainSpecificAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { formatEther } from 'ethers/lib/utils'
import { DA_LAYERS } from '../../common'
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
  stateValidationImage: 'megaeth',
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
  // override while node is unverified
  nonTemplateRiskView: {
    stateValidation: {
      value: 'Fraud proofs (1R, ZK)',
      description:
        'Fraud proofs allow actors watching the chain to prove that the state is incorrect. Single round proofs (1R) prove the validity of a state proposal, only requiring a single transaction to resolve. A fault proof eliminates a state proposal by proving that any intermediate state transition in the proposal results in a different state root. For either, a ZK proof is used. Since the node source is not available, challengers cannot watch the chain independently.',
      sentiment: 'bad',
      executionDelay: discovery.getContractValue<number>(
        'OptimismPortal2',
        'disputeGameFinalityDelaySeconds',
      ),
      challengeDelay: discovery.getContractValue<number>(
        'KailuaGame',
        'MAX_CLOCK_DURATION',
      ),
      initialBond: formatEther(
        discovery.getContractValue<number>(
          'KailuaTreasury',
          'participationBond',
        ),
      ),
      orderHint: Number.NEGATIVE_INFINITY,
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
  isNodeAvailable: 'UnderReview', // this is important because challenging is permissionless, but impossible without a node
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
