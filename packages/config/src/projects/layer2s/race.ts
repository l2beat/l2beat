import { UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { opStackL2 } from './templates/opStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('race')

export const race: Layer2 = opStackL2({
  additionalPurposes: ['RWA'],
  discovery,
  createdAt: new UnixTime(1726563843), // 2024-09-17T09:04:03Z
  genesisTimestamp: new UnixTime(1720421591),
  additionalBadges: [Badge.Infra.Superchain],
  display: {
    name: 'Race Network',
    slug: 'race',
    description:
      'Race Network is a Layer-2 designed for the tokenization and distribution of real-world assets (RWA).',
    category: 'Optimistic Rollup',
    links: {
      websites: ['https://raceecosystem.com/'],
      apps: [
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
    activityDataSource: 'Blockchain RPC',
  },
  rpcUrl: 'https://racemainnet.io',
  isNodeAvailable: true,
  discoveryDrivenData: true,
})
