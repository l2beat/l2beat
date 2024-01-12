import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import {
  CONTRACTS,
  DATA_AVAILABILITY,
  EXITS,
  FORCE_TRANSACTIONS,
  makeBridgeCompatible,
  NEW_CRYPTOGRAPHY,
  NUGGETS,
  OPERATOR,
  RISK_VIEW,
  STATE_CORRECTNESS,
} from '../common'
import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { getCommittee } from '../discovery/starkware'
import { delayDescriptionFromSeconds } from '../utils/delayDescription'
import { formatSeconds } from '../utils/formatSeconds'
import { getStage } from './common/stages/getStage'
import { Layer2 } from './types'

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
  upgradableBy: ['Rollup Admin'],
  upgradeDelay: `${formatSeconds(maxPriorityDelay)} or ${formatSeconds(
    minPriorityDelay,
  )} if overridden by Priority Controller`,
}

const shortTimelockUpgradeability = {
  upgradableBy: ['Treasury Admin'],
  upgradeDelay: `${formatSeconds(shortTimelockDelay)}`,
}

const longTimelockUpgradeability = {
  upgradableBy: ['Safety Module Admin'],
  upgradeDelay: `${formatSeconds(longTimelockDelay)}`,
}

export const dydx: Layer2 = {
  type: 'layer2',
  id: ProjectId('dydx'),
  display: {
    name: 'dYdX v3',
    slug: 'dydx',
    warning:
      'This page describes dYdX v3, which is an L2 built on Ethereum. Recently deployed dYdX v4 is a separate blockchain based on Cosmos SDK, unrelated to Ethereum and is using different technology. No information on this page applies to dYdX v4.',
    description:
      'dYdX v3 aims to build a powerful and professional exchange for trading crypto assets where users can truly own their trades and, eventually, the exchange itself.',
    purposes: ['Exchange'],
    provider: 'StarkEx',
    category: 'ZK Rollup',
    dataAvailabilityMode: 'StateDiffs',

    links: {
      websites: ['https://dydx.exchange/'],
      apps: [
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
    activityDataSource: 'Closed API',
    liveness: {
      explanation:
        'dYdX is a ZK rollup that posts state diffs to the L1. For a transaction to be considered final, the state diffs have to be submitted and validity proof should be generated, submitted, and verified. The verification is done as part of the state update.',
    },
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0xD54f502e184B6B739d7D27a6410a67dc462D69c8'),
        sinceTimestamp: new UnixTime(1613033682),
        tokens: ['USDC'],
        ...priorityExecutorUpgradeability,
      }),
    ],
    transactionApi: {
      type: 'starkex',
      product: ['dydx'],
      sinceTimestamp: new UnixTime(1613033682),
      resyncLastDays: 7,
    },
    liveness: {
      proofSubmissions: [
        {
          formula: 'functionCall',
          address: EthereumAddress(
            '0x894c4a12548FB18EaA48cF34f9Cd874Fc08b7FC3',
          ),
          selector: '0x9b3b76cc',
          functionSignature:
            'function verifyProofAndRegister(uint256[] proofParams, uint256[] proof, uint256[] taskMetadata, uint256[] cairoAuxInput, uint256 cairoVerifierId)',
          sinceTimestamp: new UnixTime(1615417556),
        },
      ],
      batchSubmissions: [],
      stateUpdates: [
        {
          formula: 'functionCall',
          address: EthereumAddress(
            '0xD54f502e184B6B739d7D27a6410a67dc462D69c8',
          ),
          selector: '0x538f9406',
          functionSignature:
            'function updateState(uint256[] publicInput, uint256[] applicationData)',
          sinceTimestamp: new UnixTime(1613033682),
        },
      ],
    },
  },
  riskView: makeBridgeCompatible({
    stateValidation: {
      ...RISK_VIEW.STATE_ZKP_ST,
      sources: [
        {
          contract: 'StarkPerpetual',
          references: [
            'https://etherscan.io/address/0xdf9c117cad37f2ed8c99e36a40317d8cc340d4a0#code#F35#L125',
          ],
        },
      ],
    },
    dataAvailability: {
      ...RISK_VIEW.DATA_ON_CHAIN,
      sources: [
        {
          contract: 'StarkPerpetual',
          references: [
            'https://etherscan.io/address/0xdf9c117cad37f2ed8c99e36a40317d8cc340d4a0#code#F35#L82',
          ],
        },
      ],
    },
    exitWindow: {
      ...RISK_VIEW.EXIT_WINDOW(
        maxPriorityDelay,
        freezeGracePeriod,
        minPriorityDelay,
      ),
      description: `There is no exit window. Upgrades have a ${formatSeconds(
        maxPriorityDelay,
      )} delay, (or ${formatSeconds(
        minPriorityDelay,
      )} if shortened by the Priority Controller), but withdrawals can be censored for up to ${formatSeconds(
        freezeGracePeriod,
      )}.`,
    },
    sequencerFailure: {
      ...RISK_VIEW.SEQUENCER_FORCE_VIA_L1_STARKEX_PERPETUAL(freezeGracePeriod),
      sources: [
        {
          contract: 'StarkPerpetual',
          references: [
            'https://etherscan.io/address/0xc43f5526124877f9125e3b48101dca6d7c6b4ea3#code#F4#L46',
          ],
        },
      ],
    },
    proposerFailure: {
      ...RISK_VIEW.PROPOSER_USE_ESCAPE_HATCH_MP_AVGPRICE,
      sources: [
        {
          contract: 'StarkPerpetual',
          references: [
            'https://etherscan.io/address/0xc43f5526124877f9125e3b48101dca6d7c6b4ea3#code#F6#L32',
          ],
        },
      ],
    },
    destinationToken: RISK_VIEW.CANONICAL_USDC,
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
  }),
  technology: {
    stateCorrectness: {
      ...STATE_CORRECTNESS.STARKEX_VALIDITY_PROOFS,
      references: [
        ...STATE_CORRECTNESS.STARKEX_VALIDITY_PROOFS.references,
        {
          text: 'UpdatePerpetualState.sol#L125 - Etherscan source code, verifyFact function call',
          href: 'https://etherscan.io/address/0xdf9c117cad37f2ed8c99e36a40317d8cc340d4a0#code#F35#L125',
        },
      ],
    },
    newCryptography: NEW_CRYPTOGRAPHY.ZK_STARKS,
    dataAvailability: {
      ...DATA_AVAILABILITY.STARKEX_ON_CHAIN,
      references: [
        ...DATA_AVAILABILITY.STARKEX_ON_CHAIN.references,
        {
          text: 'UpdatePerpetualState.sol#L82 - Etherscan source code, updateState function',
          href: 'https://etherscan.io/address/0xdf9c117cad37f2ed8c99e36a40317d8cc340d4a0#code#F35#L82',
        },
      ],
    },
    operator: {
      ...OPERATOR.STARKEX_OPERATOR,
      references: [
        ...OPERATOR.STARKEX_OPERATOR.references,
        {
          text: 'Operator.sol#L42 - Etherscan source code, onlyOperator modifier',
          href: 'https://etherscan.io/address/0xdf9c117cad37f2ed8c99e36a40317d8cc340d4a0#code#F26#L42',
        },
      ],
    },
    forceTransactions: {
      ...FORCE_TRANSACTIONS.STARKEX_PERPETUAL_WITHDRAW(freezeGracePeriod),
      references: [
        ...FORCE_TRANSACTIONS.STARKEX_PERPETUAL_WITHDRAW(freezeGracePeriod)
          .references,
        {
          text: 'ForcedTrades.sol#L46 - Etherscan source code, forcedTradeRequest function',
          href: 'https://etherscan.io/address/0xc43f5526124877f9125e3b48101dca6d7c6b4ea3#code#F4#L46',
        },
        {
          text: 'ForcedWithdrawals.sol#L32 - Etherscan source code, forcedWithdrawalRequest function',
          href: 'https://etherscan.io/address/0xc43f5526124877f9125e3b48101dca6d7c6b4ea3#code#F6#L32',
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
      },
      stage1: {
        stateVerificationOnL1: true,
        fraudProofSystemAtLeast5Outsiders: null,
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
    addresses: [
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
  permissions: [
    // TODO: detailed breakdown of permissions
    {
      name: 'Operators',
      accounts: discovery.getPermissionedAccounts(
        'StarkPerpetual',
        'OPERATORS',
      ),
      description:
        'Allowed to update state of the rollup. When Operator is down the state cannot be updated.',
    },
    getCommittee(discovery),
    {
      name: 'Rollup Admin',
      accounts: [
        discovery.getPermissionedAccount('PriorityExecutor', 'getAdmin'),
      ],
      description:
        'Controlled by dYdX Governance. Defines rules of governance via the dYdX token. Can upgrade implementation of the rollup, potentially gaining access to all funds stored in the bridge. ' +
        delayDescriptionFromSeconds(maxPriorityDelay),
      references: [
        {
          text: 'Rollup Admin documentation',
          href: 'https://docs.dydx.community/dydx-governance/voting-and-governance/governance-process#long-timelock-executor',
        },
      ],
    },
    {
      name: 'Rollup Priority Controller',
      accounts: [
        discovery.formatPermissionedAccount(
          discovery.getContractValue<string[]>(
            'PriorityExecutor',
            'PRIORITY_CONTROLLERS',
          )[0],
        ),
      ],
      description: `Can decrease the delay required for the Rollup upgrade to ${formatSeconds(
        minPriorityDelay,
      )}.`,
      references: [
        {
          text: 'dYdX governance documentation',
          href: 'https://docs.dydx.community/dydx-governance/',
        },
        {
          text: 'Priority Controller documentation',
          href: 'https://docs.dydx.community/dydx-governance/voting-and-governance/governance-process#long-timelock-executor',
        },
      ],
    },
    {
      name: 'Treasury Admin',
      accounts: [
        discovery.getPermissionedAccount('ShortTimelockExecutor', 'getAdmin'),
      ],
      description:
        'Controlled by dYdX Governance. Owner of dYdX token. Can upgrade Treasury, Liquidity Module and Merkle Distributor. ' +
        delayDescriptionFromSeconds(shortTimelockDelay),
      references: [
        {
          text: 'Treasury Admin documentation',
          href: 'https://docs.dydx.community/dydx-governance/voting-and-governance/governance-process#long-timelock-executor',
        },
      ],
    },
    {
      name: 'Safety Module Admin',
      accounts: [
        discovery.getPermissionedAccount('LongTimelockExecutor', 'getAdmin'),
      ],
      description:
        'Controlled by dYdX Governance. Has the ability to update Governance Strategy resulting in different logic of votes counting. Can upgrade Safety Module. ' +
        delayDescriptionFromSeconds(longTimelockDelay),
      references: [
        {
          text: 'Safety Module Admin',
          href: 'https://docs.dydx.community/dydx-governance/voting-and-governance/governance-process#long-timelock-executor',
        },
      ],
    },
    {
      name: 'Merkle Pauser',
      accounts: [
        discovery.getPermissionedAccount('MerklePauserExecutor', 'getAdmin'),
      ],
      description:
        'Controlled by dYdX Governance. The Merkle-pauser executor can freeze the Merkle root, which is updated periodically with each user cumulative reward balance, in case the proposed root is incorrect or malicious. It can also veto forced trade requests by any of the stark proxy contracts.' +
        delayDescriptionFromSeconds(merklePauserDelay),
      references: [
        {
          text: 'Merkle Pauser documentation',
          href: 'https://docs.dydx.community/dydx-governance/voting-and-governance/governance-process#merkle-pauser-executor',
        },
      ],
    },
  ],
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
      name: 'Public launch',
      link: 'https://dydx.exchange/blog/public',
      date: '2021-04-06T00:00:00Z',
      description:
        'Layer 2 cross-margined Perpetuals are now live in production for all traders.',
    },
    {
      name: 'dYdX Foundation',
      link: 'https://dydx.exchange/blog/introducing-dydx-foundation',
      date: '2021-08-03T00:00:00Z',
      description:
        'Independent foundation was created to participate in the Protocol governance.',
    },
    {
      name: 'dYdX v4 announcement',
      link: 'https://dydx.exchange/blog/dydx-chain',
      date: '2022-06-22T00:00:00Z',
      description:
        'dYdX V4 will be developed as a standalone blockchain based on the Cosmos SDK.',
    },
  ],
  knowledgeNuggets: [
    {
      title: 'How does escape hatch work?',
      url: 'https://twitter.com/bkiepuszewski/status/1469201939049103360',
      thumbnail: NUGGETS.THUMBNAILS.L2BEAT_03,
    },
    ...NUGGETS.STARKWARE,
  ],
}
