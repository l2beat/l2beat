import { UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { orbitStackL2 } from './templates/orbitStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('hychain', 'ethereum')

export const hychain: Layer2 = orbitStackL2({
  createdAt: new UnixTime(1710846977), // 2024-03-19T11:16:17Z
  badges: [Badge.DA.DAC, Badge.RaaS.Caldera],
  additionalPurposes: ['Gaming'],
  display: {
    name: 'HYCHAIN',
    slug: 'hychain',
    description:
      'HYCHAIN is a gaming-focused Orbit stack Optimium that was created to eliminate onboarding and technical challenges for web3 games aiming for widespread adoption.',
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
    ...discovery.getMultisigPermission(
      'HychainMultisig',
      'Can execute upgrades via the UpgradeExecutor.',
    ),
  ],
})
