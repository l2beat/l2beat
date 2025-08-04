import {
  ChainSpecificAddress,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { CONTRACTS, DA_BRIDGES, DA_LAYERS, DA_MODES } from '../../common'
import { BADGES } from '../../common/badges'
import { EXITS } from '../../common/exits'
import { FORCE_TRANSACTIONS } from '../../common/forceTransactions'
import { OPERATOR } from '../../common/operator'
import { RISK_VIEW } from '../../common/riskView'
import { getStage } from '../../common/stages/getStage'
import { STATE_VALIDATION } from '../../common/stateValidation'
import { TECHNOLOGY_DATA_AVAILABILITY } from '../../common/technologyDataAvailability'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'

const discovery = new ProjectDiscovery('termstructure')

const expirationPeriod = discovery.getContractValue<number>(
  'ZkTrueUp',
  'EXPIRATION_PERIOD',
)

const upgrades = {
  upgradableBy: [{ name: 'TermStructure Multisig 1', delay: 'no' }],
}

const treasuryWeight =
  discovery.getContractValue<Record<string, number>>(
    'ZkTrueUp',
    'getFundWeight',
  ).treasury / 100

const insuranceWeight =
  discovery.getContractValue<Record<string, number>>(
    'ZkTrueUp',
    'getFundWeight',
  ).insurance / 100

const vaultWeight =
  discovery.getContractValue<Record<string, number>>(
    'ZkTrueUp',
    'getFundWeight',
  ).vault / 100

export const termstructure: ScalingProject = {
  id: ProjectId('termstructure'),
  capability: 'appchain',
  addedAt: UnixTime(1709724246), // 2024-03-06T11:24:06Z
  dataAvailability: {
    layer: DA_LAYERS.ETH_CALLDATA,
    bridge: DA_BRIDGES.ENSHRINED,
    mode: DA_MODES.STATE_DIFFS,
  },
  badges: [
    BADGES.VM.AppChain,
    BADGES.DA.EthereumCalldata,
    BADGES.Fork.ZKsyncLiteFork,
  ],
  display: {
    name: 'Term Structure',
    slug: 'termstructure',
    description:
      'Term Structure introduces a distinct ZK Rollup solution democratizing fixed-rate and fixed-term borrowing and lending as well as fixed income trading by offering low transaction fees and enabling forced withdrawals.',
    purposes: ['Payments', 'Exchange', 'Lending'],
    category: 'ZK Rollup',
    stacks: ['ZKsync Lite'],
    links: {
      websites: ['https://ts.finance/'],
      bridges: ['https://app.ts.finance/'],
      documentation: ['https://docs.ts.finance/'],
      explorers: ['https://explorer.ts.finance/'],
      repositories: ['https://github.com/term-structure/'],
      socialMedia: [
        'https://twitter.com/TermStructLabs',
        'https://discord.gg/VnyTqGBSzK',
        'https://t.me/termstructure',
        'https://youtube.com/@termstructurelabs',
      ],
    },
    liveness: {
      explanation:
        'Term Structure is a ZK rollup based on ZKsync Lite’s code base that posts state diffs to the L1. For a transaction to be considered final, the state diffs have to be submitted and validity proof should be generated, submitted, and verified. ',
    },
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0x09E01425780094a9754B2bd8A3298f73ce837CF9',
        ),
        sinceTimestamp: UnixTime(1716263903),
        tokens: '*',
      }),
    ],
    trackedTxs: [
      {
        uses: [{ type: 'l2costs', subtype: 'batchSubmissions' }],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0x09E01425780094a9754B2bd8A3298f73ce837CF9',
          ),
          selector: '0x0d874ce4',
          functionSignature:
            'function commitBlocks((uint32,uint64,bytes32,bytes32,bytes32,uint256),(uint32,bytes32,bytes32,uint256,uint16[],bytes)[])',
          sinceTimestamp: UnixTime(1716263903),
        },
      },
      {
        uses: [
          { type: 'liveness', subtype: 'proofSubmissions' },
          { type: 'l2costs', subtype: 'proofSubmissions' },
        ],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0x09E01425780094a9754B2bd8A3298f73ce837CF9',
          ),
          selector: '0x70ab1eb6',
          functionSignature:
            'function verifyBlocks(((uint32,uint64,bytes32,bytes32,bytes32,uint256),(uint256[2],uint256[2][2],uint256[2],uint256[1]))[])',
          sinceTimestamp: UnixTime(1716263903),
        },
      },
      {
        uses: [
          { type: 'liveness', subtype: 'stateUpdates' },
          { type: 'l2costs', subtype: 'stateUpdates' },
        ],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0x09E01425780094a9754B2bd8A3298f73ce837CF9',
          ),
          selector: '0x632a5607',
          functionSignature:
            'function executeBlocks(((uint32,uint64,bytes32,bytes32,bytes32,uint256),bytes[])[])',
          sinceTimestamp: UnixTime(1716263903),
        },
      },
    ],
  },
  type: 'layer2',
  riskView: {
    stateValidation: RISK_VIEW.STATE_ZKP_SN,
    dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
    exitWindow: RISK_VIEW.EXIT_WINDOW(0, expirationPeriod),
    sequencerFailure: RISK_VIEW.SEQUENCER_FORCE_VIA_L1(expirationPeriod),
    proposerFailure: RISK_VIEW.PROPOSER_USE_ESCAPE_HATCH_ZK,
  },
  stage: getStage(
    {
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
        usersCanExitWithoutCooperation: true,
        securityCouncilProperlySetUp: null,
      },
      stage2: {
        proofSystemOverriddenOnlyInCaseOfABug: null,
        fraudProofSystemIsPermissionless: null,
        delayWith30DExitWindow: false,
      },
    },
    {
      additionalConsiderations: {
        short:
          'Term Structure provides the infrastructure for fixed-rate leverage, lending and borrowing. Arbitrary contracts are not supported.',
        long: 'Term Structure provides the infrastructure for fixed-rate leverage, lending and borrowing. Arbitrary contracts are not supported.',
      },
    },
  ),
  stateValidation: {
    categories: [
      {
        ...STATE_VALIDATION.VALIDITY_PROOFS,
        references: [
          {
            title:
              'RollupFacet.sol - Etherscan source code, verifyOneBlock function',
            url: 'https://etherscan.io/address/0x955cdD2E56Ca2776a101a552A318d28fe311398D#code',
          },
        ],
      },
    ],
  },
  technology: {
    dataAvailability: {
      ...TECHNOLOGY_DATA_AVAILABILITY.ON_CHAIN_CALLDATA,
      references: [
        {
          title:
            'RollupFacet.sol - Etherscan source code, _commitOneBlock function',
          url: 'https://etherscan.io/address/0x955cdD2E56Ca2776a101a552A318d28fe311398D#code',
        },
      ],
    },
    operator: {
      ...OPERATOR.CENTRALIZED_OPERATOR,
      references: [
        {
          title:
            'RollupFacet.sol - Etherscan source code, onlyRole in commit, verify, execute functions',
          url: 'https://etherscan.io/address/0x955cdD2E56Ca2776a101a552A318d28fe311398D#code',
        },
      ],
    },
    forceTransactions: {
      ...FORCE_TRANSACTIONS.WITHDRAW_OR_HALT(),
      references: [
        {
          title:
            'AccountFacet.sol - Etherscan source code, forceWithdraw function',
          url: 'https://etherscan.io/address/0x8D0fc76595E42f38c771ecEE627DA5654Ca2E75A#code',
        },
        {
          title:
            'Force Withdrawal and Evacuation Mode - Term Structure documentation',
          url: 'https://docs.ts.finance/zktrue-up/zk-architecture/forced-withdrawal-and-evacuation-mode',
        },
      ],
    },
    exitMechanisms: [
      {
        ...EXITS.REGULAR_WITHDRAWAL('zk'),
        references: [
          {
            title:
              'AccountFacet.sol - Etherscan source code, withdraw function',
            url: 'https://etherscan.io/address/0x8D0fc76595E42f38c771ecEE627DA5654Ca2E75A#code',
          },
          {
            title: 'Withdraw - Term Structure documentation',
            url: 'https://docs.ts.finance/protocol-spec/general/withdraw',
          },
        ],
      },
      {
        ...EXITS.FORCED_WITHDRAWAL(),
        references: [
          {
            title:
              'AccountFacet.sol - Etherscan source code, forceWithdraw function',
            url: 'https://etherscan.io/address/0x8D0fc76595E42f38c771ecEE627DA5654Ca2E75A#code',
          },
          {
            title: 'Forced Withdrawal - Term Structure documentation',
            url: 'https://docs.ts.finance/zktrue-up/zk-architecture/forced-withdrawal-and-evacuation-mode#forced-withdrawal',
          },
        ],
      },
      {
        ...EXITS.EMERGENCY('Evacuation Mode', 'zero knowledge proof'),
        references: [
          {
            title: 'Evacuation Mode - Term Structure documentation',
            url: 'https://docs.ts.finance/zktrue-up/zk-architecture/forced-withdrawal-and-evacuation-mode#evacuation-mode',
          },
        ],
      },
    ],
    otherConsiderations: [
      {
        name: 'Flashloans on escrowed funds',
        description:
          'The protocol allows flashloans with the funds locked with the bridge, for a fee.',
        references: [
          {
            title:
              'FlashloanFacet.sol - Etherscan source code, flashLoan function',
            url: 'https://etherscan.io/address/0xbb629c830a4d153CDE43Cb127b5aff60d1185B8c#code',
          },
        ],
        risks: [
          {
            category: 'Funds can be lost if',
            text: 'the flashloan mechanism is implemented incorrectly.',
          },
        ],
        isIncomplete: true,
      },
    ],
  },
  permissions: {
    ethereum: {
      actors: [
        discovery.getPermissionDetails(
          'Admins',
          discovery.getAccessControlRolePermission('ZkTrueUp', 'ADMIN_ROLE'),
          'Can update the main verifier, the evacuation verifier, can set the flash loan premium, set the half liquidation threshold, the liquidation factor, the borrow rate, the rollover fee, the withdraw protocol fee, the price feed, the stablecoin used, the minimum deposit amount and it can pause the system.',
        ),
        discovery.getMultisigPermission(
          'TermStructure Multisig 1',
          'Owner of the protocol, meaning it can upgrade the project implementation potentially gaining access to all funds.',
        ),
        discovery.getPermissionDetails(
          'Operators',
          discovery.getAccessControlRolePermission('ZkTrueUp', 'OPERATOR_ROLE'),
          'Can add tokens to the system.',
        ),
        discovery.getPermissionDetails(
          'Committers',
          discovery.getAccessControlRolePermission(
            'ZkTrueUp',
            'COMMITTER_ROLE',
          ),
          'Can commit blocks on L1 and revert pending (i.e. not yet executed) blocks.',
        ),
        discovery.getPermissionDetails(
          'Verifiers',
          discovery.getAccessControlRolePermission('ZkTrueUp', 'VERIFIER_ROLE'),
          'Can verify blocks on L1.',
        ),
        discovery.getPermissionDetails(
          'Executers',
          discovery.getAccessControlRolePermission('ZkTrueUp', 'EXECUTER_ROLE'),
          'Can execute blocks on L1.',
        ),
        discovery.getMultisigPermission(
          'TermStructure Multisig 2',
          `Address collecting a portion of protocol fees. Currently set to ${vaultWeight}% of the fees.`,
        ),
        discovery.getMultisigPermission(
          'TermStructure Multisig 3',
          `Address collecting a portion of protocol fees. Currently set to ${insuranceWeight}% of the fees.`,
        ),
        discovery.getMultisigPermission(
          'TermStructure Multisig 4',
          `Address collecting a portion of protocol fees. Currently set to ${treasuryWeight}% of the fees.`,
        ),
      ],
    },
  },
  contracts: {
    addresses: {
      ethereum: [
        discovery.getContractDetails('ZkTrueUp', {
          description:
            'Main contract of the system. It manages deposits, withdrawals, verification, permissions and DeFi operations.',
          ...upgrades,
        }),
        discovery.getContractDetails('Verifier', {
          description: 'Verifier contract used to verify the SNARK proofs.',
          ...upgrades,
        }),
      ],
    },
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  discoveryInfo: getDiscoveryInfo([discovery]),
}
