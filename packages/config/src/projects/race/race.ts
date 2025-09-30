import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { opStackL2 } from '../../templates/opStack'

const discovery = new ProjectDiscovery('race')

export const race: ScalingProject = opStackL2({
  ecosystemInfo: {
    id: ProjectId('superchain'),
    isPartOfSuperchain: true,
  },
  additionalPurposes: ['RWA'],
  discovery,
  addedAt: UnixTime(1726563843), // 2024-09-17T09:04:03Z
  genesisTimestamp: UnixTime(1720421591),
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.NO_PROOFS],
  isPartOfSuperchain: true,
  display: {
    name: 'Race Network',
    slug: 'race',
    description:
      'Race Network is a Layer-2 designed for the tokenization and distribution of real-world assets (RWA).',
    links: {
      websites: ['https://raceecosystem.com/'],
      bridges: [
        'https://bridge.race.foundation/',
        'https://raceecosystem.com/onboarding',
      ],
      documentation: ['https://raceecosystem.gitbook.io/docs'],
      explorers: ['https://racescan.io/'],
      repositories: ['https://github.com/RACE-Ecosystem/RACE-Chain'],
      socialMedia: [
        'https://x.com/RACEecosystem',
        'https://facebook.com/RACEecosystem/',
        'https://linkedin.com/company/raceecosystem',
      ],
    },
  },
  chainConfig: {
    name: 'race',
    chainId: 6805,
    apis: [
      {
        type: 'rpc',
        url: 'https://racemainnet.io',
        callsPerMinute: 300,
      },
    ],
  },
  isNodeAvailable: true,
})
