import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { opStackL2 } from '../../templates/opStack'

const discovery = new ProjectDiscovery('karak')

export const karak: ScalingProject = opStackL2({
  addedAt: UnixTime(1687459278), // 2023-06-22T18:41:18Z
  archivedAt: UnixTime(1789568562), // 2026-09-16T14:22:42Z
  additionalBadges: [BADGES.RaaS.Caldera],
  discovery,
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.NO_PROOFS,
    REASON_FOR_BEING_OTHER.NO_DA_ORACLE,
  ],
  display: {
    name: 'K2',
    aliases: ['Karak', 'OpenGDP'],
    slug: 'k2',
    description:
      'K2 is a general-purpose L2, which rebranded to the OpenGDP Network to soon become an asset tokenization-focused L1.',
    headerWarning:
      'K2 has been shut down. On 2026-09-15 the OptimismPortal and L1StandardBridge were replaced with claim-only contracts: escrowed ETH and ERC20s can only be claimed on L1 with a Merkle proof against roots set by the KarakMultisig, which can recover all remaining funds after 2027-09-12. No claim interface or Merkle tree has been published. The only public notice is a [Discord announcement from November 2025](https://farcaster.xyz/pranjal/0x030bd1ba) asking users to unstake and bridge out by 2025-12-31.',
    links: {
      websites: ['https://karak.network/'],
      bridges: ['https://k2bridge.karak.network/'],
      documentation: [
        'https://docs.opengdp.network/get-started/introduction/start-here',
      ],
      explorers: ['https://explorer.karak.network/'],
      socialMedia: [
        'https://twitter.com/Karak_Network',
        'https://t.me/Karak_Network',
        'https://discord.com/invite/opengdp',
      ],
    },
  },
  chainConfig: {
    name: 'karak',
    chainId: 2410,
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.karak.network/',
        callsPerMinute: 300,
      },
    ],
    untilTimestamp: UnixTime(1789435379), // 2026-09-15T01:22:59Z, last batch posted
  },
  genesisTimestamp: UnixTime(1703226695), //First sequencer transaction
  daTracking: [
    {
      type: 'celestia',
      daLayer: ProjectId('celestia'),
      sinceBlock: 0, // Edge Case: config added @ DA Module start
      namespace: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJBA=',
    },
  ],
  isNodeAvailable: true,
  milestones: [
    {
      title: 'K2 shut down, bridge switched to claim-only',
      url: 'https://etherscan.io/tx/0x59515cbe7245d0856751523549d7b4524beb5f31930b2bc7bc3016b8071e65fd',
      date: '2026-09-15T00:00:00Z',
      description:
        'Batch posting stopped; bridge contracts only allow Merkle-proof claims of escrowed funds.',
      type: 'incident',
    },
    {
      title: 'Karak rebrands to OpenGDP',
      url: 'https://x.com/OpenGDP/status/1990437951529226293',
      date: '2025-11-17T00:00:00Z',
      description: 'Karak rebrands to OpenGDP.',
      type: 'general',
    },
    {
      title: 'K2 Network Early Access Launch',
      url: 'https://x.com/Karak_Network/status/1762561646999068899?s=20',
      date: '2024-02-27T00:00:00Z',
      description: 'K2 Network is live on mainnet.',
      type: 'general',
    },
  ],
})
