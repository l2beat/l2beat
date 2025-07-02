import { ProjectId, UnixTime, formatSeconds } from '@l2beat/shared-pure'
import {
  DATA_ON_CHAIN,
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
  RISK_VIEW,
  SEQUENCER_NO_MECHANISM,
} from '../../common'
import { BADGES } from '../../common/badges'
import { formatExecutionDelay } from '../../common/formatDelays'
import { getStage } from '../../common/stages/getStage'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'

const discovery = new ProjectDiscovery('katana')
const upgradeDelay = discovery.getContractValue<number>(
  'Timelock',
  'getMinDelay',
)

export const katana: ScalingProject = {
  id: ProjectId('katana'),
  type: 'layer2',
  capability: 'universal',
  addedAt: UnixTime(1749119953),
  badges: [
    BADGES.VM.EVM,
    BADGES.DA.EthereumBlobs,
    BADGES.RaaS.Conduit,
    BADGES.Infra.AggLayer,
    BADGES.Other.SharedBridge,
    BADGES.Stack.OPStack,
  ],
  display: {
    name: 'Katana',
    slug: 'katana',
    description:
      'Katana is a Layer 2 specializing on DeFi. Its unique architecture combines an OP stack base with Agglayer shared bridge interoperability and OP-Succinct SP1 validity proofs.',
    purposes: ['Universal'],
    category: 'ZK Rollup',
    stack: 'Agglayer CDK',
    links: {
      websites: ['https://katana.network/'],
      bridges: ['https://app.katana.network/'],
      explorers: ['https://explorer.katanarpc.com'],
      repositories: ['https://github.com/agglayer'],
      socialMedia: [
        'https://x.com/katana',
        'https://discord.com/invite/KatanaNetwork',
      ],
    },
  },
  riskView: {
    stateValidation: {
      ...RISK_VIEW.STATE_ZKP_SN,
      secondLine: formatExecutionDelay(0), // state root is published together with the pessimistic proof
    },
    dataAvailability: DATA_ON_CHAIN,
    exitWindow: {
      value: 'None',
      description: `Even though there is a ${formatSeconds(upgradeDelay)} Timelock for upgrades, forced transactions are disabled.`,
      sentiment: 'bad',
      orderHint: -1, // worse than forced tx available but instantly upgradable
      warning: {
        value: 'The Security Council can remove the delay on upgrades.',
        sentiment: 'bad',
      },
    },
    // no node source available, assuming the op stack standard SEQUENCING_WINDOW_SECONDS is not configured
    sequencerFailure: SEQUENCER_NO_MECHANISM(false),
    // sequencerFailure: {
    //   ...RISK_VIEW.SEQUENCER_SELF_SEQUENCE(SEQUENCING_WINDOW_SECONDS),
    //   secondLine: formatDelay(SEQUENCING_WINDOW_SECONDS),
    // },
    proposerFailure: RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
  },
  stage: getStage({
    stage0: {
      callsItselfRollup: true,
      stateRootsPostedToL1: true,
      dataAvailabilityOnL1: true,
      rollupNodeSourceAvailable: 'UnderReview',
      stateVerificationOnL1: true,
      fraudProofSystemAtLeast5Outsiders: null,
    },
    stage1: {
      principle: false,
      usersHave7DaysToExit: false,
      usersCanExitWithoutCooperation: false,
      securityCouncilProperlySetUp: false,
    },
    stage2: {
      proofSystemOverriddenOnlyInCaseOfABug: false,
      fraudProofSystemIsPermissionless: false,
      delayWith30DExitWindow: false,
    },
  }),
  config: {
    activityConfig: {
      type: 'block',
      startBlock: 1,
      adjustCount: { type: 'SubtractOne' },
    },
    escrows: [],
  },
  chainConfig: {
    name: 'katana',
    chainId: 747474,
    explorerUrl: 'https://explorer.katanarpc.com',
    sinceTimestamp: UnixTime(1746742811),
    apis: [
      { type: 'rpc', url: 'https://rpc.katana.network', callsPerMinute: 1500 },
      { type: 'blockscout', url: 'https://explorer.katanarpc.com/api' },
    ],
  },
  dataAvailability: {
    layer: DA_LAYERS.ETH_BLOBS_OR_CALLDATA,
    bridge: DA_BRIDGES.ENSHRINED,
    mode: DA_MODES.TRANSACTION_DATA,
  },
  discoveryInfo: getDiscoveryInfo([discovery]),
}
