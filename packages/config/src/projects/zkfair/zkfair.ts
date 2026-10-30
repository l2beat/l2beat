import {
  ChainSpecificAddress,
  EthereumAddress,
  formatSeconds,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import {
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
  FORCE_TRANSACTIONS,
  FRONTRUNNING_RISK,
  REASON_FOR_BEING_OTHER,
  RISK_VIEW,
  SEQUENCER_NO_MECHANISM,
  TECHNOLOGY_DATA_AVAILABILITY,
} from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { agglayerDAC } from '../../templates/agglayer'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'

const discovery = new ProjectDiscovery('zkfair')
const upgradeDelay = discovery.getContractValue<number>(
  'Timelock',
  'getMinDelay',
)
const upgradeDelayString = formatSeconds(upgradeDelay)
const trustedAggregatorTimeout = discovery.getContractValue<number>(
  'ZKFairValidium',
  'trustedAggregatorTimeout',
)
const trustedAggregatorTimeoutString = formatSeconds(trustedAggregatorTimeout)

const pendingStateTimeout = discovery.getContractValue<number>(
  'ZKFairValidium',
  'pendingStateTimeout',
)
const pendingStateTimeoutString = formatSeconds(pendingStateTimeout)
const _HALT_AGGREGATION_TIMEOUT = formatSeconds(
  discovery.getContractValue<number>(
    'ZKFairValidium',
    '_HALT_AGGREGATION_TIMEOUT',
  ),
)

const membersCountDAC = discovery.getContractValue<number>(
  'ZKFairValidiumDAC',
  'getAmountOfMembers',
)

const requiredSignaturesDAC = discovery.getContractValue<number>(
  'ZKFairValidiumDAC',
  'requiredAmountOfSignatures',
)

const nonEmergencyUpgradeText = `Non-emergency validium upgrades require a ${upgradeDelayString} timelock. Emergency upgrades bypass that delay. The token bridge has separate administrative controls.`

const timelockUpgrades = {
  upgradableBy: [{ name: 'ZKFairAdmin', delay: upgradeDelayString }],
  upgradeConsiderations: nonEmergencyUpgradeText,
}

const isForcedBatchDisallowed = discovery.getContractValue<boolean>(
  'ZKFairValidium',
  'isForcedBatchDisallowed',
)

const membersCount = discovery.getContractValue<number>(
  'ZKFairValidiumDAC',
  'getAmountOfMembers',
)

const requiredSignatures = discovery.getContractValue<number>(
  'ZKFairValidiumDAC',
  'requiredAmountOfSignatures',
)

// format: [ [ip, address], ... ]
const dacMembers = discovery
  .getContractValue<
    {
      url: string
      addr: string
    }[]
  >('ZKFairValidiumDAC', 'members')
  .map((e) => e.addr)

export const zkfair: ScalingProject = {
  type: 'layer2',
  id: ProjectId('zkfair'),
  capability: 'universal',
  addedAt: UnixTime(1690815262), // 2023-07-31T14:54:22Z
  badges: [BADGES.VM.EVM, BADGES.DA.DAC, BADGES.Stack.CDKErigon],
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.NO_PROOFS,
    REASON_FOR_BEING_OTHER.NO_DA_ORACLE,
  ],
  display: {
    name: 'ZKFair',
    slug: 'zkfair',
    purposes: ['Universal'],
    redWarning: {
      text: 'Bridge withdrawals require a signature from one configured address. An administrator can withdraw all escrow funds directly. Validium proofs constrain neither path.',
    },
    warning:
      'Forced transactions are disabled. The validium contracts use a data availability committee, and the token bridge uses separate signature validation.',
    description:
      'ZKFair uses Polygon CDK for validium state proofs and a separate signature-authorized bridge for asset transfers.',
    stacks: ['Agglayer CDK'],
    links: {
      websites: ['https://zkfair.io/'],
      bridges: ['https://wallet.zkfair.io/'],
      documentation: ['https://docs.zkfair.io/'],
      explorers: ['https://scan.zkfair.io/'],
      repositories: ['https://github.com/ZKFair'],
      socialMedia: [
        'https://twitter.com/ZKFCommunity',
        'https://t.me/zkfaircommunity',
        'https://mirror.xyz/zkfair.eth',
      ],
    },
  },
  proofSystem: undefined,
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0xb10f60B4Ea978CA02aFBAC57fa84907e8439766e',
        ),
        sinceTimestamp: UnixTime(1744292087),
        tokens: '*',
      }),
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0x9cb4706e20A18E59a48ffa7616d700A3891e1861',
        ),
        sinceTimestamp: UnixTime(1702879283),
        untilTimestamp: UnixTime(1744292087), // funds swept to EOA, then [resupplied to an unverified bridge escrow](https://etherscan.io/tx/0x59304b6420a556c303b4fbcc0608c14d57d06b7aa13366f3851b3be3d6e167ed)
        tokens: '*',
      }),
    ],
    associatedTokens: ['ZKF'],
    activityConfig: {
      type: 'block',
      startBlock: 1,
    },
  },
  chainConfig: {
    name: 'zkfair',
    chainId: 42766,
    explorerUrl: 'https://scan.zkfair.io',
    // ~ Timestamp of block number 0 on zkFair
    // https://scan.zkfair.io/block/0
    sinceTimestamp: UnixTime.fromDate(new Date('2023-12-19T20:00:00Z')),
    multicallContracts: [
      {
        sinceBlock: 6330383,
        batchSize: 150,
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        version: '3',
      },
    ],
    coingeckoPlatform: 'zkfair',
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.zkfair.io',
        callsPerMinute: 600,
        retryStrategy: 'UNRELIABLE',
      },
      { type: 'blockscout', url: 'https://scan.zkfair.io/api/' },
    ],
  },
  dataAvailability: {
    layer: DA_LAYERS.DAC,
    bridge: DA_BRIDGES.DAC_MEMBERS({
      requiredSignatures,
      membersCount,
    }),
    mode: DA_MODES.STATE_DIFFS,
  },
  riskView: {
    stateValidation: RISK_VIEW.STATE_NONE,
    dataAvailability: RISK_VIEW.DATA_EXTERNAL_DAC({
      membersCount,
      requiredSignatures,
    }),
    exitWindow: RISK_VIEW.EXIT_WINDOW(0, 0),
    // this will change once the isForcedBatchDisallowed is set to false inside Polygon ZkEvm contract (if they either lower timeouts or increase the timelock delay)
    sequencerFailure: SEQUENCER_NO_MECHANISM(isForcedBatchDisallowed),
    proposerFailure: RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
  },
  stage: {
    stage: 'NotApplicable',
  },
  stateValidation: {
    categories: [
      {
        title: 'No state validation',
        description:
          'The token bridge accepts an EIP-712 signature recovering to its configured address. It checks no source-chain proof or threshold of distinct signers. A used source-domain nonce prevents replay. The escrow also accepts unrestricted withdrawals instructed by the bridge administration.',
        risks: [
          {
            category: 'Funds can be stolen if',
            text: 'the bridge signing key authorizes an arbitrary token release.',
          },
          {
            category: 'Funds can be stolen if',
            text: 'the bridge withdrawal authority sends escrow funds to itself.',
          },
        ],
        references: [
          {
            title: 'TokenBridge - verify, executeProposals and adminWithdraw',
            url: 'https://etherscan.io/address/0xB66bbf236CE102A1De692f2A034b9dB245986671#code',
          },
          {
            title: 'ERC20Handler - executeProposal and withdraw',
            url: 'https://etherscan.io/address/0xb10f60B4Ea978CA02aFBAC57fa84907e8439766e#code',
          },
        ],
      },
      {
        title: 'Validity proofs',
        description:
          'ZKFairValidium verifies proofs of state transitions using an Fflonk verifier. Its verified state and exit roots do not authorize releases from the current token escrow.',
        references: [
          {
            title:
              'ZKFairValidium.sol#L758 - Etherscan source code, _verifyAndRewardBatches function',
            url: 'https://etherscan.io/address/0x668965757127549f8755D2eEd10494B06420213b#code#F8#L758',
          },
        ],
      },
    ],
  },
  technology: {
    dataAvailability: {
      ...TECHNOLOGY_DATA_AVAILABILITY.GENERIC_OFF_CHAIN,
      references: [
        {
          title:
            'ZKFairValidium.sol#L494 - Etherscan source code, sequencedBatches mapping',
          url: 'https://etherscan.io/address/0x668965757127549f8755D2eEd10494B06420213b#code#F8#L494',
        },
      ],
    },
    operator: {
      name: 'The system has a centralized sequencer',
      description:
        'Only a trusted sequencer is allowed to submit transaction batches. A mechanism for users to submit their own batches is currently disabled.',
      risks: [
        FRONTRUNNING_RISK,
        {
          category: 'Funds can be frozen if',
          text: 'the sequencer refuses to include an exit transaction.',
          isCritical: true,
        },
      ],
      references: [
        {
          title:
            'ZKFairValidium.sol#L61 - Etherscan source code, onlyTrustedSequencer modifier',
          url: 'https://etherscan.io/address/0x668965757127549f8755D2eEd10494B06420213b#code#F8#L461',
        },
      ],
    },
    forceTransactions: {
      ...FORCE_TRANSACTIONS.SEQUENCER_NO_MECHANISM,
      description:
        'The mechanism for allowing users to submit their own transactions is currently disabled.',
      references: [
        {
          title:
            'ZKFairValidium.sol#L475 - Etherscan source code, isForceBatchAllowed modifier',
          url: 'https://etherscan.io/address/0x668965757127549f8755D2eEd10494B06420213b#code#F8#L475',
        },
      ],
    },
    exitMechanisms: [
      {
        name: 'Signature-authorized withdrawal',
        description:
          'Users depend on the bridge signing address to authorize withdrawals. Anyone can submit its valid signature and proposal to release tokens from the escrow. A validium proof cannot replace the signature.',
        risks: [
          {
            category: 'Funds can be frozen if',
            text: 'the bridge signing address stops authorizing withdrawals or the administration pauses the token bridge.',
          },
        ],
        references: [
          {
            title: 'TokenBridge - executeProposal and executeProposals',
            url: 'https://etherscan.io/address/0xB66bbf236CE102A1De692f2A034b9dB245986671#code',
          },
        ],
      },
    ],
  },
  permissions: {
    ethereum: {
      actors: [
        discovery.getPermissionDetails(
          'Bridge signing address',
          discovery.getPermissionedAccounts('TokenBridge', '_MPCAddress'),
          'Its ECDSA signature can authorize arbitrary releases from the current token escrow. The contract enforces no threshold of distinct signers.',
        ),
        discovery.getPermissionDetails(
          'Bridge permissions administrator',
          discovery.getPermissionedAccounts(
            'AccessControlSegregator',
            'grantAccessAccount',
          ),
          'Can replace every per-function bridge authority, including withdrawal and access-control replacement authorities, without delay.',
        ),
        discovery.getPermissionDetails(
          'Bridge withdrawal authority',
          discovery.getPermissionedAccounts(
            'AccessControlSegregator',
            'withdrawAccount',
          ),
          'Can withdraw all escrow funds directly through the token bridge, without a validium proof or bridge signature.',
        ),
        discovery.getPermissionDetails(
          'Sequencer',
          discovery.getPermissionedAccounts(
            'ZKFairValidium',
            'trustedSequencer',
          ),
          'Its sole purpose and ability is to submit transaction batches. In case they are unavailable users cannot rely on the force batch mechanism because it is currently disabled.',
        ),
        discovery.getPermissionDetails(
          'Proposer',
          discovery.getPermissionedAccounts(
            'ZKFairValidium',
            'trustedAggregator',
          ),
          `The trusted proposer (called Aggregator) provides the ZKFairValidium contract with ZK proofs of the new system state. In case they are unavailable a mechanism for users to submit proofs on their own exists, but is behind a ${trustedAggregatorTimeoutString} delay for proving and a ${pendingStateTimeoutString} delay for finalizing state proven in this way. These delays can only be lowered except during the emergency state.`,
        ),
        discovery.getMultisigPermission(
          'ZKFairAdmin',
          'Admin of the ZKFairValidium, can set core system parameters like timeouts, sequencer and aggregator as well as deactivate emergency state.',
        ),
        discovery.getMultisigPermission(
          'ZKFairOwner',
          'The ZkFair Owner is a multisig that can be used to trigger the emergency state which restricts advancing system state and removes the upgradeability delay.',
        ),
        discovery.getPermissionDetails(
          'DAC members',
          discovery.formatPermissionedAccounts(dacMembers),
          `Members of the Data Availability Committee. The setup is equivalent to a ${requiredSignatures}/${membersCount} multisig.`,
        ),
        discovery.getPermissionDetails(
          'DAC Owner',
          discovery.getPermissionedAccounts('ZKFairValidiumDAC', 'owner'),
          'The owner of the Data Availability Committee, can update the member set at any time.',
        ),
        discovery.getPermissionDetails(
          'TimelockExecutor',
          discovery.getAccessControlRolePermission('Timelock', 'EXECUTOR_ROLE'),
          'Controls the upgrades to the ZKFairValidiumDAC and ZKFairValidium contracts through the Timelock. ',
        ),
      ],
    },
  },
  contracts: {
    addresses: {
      ethereum: [
        discovery.getContractDetails('ZKFairValidium', {
          description: `The main contract of the Polygon CDK Validium. It defines the rules of the system including core system parameters, permissioned actors as well as emergency procedures. The emergency state can be activated either by the ZkFair Owner, by proving a soundness error or by presenting a sequenced batch that has not been aggregated before a ${_HALT_AGGREGATION_TIMEOUT} timeout. This contract receives transaction roots, L2 state roots as well as ZK proofs. It also holds the address of ZKFairValidiumDAC.`,
          ...timelockUpgrades,
          references: [
            {
              title:
                'State injections - stateRoot and exitRoot are part of the validity proof input.',
              url: 'https://etherscan.io/address/0x668965757127549f8755D2eEd10494B06420213b#code#F8#L809',
            },
          ],
        }),
        discovery.getContractDetails('Bridge', {
          description:
            'ERC20Handler escrow holding ERC20 tokens and ETH. Only TokenBridge can release or withdraw funds. Validium proofs do not constrain these releases.',
        }),
        discovery.getContractDetails('TokenBridge'),
        discovery.getContractDetails('AccessControlSegregator'),
        discovery.getContractDetails('FeeHandlerRouter'),
        discovery.getContractDetails('OldBridge', {
          description:
            'Deprecated! Was the escrow contract for user funds. It is mirrored on the L2 side and can be used to transfer ERC20 assets. To transfer funds a user initiated transaction on both sides is required.',
          ...timelockUpgrades,
        }),
        discovery.getContractDetails('GlobalExitRoot', {
          description:
            'Synchronizes deposit and withdraw merkle trees across L1 and L2. The global root from this contract is injected into the L2 contract.',
          ...timelockUpgrades,
        }),
        discovery.getContractDetails(
          'FflonkVerifier',
          'An autogenerated contract that verifies ZK proofs in the ZKFairValidium system.',
        ),
        discovery.getContractDetails('ZKFairValidiumDAC', {
          description:
            'Committee attesting that data for a given dataRoot has been published. The DAC Owner can update the member set at any time.',
          ...timelockUpgrades,
        }),
        discovery.getContractDetails('Timelock', {
          description: `Contract upgrades have to go through a ${upgradeDelayString} timelock unless the Emergency State is activated. It is controlled by the TimelockExecutor.`,
        }),
      ],
    },
    risks: [
      {
        category: 'Funds can be stolen if',
        text: 'the bridge administration changes withdrawal permissions or asset routes without delay.',
      },
    ],
  },
  milestones: [
    {
      title: 'ZKFair Mainnet is Live',
      url: 'https://twitter.com/ZKFCommunity/status/1737307444181869017',
      date: '2023-12-20T00:00:00Z',
      description: 'ZKFair launched.',
      type: 'general',
    },
  ],
  customDa: agglayerDAC({
    dac: {
      requiredMembers: requiredSignaturesDAC,
      membersCount: membersCountDAC,
    },
  }),
  discoveryInfo: getDiscoveryInfo([discovery]),
}
