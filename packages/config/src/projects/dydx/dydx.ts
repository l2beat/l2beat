import {
  ChainSpecificAddress,
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
  EXITS,
  FORCE_TRANSACTIONS,
  OPERATOR,
  RISK_VIEW,
  STATE_VALIDATION,
  TECHNOLOGY_DATA_AVAILABILITY,
} from '../../common'
import { BADGES } from '../../common/badges'
import { formatDelay, formatExecutionDelay } from '../../common/formatDelays'
import { getStage } from '../../common/stages/getStage'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import { delayDescriptionFromSeconds } from '../../utils/delayDescription'

const discovery = new ProjectDiscovery('dydx')
const maxPriorityDelay = discovery.getContractValue<number>(
  'PriorityExecutor',
  'getDelay',
)
const priorityPeriod = discovery.getContractValue<number>(
  'PriorityExecutor',
  'getPriorityPeriod',
)
const minPriorityDelay = maxPriorityDelay - priorityPeriod

const shortTimelockDelay = discovery.getContractValue<number>(
  'ShortTimelockExecutor',
  'getDelay',
)
const longTimelockDelay = discovery.getContractValue<number>(
  'LongTimelockExecutor',
  'getDelay',
)
const merklePauserDelay = discovery.getContractValue<number>(
  'MerklePauserExecutor',
  'getDelay',
)
const freezeGracePeriod = discovery.getContractValue<number>(
  'StarkPerpetual',
  'FREEZE_GRACE_PERIOD',
)

const priorityExecutorUpgradeability = {
  upgradableBy: [
    {
      name: 'Rollup Admin',
      delay: `${formatSeconds(maxPriorityDelay)} or ${formatSeconds(
        minPriorityDelay,
      )} if overridden by Priority Controller`,
    },
  ],
}

const shortTimelockUpgradeability = {
  upgradableBy: [
    { name: 'Treasury Admin', delay: formatSeconds(shortTimelockDelay) },
  ],
}

const longTimelockUpgradeability = {
  upgradableBy: [
    { name: 'Safety Module Admin', delay: formatSeconds(longTimelockDelay) },
  ],
}
const finalizationPeriod = 0

