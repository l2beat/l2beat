import { UnixTime, formatSeconds } from '@l2beat/shared-pure'

import { DA_BRIDGES, DA_LAYERS } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { opStackL2 } from './templates/opStack'
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
  daProvider: {
    layer: DA_LAYERS.EXTERNAL,
    riskView: {
      value: 'External',
      description:
        'Proof construction and state derivation rely on data that is NOT published onchain. GM Network uses a custom data availability provider without attestations, relying on DA challenges.',
      sentiment: 'bad',
    },
    technology: {
      name: 'Data required to compute fraud proof is published offchain without onchain attestations',
      description: `GM Network relies on DA challenges for data availability. If a DA challenger finds that the data behind a tx data commitment is not available, they can submit a challenge which requires locking a bond within ${daChallengeWindow}. A challenge can be resolved by publishing the preimage data within an additional ${daResolveWindow}. In such case, a portion of the challenger bond is burned, with the exact amount estimated as the cost incurred by the resolver to publish the full data, meaning that the resolver and challenger will approximately lose the same amount of funds. The system is not secure if the malicious sequencer is able to outspend the altruistic challengers. If instead, after a challenge, the preimage data is not published, the chain reorgs to the last fully derivable state.`,
      references: [
        {
          text: 'OP stack specification: alt-DA',
          href: 'https://specs.optimism.io/experimental/alt-da.html',
        },
        {
          text: 'Universal Plasma and DA Challenges - Ethresear.ch',
          href: 'https://ethresear.ch/t/universal-plasma-and-da-challenges/18629',
        },
      ],
      risks: [
        {
          category: 'Funds can be stolen if',
          text: 'the sequencer is malicious and is able to economically outspend the altruistic challengers.',
        },
        {
          category: 'Funds can be stolen if',
          text: 'there is no challenger willing to challenge unavailable data commitments.',
        },
      ],
    },
    bridge: DA_BRIDGES.NONE_WITH_DA_CHALLENGES,
  },
  genesisTimestamp: new UnixTime(1717656409),
  rpcUrl: 'https://rpc.gmnetwork.ai/',
  discoveryDrivenData: true,
})
