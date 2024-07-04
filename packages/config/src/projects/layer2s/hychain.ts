import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { orbitStackL2 } from './templates/orbitStack'
import { Layer2 } from './types'
import { Badge } from '../badges'

const discovery = new ProjectDiscovery('hychain', 'ethereum')

export const hychain: Layer2 = orbitStackL2({
  badges: [Badge.VM.EVM, Badge.Stack.Orbit],
  display: {
    redWarning:
      'Critical contracts can be upgraded by an EOA which could result in the loss of all funds.',
    name: 'HYCHAIN',
    slug: 'hychain',
    description:
      'HYCHAIN is a gaming-focused Orbit stack Optimium that was created to eliminate onboarding and technical challenges for web3 games aiming for widespread adoption.',
    purposes: ['Gaming', 'NFT'],
    links: {
      websites: ['https://hychain.com'],
      apps: ['https://bridge.hychain.com'],
      documentation: ['https://docs.hychain.com'],
      explorers: ['https://explorer.hychain.com'],
      repositories: ['https://github.com/kintoxyz'],
      socialMedia: [
        'https://x.com/HYCHAIN_GAMES',
        'https://discord.gg/hytopiagg',
        'https://hychain.substack.com/',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  discovery,
  nativeToken: 'TOPIA',
  associatedTokens: ['TOPIA'],
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  rpcUrl: 'https://rpc.hychain.com/http',
  nonTemplatePermissions: [
    {
      name: 'Hychain Admin EOA',
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
      'HychainMultisig',
      'Can execute upgrades via the UpgradeExecutor.',
    ),
  ],
})
