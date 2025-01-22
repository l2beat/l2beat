import { EthereumAddress, UnixTime, formatSeconds } from '@l2beat/shared-pure'
import { DA_LAYERS } from '../../common'
import { REASON_FOR_BEING_OTHER } from '../../common/ReasonForBeingInOther'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { DACHALLENGES_DA_PROVIDER, opStackL2 } from './templates/opStack'
import type { Layer2 } from './types'

const discovery = new ProjectDiscovery('cyber')

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

export const cyber: Layer2 = opStackL2({
  createdAt: new UnixTime(1713364684), // 2024-04-17T14:38:04Z
  associatedTokens: ['CYBER'],
  discovery,
  additionalBadges: [
    Badge.DA.CustomDA,
    Badge.Infra.Superchain,
    Badge.RaaS.AltLayer,
  ],
  additionalPurposes: ['Social'],
  display: {
    reasonsForBeingOther: [
      REASON_FOR_BEING_OTHER.NO_PROOFS,
      REASON_FOR_BEING_OTHER.NO_DA_ORACLE,
    ],
    name: 'Cyber',
    slug: 'cyber',
    architectureImage: 'opstack-dachallenge',
    description:
      'Cyber is a chain designed for social applications using an implementation of OP Plasma with DA challenges.',
    links: {
      websites: ['https://cyber.co/'],
      apps: [
        'https://cyber-bridge.alt.technology/',
        'https://cyber.co/stake',
        'https://wallet.cyber.co/',
      ],
      documentation: ['https://docs.cyber.co/'],
      explorers: ['https://cyberscan.co/', 'https://7560.routescan.io/'],
      repositories: ['https://github.com/cyberconnecthq'],
      socialMedia: [
        'https://twitter.com/cyberconnecthq',
        'https://discord.com/invite/cUc8VRGmPs',
        'https://cyber.co/blog',
      ],
    },
  },
  daProvider: DACHALLENGES_DA_PROVIDER(
    daChallengeWindow,
    daResolveWindow,
    'https://github.com/ethereum-optimism/optimism/releases/tag/v1.9.4',
    DA_LAYERS.OP_ALT_DA,
  ), // source: altlayer on telegram
  chainConfig: {
    name: 'cyber',
    chainId: 7560,
    explorerUrl: 'https://cyberscan.co/',
    coingeckoPlatform: 'cyber',
    explorerApi: {
      url: 'https://api.routescan.io/v2/network/mainnet/evm/7560/etherscan/api',
      type: 'etherscan',
    },
    minTimestampForTvl: new UnixTime(1713428569), // block 1 ts
    multicallContracts: [
      {
        sinceBlock: 1,
        batchSize: 150,
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        version: '3',
      },
    ],
  },
  discoveryDrivenData: true,
  genesisTimestamp: new UnixTime(1713428569),
  isNodeAvailable: 'UnderReview',
  rpcUrl: 'https://cyber.alt.technology/',
})
