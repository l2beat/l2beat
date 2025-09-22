import { UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { AnytrustDAC } from '../../templates/anytrust-template'
import { orbitStackL2 } from '../../templates/orbitStack'

const discovery = new ProjectDiscovery('lasernet')

export const lasernet: ScalingProject = orbitStackL2({
  capability: 'universal',
  addedAt: UnixTime(1745311928),
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.CLOSED_PROOFS,
    REASON_FOR_BEING_OTHER.SMALL_DAC,
  ],
  discovery,
  display: {
    name: 'Lasernet',
    slug: 'lasernet',
    description:
      'Lasernet is a new oracle architecture with an ETH layer-2 at its core. Lasernet brings fully on-chain, verifiable, and trustless data through its permissionless and modular design.',
    stacks: ['Arbitrum'],
    links: {
      websites: ['https://diadata.org/'],
      bridges: ['https://diadata.org/app/'],
      documentation: ['https://docs.diadata.org/resources/chain-information'],
      explorers: ['https://explorer.diadata.org/'],
      repositories: ['https://github.com/diadata-org/'],
      socialMedia: [
        'https://twitter.com/DIAdata_org',
        'https://discord.com/invite/RjHBcZ9mEH',
        'https://t.me/diadata_org',
        'https://linkedin.com/company/diadata-org/',
        'https://diadata.org/blog/',
      ],
    },
  },
  associatedTokens: ['DIA'],
  chainConfig: {
    name: 'lasernet',
    gasTokens: ['DIA'],
    chainId: 1050,
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.diadata.org/',
        callsPerMinute: 300,
      },
    ],
  },
  activityConfig: {
    type: 'block',
    startBlock: 1,
    adjustCount: { type: 'SubtractOne' },
  },
  customDa: AnytrustDAC({ discovery, hostChain: 'ethereum' }),
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
})
