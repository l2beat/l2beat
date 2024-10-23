import { ProjectId, UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { orbitStackL3 } from '../layer2s/templates/orbitStack'

const discovery = new ProjectDiscovery('deri', 'arbitrum')

export const deri = orbitStackL3({
  createdAt: new UnixTime(1701958025), // 2023-12-07T14:07:05Z
  discovery,
  badges: [Badge.L3ParentChain.Arbitrum],
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'Deri',
    slug: 'deri',
    description:
      'Deri is an Ethereum Layer-3 that leverages Arbitrum Nitro to enable efficient cross-chain futures, options, and derivatives.',
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
  nonTemplateContracts: [
    discovery.getContractDetails('L1GatewayRouter', {
      description: 'Router managing token <--> gateway mapping.',
    }),
  ],
  nonTemplatePermissions: [
    {
      name: 'OwnerEOA',
      accounts: discovery.getAccessControlRolePermission(
        'UpgradeExecutor',
        'EXECUTOR_ROLE',
      ),
      description: 'EOA that can execute upgrade via the UpgradeExecutor.',
    },
  ],
  usesBlobs: true,
})
