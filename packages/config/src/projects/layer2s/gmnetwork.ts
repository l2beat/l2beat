import { UnixTime, formatSeconds } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { DACHALLENGES_DA_PROVIDER, opStackL2 } from './templates/opStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('gmnetwork')

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

export const gmnetwork: Layer2 = opStackL2({
  createdAt: new UnixTime(1732028588), // 2024-11-19T15:03:08
  discovery,
  badges: [Badge.DA.CustomDA, Badge.Infra.Superchain, Badge.RaaS.AltLayer],
  additionalPurposes: ['AI'],
  display: {
    name: 'GM Network',
    slug: 'gmnetwork',
    architectureImage: 'opstack-dachallenge',
    description:
      'GM Network is an OP stack L2 in alt-DA mode aiming to to deepen the integration of smart, connected devices within everyday human activities by blending Artificial Intelligence and the Internet of Things.',
    links: {
      websites: ['https://gmnetwork.ai/'],
      apps: ['https://bridge.gmnetwork.ai/'],
      documentation: ['https://docs.gmnetwork.ai/docs'],
      explorers: ['https://scan.gmnetwork.ai/'],
      repositories: [],
      socialMedia: [
        'https://x.com/gmnetwork_ai',
        'https://instagram.com/gmnetwork.ai',
        'https://medium.com/@gmnetwork',
        'https://youtube.com/@gmnetwork_ai',
        'https://discord.com/invite/m4VF9WqzK8',
        'https://t.me/GMNetwork_AI',
        'https://t.me/QuestN_Announcement',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  daProvider: DACHALLENGES_DA_PROVIDER(daChallengeWindow, daResolveWindow),
  genesisTimestamp: new UnixTime(1717656409),
  rpcUrl: 'https://rpc.gmnetwork.ai/',
  discoveryDrivenData: true,
})
