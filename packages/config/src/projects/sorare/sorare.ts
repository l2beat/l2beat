import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import {
  CONTRACTS,
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
  EXITS,
  FORCE_TRANSACTIONS,
  NEW_CRYPTOGRAPHY,
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

const discovery = new ProjectDiscovery('sorare')
const freezeGracePeriod = discovery.getContractValue<number>(
  'StarkExchange',
  'FREEZE_GRACE_PERIOD',
)

const upgradeDelaySeconds = discovery.getContractValue<number>(
  'StarkExchange',
  'StarkWareDiamond_upgradeDelay',
)
const includingSHARPUpgradeDelaySeconds = Math.min(
  upgradeDelaySeconds,
  getSHARPVerifierUpgradeDelay(),
)

const { committeePermission, minSigners } = getCommittee(discovery)

export const sorare: ScalingProject = {
  type: 'layer2',
  id: ProjectId('sorare'),
  capability: 'appchain',
  addedAt: UnixTime(1623153328), // 2021-06-08T11:55:28Z
  badges: [
    BADGES.VM.AppChain,
    BADGES.DA.DAC,
    BADGES.Stack.StarkEx,
    BADGES.Infra.SHARP,
  ],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.SMALL_DAC],
  display: {
    architectureImage: 'starkex',
    name: 'Sorare',
    slug: 'sorare',
    description:
      'Sorare is a global fantasy football game where you can play with officially licensed digital cards.',
    purposes: ['NFT', 'Exchange'],
    stack: 'StarkEx',
    category: 'Validium',
    links: {
      websites: ['https://sorare.com/'],
      documentation: ['https://docs.starkware.co/starkex/index.html'],
      repositories: ['https://github.com/starkware-libs/starkex-contracts'],
      socialMedia: [
        'https://discord.gg/TSjtHaM',
        'https://reddit.com/r/Sorare/',
        'https://twitter.com/Sorare',
        'https://instagram.com/sorare_official/',
      ],
    },
  },
  stage: {
    stage: 'NotApplicable',
  },
  chainConfig: {
    name: 'sorare',
    chainId: undefined,
    apis: [{ type: 'starkex', product: ['sorare'] }],
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0xF5C9F957705bea56a7e806943f98F7777B995826'),
        sinceTimestamp: UnixTime(1626352527),
        tokens: ['ETH'],
      }),
    ],
    activityConfig: {
      type: 'day',
      sinceTimestamp: UnixTime(1626352527),
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
    proposerFailure: RISK_VIEW.PROPOSER_USE_ESCAPE_HATCH_MP_NFT,
  },
  technology: {
    stateCorrectness: STATE_CORRECTNESS.STARKEX_VALIDITY_PROOFS,
    newCryptography: NEW_CRYPTOGRAPHY.ZK_STARKS,
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
      title: 'Mainnet launch',
      date: '2021-07-26T00:00:00Z',
      url: 'https://medium.com/sorare/were-live-on-our-scaling-solution-starkware-62438abee9a8',
      description:
        'Layer 2 scaling solution powered by Starkware, is live on Ethereum.',
      type: 'general',
    },
  ],
  customDa: StarkexDAC({ discovery }),
}
