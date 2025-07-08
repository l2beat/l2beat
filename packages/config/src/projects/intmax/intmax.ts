import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import { getStage } from '../../common/stages/getStage'

export const intmax: ScalingProject = {
  type: 'layer2',
  id: ProjectId('intmax'),
  capability: 'universal',
  addedAt: UnixTime(1722256071), // 2024-07-29T12:27:51Z
  display: {
    name: 'INTMAX',
    slug: 'intmax',
    description:
      'INTMAX is a stateless Plasma-like ZK Rollup with permissionless block production.',
    purposes: ['Payments'],
    category: 'ZK Rollup',
    links: {
      websites: ['https://intmax.io/'],
      documentation: [
        'https://eprint.iacr.org/2023/1082.pdf',
        'https://medium.com/intmax/the-deep-dive-into-statelessness-intmax2-algorithm-was-published-be7a306048ff',
      ],
      repositories: ['https://github.com/InternetMaximalism'],
      socialMedia: ['https://twitter.com/intmaxIO'],
    },
  },
  config: {
    escrows: [],
  },
  riskView: {
    stateValidation: {
      value: '',
    },
    dataAvailability: {
      value: '',
    },
    exitWindow: {
      value: '',
    },
    sequencerFailure: {
      value: '',
    },
    proposerFailure: {
      value: '',
    },
  },
  stage: getStage(
    {
      stage0: {
        callsItselfRollup: true,
        stateRootsPostedToL1: true,
        dataAvailabilityOnL1: true,
        rollupNodeSourceAvailable: true,
        stateVerificationOnL1: true,
        fraudProofSystemAtLeast5Outsiders: null,
      },
      stage1: {
        principle: false,
        usersHave7DaysToExit: true,
        usersCanExitWithoutCooperation: true,
        securityCouncilProperlySetUp: true,
      },
      stage2: {
        proofSystemOverriddenOnlyInCaseOfABug: false,
        fraudProofSystemIsPermissionless: null,
        delayWith30DExitWindow: false,
      },
    },
    {
      rollupNodeLink: 'https://github.com/scroll-tech/go-ethereum',
      securityCouncilReference:
        'https://scroll-governance-documentation.vercel.app/gov-docs/content/what-is-security-council',
    },
  ),
  discoveryInfo: getDiscoveryInfo([]),
}
