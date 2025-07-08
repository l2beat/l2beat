import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { BADGES } from '../../common/badges'
import type { ScalingProject } from '../../internalTypes'
import { underReviewL2 } from '../../templates/underReview'

export const pandasea: ScalingProject = underReviewL2({
  id: 'pandasea',
  capability: 'universal',
  addedAt: UnixTime(1729797861), // 2024-10-24T21:24:21Z
  archivedAt: UnixTime(1741651200), // 2025-03-11T00:00:00.000Z,
  badges: [BADGES.Stack.OPStack, BADGES.VM.EVM, BADGES.RaaS.Zeeve],
  display: {
    name: 'PandaSea',
    slug: 'pandasea',
    description:
      'PandaSea.io is a Layer 2 Web3 platform focused on integrating social finance and sports engagement.',
    purposes: ['Universal'],
    category: 'Optimistic Rollup',
    stacks: ['OP Stack'],
    links: {
      websites: ['https://pandasea.io/'],
      explorers: ['https://pandaseascan.com/'],
      bridges: ['https://bridge.pandasea.io/'],
    },
  },
  ecosystemInfo: {
    id: ProjectId('superchain'),
  },
  chainConfig: {
    name: 'pandasea',
    chainId: 7776,
    apis: [
      { type: 'rpc', url: 'https://rpc1.pandasea.io', callsPerMinute: 1500 },
    ],
  },
  activityConfig: {
    type: 'block',
    adjustCount: { type: 'SubtractOne' },
    startBlock: 1,
  },
}) //no escrow (0xfd84a81e4419af02DFBE0A19cB8B2802C44E0368) since gas token is not on CG
