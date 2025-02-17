import { UnixTime } from '@l2beat/shared-pure'

import { REASON_FOR_BEING_OTHER } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { orbitStackL3 } from '../layer2s/templates/orbitStack'

const discovery = new ProjectDiscovery('deri', 'arbitrum')

export const deri = orbitStackL3({
  addedAt: new UnixTime(1701958025), // 2023-12-07T14:07:05Z
  discovery,
  additionalBadges: [Badge.L3ParentChain.Arbitrum],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.CLOSED_PROOFS],
  display: {
    name: 'Deri',
    slug: 'deri',
    description:
      'Deri is an Ethereum Layer-3 that leverages Arbitrum Nitro to enable efficient cross-chain futures, options, and derivatives.',
    links: {
      websites: ['https://deri.io/'],
      documentation: ['https://docs.deri.io/'],
      explorers: ['https://explorer-dchain.deri.io/'],
      repositories: ['https://github.com/OffchainLabs/nitro'],
      socialMedia: [
        'https://twitter.com/DeriProtocol',
        'https://t.me/DeriProtocol',
        'https://discord.com/invite/kb8ZbYgp8M',
      ],
    },
  },
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  usesBlobs: true,
})
