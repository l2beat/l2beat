import { EthereumAddress, UnixTime, formatSeconds } from '@l2beat/shared-pure'
import { CONTRACTS, NUGGETS, RISK_VIEW, UPGRADE_MECHANISM } from '../../common'
import { ESCROW } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Layer2 } from '../../types'
import { Badge } from '../badges'
import { OPTIMISTIC_ROLLUP_STATE_UPDATES_WARNING } from './common/liveness'
import { getStage } from './common/stages/getStage'
import {
  WASMVM_OTHER_CONSIDERATIONS,
  getNitroGovernance,
  orbitStackL2,
} from './templates/orbitStack'

const discovery = new ProjectDiscovery('arbitrum')
const l2Discovery = new ProjectDiscovery('arbitrum', 'arbitrum')

const assumedBlockTime = 12 // seconds, different from RollupUserLogic.sol#L35 which assumes 13.2 seconds
const validatorAfkBlocks = discovery.getContractValue<number>(
  'RollupProxy',
  'VALIDATOR_AFK_BLOCKS',
)
const validatorAfkTime = validatorAfkBlocks * assumedBlockTime
const challengeWindow = discovery.getContractValue<number>(
  'RollupProxy',
  'confirmPeriodBlocks',
)
const challengeWindowSeconds = challengeWindow * assumedBlockTime
const l1TimelockDelay = discovery.getContractValue<number>(
  'L1Timelock',
  'getMinDelay',
)
const l2TimelockDelay = l2Discovery.getContractValue<number>(
  'L2Timelock',
  'getMinDelay',
) // 3 days
const totalDelay = l2TimelockDelay + challengeWindowSeconds + l1TimelockDelay // compare https://github.com/ArbitrumFoundation/governance/blob/main/docs/overview.md#proposal-delays

const upgradeExecutorUpgradeability = {
  upgradableBy: ['SecurityCouncil', 'L1Timelock'],
  upgradeDelay: `${formatSeconds(
    totalDelay,
  )} or 0 if overridden by the Security Council`,
  upgradeConsiderations:
    'An upgrade initiated by the DAO can be vetoed by the Security Council.',
}
const l2Upgradability = {
  // same as on L1, but messages from L1 must be sent to L2
  upgradableBy: [
    'L2SecurityCouncilEmergency',
    'L2SecurityCouncilPropose',
    'L1Timelock',
  ],
  upgradeDelay: `${formatSeconds(
    totalDelay,
  )} or 0 if overridden by the Security Council`,
  upgradeConsiderations:
    'An upgrade initiated by the DAO can be vetoed by the Security Council.',
}

const l2CoreQuorumPercent =
  (l2Discovery.getContractValue<number>('CoreGovernor', 'quorumNumerator') /
    l2Discovery.getContractValue<number>('CoreGovernor', 'quorumDenominator')) *
  100
const l2TreasuryQuorumPercent =
  (l2Discovery.getContractValue<number>('TreasuryGovernor', 'quorumNumerator') /
    l2Discovery.getContractValue<number>(
      'TreasuryGovernor',
      'quorumDenominator',
    )) *
  100

const treasuryTimelockDelay = l2Discovery.getContractValue<number>(
  'TreasuryTimelock',
  'getMinDelay',
)

const maxTimeVariation = discovery.getContractValue<{
  delayBlocks: number
  futureBlocks: number
  delaySeconds: number
  futureSeconds: number
}>('SequencerInbox', 'maxTimeVariation')

const selfSequencingDelay = maxTimeVariation.delaySeconds

