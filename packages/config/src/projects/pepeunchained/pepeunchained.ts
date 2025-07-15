import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { CELESTIA_DA_PROVIDER, opStackL2 } from '../../templates/opStack'

const discovery = new ProjectDiscovery('pepeunchained')

export const pepeunchained: ScalingProject = opStackL2({
  addedAt: UnixTime(1739541812), // 2025-02-14T14:03:32Z
  archivedAt: UnixTime(1752134764), //2025-07-10
  daProvider: CELESTIA_DA_PROVIDER,
  celestiaDa: {
    sinceBlock: 21314461,
    namespace: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAADzZzvipmzP4=',
  },
  additionalBadges: [BADGES.RaaS.Conduit],
  discovery,
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.NO_PROOFS,
    REASON_FOR_BEING_OTHER.NO_DA_ORACLE,
  ],
  display: {
    name: 'Pepe Unchained',
    slug: 'pepeunchained',
    headerWarning:
      'The project migrated from an OP Stack to an [Orbit chain](https://l2beat.com/scaling/projects/pepe-unchained). See [announcement](https://mirror.xyz/0x5d229f641ccA8c85F356a29A2b5D12587a216Fd2/CJvQFPuEG1eUZ8rhZLnAd2d1i5wdxuxnE0mLRxeEBhs) for details.',
    description:
      'Pepe Unchained is an Optimium utilizing the OP Stack. It focuses on memes and provides a home for meme creators, traders, and communities to thrive.',
    links: {
      websites: ['https://pepeunchained.com/'],
      bridges: ['https://pepubridge.com/'],
      documentation: ['https://guide.pepeunchained.com/'],
      explorers: ['https://pepuscan.com'],
      socialMedia: ['https://x.com/pepe_unchained'],
    },
  },
  chainConfig: {
    name: 'pepeunchained',
    chainId: 3409,
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc-pepe-unchained-gupg0lo9wf.t.conduit.xyz',
        callsPerMinute: 1500,
      },
    ],
  },
  genesisTimestamp: UnixTime(1733132700),
  isNodeAvailable: true,
  nonTemplateEscrows: [
    {
      address: EthereumAddress('0x384e3ae4d5efc9471201039b555eae496b2a7240'),
      sinceTimestamp: UnixTime(1733132700),
      tokens: ['PEPU'],
      chain: 'ethereum',
    },
  ],
})
