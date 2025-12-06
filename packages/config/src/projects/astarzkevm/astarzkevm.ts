import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { agglayer } from '../../templates/agglayer'

const discovery = new ProjectDiscovery('astarzkevm')
const bridge = discovery.getContract('AgglayerBridge')

export const astarzkevm: ScalingProject = agglayer({
  addedAt: UnixTime(1690815262), // 2023-07-31T14:54:22Z
  archivedAt: UnixTime(1743465600), // 2025-04-01T00:00:00.000Z,
  additionalBadges: [BADGES.DA.DAC, BADGES.RaaS.Gelato],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.SMALL_DAC],
  display: {
    name: 'Astar zkEVM',
    slug: 'astarzkevm',
    description:
      "Astar zkEVM is a Validium that leverages Polygon's CDK and zero-knowledge cryptography to enable off-chain transactions while maintaining EVM equivalence.",
    links: {
      websites: ['https://astar.network/blog/astar-evolution-phase-1-56'],
      documentation: ['https://docs.astar.network/docs/learn/zkEVM/'],
      explorers: ['https://astar-zkevm.explorer.startale.com/'],
      repositories: ['https://github.com/AstarNetwork'],
      socialMedia: [
        'https://twitter.com/AstarNetwork',
        'https://discord.com/invite/astarnetwork',
        'https://youtube.com/@AstarNetwork',
        'https://t.me/PlasmOfficial',
      ],
    },
  },
  chainConfig: {
    name: 'astarzkevm',
    chainId: 3776,
    explorerUrl: 'https://astar-zkevm.explorer.startale.com',
    sinceTimestamp: UnixTime(1708632059),
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 183817,
        version: '3',
      },
    ],
    apis: [
      /* No RPC, project archived */
    ],
  },
  discovery,
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: bridge.address,
      tokens: '*',
      sharedEscrow: {
        type: 'AggLayer',
        nativeAsset: 'etherPreminted',
        premintedAmount: '340282366920938463463374607431768211455',
      },
    }),
  ],
  milestones: [
    {
      title: 'Astar zkEVM sunsets',
      url: 'https://x.com/AstarNetwork/status/1906658995538194650',
      date: '2025-03-31',
      description: 'Astar Network has officially sunset.',
      type: 'general',
    },
    {
      title: 'Astar zkEVM Launch',
      url: 'https://astar.network/blog/astars-zkevm-mainnet-is-live-86096',
      date: '2024-03-06',
      description:
        'Astar Network launched Astar zkEVM, integrated with Polygon Agglayer.',
      type: 'general',
    },
  ],
})
