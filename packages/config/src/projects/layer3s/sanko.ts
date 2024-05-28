import { EthereumAddress, ProjectId, } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { orbitStackL3 } from '../layer2s/templates/orbitStack'
import { Layer3 } from './types'

const discovery = new ProjectDiscovery('sanko', 'arbitrum')

export const sanko: Layer3 = orbitStackL3({
  discovery,
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'Sanko',
    slug: 'sanko',
    redWarning:
      'Critical contracts can be upgraded by an EOA which could result in the loss of all funds.',
    description:
      'Sanko is an NFT and gaming-focused Orbit stack L3 on Arbitrum with AnyTrust DA and DMT as its native token, created by Sanko GameCorp.',
    purposes: ['Gaming', 'NFT'],
    links: {
      websites: ['https://sanko.xyz/'],
      apps: ['https://sanko.xyz/bridge'],
      documentation: ['https://sanko-1.gitbook.io/sanko-mainnet-docs/'],
      explorers: ['https://sanko-mainnet.calderaexplorer.xyz/'],
      repositories: [],
      socialMedia: [
        'https://x.com/SankoGameCorp',
        'https://discord.gg/Cnz62Vfa2C',
        'https://t.me/sankogamecorp',
      ],
    },
  },
  nativeToken: 'DMT',
  associatedTokens: ['DMT'],
  rpcUrl: 'https://sanko.calderachain.xyz/http',
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  nonTemplateEscrows: [
    {
      chain: 'arbitrum',
      includeInTotal: false,
      ...discovery.getEscrowDetails({
        address: EthereumAddress('0xb4951c0C41CFceB0D195A95FE66280457A80a990'),
        tokens: '*',
        description:
          'Main entry point for users depositing ERC20 tokens. Upon depositing, on L2 a generic, "wrapped" token will be minted.',
      }),
    },
  ],
  nonTemplatePermissions: [
    {
      name: 'Sanko Admin EOA',
      chain: 'arbitrum',
      accounts: [
        {
          address: discovery.getAccessControlField(
            'UpgradeExecutor',
            'EXECUTOR_ROLE',
          ).members[0],
          type: 'EOA',
        },
      ],
      description:
        "EOA address that can upgrade the rollup's smart contract system (via UpgradeExecutor) and gain access to all funds.",
    },
    ...discovery.getMultisigPermission(
      'Caldera Multisig',
      'Can execute upgrades via the UpgradeExecutor.',
    ),
  ],
})
