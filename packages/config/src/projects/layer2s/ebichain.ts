import { UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { orbitStackL2 } from './templates/orbitStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('ebichain')

export const ebichain: Layer2 = orbitStackL2({
  discovery,
  createdAt: new UnixTime(1726563843), // 2024-09-17T09:04:03Z
  badges: [Badge.DA.DAC, Badge.RaaS.Conduit],
  additionalPurposes: ['Exchange'],
  display: {
    name: 'Ebi Chain',
    slug: 'ebichain',
    headerWarning:
      'ebi.xyz DEX [is winding down](https://x.com/ebixyzdex/status/1861326984078598388).',
    description:
      'Ebi Chain is a Layer-2 hosting the Ebi.xyz platform, a limit order book decentralised platform for trading perpetual futures.',
    links: {
      websites: ['https://ebi.xyz/en/home/'],
      apps: ['https://ebi.xyz/en/trade/contract/'],
      documentation: ['https://docs.ebi.xyz/ebi.xyz-overview'],
      explorers: ['https://explorer.ebi.xyz/'],
      repositories: [],
      socialMedia: [
        'https://x.com/ebixyzdex',
        'https://t.me/ebixyzofficial',
        'https://discord.com/invite/ebixyz',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  rpcUrl: 'https://rpc.ebi.xyz',
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  discoveryDrivenData: true,
})
