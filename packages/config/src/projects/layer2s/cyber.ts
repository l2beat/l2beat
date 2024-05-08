import { assert, UnixTime, formatSeconds } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { opStackL2 } from './templates/opStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('cyber')

const daChallengeWindowBlocks = formatSeconds(
  discovery.getContractValue<number>(
    'DataAvailabilityChallenge',
    'challengeWindow',
  ),
)

const daResolveWindowBlocks = formatSeconds(
  discovery.getContractValue<number>(
    'DataAvailabilityChallenge',
    'resolveWindow',
  ),
)

export const cyber: Layer2 = opStackL2({
  discovery,
  display: {
    name: 'Cyber',
    slug: 'cyber',
    description:
      'Cyber is a chain designed for social applications, based on the OP stack and custom data publishing.',
    redWarning:
      'Critical contracts can be upgraded by an EOA which could result with the loss of all funds.',
    purposes: ['Universal', 'Social'],
    links: {
      websites: ['https://cyber.co/'],
      apps: ['https://cyber-bridge.alt.technology/', 'https://cyber.co/stake'],
      documentation: ['https://docs.cyber.co/'],
      explorers: ['https://cyberscan.co/'],
      repositories: ['https://github.com/cyberconnecthq'],
      socialMedia: [
        'https://twitter.com/cyberconnecthq',
        'https://discord.com/invite/cUc8VRGmPs',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  daProvider: {
    name: 'External',
    riskView: {
      value: 'External',
      description: (() => {
        assert(
          daChallengeWindowBlocks === '1' && daResolveWindowBlocks === '1',
          'The challenge window in the DataAvailabilityChallenge contract changed, please update the daProvider description',
        )
        const description =
          'Proof construction and state derivation rely on data that is NOT published onchain. Cyber uses a custom data availability system without attestations and no option to challenge DA commitments posted to L1.'
        return description
      })(),
      sentiment: 'bad',
    },
    technology: {
      name: 'Data is published offchain without a usable challenging mechanism',
      description: (() => {
        assert(
          daChallengeWindowBlocks === '1' && daResolveWindowBlocks === '1',
          'The challenge window in the DataAvailabilityChallenge contract changed, please update the technology section',
        )
        const description =
          'Cyber uses a minimal data availability system in which the sequencer only publishes data commitments (hashes) to Ethereum L1. These are not attested to nor are users able to challenge them. The data essential for potential fraud- and bridge proofs can thus be withheld by the sequencer at any time.'
        return description
      })(),
      references: [
        {
          text: 'OP Plasma specification',
          href: 'https://github.com/ethereum-optimism/specs/blob/main/specs/experimental/plasma.md',
        },
        {
          text: 'Universal Plasma and DA Challenges - Ethresear.ch',
          href: 'https://ethresear.ch/t/universal-plasma-and-da-challenges/18629',
        },
      ],
      risks: [
        {
          category: 'Funds can be stolen if',
          text: 'the centralized sequencer is malicious.',
        },
      ],
    },
    bridge: { type: 'None' },
  },
  nonTemplatePermissions: [
    ...discovery.getMultisigPermission(
      'ProxyAdminOwner',
      'Owner of the ProxyAdmin and the rollup system. It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.',
    ),
    {
      name: 'SystemConfig Owner.',
      description:
        'Account privileged to change System Config parameters such as Sequencer Address and gas limit.',
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
