import { UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { opStackL3 } from '../../templates/opStack'

const discovery = new ProjectDiscovery('stack')

export const stack: ScalingProject = opStackL3({
  addedAt: UnixTime(1710853988), // 2024-03-19T13:13:08Z
  archivedAt: UnixTime(1744629590), // 2025-04-14T11:20:00.000Z
  hostChain: 'base',
  discovery,
  additionalBadges: [
    BADGES.DA.Celestia,
    BADGES.L3ParentChain.Base,
    BADGES.RaaS.Conduit,
  ],
  additionalPurposes: ['Social'],
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.NO_PROOFS,
    REASON_FOR_BEING_OTHER.NO_DA_ORACLE,
  ],
  display: {
    name: 'Stack',
    slug: 'stack',
    description:
      'Stack Chain is an Optimium settling on Base. It uses OP stack technology with Celestia for data availability. \
            Stack Chain is a blockchain for bringing points onchain, allowing brands to create and own their loyalty programs.',
    links: {
      websites: ['https://stack.so/'],
      bridges: ['https://bridge.stack.so'],
      documentation: ['https://docs.stack.so'],
      explorers: ['https://explorer.stack.so'],
      repositories: ['https://github.com/stack-so/protocol-interfaces'],
      socialMedia: [
        'https://twitter.com/stackdotso',
        'https://t.me/+RVFamOmYBo42NzFh',
        'https://stack.mirror.xyz/',
      ],
    },
  },
  chainConfig: {
    name: 'stack',
    chainId: 78225,
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.stack.so',
        callsPerMinute: 1500,
      },
    ],
  },
  genesisTimestamp: UnixTime(1709683711),
  celestiaDa: {
    sinceBlock: 0, // Edge Case: config added @ DA Module start
    namespace: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAADtb2kYRqm8M=',
  },
  isNodeAvailable: 'UnderReview',
})
