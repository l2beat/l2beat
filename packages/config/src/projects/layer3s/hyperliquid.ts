import {
  EthereumAddress,
  ProjectId,
  UnixTime,
  formatSeconds,
} from '@l2beat/shared-pure'
import { DA_LAYERS, DA_MODES, OPERATOR, RISK_VIEW } from '../../common'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Layer3 } from '../../types'
import { Badge } from '../badges'
import { generateDiscoveryDrivenContracts } from '../layer2s/templates/generateDiscoveryDrivenSections'

const discovery = new ProjectDiscovery('hyperliquid', 'arbitrum')

// TODO(radomski): Where are they from?
const hotAddresses = [
  EthereumAddress('0xEF2364dB5db6F5539Aa0bC111771a94Ee47637Fc'),
  EthereumAddress('0xda6816df552c3f9e0FB64979fb357800d690d79B'),
  EthereumAddress('0x58E1b0E63C905D5982324FCd9108582623b8132e'),
  EthereumAddress('0x263294039413B96D25E4173a5F7599F8b3801504'),
]

const coldAddresses = [
  EthereumAddress('0x8003FD297a7Aa477B746825E7A506675bF590E91'),
  EthereumAddress('0x86d6AE3032732F27239075D77a1317989B52F628'),
  EthereumAddress('0xE346B41B47296153A21E64D6bFc857C27874C6e7'),
  EthereumAddress('0x5a92b4A6a525445c9B4FFf61C0db71dCfE305ede'),
]

//const validatorSetPowers = [1, 1, 1, 1]

const challengePeriod = discovery.getContractValue<number>(
  'HyperliquidBridge',
  'disputePeriodSeconds',
)

const validatorSetSize = discovery.getContractValue<number>(
  'HyperliquidBridge',
  'nValidators',
)

const lockerThreshold = discovery.getContractValue<number>(
  'HyperliquidBridge',
  'lockerThreshold',
)

export const hyperliquid: Layer3 = {
  type: 'layer3',
  id: ProjectId('hyperliquid'),
  capability: 'appchain',
  hostChain: ProjectId('arbitrum'),
  addedAt: new UnixTime(1734956888), // 2024-12-23T13:28:48Z
  badges: [Badge.VM.AppChain, Badge.DA.CustomDA],
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.NO_PROOFS,
    REASON_FOR_BEING_OTHER.SMALL_DAC,
  ],
  display: {
    name: 'Hyperliquid',
    slug: 'hyperliquid',
    description:
      'Hyperliquid is a performant exchange on Arbitrum, utilizing a custom consensus algorithm called HyperBFT.',
    purposes: ['Exchange'],
    category: 'Other',
    links: {
      websites: ['https://hyperfoundation.org/'],
      explorers: ['https://app.hyperliquid.xyz/explorer'],
      apps: ['https://app.hyperliquid.xyz/trade'],
      socialMedia: ['https://x.com/HyperliquidX'],
      documentation: ['https://hyperliquid.gitbook.io/hyperliquid-docs'],
    },
  },
  config: {
    escrows: [
      {
        chain: 'arbitrum',
        includeInTotal: false,
        address: EthereumAddress('0x2Df1c51E09aECF9cacB7bc98cB1742757f163dF7'),
        sinceTimestamp: new UnixTime(1701389130),
        tokens: ['USDC'],
      },
    ],
  },
  dataAvailability: {
    layer: DA_LAYERS.HYPERLIQUID_DA,
    bridge: {
      value: `${validatorSetSize} validators`,
      sentiment: 'bad',
      description:
        'The bridge verifies that at least 2/3+1 of the Huperliquid validators have signed off a withdrawal request.',
    },
    mode: DA_MODES.TRANSACTION_DATA,
  },
  riskView: {
    stateValidation: RISK_VIEW.STATE_NONE,
    dataAvailability: RISK_VIEW.DATA_EXTERNAL,
    exitWindow: RISK_VIEW.EXIT_WINDOW(0, challengePeriod),
    sequencerFailure: RISK_VIEW.SEQUENCER_NO_MECHANISM(false),
    proposerFailure: RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
  },
  stage: { stage: 'NotApplicable' },
  stackedRiskView: {
    stateValidation: RISK_VIEW.STATE_NONE,
    dataAvailability: RISK_VIEW.DATA_EXTERNAL,
    exitWindow: RISK_VIEW.EXIT_WINDOW(0, challengePeriod),
    sequencerFailure: RISK_VIEW.SEQUENCER_NO_MECHANISM(false),
    proposerFailure: RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
  },
  technology: {
    operator: {
      ...OPERATOR.CENTRALIZED_OPERATOR,
      description: `Hyperliquid is composed of two sets of permissioned validators, one being a "hot" validator set, and the other being a cold one. The hot validator set is responsible for initiating withdrawals upon user requests, while cold validators are responsible for vetoing them and rotate the hot set in case of failure. Both sets are currently composed of ${validatorSetSize} validators with equal power. The system accepts a request if signed by 2/3+1 of validators power. A different set of permissioned actors (lockers) can pause the bridge in case of ermengecies, while finalizers are responsible to finalize withdrawals and validator set updates.`,
      risks: [
        ...OPERATOR.CENTRALIZED_OPERATOR.risks,
        {
          category: 'Funds can be stolen if',
          text: 'the permissioned validator majority sign an invalid withdrawal request.',
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
  permissions: {
    [discovery.chain]: {
      actors: [
        discovery.getPermissionDetails(
          'Hot validators',
          discovery.formatPermissionedAccounts(hotAddresses),
          'Permissioned actors responsible for initiating withdrawals upon user requests. They can also update the challenge period, both hot and cold validator sets with a delay, and add or remove lockers and finalizers. The system accepts a request if signed by 2/3+1 of validators power. Currently all validators have equal power.',
        ),
        discovery.getPermissionDetails(
          'Cold validators',
          discovery.formatPermissionedAccounts(coldAddresses),
          `Permissioned actors responsible for vetoing withdrawals and validator set rotations initiated by hot validators within ${formatSeconds(challengePeriod)}. They can also update the block time, change the lockers threshold, and rotate the hot validator set in case of a failure, and its own set. The system accepts a request if signed by 2/3+1 of validators power. Currently all validators have equal power.`,
        ),
        discovery.getPermissionDetails(
          'Lockers',
          [
            ...discovery.getPermissionedAccounts(
              'HyperliquidBridge',
              'lockers',
            ),
            ...discovery.formatPermissionedAccounts(
              discovery.getContractValue<{ hotAddresses: string[] }>(
                'HyperliquidBridge',
                'constructorArgs',
              )['hotAddresses'],
            ),
          ],
          `Permissioned actors responsible for pausing the bridge in case of an emergency. The current threshold to activate a pause is ${lockerThreshold}.`,
        ),
        discovery.getPermissionDetails(
          'Finalizers',
          [
            ...discovery.getPermissionedAccounts(
              'HyperliquidBridge',
              'finalizers',
            ),
            ...discovery.formatPermissionedAccounts(
              discovery.getContractValue<{ hotAddresses: string[] }>(
                'HyperliquidBridge',
                'constructorArgs',
              )['hotAddresses'],
            ),
          ],
          'Permissioned actors responsible for finalizing withdrawals and validator set updates.',
        ),
      ],
    },
  },
}
