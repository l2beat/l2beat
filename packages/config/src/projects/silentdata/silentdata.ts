import { UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { opStackL2, PRIVATE_DA_PROVIDER } from '../../templates/opStack'

const discovery = new ProjectDiscovery('silentdata')

export const silentData: ScalingProject = opStackL2({
  discovery,
  genesisTimestamp: 1753442723, // from https://explorer-mainnet.rollup.silentdata.com/block/0
  capability: 'universal',
  addedAt: UnixTime(1753945535),
  overridingPurposes: ['Enterprise'],
  daProvider: PRIVATE_DA_PROVIDER,
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.CLOSED_PROOFS,
    REASON_FOR_BEING_OTHER.NO_DA_ORACLE,
  ],
  display: {
    name: 'Silent Data',
    slug: 'silentdata',
    description:
      'Silent Data is an enterprise focused OP Stack L2 aiming to achieve privacy by not making transaction data available. It is built for institutional scale and web3 innovation.',
    stacks: ['OP Stack'],
    redWarning:
      'Critical contracts can be upgraded by an EOA which could result in the loss of all funds.',
    links: {
      websites: ['https://silentdata.com'],
      explorers: ['https://explorer-mainnet.rollup.silentdata.com/'],
      bridges: ['https://bridge-mainnet.rollup.silentdata.com/'],
      documentation: ['https://docs.silentdata.com/'],
      socialMedia: [
        'https://linkedin.com/company/69477792',
        'https://twitter.com/SilentDataApp',
        'https://podcasts.apple.com/podcast/applied-blockchain-podcast/id1653098459',
      ],
    },
  },
  isNodeAvailable: 'UnderReview',
  isPartOfSuperchain: true, // uses non-standard superchainconf but 'officially' part of superchain
})
