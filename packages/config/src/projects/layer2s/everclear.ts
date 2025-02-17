import { UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Layer2 } from '../../types'
import { Badge } from '../badges'
import { AnytrustDAC } from '../da-beat/templates/anytrust-template'
import { orbitStackL2 } from './templates/orbitStack'

const discovery = new ProjectDiscovery('everclear')

export const everclear: Layer2 = orbitStackL2({
  addedAt: new UnixTime(1717512064), // 2024-06-04T14:41:04Z
  additionalBadges: [Badge.RaaS.Gelato, Badge.DA.DAC],
  additionalPurposes: ['Interoperability'],
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.CLOSED_PROOFS,
    REASON_FOR_BEING_OTHER.SMALL_DAC,
  ],
  display: {
    name: 'Everclear Hub',
    slug: 'everclear',
    description:
      'Everclear Hub is an AnyTrust Optimium on Ethereum, built on the Orbit stack. It is used as a liquidity hub (clearing layer) to solve the liquidity fragmentation between modular scaling solutions.',
    links: {
      websites: ['https://everclear.org'],
      apps: ['https://bridge.gelato.network/bridge/everclear-mainnet'],
      documentation: ['https://docs.everclear.org'],
      explorers: ['https://scan.everclear.org/'],
      repositories: ['https://github.com/connext'],
      socialMedia: [
        'https://x.com/everclearorg',
        'https://discord.gg/everclear',
        'https://blog.everclear.org/',
      ],
    },
  },
  associatedTokens: ['NEXT'],
  rpcUrl: 'https://rpc.everclear.raas.gelato.cloud',
  discovery,
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  milestones: [
    {
      title: 'Mainnet Beta launch',
      url: 'https://blog.everclear.org/everclears-mainnet-is-live-24dedd572d56?gi=2c5d29c1443a',
      date: '2024-09-18T00:00:00Z',
      description:
        'Everclear Hub, the first Clearing Layer, is Live on Mainnet Beta.',
      type: 'general',
    },
  ],
  customDa: AnytrustDAC({ discovery }),
})
