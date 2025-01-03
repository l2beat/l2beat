import { UnixTime } from '@l2beat/shared-pure/build/types/UnixTime'
import { REASON_FOR_BEING_OTHER } from '../../common/ReasonForBeingInOther'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { opStackL2 } from './templates/opStack'
import { Layer2 } from './types'
import { OPERATOR, RISK_VIEW } from '../../common'

const discovery = new ProjectDiscovery('facet')
const FINALIZATION_PERIOD_SECONDS: number = discovery.getContractValue<number>(
  'L2OutputOracle',
  'FINALIZATION_PERIOD_SECONDS',
)

export const facet: Layer2 = opStackL2({
  createdAt: new UnixTime(1735889012), // 2025-01-03T01:36:52Z
  discovery,
  additionalBadges: [Badge.Other.BasedSequencing],
  display: {
    category: 'Other',
    reasonsForBeingOther: [REASON_FOR_BEING_OTHER.NO_PROOFS],
    name: 'Facet',
    slug: 'facet',
    description:
      'Facet is a based rollup built on the OP stack. It uses FCT as its native gas token, which is mintable by spending gas on L1.',
    links: {
      websites: ['https://facet.org/'],
      apps: ['https://facetswap.com/bridge'],
      documentation: ['https://docs.facet.org/docs/facet-network/intro'],
      explorers: ['https://explorer.facet.org/'],
      repositories: ['https://github.com/0xFacet'],
      socialMedia: [
        'https://x.com/0xFacet',
        'https://discord.com/invite/facet',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  riskView: {
    stateValidation: RISK_VIEW.STATE_NONE,
    dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
    exitWindow: RISK_VIEW.EXIT_WINDOW(0, FINALIZATION_PERIOD_SECONDS),
    sequencerFailure: RISK_VIEW.SEQUENCER_SELF_SEQUENCE_NO_SEQUENCER,
    proposerFailure: RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
  },
  nonTemplateTechnology: { operator: OPERATOR.DECENTRALIZED_OPERATOR },
  rpcUrl: 'https://mainnet.facet.org/',
  genesisTimestamp: new UnixTime(1733855495),
  milestones: [
    {
      name: 'Facet Mainnet Launch',
      link: 'https://x.com/0xFacet/status/1866610169620336761',
      date: '2024-12-10T00:00:00Z',
      description: 'Facet launches at Ethereum block 21373000.',
      type: 'general',
    },
  ],
  discoveryDrivenData: true,
  usesBlobs: false, // uses calldata
  isNodeAvailable: 'UnderReview',
})
