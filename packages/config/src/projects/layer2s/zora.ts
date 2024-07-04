import { UnixTime, formatSeconds } from '@l2beat/shared-pure'

import { DERIVATION } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { opStackL2 } from './templates/opStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('zora')

const upgradeability = {
  upgradableBy: ['ProxyAdmin'],
  upgradeDelay: 'No delay',
}

const superchainUpgradeability = {
  upgradableBy: ['SuperchainProxyAdmin'],
  upgradeDelay: 'No delay',
}

const livenessInterval = discovery.getContractValue<number>(
  'LivenessModule',
  'livenessInterval',
)

export const zora: Layer2 = opStackL2({
  discovery,
  badges: [
    Badge.VM.EVM,
    Badge.Stack.OPStack,
    Badge.Infra.Superchain,
    Badge.DA.EthereumBlobs,
  ],
  display: {
    name: 'Zora',
    slug: 'zora',
    warning:
      'Fraud proof system is currently under development. Users need to trust the block proposer to submit correct L1 state roots.',
    description:
      'Zora is a fast, cost-efficient, and scalable Layer 2 built to help bring media onchain, powered by the OP Stack.',
    purposes: ['Universal', 'NFT'],
    links: {
      websites: ['https://zora.energy/', 'https://zora.co/'],
      apps: [],
      documentation: ['https://docs.zora.co/docs/zora-network/intro'],
      explorers: [
        'https://explorer.zora.energy/',
        'https://zora.superscan.network',
      ],
      repositories: ['https://github.com/ourzora/optimism'],
      socialMedia: [
        'https://twitter.com/ourZORA',
        'https://instagram.com/our.zora',
        'https://zora.community',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  upgradeability,
  rpcUrl: 'https://rpc.zora.co',
  finality: {
    type: 'OPStack-blob',
    genesisTimestamp: new UnixTime(1686693839),
    minTimestamp: new UnixTime(1710386579),
    l2BlockTimeSeconds: 2,
    lag: 0,
    stateUpdate: 'disabled',
  },
  genesisTimestamp: new UnixTime(1686695915),
  stateDerivation: DERIVATION.OPSTACK('ZORA'),
  isNodeAvailable: true,
  milestones: [
    {
      name: 'Zora starts using blobs',
      link: 'https://twitter.com/Optimism/status/1768235284494450922',
      date: '2024-03-14T00:00:00Z',
      description: 'Zora starts publishing data to blobs.',
    },
    {
      name: 'Zora Network Launch',
      link: 'https://twitter.com/ourZORA/status/1671602234994622464',
      date: '2023-06-21T00:00:00Z',
      description: 'Zora Network is live on mainnet.',
    },
  ],
  knowledgeNuggets: [],
  nonTemplatePermissions: [
    ...discovery.getMultisigPermission(
      'ConduitMultisig',
      'Owner of the ProxyAdmin. It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.',
    ),
    discovery.contractAsPermissioned(
      discovery.getContract('SuperchainProxyAdmin'),
      'Admin of the shared SuperchainConfig contract.',
    ),
    ...discovery.getMultisigPermission(
      'SuperchainProxyAdminOwner',
      'Owner of the SuperchainProxyAdmin.',
    ),
    ...discovery.getMultisigPermission(
      'GuardianMultisig',
      'Address allowed to pause withdrawals in case of an emergency. It is controlled by the Security Council multisig, but a deputy module allows the Foundation to act through it. The Security Council can disable the module if the Foundation acts maliciously.',
    ),
    ...discovery.getMultisigPermission(
      'FoundationMultisig_1',
      'Member of the ProxyAdminOwner.',
    ),
    ...discovery.getMultisigPermission(
      'SecurityCouncilMultisig',
      `Member of the ProxyAdminOwner. It implements a LivenessModule used to remove inactive (${formatSeconds(
        livenessInterval,
      )}) members while making sure that the threshold remains above 75%. If the number of members falls below 8, the Foundation takes ownership of the Security Council.`,
      [
        {
          text: 'Security Council members - Optimism Collective forum',
          href: 'https://gov.optimism.io/t/security-council-vote-2-initial-member-ratification/7118',
        },
      ],
    ),
    ...discovery.getMultisigPermission(
      'FoundationMultisig_2',
      'Deputy to the GuardianMultisig.',
    ),
    ...discovery.getMultisigPermission(
      'ZoraMultisig',
      'Owner of the SystemConfig, meaning it can update the preconfer address, the batch submitter address and the gas configuration of the system.',
    ),
    ...discovery.getMultisigPermission(
      'ChallengerMultisig',
      'This address is the permissioned challenger of the system. It can delete non finalized roots without going through the fault proof process.',
    ),
  ],
  nonTemplateContracts: [
    discovery.getContractDetails('SuperchainConfig', {
      description:
        'The SuperchainConfig contract is used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.',
      ...superchainUpgradeability,
    }),
  ],
  usesBlobs: true,
})
