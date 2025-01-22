import { UnixTime, formatSeconds } from '@l2beat/shared-pure'
import { DA_LAYERS } from '../../common'
import { REASON_FOR_BEING_OTHER } from '../../common/ReasonForBeingInOther'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { DACHALLENGES_DA_PROVIDER, opStackL2 } from './templates/opStack'
import type { Layer2 } from './types'

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
  additionalBadges: [
    Badge.DA.CustomDA,
    Badge.Infra.Superchain,
    Badge.RaaS.AltLayer,
  ],
  additionalPurposes: ['AI'],
  display: {
    reasonsForBeingOther: [
      REASON_FOR_BEING_OTHER.NO_PROOFS,
      REASON_FOR_BEING_OTHER.NO_DA_ORACLE,
    ],
    name: 'GM Network',
    slug: 'gmnetwork',
    architectureImage: 'opstack-dachallenge',
    description:
      'GM Network is an OP stack L2 in alt-DA mode aiming to deepen the integration of smart, connected devices within everyday human activities by blending Artificial Intelligence and the Internet of Things.',
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
  },
  daProvider: DACHALLENGES_DA_PROVIDER(
    daChallengeWindow,
    daResolveWindow,
    'https://github.com/ethereum-optimism/optimism/releases/tag/op-node%2Fv1.7.5',
    DA_LAYERS.OP_ALT_DA,
  ), // source: altlayer on telegram
  genesisTimestamp: new UnixTime(1717656409),
  rpcUrl: 'https://rpc.gmnetwork.ai/',
  discoveryDrivenData: true,
})
