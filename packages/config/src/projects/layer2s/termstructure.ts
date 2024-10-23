import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { CONTRACTS, addSentimentToDataAvailability } from '../../common'
import { EXITS } from '../../common/exits'
import { FORCE_TRANSACTIONS } from '../../common/forceTransactions'
import { NEW_CRYPTOGRAPHY } from '../../common/newCryptography'
import { OPERATOR } from '../../common/operator'
import { RISK_VIEW } from '../../common/riskView'
import { STATE_CORRECTNESS } from '../../common/stateCorrectness'
import { TECHNOLOGY_DATA_AVAILABILITY } from '../../common/technologyDataAvailability'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { getStage } from './common/stages/getStage'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('termstructure')

const expirationPeriod = discovery.getContractValue<number>(
  'ZkTrueUp',
  'EXPIRATION_PERIOD',
)

const upgrades = {
  upgradableBy: ['TermStructureMultisig'],
  upgradeDelay: 'None',
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

export const termstructure: Layer2 = {
  id: ProjectId('termstructure'),
  createdAt: new UnixTime(1709724246), // 2024-03-06T11:24:06Z
  dataAvailability: addSentimentToDataAvailability({
    layers: ['Ethereum (calldata)'],
    bridge: { type: 'Enshrined' },
    mode: 'State diffs',
  }),
  badges: [
    Badge.VM.AppChain,
    Badge.DA.EthereumCalldata,
    Badge.Fork.ZKsyncLiteFork,
  ],
  display: {
    name: 'Term Structure',
    slug: 'termstructure',
    description:
      'Term Structure introduces a distinct ZK Rollup solution democratizing fixed-rate and fixed-term borrowing and lending as well as fixed income trading by offering low transaction fees and enabling forced withdrawals.',
    purposes: ['Payments', 'Exchange', 'Lending'],
    category: 'ZK Rollup',
    provider: 'ZKsync Lite',
    links: {
      websites: ['https://ts.finance/'],
      apps: ['https://app.ts.finance/'],
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
    finality: {
      finalizationPeriod: 0,
    },
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0x09E01425780094a9754B2bd8A3298f73ce837CF9'),
        sinceTimestamp: new UnixTime(1716263903),
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
          sinceTimestamp: new UnixTime(1716263903),
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
          sinceTimestamp: new UnixTime(1716263903),
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
          sinceTimestamp: new UnixTime(1716263903),
        },
      },
    ],
  },
  type: 'layer2',
  riskView: {
    stateValidation: {
      ...RISK_VIEW.STATE_ZKP_SN,
      sources: [
        {
          contract: 'Verifier',
          references: [
            'https://etherscan.io/address/0x23369A60E5A8f422E38d799eD55e7AD8Ed4A86cE',
          ],
        },
      ],
    },
    dataAvailability: {
      ...RISK_VIEW.DATA_ON_CHAIN,
      sources: [
        {
          contract: 'RollupFacet',
          references: [
            'https://etherscan.io/address/0x955cdD2E56Ca2776a101a552A318d28fe311398D#writeContract',
          ],
        },
      ],
    },
    exitWindow: RISK_VIEW.EXIT_WINDOW(0, expirationPeriod),
    sequencerFailure: RISK_VIEW.SEQUENCER_FORCE_VIA_L1(expirationPeriod),
    proposerFailure: RISK_VIEW.PROPOSER_USE_ESCAPE_HATCH_ZK,
    destinationToken: RISK_VIEW.NATIVE_AND_CANONICAL(),
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
  },
  stage: getStage({
    stage0: {
      callsItselfRollup: true,
      stateRootsPostedToL1: true,
      dataAvailabilityOnL1: true,
      rollupNodeSourceAvailable: 'UnderReview',
    },
    stage1: {
      stateVerificationOnL1: true,
      fraudProofSystemAtLeast5Outsiders: null,
      usersHave7DaysToExit: false,
      usersCanExitWithoutCooperation: true,
      securityCouncilProperlySetUp: null,
    },
    stage2: {
      proofSystemOverriddenOnlyInCaseOfABug: null,
      fraudProofSystemIsPermissionless: null,
      delayWith30DExitWindow: false,
    },
  }),
  technology: {
    stateCorrectness: {
      ...STATE_CORRECTNESS.VALIDITY_PROOFS,
      references: [
        {
          text: 'RollupFacet.sol - Etherscan source code, verifyOneBlock function',
          href: 'https://etherscan.io/address/0x955cdD2E56Ca2776a101a552A318d28fe311398D#code',
        },
      ],
    },
    newCryptography: {
      ...NEW_CRYPTOGRAPHY.ZK_SNARKS,
      references: [
        {
          text: 'Verifier.sol - Etherscan source code',
          href: 'https://etherscan.io/address/0x23369A60E5A8f422E38d799eD55e7AD8Ed4A86cE',
        },
        {
          text: 'EvacuVerifier.sol - Etherscan source code',
          href: 'https://etherscan.io/address/0x9c7Df3981A89eD04588907843fe2a6c1BcCc4467#code',
        },
      ],
    },
    dataAvailability: {
      ...TECHNOLOGY_DATA_AVAILABILITY.ON_CHAIN_CALLDATA,
      references: [
        {
          text: 'RollupFacet.sol - Etherscan source code, _commitOneBlock function',
          href: 'https://etherscan.io/address/0x955cdD2E56Ca2776a101a552A318d28fe311398D#code',
        },
      ],
    },
    operator: {
      ...OPERATOR.CENTRALIZED_OPERATOR,
      references: [
        {
          text: 'RollupFacet.sol - Etherscan source code, onlyRole in commit, verify, execute functions',
          href: 'https://etherscan.io/address/0x955cdD2E56Ca2776a101a552A318d28fe311398D#code',
        },
      ],
    },
    forceTransactions: {
      ...FORCE_TRANSACTIONS.WITHDRAW_OR_HALT(),
      references: [
        {
          text: 'AccountFacet.sol - Etherscan source code, forceWithdraw function',
          href: 'https://etherscan.io/address/0x8D0fc76595E42f38c771ecEE627DA5654Ca2E75A#code',
        },
        {
          text: 'Force Withdrawal and Evacuation Mode - Term Structure documentation',
          href: 'https://docs.ts.finance/zktrue-up/zk-architecture/forced-withdrawal-and-evacuation-mode',
        },
      ],
    },
    exitMechanisms: [
      {
        ...EXITS.REGULAR('zk', 'no proof'),
        references: [
          {
            text: 'AccountFacet.sol - Etherscan source code, withdraw function',
            href: 'https://etherscan.io/address/0x8D0fc76595E42f38c771ecEE627DA5654Ca2E75A#code',
          },
          {
            text: 'Withdraw - Term Structure documentation',
            href: 'https://docs.ts.finance/protocol-spec/general/withdraw',
          },
        ],
      },
      {
        ...EXITS.FORCED(),
        references: [
          {
            text: 'AccountFacet.sol - Etherscan source code, forceWithdraw function',
            href: 'https://etherscan.io/address/0x8D0fc76595E42f38c771ecEE627DA5654Ca2E75A#code',
          },
          {
            text: 'Forced Withdrawal - Term Structure documentation',
            href: 'https://docs.ts.finance/zktrue-up/zk-architecture/forced-withdrawal-and-evacuation-mode#forced-withdrawal',
          },
        ],
      },
      {
        ...EXITS.EMERGENCY('Evacuation Mode', 'zero knowledge proof'),
        references: [
          {
            text: 'Evacuation Mode - Term Structure documentation',
            href: 'https://docs.ts.finance/zktrue-up/zk-architecture/forced-withdrawal-and-evacuation-mode#evacuation-mode',
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
            text: 'FlashloanFacet.sol - Etherscan source code, flashLoan function',
            href: 'https://etherscan.io/address/0xbb629c830a4d153CDE43Cb127b5aff60d1185B8c#code',
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
  permissions: [
    {
      name: 'Admins',
      accounts: discovery.getAccessControlRolePermission(
        'ZkTrueUp',
        'ADMIN_ROLE',
      ),
      description:
        'Can update the main verifier, the evacuation verifier, can set the flash loan premium, set the half liquidation threshold, the liquidation factor, the borrow rate, the rollover fee, the withdraw protocol fee, the price feed, the stablecoin used, the minimum deposit amount and it can pause the system.',
    },
    ...discovery.getMultisigPermission(
      'TermStructureMultisig',
      'Owner of the protocol, meaning it can upgrade the project implementation potentially gaining access to all funds.',
    ),
    {
      name: 'Operators',
      accounts: discovery.getAccessControlRolePermission(
        'ZkTrueUp',
        'OPERATOR_ROLE',
      ),
      description: 'Can add tokens to the system.',
    },
    {
      name: 'Committers',
      accounts: discovery.getAccessControlRolePermission(
        'ZkTrueUp',
        'COMMITTER_ROLE',
      ),
      description:
        'Can commit blocks on L1 and revert pending (i.e. not yet executed) blocks.',
    },
    {
      name: 'Verifiers',
      accounts: discovery.getAccessControlRolePermission(
        'ZkTrueUp',
        'VERIFIER_ROLE',
      ),
      description: 'Can verify blocks on L1.',
    },
    {
      name: 'Executers',
      accounts: discovery.getAccessControlRolePermission(
        'ZkTrueUp',
        'EXECUTER_ROLE',
      ),
      description: 'Can execute blocks on L1.',
    },
    ...discovery.getMultisigPermission(
      'VaultMultisig',
      `Address collecting a portion of protocol fees. Currently set to ${vaultWeight}% of the fees.`,
    ),
    ...discovery.getMultisigPermission(
      'InsuranceMultisig',
      `Address collecting a portion of protocol fees. Currently set to ${insuranceWeight}% of the fees.`,
    ),
    ...discovery.getMultisigPermission(
      'TreasuryMultisig',
      `Address collecting a portion of protocol fees. Currently set to ${treasuryWeight}% of the fees.`,
    ),
  ],
  contracts: {
    addresses: [
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
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
}
