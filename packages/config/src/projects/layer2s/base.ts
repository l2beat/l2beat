import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'

import { DERIVATION } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { opStackL2 } from './templates/opStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('base')

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

export const base: Layer2 = opStackL2({
  discovery,
  display: {
    name: 'Base',
    slug: 'base',
    architectureImage: 'base',
    warning:
      'Fraud proof system is currently under development. Users need to trust the block proposer to submit correct L1 state roots.',
    description:
      'Base is an Optimistic Rollup that has been developed on the Ethereum network, utilizing OP Stack technology.',
    purposes: ['Universal'],
    links: {
      websites: ['https://base.org/'],
      apps: ['https://bridge.base.org/'],
      documentation: ['https://docs.base.org/', 'https://stack.optimism.io/'],
      explorers: [
        'https://basescan.org/',
        'https://base.superscan.network',
        'https://base.blockscout.com/',
        'https://base.l2scan.co/',
      ],
      repositories: ['https://github.com/base-org'],
      socialMedia: [
        'https://twitter.com/BuildOnBase',
        'https://discord.gg/buildonbase',
        'https://base.mirror.xyz/',
      ],
      rollupCodes: 'https://rollup.codes/base',
    },
    activityDataSource: 'Blockchain RPC',
  },
  upgradeability,
  rpcUrl: 'https://developer-access-mainnet.base.org',
  finality: {
    type: 'OPStack-blob',
    minTimestamp: new UnixTime(1710375515),
    genesisTimestamp: new UnixTime(1686789347),
    l2BlockTimeSeconds: 2,
    lag: 0,
    stateUpdate: 'disabled',
  },
  genesisTimestamp: new UnixTime(1686796655),
  stateDerivation: DERIVATION.OPSTACK('BASE'),
  isNodeAvailable: true,
  milestones: [
    {
      name: 'Base starts using blobs',
      link: 'https://twitter.com/Optimism/status/1768235284494450922',
      date: '2024-03-14T00:00:00Z',
      description: 'Base starts publishing data to blobs.',
    },
    {
      name: 'Base Mainnet Launch',
      link: 'https://base.mirror.xyz/hwNwqXHVoLlO8s4DZppog4DfGvM34tigaDjOWuEJQfY',
      date: '2023-07-13T00:00:00.00Z',
      description: 'Base is live on mainnet.',
    },
  ],
  badges: [Badge.DA.EthereumBlobs, Badge.VM.EVM, Badge.Other.L3HostChain],
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: EthereumAddress('0x9de443AdC5A411E83F1878Ef24C3F52C61571e72'),
      tokens: ['wstETH'],
      description:
        'wstETH Vault for custom wstETH Gateway. Fully controlled by Lido governance.',
    }),
  ],
  nonTemplatePermissions: [
    ...discovery.getMultisigPermission(
      'AdminMultisig',
      'This address is the owner of the ProxyAdmin. It can upgrade the bridge implementation potentially gaining access to all funds.',
    ),
    ...discovery.getMultisigPermission(
      'BaseMultisig',
      "Core multisig of the Base team, it's a member of the AdminMultisig, meaning it can upgrade the bridge implementation potentially gaining access to all funds.",
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
      'Member of the SuperChainProxyAdminOwner.',
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
      'Deputy to the GuardianMultisig. It can also challenge state roots without going through the fault proof process.',
    ),
  ],
  nonTemplateContracts: [
    discovery.getContractDetails('Challenger1of2', {
      description:
        "This contract is the permissioned challenger of the system. It can delete non finalized roots without going through the fault proof process. It is functionally equivalent to a 1/2 multisig where neither party can remove the other's permission to execute a Challenger call. It is controlled by the GuardianMultisig and the OptimismMultisig.",
    }),
    discovery.getContractDetails('SuperchainConfig', {
      description:
        'The SuperchainConfig contract is used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.',
      ...superchainUpgradeability,
    }),
  ],
  chainConfig: {
    name: 'base',
    chainId: 8453,
    explorerUrl: 'https://basescan.org',
    explorerApi: {
      url: 'https://api.basescan.org/api',
      type: 'etherscan',
    },
    // ~ Timestamp of block number 0 on Base
    // https://basescan.org/block/0
    minTimestampForTvl: UnixTime.fromDate(new Date('2023-06-15T12:35:47Z')),
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 5022,
        version: '3',
      },
    ],
    coingeckoPlatform: 'base',
  },
  usesBlobs: true,
})
