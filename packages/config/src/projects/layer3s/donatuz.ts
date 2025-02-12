import { UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Layer3 } from '../../types'
import { Badge } from '../badges'
import { EIGENDA_DA_PROVIDER, opStackL3 } from '../layer2s/templates/opStack'

const discovery = new ProjectDiscovery('donatuz', 'base')

export const donatuz: Layer3 = opStackL3({
  addedAt: new UnixTime(1726497628), // 2024-09-16T14:40:28Z
  discovery,
  daProvider: EIGENDA_DA_PROVIDER,
  additionalBadges: [
    Badge.L3ParentChain.Base,
    Badge.DA.EigenDA,
    Badge.RaaS.Conduit,
  ],
  additionalPurposes: ['Social'],
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.NO_PROOFS,
    REASON_FOR_BEING_OTHER.NO_DA_ORACLE,
  ],
  display: {
    name: 'Donatuz',
    slug: 'donatuz',
    description:
      'Donatuz is a Layer-3 that aims at providing social media creators with innovative monetization tools to earn money from their content.',
    links: {
      websites: ['https://donatuz.org/'],
      apps: ['https://bridge.donatuz.com'],
      explorers: ['https://explorer.donatuz.com/'],
      repositories: ['https://github.com/Donatuz-Labs'],
      socialMedia: [
        'https://x.com/Donatuz_',
        'https://t.me/donatuzz',
        'https://linkedin.com/company/donatuz/',
      ],
    },
  },
  genesisTimestamp: new UnixTime(1719319433),
  rpcUrl: 'https://rpc.donatuz.com',
  isNodeAvailable: true,
})
