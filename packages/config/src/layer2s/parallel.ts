import { EthereumAddress } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { orbitStackL2 } from './templates/orbitStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('parallel')

const roles = discovery.getContractValue<{
  EXECUTOR_ROLE: { members: string[] }
}>('UpgradeExecutor', 'accessControl')

const EOAExecutor = {
  address: EthereumAddress(roles.EXECUTOR_ROLE.members[0]),
  type: 'EOA',
}

export const parallel: Layer2 = orbitStackL2({
  discovery,
  display: {
    name: 'Parallel',
    slug: 'parallel',
    headerWarning: '',
    description:
      'Parallel is an Ethereum L2 solution utilizing Arbitrum Nitro technology.',
    purposes: ['Universal', 'DeFi'],
    links: {
      websites: ['https://parallel.fi'],
      apps: ['https://parallel.fi/airdrop'],
      documentation: ['https://docs.parallel.fi/parallel-chain/overview'],
      explorers: [
        'https://explorerl2new-surprised-harlequin-bonobo-fvcy2k9oqh.t.conduit.xyz/',
      ],
      repositories: [],
      socialMedia: [
        'https://twitter.com/ParallelFi',
        'https://discord.gg/rdjVz8zavF',
        'https://t.me/parallelfi_community',
      ],
    },
  },

  escrows: [
    discovery.getEscrowDetails({
      address: EthereumAddress('0x6Eb9240d4add111D5Fc81b10Ff12eECabcf9752d'),
      tokens: '*',
      description:
        'Main entry point for users depositing ERC20 tokens. Upon depositing, on L2 a generic, "wrapped" token will be minted.',
    }),
    discovery.getEscrowDetails({
      address: EthereumAddress('0xa1c86E2362dba0525075622af6d5f739B1304D45'),
      tokens: '*',
      description:
        'Main entry point for users depositing ERC20 tokens that require minting custom token on L2.',
    }),
    discovery.getEscrowDetails({
      address: EthereumAddress('0x150286BdbE7C8Cd23D41a8e1e64438e0dc04dc3d'),
      tokens: ['WETH'],
      description: 'Escrow for WETH sent to L2.',
    }),
  ],
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),

  nonTemplatePermissions: [
    ...discovery.getMultisigPermission(
      'OwnerMultisig',
      'Multisig that can execute upgrades via the UpgradeExecutor.',
    ),
    {
      name: 'RollupOwner',
      accounts: [EOAExecutor],
      description: 'EOA that can execute upgrades via the UpgradeExecutor.',
    },
  ],

  milestones: [
    {
      name: 'Parallel Mainnet closed launch',
      link: 'https://twitter.com/ParallelFi/status/1743048283684237574',
      date: '2024-01-05T00:00:00Z',
      description: 'Parallel Mainnet is open for developers.',
    },
  ],
})
