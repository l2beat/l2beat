import { UnixTime } from '@l2beat/shared-pure'
import { DERIVATION, REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { opStackL2 } from '../../templates/opStack'

const discovery = new ProjectDiscovery('snaxchain')
const genesisTimestamp = UnixTime(1723562231)

export const snaxchain: ScalingProject = opStackL2({
  capability: 'universal',
  addedAt: UnixTime(1740099913),
  additionalBadges: [BADGES.RaaS.Conduit],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.CLOSED_PROOFS],
  display: {
    name: 'SNAXchain',
    slug: 'snaxchain',
    description:
      "SNAXchain, developed by Synthetix, is a Rollup built on the OP Stack. It aims to enhance Synthetix V3's decentralized governance and streamline operations.",
    stacks: ['OP Stack'],
    links: {
      websites: ['https://governance.synthetix.io/'],
      bridges: ['https://superbridge.app/snaxchain-mainnet'],
      repositories: ['https://github.com/Synthetixio/snaxchain-config'],
      documentation: ['https://sips.synthetix.io/sips/sip-384/'],
      socialMedia: ['https://x.com/synthetix_io'],
      explorers: ['https://explorer.snaxchain.io'],
    },
  },
  chainConfig: {
    name: 'snaxchain',
    chainId: 2192,
    apis: [
      {
        type: 'rpc',
        url: 'https://mainnet.snaxchain.io',
        callsPerMinute: 1500,
      },
    ],
  },
  isNodeAvailable: true,
  nodeSourceLink:
    'https://github.com/ethereum-optimism/optimism/tree/develop/op-node',
  stateDerivation: DERIVATION.OPSTACK('SNAXCHAIN'),
  activityConfig: {
    type: 'block',
    startBlock: 1,
    adjustCount: { type: 'SubtractOne' },
  },
  discovery,
  genesisTimestamp,
})
