import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common/ReasonForBeingInOther'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { orbitStackL3 } from '../layer2s/templates/orbitStack'
import { Layer3 } from './types'

const discovery = new ProjectDiscovery('apechain', 'arbitrum')

export const apechain: Layer3 = orbitStackL3({
  createdAt: new UnixTime(1719939717), // 2024-07-02T17:01:57Z
  hostChain: ProjectId('arbitrum'),
  additionalBadges: [
    Badge.DA.DAC,
    Badge.L3ParentChain.Arbitrum,
    Badge.RaaS.Caldera,
  ],
  display: {
    reasonsForBeingOther: [
      REASON_FOR_BEING_OTHER.CLOSED_PROOFS,
      REASON_FOR_BEING_OTHER.SMALL_DAC,
    ],
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
    activityDataSource: 'Blockchain RPC',
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
})
