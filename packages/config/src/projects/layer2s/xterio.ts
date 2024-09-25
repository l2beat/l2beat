import { UnixTime, formatSeconds } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { opStackL2 } from './templates/opStack'
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
  discovery,
  badges: [Badge.DA.CustomDA, Badge.RaaS.AltLayer],
  display: {
    name: 'Xterio Chain',
    slug: 'xterio',
    description:
      'Xterio Chain is an OP stack Optimium on Ethereum. The chain focuses on gaming, high performance and low fees .',
    purposes: ['Universal', 'Gaming'],
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
  daProvider: {
    name: 'XterioDA',
    riskView: {
      value: 'External',
      description:
        'Proof construction and state derivation rely on data that is NOT published onchain. Xterio uses a custom data availability provider without attestations, relying though on DA challenges.',
      sentiment: 'bad',
    },
    technology: {
      name: 'Data required to compute fraud proofs is published offchain without onchain attestations',
      description: `Xterio relies on DA challenges for data availability. If a DA challenger finds that the data behind a tx data commitment is not available, they can submit a challenge which requires locking a bond within ${daChallengeWindow}. A challenge can be resolved by publishing the preimage data within an additional ${daResolveWindow}. In such a case, a portion of the challenger bond is burned, with the exact amount estimated as the cost incurred by the resolver to publish the full data, meaning that the resolver and challenger will approximately lose the same amount of funds. The system is not secure if the malicious sequencer is able to outspend the altruistic challengers. If instead, after a challenge, the preimage data is not published, the chain reorgs to the last fully derivable state.`,
      references: [
        {
          text: 'OP Plasma design docs',
          href: 'https://github.com/ethereum-optimism/design-docs/blob/main/protocol/plasma-mode.md',
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
  nonTemplatePermissions: [
    ...discovery.getMultisigPermission(
      'RollupOwnerMultisig',
      'Owner of the ProxyAdmin and the rollup system. It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.',
    ),
    {
      name: 'DataAvailabilityChallenge owner',
      accounts: [
        discovery.getPermissionedAccount('DataAvailabilityChallenge', 'owner'),
      ],
      description:
        'Owner of the DataAvailabilityChallenge contract. It can upgrade the contract params, potentially making the system insecure.',
    },
    {
      name: 'SystemConfig owner',
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
      description: `Upgradable contract that manages the PAUSED_SLOT, a boolean value indicating whether the Superchain is paused, and GUARDIAN_SLOT, the address of the guardian which can pause and unpause the system. The address of the guardian can only be modified by the ProxyAdmin by upgrading the SuperchainConfig contract. This contract is a fork of Optimism's superchainConfig contract and is unrelated to the one used by the OP stack Superchain.`,
    }),
  ],
  isNodeAvailable: 'UnderReview',
  genesisTimestamp: new UnixTime(1716537433),
  rpcUrl: 'https://xterio-eth.alt.technology/',
})
