import { EthereumAddress, UnixTime, formatSeconds } from '@l2beat/shared-pure'

import { DERIVATION } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { opStackL2 } from './templates/opStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('mode')

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

export const mode: Layer2 = opStackL2({
  discovery,
  display: {
    name: 'Mode Network',
    slug: 'mode',
    warning:
      'Fraud proof system is currently under development. Users need to trust the block proposer to submit correct L1 state roots.',
    description:
      'Mode is an Optimistic Rollup based on the OP Stack. The L2 is focused on building new economic systems for financial applications to grow.',
    purposes: ['Universal'],
    links: {
      websites: ['https://mode.network/'],
      apps: ['https://app.mode.network/'],
      documentation: ['https://docs.mode.network/'],
      explorers: ['https://modescan.io'],
      repositories: [],
      socialMedia: [
        'https://twitter.com/modenetwork',
        'https://discord.gg/modenetworkofficial',
        'https://mode.mirror.xyz/',
        'https://t.me/ModeNetworkOfficial',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  associatedTokens: ['MODE'],
  upgradeability,
  rpcUrl: 'https://mainnet.mode.network/',
  genesisTimestamp: new UnixTime(1700125343),
  stateDerivation: DERIVATION.OPSTACK('MODE'),
  isNodeAvailable: true,
  milestones: [
    {
      name: 'Mode starts using blobs',
      link: 'https://twitter.com/Optimism/status/1768235284494450922',
      date: '2024-03-14T00:00:00Z',
      description: 'Mode starts publishing data to blobs.',
    },
    {
      name: 'Mode Network Mainnet Launch',
      link: 'https://twitter.com/modenetwork/status/1752760726907760933',
      date: '2024-01-31T00:00:00Z',
      description: 'Mode Network is live on mainnet.',
    },
    {
      name: 'MODE token airdrop',
      link: 'https://mode.mirror.xyz/2Aom53lrot8KQ143u8lCfyYvTOkR7LJcIChoyP1Q4wI',
      date: '2024-05-07T00:00:00Z',
      description: 'MODE token launched.',
    },
  ],
  finality: {
    type: 'OPStack-blob',
    l2BlockTimeSeconds: 2,
    minTimestamp: new UnixTime(1710386375),
    genesisTimestamp: new UnixTime(1700167583),
    lag: 0,
    stateUpdate: 'disabled',
  },
  nonTemplatePermissions: [
    ...discovery.getMultisigPermission(
      'ConduitMultisig',
      'Owner of the ProxyAdmin: it can upgrade the bridge implementation potentially gaining access to all funds, and change any system component. Also designated as the owner of the SystemConfig, meaning it can update the preconfer address, the batch submitter address and the gas configuration of the system.',
    ),
    ...discovery.getMultisigPermission(
      'ChallengerMultisig',
      'This address is the permissioned challenger of the system. It can delete non finalized roots without going through the fault proof process.',
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
  ],
  nonTemplateContracts: [
    discovery.getContractDetails('SuperchainConfig', {
      description:
        'The SuperchainConfig contract is used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.',
      ...superchainUpgradeability,
    }),
  ],
  chainConfig: {
    name: 'mode',
    chainId: 34443,
    explorerUrl: 'https://explorer.mode.network',
    explorerApi: {
      url: 'https://api.routescan.io/v2/network/mainnet/evm/34443/etherscan/api',
      type: 'etherscan',
    },
    // ~ Timestamp of block number 0 on Mode
    // The first full hour timestamp that will return the block number
    // https://explorer.mode.network/block/0
    minTimestampForTvl: UnixTime.fromDate(new Date('2023-11-16T22:46:23Z')),
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 5022,
        version: '3',
      },
    ],
    coingeckoPlatform: 'mode',
  },
  usesBlobs: true,
})
