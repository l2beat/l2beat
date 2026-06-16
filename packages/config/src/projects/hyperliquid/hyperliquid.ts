import { ChainSpecificAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import {
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
  OPERATOR,
  REASON_FOR_BEING_OTHER,
  RISK_VIEW,
} from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import {
  generateDiscoveryDrivenContracts,
  generateDiscoveryDrivenPermissions,
} from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import { readProjectMarkdown } from '../../utils/readMarkdown'

const discovery = new ProjectDiscovery('hyperliquid')

const challengePeriod = discovery.getContractValue<number>(
  'HyperliquidBridge',
  'disputePeriodSeconds',
)

const validatorSetSize = discovery.getContractValue<number>(
  'HyperliquidBridge',
  'nValidators',
)

export const hyperliquid: ScalingProject = {
  type: 'layer3',
  id: ProjectId('hyperliquid'),
  capability: 'appchain',
  hostChain: ProjectId('arbitrum'),
  addedAt: UnixTime(1777037577),
  proofSystem: undefined,
  badges: [
    BADGES.VM.AppChain,
    BADGES.DA.CustomDA,
    BADGES.L3ParentChain.Arbitrum,
  ],
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.NO_PROOFS,
    REASON_FOR_BEING_OTHER.NO_DA_ORACLE,
  ],
  display: {
    name: 'Hyperliquid',
    slug: 'hyperliquid',
    description:
      'Hyperliquid is a performant exchange with its main bridge on Arbitrum. It uses a custom consensus algorithm called HyperBFT.',
    purposes: ['Exchange'],
    links: {
      websites: ['https://hyperfoundation.org/'],
      explorers: ['https://app.hyperliquid.xyz/explorer'],
      bridges: ['https://app.hyperliquid.xyz/trade'],
      socialMedia: [
        'https://x.com/HyperliquidX',
        'https://discord.gg/hyperliquid',
        'https://t.me/hyperliquid_dex',
      ],
      documentation: ['https://hyperliquid.gitbook.io/hyperliquid-docs'],
      repositories: ['https://github.com/hyperliquid-dex'],
    },
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        includeInTotal: false,
        address: ChainSpecificAddress(
          'arb1:0x2Df1c51E09aECF9cacB7bc98cB1742757f163dF7',
        ),
        sinceTimestamp: UnixTime(1701389130),
        tokens: ['USDC'],
        description: 'Hyperliquid bridge escrow on Arbitrum.',
      }),
      discovery.getEscrowDetails({
        includeInTotal: false,
        address: ChainSpecificAddress(
          'hyperevm:0x6B9E773128f453f5c2C60935Ee2DE2CBc5390A24',
        ),
        sinceTimestamp: UnixTime(1763482980),
        tokens: ['USDC'],
        description: 'Hyperliquid bridge escrow on HyperEVM.',
      }),
    ],
  },
  dataAvailability: {
    layer: DA_LAYERS.HYPERLIQUID_DA,
    bridge: DA_BRIDGES.NONE,
    mode: DA_MODES.TRANSACTION_DATA,
  },
  riskView: {
    stateValidation: RISK_VIEW.STATE_NONE,
    dataAvailability: RISK_VIEW.DATA_EXTERNAL,
    exitWindow: RISK_VIEW.EXIT_WINDOW(0, challengePeriod),
    sequencerFailure: RISK_VIEW.SEQUENCER_NO_MECHANISM(false),
    proposerFailure: RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
  },
  stackedRiskView: {
    stateValidation: RISK_VIEW.STATE_NONE,
    dataAvailability: RISK_VIEW.DATA_EXTERNAL_L3,
    exitWindow: RISK_VIEW.EXIT_WINDOW(0, challengePeriod),
    sequencerFailure: RISK_VIEW.SEQUENCER_NO_MECHANISM(false),
    proposerFailure: RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
  },
  stage: { stage: 'NotApplicable' },
  stateValidation: {
    categories: [
      {
        title: 'No state validation',
        description:
          'Hyperliquid does not use a proof system to validate state transitions on Arbitrum. Withdrawals are externally verified by the permissioned validator set.',
        risks: [
          {
            category: 'Funds can be stolen if',
            text: 'the permissioned validator majority signs an invalid withdrawal request.',
            isCritical: true,
          },
          {
            category: 'Funds can be frozen if',
            text: 'the permissioned validator set stops processing withdrawals.',
            isCritical: true,
          },
        ],
      },
    ],
  },
  technology: {
    operator: {
      ...OPERATOR.CENTRALIZED_OPERATOR,
      description: readProjectMarkdown('hyperliquid', 'technologyOperator', {
        challengePeriod,
        validatorSetSize,
      }),
      references: [
        {
          title: 'Bridge2 - Hyperliquid docs',
          url: 'https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/bridge2',
        },
        {
          title: 'Bridge2 contract: function checkValidatorSignatures()',
          url: 'https://arbiscan.io/address/0x2Df1c51E09aECF9cacB7bc98cB1742757f163dF7#code#L2190',
        },
      ],
      risks: [
        ...OPERATOR.CENTRALIZED_OPERATOR.risks,
        {
          category: 'Funds can be stolen if',
          text: 'the permissioned validator majority signs an invalid withdrawal request.',
          isCritical: true,
        },
        {
          category: 'Funds can be frozen if',
          text: 'the permissioned validator set stops processing withdrawals.',
          isCritical: true,
        },
        {
          category: 'Funds can be frozen if',
          text: 'the permissioned lockers maliciously pause the bridge.',
        },
        {
          category: 'Funds can be stolen if',
          text: "the permissioned finalizers don't finalize withdrawals.",
        },
      ],
    },
  },
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [],
  },
  permissions: generateDiscoveryDrivenPermissions([discovery]),
  discoveryInfo: getDiscoveryInfo([discovery]),
  interopConfig: {
    description:
      'Canonical USDC bridge between Arbitrum and Hyperliquid L1, validated by a permissioned set of Hyperliquid validators.',
    plugins: [
      {
        plugin: 'hyperliquid-bridge',
        bridgeType: 'lockAndMint',
      },
    ],
    type: 'canonical',
  },
}
