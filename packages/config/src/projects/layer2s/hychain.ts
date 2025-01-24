import { UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common/ReasonForBeingInOther'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { AnytrustDAC } from '../da-beat/templates/anytrust-template'
import { orbitStackL2 } from './templates/orbitStack'
import type { Layer2 } from './types'

const discovery = new ProjectDiscovery('hychain', 'ethereum')

export const hychain: Layer2 = orbitStackL2({
  createdAt: new UnixTime(1710846977), // 2024-03-19T11:16:17Z
  additionalBadges: [Badge.DA.DAC, Badge.RaaS.Caldera],
  additionalPurposes: ['Gaming'],
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.CLOSED_PROOFS,
    REASON_FOR_BEING_OTHER.SMALL_DAC,
  ],
  display: {
    name: 'HYCHAIN',
    slug: 'hychain',
    description:
      'HYCHAIN is a gaming-focused Orbit stack Optimium that was created to eliminate onboarding and technical challenges for web3 games aiming for widespread adoption.',
    links: {
      websites: ['https://hychain.com'],
      apps: ['https://bridge.hychain.com'],
      documentation: ['https://docs.hychain.com'],
      explorers: ['https://explorer.hychain.com'],
      repositories: ['https://github.com/kintoxyz'],
      socialMedia: [
        'https://x.com/HYCHAIN_GAMES',
        'https://discord.gg/hytopiagg',
        'https://hychain.substack.com/',
      ],
    },
  },
  discovery,
  gasTokens: ['TOPIA'],
  associatedTokens: ['TOPIA'],
  bridge: discovery.getContract('ERC20Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  rpcUrl: 'https://rpc.hychain.com/http',
  discoveryDrivenData: true,
  dataAvailabilitySolution: AnytrustDAC({
    bridge: {
      createdAt: new UnixTime(1723211933), // 2024-08-09T13:58:53Z
    },
    discovery,
  }),
})
