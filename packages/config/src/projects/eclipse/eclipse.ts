import {
  EthereumAddress,
  formatSeconds,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import {
  CONTRACTS,
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
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

const discovery = new ProjectDiscovery('eclipse')

const withdrawalDelaySeconds = discovery.getContractValue<number>(
  'CanonicalBridgeV2',
  'fraudWindowDuration',
)

export const eclipse: ScalingProject = {
  type: 'layer2',
  id: ProjectId('eclipse'),
  capability: 'universal',
  addedAt: UnixTime(1725359142), // 2024-09-03T10:25:42Z
  badges: [BADGES.VM.SolanaVM, BADGES.DA.Celestia],
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.NO_PROOFS,
    REASON_FOR_BEING_OTHER.NO_DA_ORACLE,
  ],
  display: {
    name: 'Eclipse',
    slug: 'eclipse',
    description:
      'Eclipse is a sidechain powered by the Solana Virtual Machine (SVM).',
    purposes: ['Universal'],
    links: {
      websites: ['https://eclipse.xyz/'],
      bridges: ['https://app.eclipse.xyz/'],
      documentation: ['https://docs.eclipse.xyz/'],
      explorers: ['https://eclipsescan.xyz/'],
      repositories: ['https://github.com/Eclipse-Laboratories-Inc'],
      socialMedia: [
        'https://twitter.com/eclipsefnd',
        'https://discord.gg/eclipse-labs',
        'https://mirror.xyz/eclipsemainnet.eth',
      ],
    },
  },
  proofSystem: undefined,
  stage: {
    stage: 'NotApplicable',
  },
  // rpcUrl: 'https://mainnetbeta-rpc.eclipse.xyz', custom VM, i guess it's different
  config: {
    escrows: [
      {
        chain: 'ethereum',
        address: EthereumAddress('0xd7e4b67e735733ac98a88f13d087d8aac670e644'),
        sinceTimestamp: UnixTime(1722140987),
        tokens: ['ETH'],
      },
    ],
    daTracking: [
      {
        type: 'celestia',
        daLayer: ProjectId('celestia'),
        sinceBlock: 0, // Edge Case: config added @ DA Module start
        namespace: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAGVjbGlwc2U=',
      },
    ],
    activityConfig: {
      type: 'slot',
      startSlot: 1,
    },
  },
  dataAvailability: {
    layer: DA_LAYERS.CELESTIA,
    bridge: DA_BRIDGES.NONE,
    mode: DA_MODES.TRANSACTION_DATA,
  },
  riskView: {
    stateValidation: {
      ...RISK_VIEW.STATE_NONE,
      challengeDelay: withdrawalDelaySeconds,
    },
    dataAvailability: RISK_VIEW.DATA_CELESTIA(false),
    exitWindow: RISK_VIEW.EXIT_WINDOW(0, 0),
    sequencerFailure: RISK_VIEW.SEQUENCER_NO_MECHANISM(false),
    proposerFailure: RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
  },
  stateValidation: {
    categories: [
      {
        title: 'No state validation',
        description: `Eclipse implements a custom permissioned bridge. Withdrawals need to be actively authorized by a Multisig. Moreover, there is no mechanism to send arbitrary messages from Eclipse back to Ethereum. There is a ${formatSeconds(withdrawalDelaySeconds)} delay for withdrawals.`,
        references: [
          {
            title:
              'CanonicalBridge.sol - Etherscan source code, authorizeWithdraw() function',
            url: 'https://etherscan.io/address/0x2B08D7cF7EafF0f5f6623d9fB09b080726D4be11#code#F1#L183',
          },
          {
            title:
              'Mailbox.sol - Etherscan source code, receiveMessage() function calls CanonicalBridge',
            url: 'https://etherscan.io/address/0x4cef0fa54dc06ce0ea198dab2f57d28a9dee712b#code#F1#L199',
          },
          {
            title:
              'Treasury.sol - Etherscan source code, emergencyWithdraw() function',
            url: 'https://etherscan.io/address/0xF1F7a359C3f33EE8A66bdCbf4c897D25Caf90978#code',
          },
        ],
        risks: [
          {
            category: 'Users can be censored if',
            text: 'the bridge operators decide not to mint tokens after observing a deposit.',
          },
          {
            category: 'Funds can be stolen if',
            text: 'the Treasury owner decides to transfer the funds locked on L1.',
          },
        ],
      },
    ],
  },
  permissions: generateDiscoveryDrivenPermissions([discovery]),
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  chainConfig: {
    name: 'eclipse',
    chainId: undefined,
    apis: [
      {
        type: 'svm-rpc',
        url: 'https://eclipse.helius-rpc.com',
        callsPerMinute: 120,
      },
    ],
  },
  discoveryInfo: getDiscoveryInfo([discovery]),
}
