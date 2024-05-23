import { ProjectId } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { orbitStackL3 } from '../layer2s/templates/orbitStack'
import { Layer3 } from './types'

const discovery = new ProjectDiscovery('molten', 'arbitrum')

export const molten: Layer3 = orbitStackL3({
  discovery,
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'Molten Network',
    slug: 'molten',
    description:
      'Molten is an Orbit stack L3 on Arbitrum with AnyTrust DA, created by the UniDex team.',
    purposes: ['DeFi'],
    links: {
      websites: ['https://unidex.exchange/molten-network'],
      apps: [],
      documentation: ['https://docs.unidex.exchange/appchain/markdown'],
      explorers: ['https://unidex-celestium.calderaexplorer.xyz/'], //Temporarily Unavailable
      repositories: [],
      socialMedia: [
        'https://twitter.com/UniDexFinance',
        'https://discord.gg/unidex',
        'https://mirror.xyz/unidexexchange.eth',
        'https://t.me/unidexfinance',
      ],
    },
  },
  rpcUrl: '',
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
})