export const arbitrum: Layer2 = orbitStackL2({
  addedAt: new UnixTime(1623153328), // 2021-06-08T11:55:28Z
  additionalBadges: [
    Badge.VM.WasmVM,
    Badge.Stack.Nitro,
    Badge.Other.Governance,
    Badge.Other.L3HostChain,
  ],
  discovery,
  hasAtLeastFiveExternalChallengers: true,
  associatedTokens: ['ARB'],
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  display: {
    name: 'Arbitrum One',
    slug: 'arbitrum',
    warning:
      'Fraud proof system is fully deployed but is not yet permissionless as it requires Validators to be whitelisted.',
    description: `Arbitrum One is a general-purpose Optimistic Rollup built by Offchain Labs and governed by the Arbitrum DAO.`,
    links: {
      websites: ['https://arbitrum.io/', 'https://arbitrum.foundation/'],
      apps: ['https://bridge.arbitrum.io'],
      documentation: [
        'https://docs.arbitrum.io',
        'https://docs.arbitrum.foundation/',
      ],
      explorers: [
        'https://arbiscan.io',
        'https://explorer.arbitrum.io/',
        'https://arbitrum.l2scan.co/',
      ],
      repositories: [
        'https://github.com/ArbitrumFoundation/docs',
        'https://github.com/ArbitrumFoundation/governance',
        'https://github.com/OffchainLabs/arbitrum',
        'https://github.com/OffchainLabs/nitro',
        'https://github.com/OffchainLabs/arb-os',
      ],
      socialMedia: [
        'https://twitter.com/arbitrum',
        'https://arbitrumfoundation.medium.com/',
        'https://discord.gg/Arbitrum',
        'https://youtube.com/@Arbitrum',
        'https://t.me/arbitrum',
      ],
      rollupCodes: 'https://rollup.codes/arbitrum-one',
    },
    liveness: {
      warnings: {
        stateUpdates: OPTIMISTIC_ROLLUP_STATE_UPDATES_WARNING,
      },
      explanation: `Arbitrum One is an Optimistic rollup that posts transaction data to the L1. For a transaction to be considered final, it has to be posted on L1. Forced txs can be delayed up to ${formatSeconds(
        selfSequencingDelay,
      )}. The state root gets finalized ${formatSeconds(
        challengeWindow * assumedBlockTime,
      )} after it has been posted.`,
    },
    finality: { finalizationPeriod: challengeWindowSeconds },
  },
  finality: {
    type: 'Arbitrum',
    // First blob tx from arbitrum
    // https://etherscan.io/tx/0x5969e9d520e138e6eeb5c020a75635fd2fdc15803f707dce7909c1bf062b32d0
    minTimestamp: new UnixTime(1710427823),
    lag: 0,
    stateUpdate: 'disabled',
  },
  trackedTxs: [
    {
      uses: [
        { type: 'liveness', subtype: 'batchSubmissions' },
        { type: 'l2costs', subtype: 'batchSubmissions' },
      ],
      query: {
        formula: 'functionCall',
        address: EthereumAddress('0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6'),
        selector: '0x8f111f3c',
        functionSignature:
          'function addSequencerL2BatchFromOrigin(uint256 sequenceNumber,bytes data,uint256 afterDelayedMessagesRead,address gasRefunder,uint256 prevMessageCount,uint256 newMessageCount)',
        sinceTimestamp: new UnixTime(1661457944),
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'batchSubmissions' },
        { type: 'l2costs', subtype: 'batchSubmissions' },
      ],
      query: {
        formula: 'functionCall',
        address: EthereumAddress('0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6'),
        selector: '0x6f12b0c9',
        functionSignature:
          'function addSequencerL2BatchFromOrigin(uint256 sequenceNumber,bytes calldata data,uint256 afterDelayedMessagesRead,address gasRefunder)',
        sinceTimestamp: new UnixTime(1661457944),
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'batchSubmissions' },
        { type: 'l2costs', subtype: 'batchSubmissions' },
      ],
      query: {
        formula: 'functionCall',
        address: EthereumAddress('0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6'),
        selector: '0xe0bc9729',
        functionSignature:
          'function addSequencerL2Batch(uint256 sequenceNumber,bytes calldata data,uint256 afterDelayedMessagesRead,address gasRefunder,uint256 prevMessageCount,uint256 newMessageCount)',
        sinceTimestamp: new UnixTime(1661457944),
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'batchSubmissions' },
        { type: 'l2costs', subtype: 'batchSubmissions' },
      ],
      query: {
        formula: 'functionCall',
        address: EthereumAddress('0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6'),
        selector: '0x3e5aa082',
        functionSignature:
          'function addSequencerL2BatchFromBlobs(uint256 sequenceNumber,uint256 afterDelayedMessagesRead,address gasRefunder,uint256 prevMessageCount,uint256 newMessageCount)',
        sinceTimestamp: new UnixTime(1710427823),
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'stateUpdates' },
        { type: 'l2costs', subtype: 'stateUpdates' },
      ],
      query: {
        formula: 'functionCall',
        address: EthereumAddress('0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840'),
        selector: '0xa04cee60',
        functionSignature:
          'function updateSendRoot(bytes32 root, bytes32 l2BlockHash) external',
        sinceTimestamp: new UnixTime(1661455766),
      },
    },
  ],
  chainConfig: {
    name: 'arbitrum',
    chainId: 42161,
    blockscoutV2ApiUrl: 'https://arbitrum.blockscout.com/api/v2',
    explorerUrl: 'https://arbiscan.io',
    explorerApi: {
      url: 'https://api.arbiscan.io/api',
      type: 'etherscan',
    },
    // ~ Timestamp of block number 0 on Arbitrum
    minTimestampForTvl: UnixTime.fromDate(new Date('2021-05-28T22:15:00Z')),
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 7654707,
        version: '3',
      },
      {
        sinceBlock: 821923,
        batchSize: 150,
        address: EthereumAddress('0x842eC2c7D803033Edf55E478F461FC547Bc54EB2'),
        version: '2',
      },
    ],
    coingeckoPlatform: 'arbitrum-one',
  },
  rpcUrl: 'https://arb1.arbitrum.io/rpc',
  upgradesAndGovernance: getNitroGovernance(
    l2CoreQuorumPercent,
    l2TimelockDelay,
    challengeWindowSeconds,
    l1TimelockDelay,
    treasuryTimelockDelay,
    l2TreasuryQuorumPercent,
  ),
  nonTemplatePermissions: {
    [discovery.chain]: {
      actors: [
        discovery.getMultisigPermission(
          'SecurityCouncil',
          'The admin of all contracts in the system, capable of issuing upgrades without notice and delay. This allows it to censor transactions and to upgrade the bridge implementation, potentially gaining access to all funds stored in the bridge and change the sequencer or any other system component (unlimited upgrade power). It is also the admin of the special purpose smart contracts used by validators.',
          [
            {
              title: 'Security Council members - Arbitrum Foundation Docs',
              url: 'https://docs.arbitrum.foundation/security-council-members',
            },
          ],
        ),
        discovery.contractAsPermissioned(
          discovery.getContract('L1Timelock'),
          'Timelock contract for Arbitrum Governance transactions. Scheduled transactions from Arbitrum One L2 (by the DAO or the Security Council) are delayed here and can be canceled by the Security Council or executed to upgrade and change system contracts on Ethereum, Arbitrum One and -Nova.',
        ),
        discovery.getMultisigPermission(
          'BatchPosterManagerMultisig',
          'It can update whether an address is authorized to be a batch poster at the sequencer inbox. The UpgradeExecutor retains the ability to update the batch poster manager (along with any batch posters).',
        ),
      ],
    },
    [l2Discovery.chain]: {
      actors: [
        l2Discovery.getMultisigPermission(
          'L2SecurityCouncilEmergency',
          'The elected signers for the Arbitrum SecurityCouncil can act through this multisig on Layer2, permissioned to upgrade all system contracts without delay.',
        ),
        l2Discovery.getMultisigPermission(
          'L2SecurityCouncilPropose',
          'The elected signers for the Arbitrum SecurityCouncil can act through this multisig on Layer2 to propose transactions in the L2Timelock (e.g. upgrade proposals).',
        ),
        l2Discovery.eoaAsPermissioned(
          l2Discovery.getEOA('L1Timelock'),
          'Alias of the L1Timelock contract on L1.',
        ),
      ],
    },
  },
  nonTemplateContracts: {
    [discovery.chain]: [
      discovery.getContractDetails('RollupProxy', {
        description:
          'Main contract implementing Arbitrum One Rollup. Manages other Rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.',
        ...upgradeExecutorUpgradeability,
      }),
      discovery.getContractDetails('Bridge', {
        description:
          'Contract managing Inboxes and Outboxes. It escrows ETH sent to L2.',
        ...upgradeExecutorUpgradeability,
      }),
      discovery.getContractDetails('SequencerInbox', {
        description:
          'Main entry point for the Sequencer submitting transaction batches to a Rollup. Sequencers can be changed here through the UpgradeExecutor or the BatchPosterManager.',
        ...upgradeExecutorUpgradeability,
      }),
      discovery.getContractDetails('Inbox', {
        description:
          'Entry point for users depositing ETH and sending L1 --> L2 messages. Deposited ETH is escrowed in a Bridge contract.',
        ...upgradeExecutorUpgradeability,
      }),
      discovery.getContractFromValue('RollupProxy', 'outbox', {
        description:
          "Arbitrum's Outbox system allows for arbitrary L2 to L1 contract calls; i.e., messages initiated from L2 which eventually resolve in execution on L1.",
        ...upgradeExecutorUpgradeability,
      }),
      discovery.getContractDetails('UpgradeExecutor', {
        description:
          "This contract can upgrade the system's contracts. The upgrades can be done either by the Security Council or by the L1Timelock.",
        ...upgradeExecutorUpgradeability,
      }),
      discovery.getContractDetails('L1Timelock', {
        description:
          'Timelock contract for Arbitrum Governance transactions. Scheduled transactions from Arbitrum One L2 (by the DAO or the Security Council) are delayed here and can be canceled by the Security Council or executed to upgrade and change system contracts on Ethereum, Arbitrum One and -Nova.',
        ...upgradeExecutorUpgradeability,
      }),
      discovery.getContractDetails('L1GatewayRouter', {
        description: 'Router managing token <--> gateway mapping.',
        ...upgradeExecutorUpgradeability,
      }),
      discovery.getContractDetails('ChallengeManager', {
        description:
          'Contract that allows challenging invalid state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.',
        ...upgradeExecutorUpgradeability,
      }),
    ],
    [l2Discovery.chain]: [
      l2Discovery.getContractDetails('CoreGovernor', {
        description: `Governance contract accepting and managing constitutional Arbitrum Improvement Proposals (AIPs, core proposals) and, among other formal parameters, enforcing the ${l2CoreQuorumPercent}% quorum for proposals.`,
        ...l2Upgradability,
      }),
      l2Discovery.getContractDetails('L2Timelock', {
        description: `Delays constitutional AIPs from the CoreGovernor by ${formatSeconds(
          l2TimelockDelay,
        )}.`,
        ...l2Upgradability,
      }),
      l2Discovery.getContractDetails('TreasuryGovernor', {
        description: `Governance contract used for creating non-constitutional AIPs, or "treasury proposals", e.g., transferring founds out of the DAO Treasury. Also enforces the ${l2TreasuryQuorumPercent}% quorum for proposals.`,
        ...l2Upgradability,
      }),
      l2Discovery.getContractDetails('TreasuryTimelock', {
        description: `Delays treasury proposals from the TreasuryGovernor by ${formatSeconds(
          treasuryTimelockDelay,
        )}. Is used as the main recipient for the ETH from L2SurplusFee and L2BaseFee contracts.`,
        ...l2Upgradability,
      }),
      l2Discovery.getContractDetails('L2UpgradeExecutor', {
        description:
          "This contract can upgrade the L2 system's contracts through the L2ProxyAdmin. The upgrades can be done either by the Security Council or by the L1Timelock (via its alias on L2).",
        ...l2Upgradability,
      }),
      l2Discovery.getContractDetails('SecurityCouncilManager', {
        description:
          'This contract enforces the rules for changing members and cohorts of the SecurityCouncil and creates crosschain messages to Ethereum and Arbitrum Nova to keep the configuration in sync.',
        ...l2Upgradability,
      }),
      l2Discovery.getContractDetails('ConstitutionHash', {
        description:
          'Keeps the current hash of the ArbitrumDAO Constitution. Settable by the L2UpgradeExecutor.',
      }),
      l2Discovery.getContractDetails('L2ProxyAdmin', {
        description:
          "The owner (UpgradeExecutor) can upgrade proxies' implementations of all L2 system contracts through this contract.",
      }),
      l2Discovery.getContractDetails('L2GatewaysProxyAdmin', {
        description:
          "The owner (UpgradeExecutor) can upgrade proxies' implementations of all L2 bridging gateway contracts through this contract.",
      }),
      l2Discovery.getContractDetails('L2BaseFee', {
        description:
          'This contract receives all BaseFees: The transaction fee component that covers the minimum cost of Arbitrum transaction execution. They are withdrawable to a configurable set of recipients.',
      }),
      l2Discovery.getContractDetails('L2SurplusFee', {
        description:
          'This contract receives all SurplusFees: Transaction fee component that covers the cost beyond that covered by the L2 Base Fee during chain congestion. They are withdrawable to a configurable set of recipients.',
      }),
      l2Discovery.getContractDetails('L2ArbitrumToken', {
        description:
          'The ARB token contract. Supply can be increased by the owner once per year by a maximum of 2%.',
        ...l2Upgradability,
      }),
      l2Discovery.getContractDetails('L2GatewayRouter', {
        description: 'Router managing token <--> gateway mapping on L2.',
        ...l2Upgradability,
      }),
      l2Discovery.getContractDetails('L2ERC20Gateway', {
        description:
          'Counterpart to the L1ERC20Gateway. Can mint (deposit to L2) and burn (withdraw to L1) ERC20 tokens on L2.',
        ...l2Upgradability,
      }),
      l2Discovery.getContractDetails('L2WethGateway', {
        description:
          'Counterpart to the Bridge on L1. Mints and burns WETH on L2.',
        ...l2Upgradability,
      }),
      l2Discovery.getContractDetails('L2ARBGateway', {
        description:
          'ARB sent from L2 to L1 is escrowed in this contract and minted on L1.',
        ...l2Upgradability,
      }),
      l2Discovery.getContractDetails('L2DAIGateway', {
        description:
          'Counterpart to the L1DaiGateway. Can mint (deposit to L2) and burn (withdraw to L1) DAI tokens on L2.',
      }),
      l2Discovery.getContractDetails('L2LPTGateway', {
        description:
          'Counterpart to the L1LPTGateway. Can mint (deposit to L2) and burn (withdraw to L1) LPT on L2.',
      }),
    ],
  },
  nonTemplateContractRisks: [
    CONTRACTS.UPGRADE_WITH_DELAY_RISK_WITH_EXCEPTION(
      formatSeconds(totalDelay),
      'Security Council',
    ),
  ],
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      // Custom ERC20 Gateway
      address: EthereumAddress('0xcEe284F754E854890e311e3280b767F80797180d'),
      tokens: '*',
      ...ESCROW.CANONICAL_EXTERNAL,
      excludedTokens: ['USDT'], // upgraded to USDT0 - tracked on L2
      description:
        'Main entry point for users depositing ERC20 tokens that require minting custom tokens on L2.',
      ...upgradeExecutorUpgradeability,
    }),
    discovery.getEscrowDetails({
      // ERC20 Gateway
      address: EthereumAddress('0xa3A7B6F88361F48403514059F1F16C8E78d60EeC'),
      tokens: '*',
      excludedTokens: ['SolvBTC', 'SolvBTC.BBN', 'PEPE', 'rsETH'],
      premintedTokens: ['LOGX', 'AIUS', 'YBR', 'FFM'],
      description:
        'Main entry point for users depositing ERC20 tokens. Upon depositing, on L2 a generic, "wrapped" token will be minted.',
      ...upgradeExecutorUpgradeability,
    }),
    discovery.getEscrowDetails({
      address: EthereumAddress('0xA10c7CE4b876998858b1a9E12b10092229539400'),
      tokens: ['DAI'],
      ...ESCROW.CANONICAL_EXTERNAL,
      description:
        'DAI Vault for custom DAI Gateway. Fully controlled by MakerDAO governance.',
    }),
    discovery.getEscrowDetails({
      address: EthereumAddress('0x0F25c1DC2a9922304f2eac71DCa9B07E310e8E5a'),
      tokens: ['wstETH'],
      ...ESCROW.CANONICAL_EXTERNAL,
      description:
        'wstETH Vault for custom wstETH Gateway. Fully controlled by Lido governance.',
    }),
    discovery.getEscrowDetails({
      // LPT L1 Escrow
      address: EthereumAddress('0x6A23F4940BD5BA117Da261f98aae51A8BFfa210A'),
      tokens: ['LPT'],
      ...ESCROW.CANONICAL_EXTERNAL,
      description: 'LPT Vault for custom Livepeer Token Gateway.',
    }),
    {
      // This bridge is inactive, but we keep it
      // in case we have to gather historic data
      address: EthereumAddress('0x011B6E24FfB0B5f5fCc564cf4183C5BBBc96D515'),
      chain: 'ethereum',
      sinceTimestamp: new UnixTime(1622243344),
      tokens: ['ETH'],
      isHistorical: true,
    },
  ],
  nonTemplateRiskView: {
    exitWindow: RISK_VIEW.EXIT_WINDOW_NITRO(
      l2TimelockDelay,
      selfSequencingDelay,
      challengeWindowSeconds,
      validatorAfkTime,
      l1TimelockDelay,
    ),
  },
  isNodeAvailable: true,
  nodeSourceLink: 'https://github.com/OffchainLabs/nitro/',
  stage: getStage(
    {
      stage0: {
        callsItselfRollup: true,
        stateRootsPostedToL1: true,
        dataAvailabilityOnL1: true,
        rollupNodeSourceAvailable: true,
      },
      stage1: {
        principle: true,
        stateVerificationOnL1: true,
        fraudProofSystemAtLeast5Outsiders: true,
        usersHave7DaysToExit: true,
        usersCanExitWithoutCooperation: true,
        securityCouncilProperlySetUp: true,
      },
      stage2: {
        proofSystemOverriddenOnlyInCaseOfABug: false,
        fraudProofSystemIsPermissionless: false,
        delayWith30DExitWindow: false,
      },
    },
    {
      rollupNodeLink: 'https://github.com/OffchainLabs/nitro/',
    },
  ),
  stateDerivation: {
    nodeSoftware: `The rollup node (Arbitrum Nitro) consists of four parts. The base layer is the core Geth server (with minor modifications to add hooks) that emulates the execution of EVM contracts and maintains Ethereum's state and [a fork of wasmer](https://github.com/OffchainLabs/wasmer) that is used for native WASM execution. The middle layer, ArbOS, provides additional Layer 2 functionalities such as decompressing data batches, accounting for Layer 1 gas costs, and supporting cross-chain bridge functionalities. The top layer consists of node software, primarily from Geth, that handles client connections (i.e., regular RPC node). [View Code](https://github.com/OffchainLabs/nitro/)`,
    compressionScheme: `The Sequencer's batches are compressed using a general-purpose data compression algorithm known as [Brotli](https://github.com/google/brotli), configured to its highest compression setting.`,
    genesisState:
      'They performed a regenesis from Classic to Nitro, and that file represents the [last Classic state](https://snapshot.arbitrum.foundation/arb1/nitro-genesis.tar). To sync from the initial Classic state, instructions can be found [here](https://docs.arbitrum.io/migration/state-migration).',
    dataFormat: `Nitro supports Ethereum's data structures and formats by incorporating the core code of the popular go-ethereum ("Geth") Ethereum node software. The batch is composed of a header and a compressed blob, which results from compressing concatenated RLP-encoded transactions using the standard RLP encoding.`,
  },
  nonTemplateTechnology: {
    otherConsiderations: [
      ...WASMVM_OTHER_CONSIDERATIONS,
      UPGRADE_MECHANISM.ARBITRUM_DAO(
        l1TimelockDelay,
        challengeWindow * assumedBlockTime,
        l2TimelockDelay,
      ),
    ],
  },
  milestones: [
    {
      title: 'Exit window extension to 7 days',
      url: 'https://www.tally.xyz/gov/arbitrum/proposal/27888300053486667232765715922683646778055572080881341292116987136155397805421?govId=eip155:42161:0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9',
      date: '2024-10-25T00:00:00Z',
      type: 'general',
    },
    {
      title: 'ArbOS 32 Emergency upgrade',
      url: 'https://github.com/OffchainLabs/nitro/releases/tag/v3.2.0',
      date: '2024-09-25T00:00:00Z',
      description:
        'SecurityCouncil emergency upgrades to fix attack vectors related to Stylus resource pricing.',
      type: 'incident',
    },
    {
      title: 'ArbOS 31 Bianca upgrade',
      url: 'https://www.tally.xyz/gov/arbitrum/proposal/108288822474129076868455956066667369439381709547570289793612729242368710728616',
      date: '2024-09-03T00:00:00Z',
      description:
        'Arbitrum upgrades to ArbOS 31 activating Stylus (new languages for smart contracts).',
      type: 'general',
    },
    {
      title: 'Arbitrum starts using blobs',
      url: 'https://twitter.com/arbitrum/status/1768306107318178061',
      date: '2024-03-14T00:00:00Z',
      description: 'Arbitrum starts publishing data to blobs.',
      type: 'general',
    },
    {
      title: 'ARB token airdrop',
      url: 'https://twitter.com/arbitrum/status/1638888588443111425',
      date: '2023-03-23T00:00:00Z',
      description: 'ARB token launched as a governance token for Arbitrum DAO.',
      type: 'general',
    },
    {
      title: 'Nitro Upgrade',
      url: 'https://medium.com/offchainlabs/arbitrum-nitro-one-small-step-for-l2-one-giant-leap-for-ethereum-bc9108047450',
      date: '2022-08-31T00:00:00Z',
      description:
        'Upgrade is live, introducing new architecture, increased throughput and lower fees.',
      type: 'general',
    },
    {
      title: 'Odyssey paused',
      url: 'https://twitter.com/arbitrum/status/1542159109511847937',
      date: '2022-06-29T00:00:00Z',
      description:
        'Due of the heavy load being put on the chain, Odyssey program got paused.',
      type: 'incident',
    },
    {
      title: 'Odyssey started',
      url: 'https://twitter.com/arbitrum/status/1539292126105706496',
      date: '2022-06-21T00:00:00Z',
      description: 'Incentives program to onboard new users has started.',
      type: 'general',
    },
    {
      title: 'Mainnet for everyone',
      description:
        'Whitelist got removed, there are no restrictions on who can transact with the network.',
      url: 'https://twitter.com/arbitrum/status/1432817424752128008',
      date: '2021-08-31T00:00:00Z',
      type: 'general',
    },
  ],
  knowledgeNuggets: [
    {
      title: 'Arbitrum update boosts decentralization',
      url: 'https://twitter.com/bkiepuszewski/status/1594754717330309120',
      thumbnail: NUGGETS.THUMBNAILS.L2BEAT_03,
    },
    {
      title: 'Arbitrum is down... or is it?',
      url: 'https://twitter.com/bkiepuszewski/status/1438445910191710211',
      thumbnail: NUGGETS.THUMBNAILS.L2BEAT_04,
    },
  ],
})