export const dydx: ScalingProject = {
  type: 'layer2',
  id: ProjectId('dydx'),
  addedAt: UnixTime(1623153328), // 2021-06-08T11:55:28Z
  archivedAt: UnixTime(1733356800), // 2024-12-05T00:00:00.000Z,
  capability: 'universal',
  badges: [
    BADGES.VM.AppChain,
    BADGES.Stack.StarkEx,
    BADGES.DA.EthereumCalldata,
    BADGES.Other.Governance,
  ],
  display: {
    name: 'dYdX v3',
    slug: 'dydx',
    warning:
      'This page describes dYdX v3, which is an L2 built on Ethereum. Recently deployed dYdX v4 is a separate blockchain based on Cosmos SDK, unrelated to Ethereum and is using different technology. No information on this page applies to dYdX v4.',
    headerWarning:
      'dYdX v3 shut down on October 28th and is currently processing withdrawals in escape-hatch mode. [Read more](https://dydx.exchange/blog/v3-product-sunset) or [use the escape-hatch](https://explorer.dydx.exchange/tutorials/escapehatch).',
    description:
      'dYdX v3 aims to build a powerful and professional exchange for trading crypto assets where users can truly own their trades and, eventually, the exchange itself.',
    purposes: ['Exchange'],
    stacks: ['StarkEx'],
    category: 'ZK Rollup',
    links: {
      websites: ['https://dydx.exchange/'],
      bridges: [
        'https://trade.dydx.exchange/',
        'https://margin.dydx.exchange/',
        'https://dydx.l2beat.com',
      ],
      documentation: [
        'https://docs.starkware.co/starkex/',
        'https://docs.dydx.exchange/',
        'https://docs.dydx.community/dydx-governance/',
      ],
      explorers: ['https://dydx.l2beat.com'],
      repositories: [
        'https://github.com/starkware-libs/starkex-contracts',
        'https://github.com/dydxprotocol/',
      ],
      socialMedia: [
        'https://dydx.exchange/blog',
        'https://twitter.com/dYdX',
        'https://discord.gg/dydx',
        'https://youtube.com/c/dydxprotocol',
        'https://reddit.com/r/dydxprotocol/',
        'https://linkedin.com/company/dydx',
      ],
    },
    liveness: {
      explanation:
        'dYdX is a ZK rollup that posts state diffs to the L1. For a transaction to be considered final, the state diffs have to be submitted and validity proof should be generated, submitted, and verified. The verification is done as part of the state update.',
    },
  },
  chainConfig: {
    name: 'dydx',
    chainId: undefined,
    apis: [{ type: 'starkex', product: ['dydx'] }],
  },
  config: {
    associatedTokens: ['DYDX'],
    escrows: [
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0xD54f502e184B6B739d7D27a6410a67dc462D69c8',
        ),
        sinceTimestamp: UnixTime(1613033682),
        tokens: ['USDC'],
        ...priorityExecutorUpgradeability,
      }),
    ],
    activityConfig: {
      type: 'day',
      sinceTimestamp: UnixTime(1613033682),
      resyncLastDays: 7,
    },
    trackedTxs: [
      {
        uses: [
          { type: 'liveness', subtype: 'proofSubmissions' },
          { type: 'l2costs', subtype: 'proofSubmissions' },
        ],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0x894c4a12548FB18EaA48cF34f9Cd874Fc08b7FC3',
          ),
          selector: '0x9b3b76cc',
          functionSignature:
            'function verifyProofAndRegister(uint256[] proofParams, uint256[] proof, uint256[] taskMetadata, uint256[] cairoAuxInput, uint256 cairoVerifierId)',
          sinceTimestamp: UnixTime(1615417556),
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
            '0xD54f502e184B6B739d7D27a6410a67dc462D69c8',
          ),
          selector: '0x538f9406',
          functionSignature:
            'function updateState(uint256[] publicInput, uint256[] applicationData)',
          sinceTimestamp: UnixTime(1613033682),
        },
      },
    ],
  },
  dataAvailability: {
    layer: DA_LAYERS.ETH_CALLDATA,
    bridge: DA_BRIDGES.ENSHRINED,
    mode: DA_MODES.STATE_DIFFS,
  },
  riskView: {
    stateValidation: {
      ...RISK_VIEW.STATE_ZKP_ST,
      secondLine: formatExecutionDelay(finalizationPeriod),
    },
    dataAvailability: {
      ...RISK_VIEW.DATA_ON_CHAIN,
    },
    exitWindow: {
      ...RISK_VIEW.EXIT_WINDOW(maxPriorityDelay, 0),
      description: `There is a ${formatSeconds(
        maxPriorityDelay,
      )} exit window (or ${formatSeconds(
        minPriorityDelay,
      )} if shortened by the Priority Controller).`,
    },
    sequencerFailure: {
      ...RISK_VIEW.SEQUENCER_FORCE_VIA_L1_STARKEX_PERPETUAL(freezeGracePeriod),
      secondLine: formatDelay(freezeGracePeriod),
    },
    proposerFailure: RISK_VIEW.PROPOSER_USE_ESCAPE_HATCH_MP_AVGPRICE,
  },
  stateValidation: {
    categories: [
      {
        ...STATE_VALIDATION.STARKEX_VALIDITY_PROOFS,
        references: [
          ...(STATE_VALIDATION.STARKEX_VALIDITY_PROOFS.references ?? []),
          {
            title:
              'UpdatePerpetualState.sol#L125 - Etherscan source code, verifyFact function call',
            url: 'https://etherscan.io/address/0xdf9c117cad37f2ed8c99e36a40317d8cc340d4a0#code#F35#L125',
          },
        ],
      },
    ],
  },
  technology: {
    dataAvailability: {
      ...TECHNOLOGY_DATA_AVAILABILITY.STARKEX_ON_CHAIN,
      references: [
        ...TECHNOLOGY_DATA_AVAILABILITY.STARKEX_ON_CHAIN.references,
        {
          title:
            'UpdatePerpetualState.sol#L82 - Etherscan source code, updateState function',
          url: 'https://etherscan.io/address/0xdf9c117cad37f2ed8c99e36a40317d8cc340d4a0#code#F35#L82',
        },
      ],
    },
    operator: {
      ...OPERATOR.STARKEX_OPERATOR,
      references: [
        ...OPERATOR.STARKEX_OPERATOR.references,
        {
          title:
            'Operator.sol#L42 - Etherscan source code, onlyOperator modifier',
          url: 'https://etherscan.io/address/0xdf9c117cad37f2ed8c99e36a40317d8cc340d4a0#code#F26#L42',
        },
      ],
    },
    forceTransactions: {
      ...FORCE_TRANSACTIONS.STARKEX_PERPETUAL_WITHDRAW(freezeGracePeriod),
      references: [
        ...FORCE_TRANSACTIONS.STARKEX_PERPETUAL_WITHDRAW(freezeGracePeriod)
          .references,
        {
          title:
            'ForcedTrades.sol#L46 - Etherscan source code, forcedTradeRequest function',
          url: 'https://etherscan.io/address/0xc43f5526124877f9125e3b48101dca6d7c6b4ea3#code#F4#L46',
        },
        {
          title:
            'ForcedWithdrawals.sol#L32 - Etherscan source code, forcedWithdrawalRequest function',
          url: 'https://etherscan.io/address/0xc43f5526124877f9125e3b48101dca6d7c6b4ea3#code#F6#L32',
        },
      ],
    },
    exitMechanisms: EXITS.STARKEX_PERPETUAL,
  },
  stage: getStage(
    {
      stage0: {
        callsItselfRollup: true,
        stateRootsPostedToL1: true,
        dataAvailabilityOnL1: true,
        rollupNodeSourceAvailable: true,
        stateVerificationOnL1: true,
        fraudProofSystemAtLeast5Outsiders: null,
      },
      stage1: {
        principle: true,
        usersHave7DaysToExit: true,
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
      rollupNodeLink: 'https://github.com/l2beat/starkex-explorer',
    },
  ),
  contracts: {
    addresses: {
      ethereum: [
        discovery.getContractDetails('StarkPerpetual', {
          description:
            'Main contract of dYdX exchange. Updates dYdX state and verifies its integrity using STARK Verifier. Allows users to deposit and withdraw tokens via normal and emergency modes.',
          ...priorityExecutorUpgradeability,
        }),
        discovery.getContractDetails('FinalizableGpsFactAdapter', {
          description:
            'Contract serving as an adapter for STARK Verifier. It holds the address of the STARK Verifier and CAIRO program hash needed for verification.',
          upgradeConsiderations:
            'This contract is not upgradeable and the program hash cannot be updated because it is in the finalized state.',
        }),
        discovery.getContractDetails(
          'GpsStatementVerifier',
          'STARK Verifier. In contrast to other StarkWare systems which use common SHARP Prover, dYdX uses separate Prover/Verifier.',
        ),
        discovery.getContractDetails(
          'MemoryPageFactRegistry',
          'Contract storing CAIRO Program Output, in case of dYdX, it stores state diffs of dYdX Exchange.',
        ),
        discovery.getContractDetails(
          'FriStatementContract',
          'Part of STARK Verifier.',
        ),
        discovery.getContractDetails(
          'MerkleStatementContract',
          'Part of STARK Verifier.',
        ),
        discovery.getContractDetails(
          'CairoBootloaderProgram',
          'Part of STARK Verifier.',
        ),
        discovery.getContractDetails('PerpetualEscapeVerifier', {
          description:
            'Contract responsible for validating force withdrawal requests.',
        }),
        discovery.getContractDetails('MerkleDistributor', {
          description:
            'The Merkle Distributor smart contract distributes DYDX token rewards according to a Merkle tree of balances.',
          ...shortTimelockUpgradeability,
          upgradeConsiderations: `This contract can be paused by the Merkle Pauser with ${
            formatSeconds(merklePauserDelay) === ''
              ? 'no'
              : formatSeconds(merklePauserDelay)
          } delay.`,
        }),
        discovery.getContractDetails('LiquidityStaking', {
          description:
            'The Liquidity Module is a collection of smart contracts for staking and borrowing, which incentivize the allocation of USDC funds for market making purposes on the dYdX layer 2 exchange.',
          ...shortTimelockUpgradeability,
        }),
        discovery.getContractDetails('SafetyModule', {
          description:
            'The Safety Module is a staking pool that offers DYDX rewards to users who stake DYDX towards the security of the Protocol.',
          ...longTimelockUpgradeability,
        }),
        discovery.getContractDetails('DydxGovernor', {
          description: 'Contract storing dYdX Governance logic.',
        }),
        discovery.getContractDetails('GovernanceStrategyV2', {
          description:
            'Contract storing logic for votes counting in dYdX Governance.',
          upgradeConsiderations:
            'This contract is not upgradeable, although the address of the GovernanceStrategyV2 can be changed by the owner of DydxGovernor contract.',
        }),
        discovery.getContractDetails('DydxToken', {
          description: 'Token used by the dYdX Governance for voting.',
        }),
      ],
    },
    risks: [
      {
        ...CONTRACTS.UPGRADE_WITH_DELAY_SECONDS_RISK(maxPriorityDelay),
        text:
          CONTRACTS.UPGRADE_WITH_DELAY_SECONDS_RISK(maxPriorityDelay).text +
          `The delay can be decreased by the Priority Controller to ${formatSeconds(
            minPriorityDelay,
          )}.`,
      },
    ],
  },
  permissions: {
    ethereum: {
      actors: [
        // TODO: detailed breakdown of permissions
        discovery.getPermissionDetails(
          'Operators',
          discovery.getPermissionedAccounts('StarkPerpetual', 'OPERATORS'),
          'Allowed to update state of the rollup. When Operator is down the state cannot be updated.',
        ),
        discovery.getPermissionDetails(
          'Rollup Admin',
          discovery.getPermissionedAccounts('PriorityExecutor', 'getAdmin'),
          'Controlled by dYdX Governance. Defines rules of governance via the dYdX token. Can upgrade implementation of the rollup, potentially gaining access to all funds stored in the bridge. ' +
            delayDescriptionFromSeconds(maxPriorityDelay),
          {
            references: [
              {
                title: 'Rollup Admin documentation',
                url: 'https://docs.dydx.community/dydx-governance/voting-and-governance/governance-process#long-timelock-executor',
              },
            ],
          },
        ),
        discovery.getPermissionDetails(
          'Rollup Priority Controller',
          discovery.formatPermissionedAccounts([
            discovery.getContractValue<string[]>(
              'PriorityExecutor',
              'PRIORITY_CONTROLLERS',
            )[0],
          ]),
          `Can decrease the delay required for the Rollup upgrade to ${formatSeconds(
            minPriorityDelay,
          )}.`,
          {
            references: [
              {
                title: 'dYdX governance documentation',
                url: 'https://docs.dydx.community/dydx-governance/',
              },
              {
                title: 'Priority Controller documentation',
                url: 'https://docs.dydx.community/dydx-governance/voting-and-governance/governance-process#long-timelock-executor',
              },
            ],
          },
        ),
        discovery.getPermissionDetails(
          'Treasury Admin',
          discovery.getPermissionedAccounts(
            'ShortTimelockExecutor',
            'getAdmin',
          ),

          'Controlled by dYdX Governance. Owner of dYdX token. Can upgrade Treasury, Liquidity Module and Merkle Distributor. ' +
            delayDescriptionFromSeconds(shortTimelockDelay),
          {
            references: [
              {
                title: 'Treasury Admin documentation',
                url: 'https://docs.dydx.community/dydx-governance/voting-and-governance/governance-process#long-timelock-executor',
              },
            ],
          },
        ),
        discovery.getPermissionDetails(
          'Safety Module Admin',
          discovery.getPermissionedAccounts('LongTimelockExecutor', 'getAdmin'),

          'Controlled by dYdX Governance. Has the ability to update Governance Strategy resulting in different logic of votes counting. Can upgrade Safety Module. ' +
            delayDescriptionFromSeconds(longTimelockDelay),
          {
            references: [
              {
                title: 'Safety Module Admin',
                url: 'https://docs.dydx.community/dydx-governance/voting-and-governance/governance-process#long-timelock-executor',
              },
            ],
          },
        ),
        discovery.getPermissionDetails(
          'Merkle Pauser',
          discovery.getPermissionedAccounts('MerklePauserExecutor', 'getAdmin'),

          'Controlled by dYdX Governance. The Merkle-pauser executor can freeze the Merkle root, which is updated periodically with each user cumulative reward balance, in case the proposed root is incorrect or malicious. It can also veto forced trade requests by any of the stark proxy contracts.' +
            delayDescriptionFromSeconds(merklePauserDelay),
          {
            references: [
              {
                title: 'Merkle Pauser documentation',
                url: 'https://docs.dydx.community/dydx-governance/voting-and-governance/governance-process#merkle-pauser-executor',
              },
            ],
          },
        ),
      ],
    },
  },
  stateDerivation: {
    nodeSoftware:
      'State can be independently derived from data (state updates) published on Ethereum by running an open-source [StarkEx Explorer](https://github.com/l2beat/starkex-explorer). The explorer, once fully synced, provides UI interface to perform forced actions, trigger rollup freeze and withdraw funds using escape hatch.',
    compressionScheme:
      'No compression is used, state updates and other metadata are simply serialized for L1',
    genesisState:
      'There is no genesis file for dYdX. By default, all accounts were empty at the beginning.',
    dataFormat:
      "dYdX doesn't publish transactions. Balances of user positions are stored in a Merkle Tree and updates to that tree are published on Ethereum, together with Merkle Root and a ZK proof. Deserialization of that data is implemented [here](https://github.com/l2beat/starkex-explorer/blob/59e5c744cd3a1103c01893881a40492a817f13bd/packages/encoding/src/decoding/decodeOnChainData.ts#L6). Generating Merkle Proof is implemented [here](https://github.com/l2beat/starkex-explorer/blob/d957fe5ed3b8f6590a84507655eb76c7b2876e67/packages/state/src/MerkleTree.ts#L92).",
  },
  milestones: [
    {
      title: 'Public launch',
      url: 'https://dydx.exchange/blog/public',
      date: '2021-04-06T00:00:00Z',
      description:
        'Layer 2 cross-margined Perpetuals are now live in production for all traders.',
      type: 'general',
    },
    {
      title: 'dYdX Foundation',
      url: 'https://dydx.exchange/blog/introducing-dydx-foundation',
      date: '2021-08-03T00:00:00Z',
      description:
        'Independent foundation was created to participate in the Protocol governance.',
      type: 'general',
    },
    {
      title: 'dYdX v4 announcement',
      url: 'https://dydx.exchange/blog/dydx-chain',
      date: '2022-06-22T00:00:00Z',
      description:
        'dYdX V4 will be developed as a standalone blockchain based on the Cosmos SDK.',
      type: 'general',
    },
  ],
  discoveryInfo: getDiscoveryInfo([discovery]),
}
