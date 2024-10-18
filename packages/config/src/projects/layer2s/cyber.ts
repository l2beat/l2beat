import {
  assert,
  EthereumAddress,
  UnixTime,
  formatSeconds,
} from '@l2beat/shared-pure'

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
  associatedTokens: ['CYBER'],
  discovery,
  badges: [Badge.DA.CustomDA, Badge.Infra.Superchain, Badge.RaaS.AltLayer],
  additionalPurposes: ['Social'],
  display: {
    name: 'Cyber',
    slug: 'cyber',
    architectureImage: 'cyber',
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
    name: 'External',
    riskView: {
      value: 'External',
      description:
        'Proof construction and state derivation rely on data that is NOT published onchain. Cyber uses a custom data availability system without attestations, but allowing data challenges.',
      sentiment: 'bad',
    },
    technology: {
      name: 'Data required to compute fraud proof is published offchain without onchain attestations',
      description: `Cyber relies on DA challenges for data availability. If a DA challenger finds that the data behind a tx data commitment is not available, they can submit a challenge which requires locking a bond within ${daChallengeWindow}. A challenge can be resolved by publishing the preimage data within an additional ${daResolveWindow}. In such case, a portion of the challenger bond is burned, with the exact amount estimated as the cost incurred by the resolver to publish the full data, meaning that the resolver and challenger will approximately lose the same amount of funds. The system is not secure if the malicious sequencer is able to outspend the altruistic challengers. If instead, after a challenge, the preimage data is not published, the chain reorgs to the last fully derivable state.`,
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
      ],
    },
    bridge: { type: 'None + DA challenges' },
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
  nonTemplatePermissions: [
    ...discovery.getMultisigPermission(
      'ProxyAdminOwner',
      'Owner of the ProxyAdmin and the rollup system. It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.',
    ),
    {
      name: 'SystemConfig + DAC Owner',
      description: (() => {
        assert(
          discovery.getPermissionedAccount('SystemConfig', 'owner').address ===
            discovery.getPermissionedAccount(
              'DataAvailabilityChallenge',
              'owner',
            ).address,
          'The permissions for the SystemConfig + DAC Owner changed, please change the nonTemplatePermissions entry',
        )
        const description =
          'Account privileged to change System Config parameters such as Sequencer Address and gas limit. It can also upgrade the DataAvailabilityChallenge contract and change its parameters like bondSize.'
        return description
      })(),
      accounts: [discovery.getPermissionedAccount('SystemConfig', 'owner')],
    },
  ],
  nonTemplateContracts: [
    discovery.getContractDetails('DataAvailabilityChallenge', {
      description:
        'The DataAvailabilityChallenge contract is used to challenge the data availability of tx data hashes. See the technology section for more details.',
    }),
    discovery.getContractDetails('SuperchainConfig', {
      description: `Upgradable contract that manages the PAUSED_SLOT, a boolean value indicating whether the Superchain is paused, and GUARDIAN_SLOT, the address of the guardian which can pause and unpause the system. The address of the guardian can only be modified by the ProxyAdmin by upgrading the SuperchainConfig contract. This contract is a fork of Optimism's superchainConfig contract and it's unrelated to the one used by the Superchain.`,
    }),
  ],
  genesisTimestamp: new UnixTime(1713428569),
  isNodeAvailable: 'UnderReview',
  rpcUrl: 'https://cyber.alt.technology/',
})
