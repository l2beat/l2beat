import { EthereumAddress, ProjectId } from '@l2beat/shared-pure'

import { ScalingProjectPermissionedAccount } from '../common'
import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { orbitStackL3 } from '../layer2s/templates/orbitStack'

const discovery = new ProjectDiscovery('deri', 'arbitrum')

const roles = discovery.getContractValue<{
  EXECUTOR_ROLE: { members: string[] }
}>('UpgradeExecutor', 'accessControl')

const EOAExecutor: ScalingProjectPermissionedAccount = {
  address: EthereumAddress(roles.EXECUTOR_ROLE.members[0]),
  type: 'EOA',
}

export const deri = orbitStackL3({
  discovery,
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'Deri',
    slug: 'deri',
    description:
      'Deri is an Ethereum Layer-3 that leverages Arbitrum Nitro to enable efficient cross-chain futures, options, and derivatives.',
    purposes: ['DeFi'],
    links: {
      websites: ['https://deri.io/'],
      apps: [],
      documentation: ['https://docs.deri.io/'],
      explorers: ['https://explorer-dchain.deri.io/'],
      repositories: ['https://github.com/OffchainLabs/nitro'],
      socialMedia: [
        'https://twitter.com/DeriProtocol',
        'https://t.me/DeriProtocol',
        'https://discord.com/invite/kb8ZbYgp8M',
      ],
    },
  },

  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),

  nonTemplatePermissions: [
    {
      name: 'OwnerEOA',
      accounts: [EOAExecutor],
      description: 'EOA that can execute upgrade via the UpgradeExecutor.',
    },
  ],
})
