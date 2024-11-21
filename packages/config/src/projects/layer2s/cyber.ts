import { EthereumAddress, UnixTime, formatSeconds } from '@l2beat/shared-pure'

import { DA_BRIDGES, DA_LAYERS } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { opStackL2 } from './templates/opStack'
import { Layer2 } from './types'

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
  badges: [Badge.DA.CustomDA, Badge.Infra.Superchain, Badge.RaaS.AltLayer],
  additionalPurposes: ['Social'],
  display: {
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
    activityDataSource: 'Blockchain RPC',
  },
  daProvider: {
    layer: DA_LAYERS.EXTERNAL,
    riskView: {
      value: 'External',
      description:
        'Proof construction and state derivation rely on data that is NOT published onchain. Cyber uses a custom data availability system without attestations, but allowing data challenges.',
      sentiment: 'bad',
    },
    technology: {
      name: 'Data required to compute fraud proof is published offchain without onchain attestations',
      description: `Xterio relies on DA challenges for data availability. If a DA challenger finds that the data behind a tx data commitment is not available, 
      they can submit a challenge which requires locking a bond within ${daChallengeWindow}. A challenge can be resolved by publishing the preimage data within an additional ${daResolveWindow}. 
      In such a case, a portion of the challenger bond is burned, with the exact amount estimated as the cost incurred by the resolver to publish the full data, 
      meaning that the resolver and challenger will approximately lose the same amount of funds. The system is not secure if the malicious sequencer is able to outspend the altruistic challengers. 
      If instead, after a challenge, the preimage data is not published, the chain reorgs to the last fully derivable state. 
      This mechanism fully depends on the derivation rule of the L2 node and can only be verified in its source code, which in this case is not made available.`,
      references: [
        {
          text: 'OP Plasma specification',
          href: 'https://github.com/ethereum-optimism/specs/blob/main/specs/experimental/alt-da.md',
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
        {
          category: 'Funds can be stolen if',
          text: 'a successful challenge is ignored by the source-unavailable L2 node.',
        },
      ],
    },
    bridge: DA_BRIDGES.NONE_WITH_DA_CHALLENGES,
  },
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
