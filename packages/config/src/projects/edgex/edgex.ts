import { ChainSpecificAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import {
  CONTRACTS,
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
  EXITS,
  FORCE_TRANSACTIONS,
  OPERATOR,
  REASON_FOR_BEING_OTHER,
  RISK_VIEW,
  STATE_VALIDATION,
  TECHNOLOGY_DATA_AVAILABILITY,
} from '../../common'
import { BADGES } from '../../common/badges'
import { formatDelay } from '../../common/formatDelays'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { getSHARPVerifierUpgradeDelay } from '../../discovery/starkware'
import type { ScalingProject } from '../../internalTypes'
import {
  generateDiscoveryDrivenContracts,
  generateDiscoveryDrivenPermissions,
} from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import { StarkexDAC } from '../../templates/starkex-template'

const discovery = new ProjectDiscovery('edgex')

const minDASigners = discovery.getContractValue<number>(
  'FinalizableCommittee',
  'signaturesRequired',
)

const addedDASigners = discovery.getContractValue<string[]>(
  'FinalizableCommittee',
  'addedDACMembers',
)
const constructorDASigners = discovery.getConstructorArg<string[]>(
  'FinalizableCommittee',
  0,
)
const daSigners = addedDASigners.concat(constructorDASigners)

const dacConfig = {
  requiredSignatures: minDASigners,
  membersCount: daSigners.length,
}

const freezeGracePeriod = discovery.getContractValue<number>(
  'StarkPerpetual',
  'FREEZE_GRACE_PERIOD',
)

const upgradeDelaySeconds = discovery.getContractValue<number>(
  'StarkPerpetual',
  'StarkWareDiamond_upgradeDelay',
)

const includingSHARPUpgradeDelaySeconds = Math.min(
  upgradeDelaySeconds,
  getSHARPVerifierUpgradeDelay(),
)

export const edgex: ScalingProject = {
  type: 'layer2',
  id: ProjectId('edgex'),
  capability: 'appchain',
  addedAt: UnixTime.fromDate(new Date('2025-10-13')),
  badges: [
    BADGES.VM.CairoVM,
    BADGES.DA.DAC,
    BADGES.Stack.StarkEx,
    BADGES.Infra.SHARP,
  ],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.LOW_DAC_THRESHOLD],
  display: {
    name: 'EdgeX',
    slug: 'edgex',
    stacks: ['SN Stack', 'StarkEx'],
    description:
      "EdgeX is a high-performance on-chain trading platform, build as an L2 on Starknet's StarkEx tech.",
    purposes: ['Exchange'],
    links: {
      websites: ['https://edgex.exchange'],
      documentation: ['https://edgex-1.gitbook.io/edgeX-documentation'],
      bridges: ['https://pro.edgex.exchange'],
      socialMedia: [
        'https://x.com/edgeX_exchange',
        'https://discord.com/invite/edgeX',
        'https://medium.com/@edgexexchange',
        'https://t.me/edgeX_exchange',
      ],
    },
  },
  proofSystem: {
    type: 'Validity',
    zkCatalogId: ProjectId('stone'),
  },
  stage: {
    stage: 'NotApplicable',
  },
  chainConfig: {
    name: 'edgex',
    chainId: undefined,
    apis: [{ type: 'starkex', product: ['edgex'] }],
  },

  config: {
    activityConfig: {
      type: 'day',
      sinceTimestamp: UnixTime(1720435943),
      resyncLastDays: 7,
      batchSize: 10,
      dataSource: 'StarkEx Aggregations API',
    },
    escrows: [
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0xfAaE2946e846133af314d1Df13684c89fA7d83DD',
        ),
        tokens: ['USDT'],
      }),
    ],
  },
  dataAvailability: {
    layer: DA_LAYERS.DAC,
    bridge: DA_BRIDGES.DAC_MEMBERS(dacConfig),
    mode: DA_MODES.STATE_DIFFS,
  },
  riskView: {
    stateValidation: RISK_VIEW.STATE_ZKP_ST,
    dataAvailability: RISK_VIEW.DATA_EXTERNAL_DAC(dacConfig),
    exitWindow: RISK_VIEW.EXIT_WINDOW(
      includingSHARPUpgradeDelaySeconds,
      freezeGracePeriod,
    ),
    sequencerFailure: {
      ...RISK_VIEW.SEQUENCER_FORCE_VIA_L1_STARKEX_PERPETUAL(freezeGracePeriod),
      secondLine: formatDelay(freezeGracePeriod),
    },
    proposerFailure: RISK_VIEW.PROPOSER_USE_ESCAPE_HATCH_MP_AVGPRICE,
  },
  stateValidation: {
    categories: [STATE_VALIDATION.STARKEX_VALIDITY_PROOFS],
  },
  technology: {
    dataAvailability: TECHNOLOGY_DATA_AVAILABILITY.STARKEX_OFF_CHAIN,
    operator: OPERATOR.STARKEX_OPERATOR,
    forceTransactions:
      FORCE_TRANSACTIONS.STARKEX_PERPETUAL_WITHDRAW(freezeGracePeriod),
    exitMechanisms: EXITS.STARKEX_PERPETUAL,
  },
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [
      CONTRACTS.UPGRADE_WITH_DELAY_SECONDS_RISK(
        includingSHARPUpgradeDelaySeconds,
      ),
    ],
  },
  permissions: generateDiscoveryDrivenPermissions([discovery]),
  milestones: [
    {
      title: 'edgeX live on Mainnet',
      date: '2024-08-03T00:00:00Z',
      url: 'https://x.com/edgeX_exchange/status/1819614179760001039',
      description:
        'edgeX, a non-custodial decentralized exchange powered by StarkeX, is now live on Mainnet.',
      type: 'general',
    },
  ],
  customDa: StarkexDAC({
    dac: {
      requiredMembers: dacConfig.requiredSignatures,
      membersCount: dacConfig.membersCount,
    },
  }),
  discoveryInfo: getDiscoveryInfo([discovery]),
}
