import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { orbitStackL2 } from './templates/orbitStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('alephzero')

export const alephzero: Layer2 = orbitStackL2({
  discovery,
  badges: [Badge.DA.DAC, Badge.RaaS.Gelato],
  display: {
    redWarning:
      'Critical contracts can be upgraded by an EOA which could result in the loss of all funds.',
    name: 'Aleph Zero EVM',
    slug: 'aleph-zero',
    description:
      'Aleph Zero is an Optimium on Ethereum, built on the Orbit stack. It aims to offer seamless interoperability with the Aleph Zero Layer 1 and a suite of developer tools for building privacy-enhancing dapps.',
    purposes: ['Privacy', 'Universal'],
    links: {
      websites: ['https://alephzero.org/'],
      apps: ['https://bridge.gelato.network/bridge/aleph-zero-evm'],
      documentation: ['https://docs.alephzero.org/'],
      explorers: ['https://evm-explorer.alephzero.org/'],
      repositories: ['https://github.com/Cardinal-Cryptography'],
      socialMedia: ['https://x.com/Aleph__Zero'],
    },
    activityDataSource: 'Blockchain RPC',
  },
  nonTemplatePermissions: [
    {
      name: 'AdminEOA',
      accounts: discovery.getAccessControlRolePermission(
        'UpgradeExecutor',
        'EXECUTOR_ROLE',
      ),
      description:
        'Can upgrade any project implementation via UpgradeExecutor, potentially gaining access to all funds.',
    },
  ],
  associatedTokens: ['AZERO'],
  nativeToken: 'AZERO',
  rpcUrl: 'https://rpc.alephzero.raas.gelato.cloud',
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
})
