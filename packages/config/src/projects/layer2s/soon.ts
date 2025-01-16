import { UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { opStackL2 } from './templates/opStack'
import { Layer2 } from './types'
import { DA_BRIDGES, DA_LAYERS } from '../../common'
import { REASON_FOR_BEING_OTHER } from '../../common/ReasonForBeingInOther'



const discovery = new ProjectDiscovery('soon')

export const soon: Layer2 = opStackL2({
  createdAt: new UnixTime(1726836904), // 2024-09-20T12:55:04Z
  discovery,
  //daProvider: EIGEN_DA_PROVIDER,
  additionalBadges: [Badge.DA.EigenDA],
  daProvider: {
    layer: DA_LAYERS.EIGEN_DA,
    riskView: {
      value: 'External',
      description:
        'Proof construction and state derivation rely fully on data that is NOT published on chain. Sequencer commitments are not checked against the EigenDA ServiceManager DA bridge.',
      sentiment: 'bad',
    },
    technology: {
      name: 'Data required to compute fraud proof is not published on chain, and currently not publicly accessible',
      description:
        'Fraxtal uses a separate data availability module developed by the Frax Core Team. Data is posted off chain, and only hashes of blob data is published on an on chain inbox.',
      references: [
        {
          text: 'Fraxtal documentation',
          href: 'https://docs.frax.com/fraxtal',
        },
        {
          text: 'On-Chain Inbox',
          href: 'https://etherscan.io/address/0xff000000000000000000000000000000000420fc',
        },
      ],
      risks: [
        {
          category: 'Funds can be lost if',
          text: 'the data is not made available on the external provider.',
          isCritical: true,
        },
        {
          category: 'Funds can be lost if',
          text: 'the sequencer posts an unavailable or malicious transaction root.',
          isCritical: true,
        },
      ],
    },
    bridge: DA_BRIDGES.NONE,
  },
  display: {
    reasonsForBeingOther: [
      REASON_FOR_BEING_OTHER.NO_PROOFS],
    name: 'Soon Alpha Mainnet',
    shortName: 'Soon',
    slug: 'soon',
    description:
      'SOON is a Layer 2 chain built on top of the SOON Stack, which itself is based on the OP Stack, but introduces the Decoupled Solana Virtual Machine (SVM).',
    links: {
      websites: ['https://soo.network/'],
      apps: ['https://bridge.mainnet.soo.network/home'],
      documentation: ['https://docs.soo.network/introduction/what-is-soon'],
      explorers: ['https://explorer.soo.network/'],
      repositories: ['https://github.com/soonlabs'],
      socialMedia: [
        'https://x.com/soon_svm',
        'https://discord.gg/soon-svm',
        'https://medium.com/@soon_SVM',
      ],
    },
    // no activityDataSource due to SVM
  },
  genesisTimestamp: new UnixTime(1696566432), // TODO: update
  isNodeAvailable: false,
  discoveryDrivenData: true,
})

