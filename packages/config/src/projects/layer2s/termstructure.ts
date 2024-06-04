import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import {
  CONTRACTS,
  EXITS,
  FORCE_TRANSACTIONS,
  NEW_CRYPTOGRAPHY,
  OPERATOR,
  RISK_VIEW,
  STATE_CORRECTNESS,
  TECHNOLOGY_DATA_AVAILABILITY,
  addSentimentToDataAvailability,
  makeBridgeCompatible,
} from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { getStage } from './common/stages/getStage'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('termstructure')

const upgradeDelay = 0

const forcedWithdrawalDelay = discovery.getContractValue<number>(
  'RollupFacet',
  'EXPIRATION_PERIOD',
)

export const termstructure: Layer2 = {
  type: 'layer2',
  id: ProjectId('termstructure'),
  display: {
    name: 'Term Structure',
    redWarning:
      'Critical contracts can be upgraded by EOAs which could result in the loss of all funds.',
    slug: 'termstructure',
    description:
      'Term Structure introduces a distinct ZK Rollup solution democratizing fixed-rate and fixed-term borrowing and lending as well as fixed income trading by offering low transaction fees and enabling forced withdrawals.',
    purposes: ['DeFi', 'Lending'],
    category: 'ZK Rollup',
    provider: 'zkSync Lite',
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
    activityDataSource: 'Explorer API',
    liveness: {
      explanation:
        "Term Structure is a ZK Rollup based on zkSync Lite's code. For a transaction to be considered final, the transaction inputs have to be submitted and a validity proof verified. ",
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
            '0x09E01425780094a9754B2bd8A3298f73ce837CF9', // rollup diamond
          ),
          selector: '0x0d874ce4',
          functionSignature:
            'function commitBlocks((uint32,uint64,bytes32,bytes32,bytes32,uint256), (uint32,bytes32,bytes32,uint256,uint16[],bytes)[])',
          sinceTimestampInclusive: new UnixTime(1716461255), // first commitBlocks tx (https://etherscan.io/tx/0x0c7cc0163d206f60d11e069627502a84d2868a3274b016ec355f89464e8b3df7)
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
            '0x955cdD2E56Ca2776a101a552A318d28fe311398D',
          ),
          selector: '0x70ab1eb6',
          functionSignature:
            'function verifyBlocks(((uint32,uint64,bytes32,bytes32,bytes32,uint256), (uint256[2],uint256[2][2],uint256[2],uint256[1]) )[])',
          sinceTimestampInclusive: new UnixTime(1716461255),
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
            '0x955cdD2E56Ca2776a101a552A318d28fe311398D',
          ),
          selector: '0x632a5607',
          functionSignature:
            'function executeBlocks(((uint32 blockNumber, uint64 l1RequestNum, bytes32 pendingRollupTxHash, bytes32 commitment, bytes32 stateRoot, uint256 timestamp) storedBlock, bytes[] pendingRollupTxPubData)[] pendingBlocks)',
          sinceTimestampInclusive: new UnixTime(1716461255),
        },
      },
    ],
    finality: {
      type: 'zkSyncLite',
      minTimestamp: new UnixTime(1716461255),
      lag: 0,
      stateUpdate: 'disabled',
    },
  },
  dataAvailability: addSentimentToDataAvailability({
    layers: ['Ethereum (calldata)'],
    bridge: { type: 'Enshrined' },
    mode: 'Transactions data',
  }),
  riskView: makeBridgeCompatible({
    stateValidation: {
      ...RISK_VIEW.STATE_ZKP_SN,
      sources: [
        {
          contract: 'RollupFacet',
          references: [
            'https://etherscan.io/address/0x955cdD2E56Ca2776a101a552A318d28fe311398D#code#F1#L67',
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
            'https://etherscan.io/address/0x955cdD2E56Ca2776a101a552A318d28fe311398D#code#F1#L53',
          ],
        },
      ],
    },
    exitWindow: RISK_VIEW.EXIT_WINDOW(upgradeDelay, forcedWithdrawalDelay, 0),
    sequencerFailure: {
      ...RISK_VIEW.SEQUENCER_FORCE_VIA_L1(forcedWithdrawalDelay),
      sources: [
        {
          contract: 'AccountFacet',
          references: [
            'https://etherscan.io/address/0x8D0fc76595E42f38c771ecEE627DA5654Ca2E75A#code#F1#L105',
          ],
        },
      ],
    },
    proposerFailure: {
      ...RISK_VIEW.PROPOSER_USE_ESCAPE_HATCH_ZK,
      sources: [
        {
          contract: 'EvacuationFacet',
          references: [
            'https://etherscan.io/address/0x882aBFb2F6A67d36350499991638044e8Bd83a72#code#F1#L46',
            'https://etherscan.io/address/0x882aBFb2F6A67d36350499991638044e8Bd83a72#code#F1#L134',
          ],
        },
      ],
    },
    destinationToken: RISK_VIEW.NATIVE_AND_CANONICAL(),
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
  }),
  stage: getStage(
    {
      stage0: {
        callsItselfRollup: true,
        stateRootsPostedToL1: true,
        dataAvailabilityOnL1: true,
        rollupNodeSourceAvailable: true,
      },
      stage1: {
        stateVerificationOnL1: true,
        fraudProofSystemAtLeast5Outsiders: null,
        usersHave7DaysToExit: false,
        usersCanExitWithoutCooperation: true,
        securityCouncilProperlySetUp: false,
      },
      stage2: {
        proofSystemOverriddenOnlyInCaseOfABug: false,
        fraudProofSystemIsPermissionless: null,
        delayWith30DExitWindow: false,
      },
    },
    {
      rollupNodeLink:
        'https://github.com/term-structure/Term-Structure-Evacuation-Kit',
    },
  ),
  technology: {
    stateCorrectness: {
      ...STATE_CORRECTNESS.VALIDITY_PROOFS,
      references: [
        {
          text: 'Operator - Term Structure Docs',
          href: 'https://docs.ts.finance/architecture/rollup-services#operator',
        },
        {
          text: 'RollupFacet.sol#L67 - Etherscan source code, verifyBlocks function',
          href: 'https://etherscan.io/address/0x955cdD2E56Ca2776a101a552A318d28fe311398D#code#F1#L67',
        },
      ],
    },
    newCryptography: {
      ...NEW_CRYPTOGRAPHY.ZK_SNARKS,
      references: [
        {
          text: 'Zero-Knowledge Proofs - Term Structure Docs',
          href: 'https://docs.ts.finance/zktrue-up/zk-and-zk-rollups/zero-knowledge-proofs',
        },
        {
          text: 'Verifier.sol#L62 - Etherscan source code, verifyProof function',
          href: 'https://etherscan.io/address/0x23369A60E5A8f422E38d799eD55e7AD8Ed4A86cE#code#F1#L62',
        },
      ],
    },
    dataAvailability: {
      ...TECHNOLOGY_DATA_AVAILABILITY.ON_CHAIN_CALLDATA,
      references: [
        {
          text: 'ZK Engine - Term Structure Docs',
          href: 'https://docs.ts.finance/architecture/rollup-services#zk-engine',
        },
        {
          text: 'RollupFacet.sol#L53 - Etherscan source code, commitBlocks function',
          href: 'https://etherscan.io/address/0x955cdD2E56Ca2776a101a552A318d28fe311398D#code#F1#L53',
        },
      ],
    },
    operator: {
      ...OPERATOR.CENTRALIZED_OPERATOR,
      references: [
        {
          text: 'Rollup Services - Term Structure Docs',
          href: 'https://docs.ts.finance/architecture/rollup-services',
        },
        {
          text: 'RollupFacet.sol#L53 - Etherscan source code, onlyRole modifier in commitBlocks function',
          href: 'https://etherscan.io/address/0x955cdD2E56Ca2776a101a552A318d28fe311398D#code#F1#L56',
        },
      ],
    },
    forceTransactions: {
      ...FORCE_TRANSACTIONS.WITHDRAW_OR_HALT(),
      references: [
        {
          text: 'Forced Withdrawal and Evacuation Mode - Term Structure Docs',
          href: 'https://docs.ts.finance/zktrue-up/zk-architecture/forced-withdrawal-and-evacuation-mode',
        },
        {
          text: 'AccountFacet.sol#L105 - forceWithdraw function',
          href: 'https://etherscan.io/address/0x8D0fc76595E42f38c771ecEE627DA5654Ca2E75A#code#F1#L105',
        },
        {
          text: 'EvacuationFacet.sol#L46 - activateEvacuation function',
          href: 'https://etherscan.io/address/0x882aBFb2F6A67d36350499991638044e8Bd83a72#code#F1#L46',
        },
      ],
    },
    exitMechanisms: [
      {
        ...EXITS.REGULAR('zk', 'no proof'),
        references: [
          {
            text: 'Withdraw - Term Structure Docs',
            href: 'https://docs.ts.finance/protocol-spec./general/withdraw',
          },
        ],
      },
      {
        ...EXITS.FORCED(),
        references: [
          {
            text: 'Forced Withdrawal - Term Structure Docs',
            href: 'https://docs.ts.finance/zktrue-up/zk-architecture/forced-withdrawal-and-evacuation-mode#forced-withdrawal',
          },
          {
            text: 'AccountFacet.sol#L105 - forceWithdraw function',
            href: 'https://etherscan.io/address/0x8D0fc76595E42f38c771ecEE627DA5654Ca2E75A#code#F1#L105',
          },
        ],
      },
      {
        ...EXITS.EMERGENCY(
          'Evacuation Mode',
          'zero knowledge proof',
          forcedWithdrawalDelay,
        ),
        references: [
          {
            text: 'Evacuation Mode - Term Structure Docs',
            href: 'https://docs.ts.finance/zktrue-up/zk-architecture/forced-withdrawal-and-evacuation-mode#evacuation-mode',
          },
          {
            text: 'Term Structure Evacuation Kit',
            href: 'https://github.com/term-structure/Term-Structure-Evacuation-Kit',
          },
          {
            text: 'EvacuationFacet.sol#L134 - evacuate function',
            href: 'https://etherscan.io/address/0x882aBFb2F6A67d36350499991638044e8Bd83a72#code#F1#L134',
          },
        ],
      },
    ],
  },
  stateDerivation: {
    nodeSoftware:
      'The software toolkit for evacuation is open-sourced, and the source code can be found [here](https://github.com/term-structure/Term-Structure-Evacuation-Kit).',
    compressionScheme: 'No compression is used.',
    genesisState:
      'There is no genesis file nor regenesis for Term Structure. By default, all accounts were empty at the beginning.',
    dataFormat: `The data format documentation can be found [here](https://github.com/term-structure/TS-Circom/blob/main/doc/DOC-raw.md#requests).`,
  },
  permissions: [
    ...discovery.getMultisigPermission(
      'TermStructureMultisig',
      'This Multisig is the owner of zkTrueUp contract and can therefore upgrade the rollup system, potentially gaining access to all funds. It can also change the list of operators.' +
        (discovery.getMultisigStats('TermStructureMultisig') === '1 / 2'
          ? "The multisig's current threshold makes each perticipant an independent admin."
          : ''),
    ),
    {
      name: 'Operator',
      accounts: discovery.getAccessControlRolePermission(
        'ZkTrueUp',
        'OPERATOR_ROLE',
      ),
      description:
        'Allowed to whitelist base tokens, and create and whitelist tsbTokens.',
    },
    {
      name: 'Committer',
      accounts: discovery.getAccessControlRolePermission(
        'ZkTrueUp',
        'COMMITTER_ROLE',
      ),
      description: 'Allowed to propose L2 blocks on L1.',
    },
    {
      name: 'Verifier',
      accounts: discovery.getAccessControlRolePermission(
        'ZkTrueUp',
        'VERIFIER_ROLE',
      ),
      description:
        'Allowed to submit ZK proofs of correct L2 state transition on L1.',
    },
    {
      name: 'Executer',
      accounts: discovery.getAccessControlRolePermission(
        'ZkTrueUp',
        'EXECUTER_ROLE',
      ),
      description: 'Allowed to execute L2 blocks on L1.',
    },
  ],
  contracts: {
    addresses: [
      discovery.getContractDetails(
        'ZkTrueUp',
        'The main contract, defining the upgrade process for all other contracts.',
      ),
      discovery.getContractDetails(
        'RollupFacet',
        'The main Rollup contract, allowing the operator to commit blocks, provide ZK proofs (validated by the Verifier), and execute blocks.',
      ),
      discovery.getContractDetails(
        'Verifier',
        'Implements ZK proof verification logic for Rollup blocks.',
      ),
      discovery.getContractDetails(
        'EvacuVerifier',
        'Implements ZK proof verification logic for evacuation mode.',
      ),
    ],
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  milestones: [
    {
      name: 'Term Structure Mainnet launch',
      link: 'https://x.com/TermStructLabs/status/1797433199985078402',
      date: '2024-06-03T00:00:00Z',
      description:
        'Term Structure is live, bringing fixed-income borrowing and lending to Ethereum.',
    },
  ],
}
