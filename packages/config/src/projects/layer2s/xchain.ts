import { UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { AnytrustDAC } from '../da-beat/templates/anytrust-template'
import { orbitStackL2 } from './templates/orbitStack'
import type { Layer2 } from './types'

const discovery = new ProjectDiscovery('xchain')

export const xchain: Layer2 = orbitStackL2({
  createdAt: new UnixTime(1690896554), // 2023-08-01T13:29:14Z
  additionalBadges: [Badge.RaaS.Conduit, Badge.DA.DAC],
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.CLOSED_PROOFS,
    REASON_FOR_BEING_OTHER.SMALL_DAC,
  ],
  display: {
    name: 'XCHAIN',
    slug: 'xchain',
    description:
      'XCHAIN is an Optimium based on the Arbitrum Orbit stack. It is built to support IDEX - a high-performance perpetual swaps exchange. It allows for gas free and nearly instant settlement of all IDEX transactions.',
    links: {
      websites: ['https://idex.io/'],
      apps: ['https://exchange.idex.io/'],
      documentation: ['https://docs.idex.io/'],
      explorers: ['https://xchain-explorer.idex.io/'],
      repositories: [],
      socialMedia: [
        'https://x.com/idexio',
        'https://discord.com/invite/idex',
        'https://t.me/IDEXChat',
      ],
    },
  },
  chainConfig: {
    name: 'xchain',
    chainId: 94524,
    explorerUrl: 'https://xchain-explorer.idex.io/',
    explorerApi: {
      url: 'https://xchain-explorer.idex.io/api',
      type: 'blockscout',
    },
    multicallContracts: [],
    minTimestampForTvl: UnixTime.fromDate(new Date('2024-08-21T00:00:00Z')),
  },
  rpcUrl: 'https://xchain-rpc.idex.io/',

  discovery,
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  discoveryDrivenData: true,
  milestones: [
    {
      name: 'Mainnet launch',
      link: 'https://blog.idex.io/p/idex-mainnet-is-live',
      date: '2024-09-02T00:00:00Z',
      description: 'XCHAIN launches together with a new version of IDEX.',
      type: 'general',
    },
  ],
  dataAvailabilitySolution: AnytrustDAC({
    bridge: {
      createdAt: new UnixTime(1723211933), // 2024-08-09T13:58:53Z
    },
    discovery,
  }),
})
