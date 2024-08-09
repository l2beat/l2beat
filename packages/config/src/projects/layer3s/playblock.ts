import { ProjectId } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { orbitStackL3 } from '../layer2s/templates/orbitStack'
import { Layer3 } from './types'

const discovery = new ProjectDiscovery('playblock', 'nova')

export const playblock: Layer3 = orbitStackL3({
  discovery,
  hostChain: ProjectId('nova'),
  badges: [Badge.DA.DAC, Badge.L3ParentChain.Nova, Badge.RaaS.Gelato],
  display: {
    redWarning:
      'Critical contracts can be upgraded by an EOA which could result in the loss of all funds.',
    name: 'PlayBlock',
    slug: 'playblock',
    description:
      'PlayBlock is an Orbit stack Layer 3 on Arbitrum Nova. It is built by the team behind Playnance, and is focused on gasless gaming and gambling.',
    purposes: ['Gaming'],
    links: {
      websites: ['https://playnance.com/'],
      apps: [],
      documentation: [],
      explorers: ['https://explorer.playblock.io/'],
      repositories: ['https://github.com/playnance-games/PlayBlock'],
      socialMedia: ['https://twitter.com/Playnancetech'],
    },
    activityDataSource: 'Blockchain RPC',
  },
  // not on coingecko
  // nativeToken: 'PBG',
  // associatedTokens: ['PBG'],
  rpcUrl: 'https://playnance.drpc.org/',
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  nonTemplatePermissions: [
    {
      name: 'RollupOwnerEOA',
      accounts: discovery.getAccessControlRolePermission(
        'UpgradeExecutor',
        'EXECUTOR_ROLE',
      ),
      description:
        'This address has the Executor role and can upgrade the rollup contracts (via ProxyAdmin) without delay, potentially stealing all funds.',
    },
  ],
  nonTemplateContracts: [
    discovery.getContractDetails('ProxyAdmin', {
      description:
        'This contract can upgrade the implementations of the rollup proxies.',
    }),
  ],
})
