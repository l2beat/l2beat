import { UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { AnytrustDAC } from '../../templates/anytrust-template'
import { orbitStackL2 } from '../../templates/orbitStack'

const discovery = new ProjectDiscovery('xchain')

export const xchain: ScalingProject = orbitStackL2({
  addedAt: UnixTime(1725235200), // 2024-09-02T00:00:00Z
  additionalBadges: [BADGES.RaaS.Conduit],
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
      bridges: ['https://exchange.idex.io/'],
      documentation: ['https://docs.idex.io/'],
      explorers: ['https://xchain-explorer.idex.io/'],
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
    explorerUrl: 'https://xchain-explorer.idex.io',
    multicallContracts: [],
    sinceTimestamp: UnixTime.fromDate(new Date('2024-08-21T00:00:00Z')),
    apis: [
      { type: 'rpc', url: 'https://xchain-rpc.idex.io/', callsPerMinute: 300 },
      { type: 'blockscout', url: 'https://xchain-explorer.idex.io/api' },
    ],
  },
  discovery,
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  milestones: [
    {
      title: 'Mainnet Launch',
      url: 'https://blog.idex.io/p/idex-mainnet-is-live',
      date: '2024-09-02T00:00:00Z',
      description: 'XCHAIN launches together with a new version of IDEX.',
      type: 'general',
    },
  ],
  customDa: AnytrustDAC({ discovery, hostChain: 'ethereum' }),
})
