import { UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const surge: ScalingProject = upcomingL2({
  id: 'surge',
  capability: 'universal',
  hasTestnet: true,
  addedAt: UnixTime(1745423262), // 2025-04-23T17:47:35Z
  display: {
    name: 'Surge',
    slug: 'surge',
    description:
      "Surge is a based rollup showcasing the Nethermind client's Gigagas performance, built on the Taiko stack.",
    purposes: ['Universal'],
    links: {
      websites: ['https://surge.wtf/'],
      bridges: ['https://bridge.hoodi.surge.wtf/'],
      explorers: ['https://explorer.hoodi.surge.wtf'],
      documentation: ['https://docs.surge.wtf'],
      repositories: ['https://github.com/nethermindEth/surge'],
      socialMedia: ['https://x.com/NethermindEth'],
    },
  },
  proofSystem: {
    type: 'Validity',
  },
})
