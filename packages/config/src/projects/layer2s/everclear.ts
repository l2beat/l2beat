import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { orbitStackL2 } from './templates/orbitStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('everclear')

export const everclear: Layer2 = orbitStackL2({
  badges: [Badge.RaaS.Gelato],
  display: {
    name: 'Everclear',
    slug: 'everclear',
    redWarning:
      'Critical contracts can be upgraded by an EOA which could result in the loss of all funds.',
    description:
      'Everclear is an AnyTrust Optimium on Ethereum, built on the Orbit stack. It is used as a liquidity hub (clearing layer) to solve the liquidity fragmentation between modular scaling solutions.',
    purposes: ['Interoperability'],
    links: {
      websites: ['https://everclear.org'],
      apps: ['https://bridge.gelato.network/bridge/everclear-mainnet'],
      documentation: ['https://docs.everclear.org'],
      explorers: ['https://scan.everclear.org/'],
      repositories: ['https://github.com/connext'],
      socialMedia: [
        'https://x.com/everclearorg',
        'https://discord.gg/everclear',
        'https://blog.everclear.org/',
      ],
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
  rpcUrl: 'https://rpc.everclear.raas.gelato.cloud',
  discovery,
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
})
