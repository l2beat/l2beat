import { assert, ProjectId } from '@l2beat/shared-pure'

import { subtractOne } from '../common/assessCount'
import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { orbitStackL3 } from '../layer2s/templates/orbitStack'
import { Layer3 } from './types'

const discovery = new ProjectDiscovery('degen', 'base')

export const degen: Layer3 = orbitStackL3({
  hostChain: ProjectId('base'),
  discovery,
  nativeToken: 'DEGEN',
  display: {
    name: 'Degen Chain',
    slug: 'degen',
    description:
      'Degen Chain is an ultra-low-cost L3 for the Degen community built with Arbitrum Orbit, Base for settlement, and AnyTrust for data availability. DEGEN is the native gas token.',
    purposes: ['Social', 'DeFi', 'Universal'],
    links: {
      websites: ['https://syndicate.io/blog/degen-chain'],
      apps: ['https://bridge.degen.tips/', 'https://degen.tips/'],
      documentation: ['https://docs.syndicate.io/get-started/introduction'],
      explorers: ['https://explorer.degen.tips/'],
      repositories: [],
      socialMedia: [
        'https://twitter.com/degentokenbase',
        'https://warpcast.com/~/channel/degen',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  transactionApi: {
    type: 'rpc',
    defaultUrl: 'https://rpc.degen.tips',
    defaultCallsPerMinute: 900,
    assessCount: subtractOne,
    startBlock: 1,
  },
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  nonTemplatePermissions: [
    ...discovery.getMultisigPermission(
      'RollupOwnerMultisig',
      (() => {
        const discoveredAdminOwner = discovery.getAddressFromValue(
          'ProxyAdmin',
          'owner',
        )
        const discoveredUpgradeExecutorAddy =
          discovery.getContract('UpgradeExecutor').address
        const discoveredExecutor = discovery.getAccessControlField(
          'UpgradeExecutor',
          'EXECUTOR_ROLE',
        ).members[0]
        const discoveredRollupOwnerMultisig = discovery.getContract(
          'RollupOwnerMultisig',
        ).address
        assert(
          discoveredAdminOwner === discoveredUpgradeExecutorAddy &&
            discoveredExecutor === discoveredRollupOwnerMultisig,
          'Update the permissions section if this changes.',
        )
        const description =
          'Has the executor role of the UpgradeExecutor and indirectly owns the ProxyAdmin (can upgrade the whole system).'
        return description
      })(),
    ),
    {
      name: 'UTBAdmin',
      accounts: discovery.getAccessControlRolePermission(
        'UTBDecent',
        'DEFAULT_ADMIN_ROLE',
      ),
      description:
        'The UTBAdmin directly controls the UTB contracts critical functions like updating all roles and modules.',
    },
  ],
  nonTemplateContracts: [
    discovery.getContractDetails('UTBDecent', {
      description:
        'The UTB contract serves as an L2<->L3 gateway by integrating with Decent (LayerZero app) to allow bridging and swapping in- and out of Degen L3. This is achieved using external modules (smart contracts) like swappers and bridgers that can be registered in the UTB contract.',
    }),
  ],
})
