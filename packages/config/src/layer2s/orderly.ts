import { UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { CELESTIA_DA_PROVIDER, opStackL2 } from './templates/opStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('orderly')

const upgradeability = {
  upgradableBy: ['ProxyAdmin'],
  upgradeDelay: 'No delay',
}

export const orderly: Layer2 = opStackL2({
  daProvider: CELESTIA_DA_PROVIDER,
  discovery,
  display: {
    name: 'Orderly Network',
    slug: 'orderly',
    warning:
      'Fraud proof system is currently under development. Users need to trust the block proposer to submit correct L1 state roots.',
    description:
      'Orderly is an Optimium based on the OP Stack and using Celestia DA. It serves as a ledger for all transaction data, user data balances, and trading data retrieved from the Orderbook and order-related services.',
    purposes: ['DeFi'],
    links: {
      websites: ['https://orderly.network/'],
      apps: [],
      documentation: [
        'https://orderly.network/docs/build-on-evm/building-on-evm',
      ],
      explorers: ['https://explorer.orderly.network/'],
      repositories: [],
      socialMedia: [
        'https://twitter.com/OrderlyNetwork',
        'https://discord.gg/orderlynetwork',
        'https://medium.com/@orderlynetwork',
        'https://t.me/OrderlyNetworkAnnouncements',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  upgradeability,
  rpcUrl: 'https://rpc.orderly.network',
  genesisTimestamp: new UnixTime(1696566432),
  isNodeAvailable: false,
  milestones: [
    {
      name: 'Orderly Network Mainnet Launch',
      link: 'https://twitter.com/OrderlyNetwork/status/1749419001913237526',
      date: '2024-01-22T00:00:00Z',
      description: 'Orderly Network is live on mainnet.',
    },
  ],
  nonTemplatePermissions: [
    ...discovery.getMultisigPermission(
      'OrderlyMultisig',
      'This address is the owner of the following contracts: ProxyAdmin, SystemConfig.',
    ),
  ],
})
