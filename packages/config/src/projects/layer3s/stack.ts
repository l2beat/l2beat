import { ProjectId, UnixTime } from '@l2beat/shared-pure'

import { REASON_FOR_BEING_OTHER } from '../../common/ReasonForBeingInOther'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { opStackL3 } from '../layer2s/templates/opStack'
import { Layer3 } from './types'

const discovery = new ProjectDiscovery('stack', 'base')

export const stack: Layer3 = opStackL3({
  createdAt: new UnixTime(1710853988), // 2024-03-19T13:13:08Z
  discovery,
  additionalBadges: [
    Badge.DA.Celestia,
    Badge.L3ParentChain.Base,
    Badge.RaaS.Conduit,
  ],
  additionalPurposes: ['Social'],
  hostChain: ProjectId('base'),
  display: {
    reasonsForBeingOther: [
      REASON_FOR_BEING_OTHER.NO_PROOFS,
      REASON_FOR_BEING_OTHER.NO_DA_ORACLE,
    ],
    name: 'Stack',
    slug: 'stack',
    description:
      'Stack Chain is an Optimium settling on Base. It uses OP stack technology with Celestia for data availability. \
            Stack Chain is a blockchain for bringing points onchain, allowing brands to create and own their loyalty programs.',
    links: {
      websites: ['https://stack.so/'],
      apps: ['https://bridge.stack.so'],
      documentation: ['https://docs.stack.so'],
      explorers: ['https://explorer.stack.so'],
      repositories: ['https://github.com/stack-so/protocol-interfaces'],
      socialMedia: [
        'https://twitter.com/stackdotso',
        'https://t.me/+RVFamOmYBo42NzFh',
        'https://stack.mirror.xyz/',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  rpcUrl: 'https://rpc.stack.so',
  genesisTimestamp: new UnixTime(1709683711),
  isNodeAvailable: 'UnderReview',
  discoveryDrivenData: true,
})
