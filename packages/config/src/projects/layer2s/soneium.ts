import { UnixTime } from '@l2beat/shared-pure'
import { DERIVATION, REASON_FOR_BEING_OTHER } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { opStackL2 } from './templates/opStack'

const discovery = new ProjectDiscovery('soneium')
const genesisTimestamp = new UnixTime(1733498411)

export const soneium = opStackL2({
  createdAt: new UnixTime(1724842746),
  discovery,
  genesisTimestamp,
  additionalBadges: [Badge.Infra.Superchain],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.CLOSED_PROOFS],
  display: {
    name: 'Soneium',
    slug: 'soneium',
    stateValidationImage: 'opfp',
    description:
      'Soneium is an Optimistic rollup based on the OP Stack. It is built by Sony Block Solutions Labs and planned to stand as a versatile, general-purpose blockchain.',
    links: {
      websites: ['https://soneium.org/en/'],
      apps: ['https://bridge.soneium.org/'],
      documentation: ['https://docs.soneium.org/docs/builders/overview'],
      explorers: ['https://soneium.blockscout.com/'],
      repositories: ['https://github.com/Soneium'],
      socialMedia: [
        'https://x.com/soneium',
        'https://t.me/SoneiumOfficial',
        'https://discord.gg/rWWPBHug9w',
      ],
    },
  },
  rpcUrl: 'https://rpc.soneium.org/',
  finality: {
    type: 'OPStack',
    minTimestamp: new UnixTime(1733134753),
    genesisTimestamp: new UnixTime(1733134753),
    l2BlockTimeSeconds: 2,
    lag: 0,
    stateUpdate: 'disabled',
  },
  isNodeAvailable: 'UnderReview',
  stateDerivation: DERIVATION.OPSTACK('SONEIUM'),
  discoveryDrivenData: true,
})
