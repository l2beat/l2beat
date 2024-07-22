import { ProjectId } from '@l2beat/shared-pure'
import { Badge } from '../badges'
import { orbitStackL3 } from '../layer2s/templates/orbitStack'
import { Layer3 } from './types'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'

const discovery = new ProjectDiscovery('playblock', 'nova')

export const playblock: Layer3 = orbitStackL3({
  discovery,
  hostChain: ProjectId('nova'),
  badges: [Badge.DA.DAC, Badge.L3ParentChain.Nova, Badge.RaaS.Gelato],
  display: {
    name: 'PlayBlock',
    slug: 'playblock',
    description:
      'PlayBlock is an upcoming Layer 3 on Arbitrum, built on the Orbit stack. It is built by the team behind Playnance, and is focused on gasless gaming.',
    purposes: ['Gaming'],
    links: {
      websites: ['https://playnance.com/'],
      apps: [],
      documentation: [],
      explorers: [],
      repositories: [],
      socialMedia: ['https://twitter.com/Playnancetech'],
    },
  },
  // not on coingecko
  // nativeToken: 'PBG',
  // associatedTokens: ['PBG'],
  rpcUrl: 'https://mainnet.sanko.xyz',
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      includeInTotal: false,
      address: EthereumAddress('0xb4951c0C41CFceB0D195A95FE66280457A80a990'),
      tokens: '*',
      description:
        'Main entry point for users depositing ERC20 tokens. Upon depositing, on L2 a generic, "wrapped" token will be minted.',
    }),
  ],
  nonTemplatePermissions: [
    ...discovery.getMultisigPermission(
      'Caldera Multisig',
      'Rollup Owner: Can execute upgrades for the entire rollup system via the UpgradeExecutor.',
    ),
  ],
})
