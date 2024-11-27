import { UnixTime, formatSeconds } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { DACHALLENGES_DA_PROVIDER, opStackL2 } from './templates/opStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('xterio')

const daChallengeWindow = formatSeconds(
  discovery.getContractValue<number>(
    'DataAvailabilityChallenge',
    'challengeWindow',
  ) * 12, // in blocks, to seconds
)

const daResolveWindow = formatSeconds(
  discovery.getContractValue<number>(
    'DataAvailabilityChallenge',
    'resolveWindow',
  ) * 12, // in blocks, to seconds
)

export const xterio: Layer2 = opStackL2({
  createdAt: new UnixTime(1714996778), // 2024-05-06T11:59:38Z
  discovery,
  badges: [Badge.DA.CustomDA, Badge.RaaS.AltLayer],
  additionalPurposes: ['Gaming'],
  display: {
    architectureImage: 'opstack-dachallenge',
    name: 'Xterio Chain',
    slug: 'xterio',
    description:
      'Xterio Chain is an OP stack Optimium on Ethereum. The chain focuses on gaming, high performance and low fees .',
    links: {
      websites: ['https://xter.io/'],
      apps: ['https://xter.io/', 'https://eth-bridge.xter.io/'],
      documentation: ['https://stack.optimism.io/'],
      explorers: ['https://eth.xterscan.io/'],
      repositories: ['https://github.com/XterioTech'],
      socialMedia: [
        'https://x.com/XterioGames',
        'https://discord.gg/xterio',
        'https://medium.com/@XterioGames',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  isNodeAvailable: 'UnderReview',
  daProvider: DACHALLENGES_DA_PROVIDER(daChallengeWindow, daResolveWindow),
  discoveryDrivenData: true,
  genesisTimestamp: new UnixTime(1716537433),
  rpcUrl: 'https://xterio-eth.alt.technology/',
})
