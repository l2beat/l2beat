import { UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Layer2 } from '../../types'
import { opStackL2 } from './templates/opStack'

const discovery = new ProjectDiscovery('thebinaryholdings')

export const thebinaryholdings: Layer2 = opStackL2({
  addedAt: new UnixTime(1726668186), // 2024-09-18T14:03:06Z
  discovery,
  associatedTokens: ['BNRY'],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.NO_PROOFS],
  isArchived: true, // operator inactive, might still be pre official launch
  display: {
    name: 'The Binary Holdings',
    slug: 'thebinaryholdings',
    shortName: 'Binary',
    redWarning:
      'Critical contracts can be upgraded by an EOA which could result in the loss of all funds.',
    description:
      'The Binary Holdings is a web3 infrastructure that integrates into telecommunication and banking apps to increase user engagement, retention, and ARPU (Average Revenue Per User) - while rewarding users for their engagement. It uses its own token (BNRY) for gas.',
    links: {
      websites: ['https://thebinaryholdings.com/'],
      documentation: ['https://docs.thebinaryholdings.com/'],
      explorers: ['https://explorer.thebinaryholdings.com'],
      socialMedia: [
        'https://twitter.com/thebinaryhldgs',
        'https://t.me/tbhofficialchat',
        'https://discord.gg/wCXJmTBGr2',
      ],
    },
  },
  rpcUrl: 'https://rpc.zero.thebinaryholdings.com',
  genesisTimestamp: new UnixTime(1719397465),
  finality: {
    type: 'OPStack',
    genesisTimestamp: new UnixTime(1719397463),
    minTimestamp: new UnixTime(1719397465),
    l2BlockTimeSeconds: 2,
    lag: 0,
    stateUpdate: 'analyze',
  },
  isNodeAvailable: 'UnderReview',
  milestones: [],
  nonTemplateOptimismPortalEscrowTokens: ['BNRY'],
})
