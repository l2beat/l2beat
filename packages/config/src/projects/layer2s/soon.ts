import { UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common/ReasonForBeingInOther'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { EIGENDA_DA_PROVIDER, opStackL2 } from './templates/opStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('soon')

export const soon: Layer2 = opStackL2({
  createdAt: new UnixTime(1726836904), // 2024-09-20T12:55:04Z
  discovery,
  daProvider: EIGENDA_DA_PROVIDER,
  additionalBadges: [Badge.DA.EigenDA, Badge.VM.SolanaVM],
  display: {
    reasonsForBeingOther: [REASON_FOR_BEING_OTHER.NO_PROOFS],
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
  usingAltVm: true,
  nonTemplateTechnology: {
    otherConsiderations: [
      {
        name: 'Solana Virtual Machine is supported',
        description:
          'OP stack chains are usually pursuing the EVM Equivalence model. But Soon implements the rust-based Solana virtual machine (SVM) which uses parallel processing.',
        risks: [],
        references: [
          {
            text: 'Soon Docs - Decoupled SVM',
            href: 'https://docs.soo.network/introduction/decoupled-svm',
          },
        ],
      },
    ],
  },
  genesisTimestamp: new UnixTime(1696566432), // TODO: update
  isNodeAvailable: false,
  discoveryDrivenData: true,
})
