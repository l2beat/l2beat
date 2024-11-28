import { UnixTime, formatSeconds } from '@l2beat/shared-pure'

import { DA_LAYERS } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { DACHALLENGES_DA_PROVIDER, opStackL2 } from './templates/opStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('redstone')

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

export const redstone: Layer2 = opStackL2({
  createdAt: new UnixTime(1714996778), // 2024-05-06T11:59:38Z
  discovery,
  badges: [Badge.DA.CustomDA, Badge.Infra.Superchain],
  additionalPurposes: ['Gaming'],
  display: {
    name: 'Redstone',
    slug: 'redstone',
    architectureImage: 'opstack-dachallenge',
    description:
      "Redstone is a chain built for onchain games and autonomous worlds running MUD. It's an implementation of OP Plasma with DA challenges.",
    links: {
      websites: ['https://redstone.xyz/'],
      apps: ['https://redstone.xyz/deposit'],
      documentation: ['https://redstone.xyz/docs'],
      explorers: ['https://explorer.redstone.xyz/'],
      repositories: ['https://github.com/latticexyz/redstone'],
      socialMedia: [
        'https://twitter.com/redstonexyz',
        'https://discord.com/invite/latticexyz',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  daProvider: DACHALLENGES_DA_PROVIDER(
    daChallengeWindow,
    daResolveWindow,
    'https://github.com/latticexyz/redstone',
    DA_LAYERS.REDSTONE_DA,
  ),
  discoveryDrivenData: true,
  genesisTimestamp: new UnixTime(1712192291),
  isNodeAvailable: 'UnderReview',
  rpcUrl: 'https://rpc.redstonechain.com',
})
