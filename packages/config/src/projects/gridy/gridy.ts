import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { BADGES } from '../../common/badges'
import { getStage } from '../../common/stages/getStage'
import { RISK_VIEW } from '../../common/riskView'

import { STATE_CORRECTNESS } from '../../common/stateCorrectness'
import {
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
  EXITS,
  NEW_CRYPTOGRAPHY,
  OPERATOR,
  TECHNOLOGY_DATA_AVAILABILITY,
} from '../../common'
import { FORCE_TRANSACTIONS } from '../../common/forceTransactions'

export const gridy: ScalingProject = {
  type: 'layer3',
  id: ProjectId('gridy'),
  capability: 'appchain',
  addedAt: UnixTime(1745041853), // 2025-04-19T05:50:53Z
  hostChain: ProjectId('starknet'),
  badges: [
      BADGES.VM.CairoVM,
      BADGES.Stack.SNStack,
      BADGES.Infra.SHARP,
      BADGES.RaaS.Karnot
    ],
  display: {
    name: 'Gridy',
    slug: 'gridy',
    stack: 'SN Stack',
    description:
      'Gridy is a lightning‑fast on‑chain treasure hunt forged on a Layer 3 on SN Stack, turning every click into a dig site where diamonds and jackpot gems fire real‑time autonomous transactions toward a massive USDC prize pool.',
    purposes: ['Gaming'],
    category: 'ZK Rollup',
    links: {
      websites: ['https://gridy.karnot.xyz/'],
      socialMedia: [
        'https://twitter.com/karnotxyz',
      ],
    },
    liveness: {
      explanation:
        'Gridy is a lightning‑fast on‑chain treasure hunt forged on a Layer 3 on SN Stack, turning every click into a dig site where diamonds and jackpot gems fire real‑time autonomous transactions toward a massive USDC prize pool.',
    },
  },
    chainConfig: {
      name: 'Gridy',
      chainId: 6120767554663640178324841317716,
      apis: [
        {
          type: 'starknet',
          url: '',
          callsPerMinute: 10,
        },
      ],
    },
  config: {
    escrows : [],
    activityConfig: {
      type: 'block',
    },
    daTracking: [
      {
        type: 'starknet',
        daLayer: ProjectId('starknet'),
        sinceBlock: 0,
        inbox: '0x4090b89b476da6dccd66e8e27db5bc814bfaee95dc3eb84ec00a7a64af03600',
        sequencers: ['0x04f59E35F2d130Fe6ef478b6A8b65B5fbb272BB7D67c047A0Dd7a2Dd9b320A30'],
      },
    ],
    finality: {
      lag: 0,
      type: 'Starknet',
      minTimestamp: UnixTime(1744728260),
      stateUpdate: 'disabled',
    },
  },
  ecosystemInfo: {
    id: ProjectId('starknet')
  },
  dataAvailability: {
    layer: DA_LAYERS.STARKNET_CALLDATA,
    bridge: DA_BRIDGES.ENSHRINED,
    mode: DA_MODES.STATE_DIFFS
  },
  riskView: {
    stateValidation: {
      ...RISK_VIEW.STATE_ZKP_ST,
    },
    dataAvailability: RISK_VIEW.DATA_ON_CHAIN_STATE_DIFFS,
    exitWindow: { value: '0' },
    sequencerFailure: RISK_VIEW.SEQUENCER_NO_MECHANISM(),
    proposerFailure: RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
  },
  stage: getStage({
      stage0: {
        callsItselfRollup: true,
        stateRootsPostedToL1: true,
        dataAvailabilityOnL1: true,
        rollupNodeSourceAvailable: true,
      },
      stage1: {
        principle: false,
        stateVerificationOnL1: true,
        fraudProofSystemAtLeast5Outsiders: null,
        usersHave7DaysToExit: false,
        usersCanExitWithoutCooperation: false,
        securityCouncilProperlySetUp: null,
      },
      stage2: {
        proofSystemOverriddenOnlyInCaseOfABug: null,
        fraudProofSystemIsPermissionless: null,
        delayWith30DExitWindow: false,
      },
  }),
  technology: {
      stateCorrectness: STATE_CORRECTNESS.VALIDITY_PROOFS,
      newCryptography: NEW_CRYPTOGRAPHY.ZK_STARKS,
      dataAvailability: TECHNOLOGY_DATA_AVAILABILITY.STARKNET_CALLDATA_OFF_CHAIN,
      operator: OPERATOR.CENTRALIZED_OPERATOR,
      forceTransactions: {
        ...FORCE_TRANSACTIONS.SEQUENCER_NO_MECHANISM,
      },
      exitMechanisms: EXITS.STARKNET,
    },

};