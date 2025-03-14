import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import {
  CONTRACTS,
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
  EXITS,
  FORCE_TRANSACTIONS,
  OPERATOR,
  RISK_VIEW,
  STATE_CORRECTNESS,
  TECHNOLOGY_DATA_AVAILABILITY,
} from '../../common'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { formatDelay } from '../../common/formatDelays'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import {
  getCommittee,
  getSHARPVerifierUpgradeDelay,
} from '../../discovery/starkware'
import type { ScalingProject } from '../../internalTypes'
import {
  generateDiscoveryDrivenContracts,
  generateDiscoveryDrivenPermissions,
} from '../../templates/generateDiscoveryDrivenSections'
import { StarkexDAC } from '../../templates/starkex-template'

const discovery = new ProjectDiscovery('brine')

const upgradeDelaySeconds = discovery.getContractValue<number>(
  'StarkExchange',
  'StarkWareDiamond_upgradeDelay',
)
const includingSHARPUpgradeDelaySeconds = Math.min(
  upgradeDelaySeconds,
  getSHARPVerifierUpgradeDelay(),
)

const freezeGracePeriod = discovery.getContractValue<number>(
  'StarkExchange',
  'FREEZE_GRACE_PERIOD',
)

const { committeePermission, minSigners } = getCommittee(discovery)

export const tanx: ScalingProject = {
  type: 'layer2',
  id: ProjectId('brine'),
  capability: 'appchain',
  addedAt: UnixTime(1690545663), // 2023-07-28T12:01:03Z
  badges: [
    BADGES.VM.AppChain,
    BADGES.DA.DAC,
    BADGES.Stack.StarkEx,
    BADGES.Infra.SHARP,
  ],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.SMALL_DAC],
  display: {
    architectureImage: 'starkex',
    name: 'tanX',
    slug: 'tanx',
    description: 'tanX is a DEX powered by StarkEx technology.',
    purposes: ['Exchange'],
    category: 'Validium',
    stack: 'StarkEx',
    links: {
      websites: ['https://tanx.fi/'],
      apps: ['https://trade.tanx.fi/'],
      documentation: ['https://docs.tanx.fi/'],
      socialMedia: [
        'https://twitter.com/tanXfinance',
        'https://discord.gg/wMAnf3gVTh',
        'https://youtube.com/channel/UCUG2L75yvKJBK9QFUaXTdyA',
        'https://linkedin.com/company/tanx-fi',
      ],
    },
  },
  stage: {
    stage: 'NotApplicable',
  },
  chainConfig: {
    name: 'brine',
    chainId: undefined,
    apis: [{ type: 'starkex', product: ['brine'] }],
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0x1390f521A79BaBE99b69B37154D63D431da27A07'),
        sinceTimestamp: UnixTime(1657453320),
        tokens: '*',
        description: "Main entry point for users' deposits.",
      }),
    ],
    activityConfig: {
      type: 'day',
      sinceTimestamp: UnixTime(1657453320),
      resyncLastDays: 7,
    },
  },
  dataAvailability: {
    layer: DA_LAYERS.DAC,
    bridge: DA_BRIDGES.DAC_MEMBERS({
      membersCount: committeePermission.accounts.length,
      requiredSignatures: minSigners,
    }),
    mode: DA_MODES.STATE_DIFFS,
  },
  riskView: {
    stateValidation: RISK_VIEW.STATE_ZKP_ST,
    dataAvailability: RISK_VIEW.DATA_EXTERNAL_DAC({
      membersCount: committeePermission.accounts.length,
      requiredSignatures: minSigners,
    }),
    exitWindow: RISK_VIEW.EXIT_WINDOW(
      includingSHARPUpgradeDelaySeconds,
      freezeGracePeriod,
    ),
    sequencerFailure: {
      ...RISK_VIEW.SEQUENCER_FORCE_VIA_L1(freezeGracePeriod),
      secondLine: formatDelay(freezeGracePeriod),
    },
    proposerFailure: RISK_VIEW.PROPOSER_USE_ESCAPE_HATCH_MP,
  },
  technology: {
    stateCorrectness: STATE_CORRECTNESS.STARKEX_VALIDITY_PROOFS,
    dataAvailability: TECHNOLOGY_DATA_AVAILABILITY.STARKEX_OFF_CHAIN,
    operator: OPERATOR.STARKEX_OPERATOR,
    forceTransactions: FORCE_TRANSACTIONS.STARKEX_SPOT_WITHDRAW(),
    exitMechanisms: EXITS.STARKEX_SPOT,
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
      title: 'Mainnet Launch',
      date: '2023-04-27T00:00:00.00Z',
      url: 'https://tanx.fi/',
      description: 'tanX is live on mainnet.',
      type: 'general',
    },
  ],
  customDa: StarkexDAC({ discovery }),
}
