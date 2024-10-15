import { EthereumAddress, ProjectId } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { orbitStackL3 } from '../layer2s/templates/orbitStack'
import { Layer3 } from './types'

const discovery = new ProjectDiscovery('molten', 'arbitrum')

export const molten: Layer3 = orbitStackL3({
  discovery,
  badges: [Badge.DA.DAC, Badge.L3ParentChain.Arbitrum, Badge.RaaS.Caldera],
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'Molten Network',
    shortName: 'Molten',
    slug: 'molten',
    description:
      'Molten is an Orbit stack L3 on Arbitrum with AnyTrust DA, created by the UniDex team.',
    purposes: ['DeFi'],
    links: {
      websites: ['https://moltennetwork.com/'],
      apps: [
        'https://molten.calderabridge.xyz/',
        'https://leverage.unidex.exchange/',
      ],
      documentation: ['https://docs.unidex.exchange/appchain/markdown'],
      explorers: ['https://molten.calderaexplorer.xyz'],
      repositories: [],
      socialMedia: [
        'https://x.com/moltenl3',
        'https://discord.gg/moltennetwork',
        'https://mirror.xyz/unidexexchange.eth',
        'https://t.me/unidexfinance',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  nativeToken: 'MOLTEN',
  associatedTokens: ['MOLTEN'],
  rpcUrl: 'https://molten.calderachain.xyz/http',
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      includeInTotal: false,
      address: EthereumAddress('0x5a6f8ea5e1028C80CB98Fd8916afBBC4E6b23D80'),
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
