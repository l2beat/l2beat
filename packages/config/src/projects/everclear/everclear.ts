import { UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { AnytrustDAC } from '../../templates/anytrust-template'
import { orbitStackL2 } from '../../templates/orbitStack'

const discovery = new ProjectDiscovery('everclear')

export const everclear: ScalingProject = orbitStackL2({
  addedAt: UnixTime(1726617600), // 2024-09-18T00:00:00Z
  additionalBadges: [BADGES.RaaS.Gelato],
  additionalPurposes: ['Interoperability'],
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.CLOSED_PROOFS,
    REASON_FOR_BEING_OTHER.SMALL_DAC,
  ],
  display: {
    name: 'Everclear Hub',
    aliases: ['Connext'],
    slug: 'everclear',
    description:
      'Everclear Hub is an AnyTrust Optimium on Ethereum, built on the Orbit stack. It is used as a liquidity hub (clearing layer) to solve the liquidity fragmentation between modular scaling solutions.',
    links: {
      websites: ['https://everclear.org'],
      bridges: ['https://bridge.gelato.network/bridge/everclear-mainnet'],
      documentation: ['https://docs.everclear.org'],
      explorers: ['https://scan.everclear.org/'],
      repositories: ['https://github.com/connext'],
      socialMedia: [
        'https://x.com/everclearorg',
        'https://discord.gg/everclear',
        'https://t.me/EverclearCommunity',
        'https://blog.everclear.org/',
      ],
    },
  },
  associatedTokens: ['NEXT', 'CLEAR'],
  chainConfig: {
    name: 'everclear',
    chainId: 25327,
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.everclear.raas.gelato.cloud',
        callsPerMinute: 300,
      },
      {
        type: 'blockscout',
        url: 'https://scan.everclear.org/api',
      },
    ],
    sinceTimestamp: UnixTime(1725539051), // block 1 ts
  },
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
  customDa: AnytrustDAC({ discovery, hostChain: 'ethereum' }),
  // sequencer only uses addSequencerL2BatchFromOrigin (0x8f111f3c)
  unusedBatchSubmissionSelectors: [
    '0xe0bc9729',
    '0x37501551',
    '0x3e5aa082',
    '0x6e620055',
    '0x917cf8ac',
    '0x69cacded',
  ],
})
