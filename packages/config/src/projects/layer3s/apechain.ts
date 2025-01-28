import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { AnytrustDAC } from '../da-beat/templates/anytrust-template'
import { orbitStackL3 } from '../layer2s/templates/orbitStack'
import type { Layer3 } from './types'

const discovery = new ProjectDiscovery('apechain', 'arbitrum')

export const apechain: Layer3 = orbitStackL3({
  createdAt: new UnixTime(1719939717), // 2024-07-02T17:01:57Z
  hostChain: ProjectId('arbitrum'),
  additionalBadges: [
    Badge.DA.DAC,
    Badge.L3ParentChain.Arbitrum,
    Badge.RaaS.Caldera,
  ],
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.CLOSED_PROOFS,
    REASON_FOR_BEING_OTHER.SMALL_DAC,
  ],
  display: {
    name: 'ApeChain',
    slug: 'apechain',
    description:
      'ApeChain is an Optimium on Arbitrum, built on the Orbit stack. It is built to support the ApeCoin ecosystem. Powered by $APE as gas token it aims to host assets and games of the ApeCoin ecosystem with development and growth led by Horizen Labs.',
    links: {
      websites: ['https://apechain.com/'],
      apps: ['https://apechain.com/portal'],
      documentation: ['https://docs.apechain.com/'],
      explorers: ['https://apescan.io/'],
      repositories: [],
      socialMedia: [
        'https://twitter.com/apecoin',
        'https://discord.gg/apecoindao',
        'https://t.me/apechainofficial',
      ],
    },
  },
  discovery,
  bridge: discovery.getContract('ERC20Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  rpcUrl: 'https://rpc.apechain.com/http',
  // associatedTokens: ['APE'],
  gasTokens: ['APE'],
  overrideEscrows: [],
  discoveryDrivenData: true,
  dataAvailabilitySolution: AnytrustDAC({
    bridge: {
      createdAt: new UnixTime(1723211933), // 2024-08-09T13:58:53Z
    },
    discovery,
  }),
})
