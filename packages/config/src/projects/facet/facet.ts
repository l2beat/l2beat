import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import {
  DATA_ON_CHAIN,
  FORCE_TRANSACTIONS,
  OPERATOR,
  RISK_VIEW,
} from '../../common'
import { BADGES } from '../../common/badges'
import { formatExecutionDelay } from '../../common/formatDelays'
import { getStage } from '../../common/stages/getStage'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'

const discovery = new ProjectDiscovery('facet')

const FALLBACK_TIMEOUT_SECS = discovery.getContractValue<number>(
  'Rollup',
  'FALLBACK_TIMEOUT_SECS',
)

const MAX_CHALLENGE_SECS = discovery.getContractValue<number>(
  'Rollup',
  'MAX_CHALLENGE_SECS',
)

export const facet: ScalingProject = {
  type: 'layer2',
  id: ProjectId('facet'),
  capability: 'universal',
  addedAt: UnixTime(1735889012), // 2025-01-03T01:36:52Z
  badges: [
    BADGES.Other.BasedSequencing,
    BADGES.DA.EthereumCalldata,
    BADGES.VM.EVM,
  ],
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
        principle: true,
        usersHave7DaysToExit: true,
        usersCanExitWithoutCooperation: true,
        securityCouncilProperlySetUp: null,
      },
      stage2: {
        proofSystemOverriddenOnlyInCaseOfABug: true,
        fraudProofSystemIsPermissionless: true,
        delayWith30DExitWindow: true,
      },
    },
    {
      rollupNodeLink: 'https://github.com/0xFacet/facet-op-succinct',
    },
  ),
  discoveryInfo: getDiscoveryInfo([discovery]),
  display: {
    name: 'Facet',
    slug: 'facet',
    description:
      'Facet is a based rollup built on the OP stack. It uses FCT as its native gas token, which is mintable by spending gas on L1.',
    purposes: ['Universal'],
    category: 'Optimistic Rollup',
    links: {
      websites: ['https://facet.org/'],
      bridges: ['https://facetswap.com/bridge'],
      documentation: ['https://docs.facet.org/'],
      explorers: ['https://explorer.facet.org/'],
      repositories: ['https://github.com/0xFacet'],
      socialMedia: [
        'https://x.com/0xFacet',
        'https://discord.com/invite/facet',
      ],
    },
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0x0000000000000b07ED001607f5263D85bf28Ce4C'),
        tokens: ['ETH'],
        description: 'Fast bridge contract.',
      }),
    ],
  },
  riskView: {
    stateValidation: {
      ...RISK_VIEW.STATE_ZKP_OPTIMISTIC,
      secondLine: formatExecutionDelay(MAX_CHALLENGE_SECS),
    },
    dataAvailability: {
      ...DATA_ON_CHAIN,
    },
    exitWindow: {
      value: 'Immutable',
      description: 'Core contracts are immutable and cannot be upgraded.',
      sentiment: 'good',
    },
    sequencerFailure: {
      ...RISK_VIEW.SEQUENCER_SELF_SEQUENCE_NO_SEQUENCER,
    },
    proposerFailure: RISK_VIEW.PROPOSER_SELF_PROPOSE_WHITELIST_MAX_DELAY(
      FALLBACK_TIMEOUT_SECS,
    ),
  },

  technology: {
    operator: OPERATOR.DECENTRALIZED_OPERATOR,
    forceTransactions: FORCE_TRANSACTIONS.CANONICAL_ORDERING('EOA inbox'),
    exitMechanisms: [
      {
        name: 'Withdrawals are initiated on L1',
        description:
          'Users can initiate a withdrawal from the L1StandardBridge escrow by sending a transaction to the L1 contract, forcing the operator to either process it, halt all withdrawals or produce an invalid state transition. Deposits from the L1StandardBridge are disabled, and the use of the fast bridge is encouraged. There is no way to force the fast bridge operator (EOA) to process a withdrawal.',
        references: [
          {
            title:
              'PausedL1StandardBridge.sol - Etherscan source code, disabled _initiateBridgeERC20 function',
            url: 'https://etherscan.io/address//0x8F75466D69a52EF53C7363F38834bEfC027A2909#code',
          },
        ],
        risks: [
          {
            category: 'Funds can be lost if',
            text: 'the fast bridge EOA operator signs an invalid withdrawal.',
            isCritical: true,
          },
          {
            category: 'Funds can be frozen if',
            text: 'the operator halts withdrawals.',
            isCritical: true,
          },
        ],
      },
    ],
  },
  chainConfig: {
    name: 'facet',
    chainId: 1027303,
    gasTokens: ['FCT'],
    apis: [
      {
        type: 'rpc',
        url: 'https://mainnet.facet.org/',
        callsPerMinute: 1500,
      },
    ],
  },
  milestones: [
    {
      title: 'Mainnet Launch',
      url: 'https://x.com/0xFacet/status/1866610169620336761',
      date: '2024-12-10T00:00:00Z',
      description: 'Facet launches at Ethereum block 21373000.',
      type: 'general',
    },
  ],
}
