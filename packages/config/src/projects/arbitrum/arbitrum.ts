import {
  assert,
  ChainSpecificAddress,
  EthereumAddress,
  formatSeconds,
  UnixTime,
} from '@l2beat/shared-pure'
import { formatEther } from 'ethers/lib/utils'
import {
  CONTRACTS,
  computeBoldDefenderAdvantage,
  OPTIMISTIC_ROLLUP_STATE_UPDATES_WARNING,
  RISK_VIEW,
  SOA,
  UPGRADE_MECHANISM,
} from '../../common'
import { BADGES } from '../../common/badges'
import { getRollupStage } from '../../common/stages/getRollupStage'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import {
  getNitroGovernance,
  orbitStackL2,
  WASMVM_OTHER_CONSIDERATIONS,
} from '../../templates/orbitStack'

const discovery = new ProjectDiscovery('arbitrum')

const assumedBlockTime = 12 // seconds, different from RollupUserLogic.sol#L35 which assumes 13.2 seconds

const challengeWindow = discovery.getContractValue<number>(
  'RollupProxy',
  'confirmPeriodBlocks',
)
const challengeWindowSeconds = challengeWindow * assumedBlockTime
const challengeGracePeriodSeconds =
  discovery.getContractValue<number>(
    'RollupProxy',
    'challengeGracePeriodBlocks',
  ) * assumedBlockTime
const l1TimelockDelay = discovery.getContractValue<number>(
  'L1Timelock',
  'getMinDelay',
)
const l2TimelockDelay = discovery.getContractValue<number>(
  'L2Timelock',
  'getMinDelay',
) // 8 days since the 2024-10 'Extend Delay on L2Time Lock' constitutional AIP
const totalDelay = l2TimelockDelay + challengeWindowSeconds + l1TimelockDelay // compare https://github.com/ArbitrumFoundation/governance/blob/main/docs/overview.md#proposal-delays

const upgradeExecutorUpgradeability = {
  upgradableBy: [
    { name: 'SecurityCouncil', delay: 'no' },
    { name: 'L1Timelock', delay: formatSeconds(totalDelay) },
  ],
  upgradeConsiderations:
    'An upgrade initiated by the DAO can be vetoed by the Security Council.',
}

// const l2Upgradability = {
//   // same as on L1, but messages from L1 must be sent to L2
//   upgradableBy: [
//     { name: 'L2SecurityCouncilEmergency', delay: formatSeconds(totalDelay) },
//     { name: 'L2SecurityCouncilPropose', delay: formatSeconds(totalDelay) },
//     { name: 'L1Timelock', delay: formatSeconds(totalDelay) },
//   ],
//   upgradeConsiderations:
//     'An upgrade initiated by the DAO can be vetoed by the Security Council.',
// }

const l2CoreQuorumPercent =
  (discovery.getContractValue<number>('CoreGovernor', 'quorumNumerator') /
    discovery.getContractValue<number>('CoreGovernor', 'quorumDenominator')) *
  100
const l2TreasuryQuorumPercent =
  (discovery.getContractValue<number>('TreasuryGovernor', 'quorumNumerator') /
    discovery.getContractValue<number>(
      'TreasuryGovernor',
      'quorumDenominator',
    )) *
  100

const treasuryTimelockDelay = discovery.getContractValue<number>(
  'TreasuryTimelock',
  'getMinDelay',
)

const securityCouncilStats = discovery.getMultisigStats(
  'Arbitrum Security Council',
)
const coreVotingDelaySeconds =
  discovery.getContractValue<number>('CoreGovernor', 'votingDelay') *
  assumedBlockTime
const coreVotingPeriodSeconds =
  discovery.getContractValue<number>('CoreGovernor', 'votingPeriod') *
  assumedBlockTime
const tempCheckSeconds = 7 * 24 * 60 * 60
const constitutionalWallClockDays = Math.round(
  (tempCheckSeconds +
    coreVotingDelaySeconds +
    coreVotingPeriodSeconds +
    totalDelay) /
    86400,
)
const treasuryWallClockDays = Math.round(
  (tempCheckSeconds +
    coreVotingDelaySeconds +
    coreVotingPeriodSeconds +
    treasuryTimelockDelay) /
    86400,
)
const onchainEnforcedDays = Math.round(
  (coreVotingDelaySeconds + coreVotingPeriodSeconds + totalDelay) / 86400,
)
const exitWindowDays = (totalDelay / 86400).toFixed(1)
const outboxDays = (challengeWindowSeconds / 86400).toFixed(1)

const sequencerInbox = discovery.getContract('SequencerInbox')
const outbox = discovery.getContract('Outbox')
assert(
  sequencerInbox.sinceTimestamp !== undefined &&
    outbox.sinceTimestamp !== undefined,
)
const genesisTimestamp = UnixTime(
  Math.min(sequencerInbox.sinceTimestamp, outbox.sinceTimestamp),
)

const maxTimeVariation = discovery.getContractValue<{
  delayBlocks: number
  futureBlocks: number
  delaySeconds: number
  futureSeconds: number
}>('SequencerInbox', 'maxTimeVariation')

const selfSequencingDelay = maxTimeVariation.delaySeconds

const chainId = 42161

export const arbitrum: ScalingProject = orbitStackL2({
  addedAt: UnixTime(1623153328), // 2021-06-08T11:55:28Z
  additionalBadges: [
    BADGES.VM.WasmVM,
    BADGES.Stack.Nitro,
    BADGES.Other.Governance,
  ],
  discovery,
  hasAtLeastFiveExternalChallengers: true,
  associatedTokens: ['ARB'],
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox,
  additionalTrackedTxs: [
    {
      uses: [
        { type: 'liveness', subtype: 'batchSubmissions' },
        { type: 'l2costs', subtype: 'batchSubmissions' },
      ],
      query: {
        formula: 'functionCall',
        address: ChainSpecificAddress.address(sequencerInbox.address),
        selector: '0x3e5aa082',
        functionSignature:
          'function addSequencerL2BatchFromBlobs(uint256 sequenceNumber,uint256 afterDelayedMessagesRead,address gasRefunder,uint256 prevMessageCount,uint256 newMessageCount)',
        sinceTimestamp: genesisTimestamp,
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'batchSubmissions' },
        { type: 'l2costs', subtype: 'batchSubmissions' },
      ],
      query: {
        formula: 'functionCall',
        address: ChainSpecificAddress.address(sequencerInbox.address),
        selector: '0x917cf8ac',
        functionSignature:
          'function addSequencerL2BatchFromBlobsDelayProof(uint256 sequenceNumber, uint256 afterDelayedMessagesRead, address gasRefunder, uint256 prevMessageCount, uint256 newMessageCount, tuple(bytes32 beforeDelayedAcc, tuple(uint8 kind, address sender, uint64 blockNumber, uint64 timestamp, uint256 inboxSeqNum, uint256 baseFeeL1, bytes32 messageDataHash) delayedMessage) delayProof)',
        sinceTimestamp: genesisTimestamp,
      },
    },
  ],
  usesEthereumBlobs: true,
  display: {
    name: 'Arbitrum One',
    slug: 'arbitrum',
    warning: undefined,
    architectureImage: 'arbitrumwithbold',
    description:
      'Arbitrum One is a general-purpose Optimistic Rollup built by Offchain Labs and governed by the Arbitrum DAO.',
    links: {
      websites: [
        'https://arbitrum.io/',
        'https://arbitrum.foundation/',
        'https://forum.arbitrum.foundation/',
      ],
      bridges: ['https://bridge.arbitrum.io'],
      documentation: [
        'https://docs.arbitrum.io',
        'https://docs.arbitrum.foundation/',
      ],
      explorers: [
        'https://arbiscan.io',
        'https://explorer.arbitrum.io/',
        'https://arbitrum.blockscout.com/',
      ],
      repositories: [
        'https://github.com/ArbitrumFoundation/docs',
        'https://github.com/ArbitrumFoundation/governance',
        'https://github.com/OffchainLabs/nitro',
        'https://github.com/OffchainLabs/nitro-contracts',
      ],
      socialMedia: [
        'https://twitter.com/arbitrum',
        'https://arbitrumfoundation.medium.com/',
        'https://discord.gg/Arbitrum',
        'https://youtube.com/@Arbitrum',
        'https://linkedin.com/company/arbitrum',
        'https://t.me/arbitrum',
      ],

      other: [
        'https://rollup.codes/arbitrum-one',
        'https://growthepie.com/chains/arbitrum',
      ],
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
  },
  interopConfig: {
    name: 'Arbitrum Canonical',
    durationSplit: {
      lockAndMint: [
        {
          label: 'L1 -> L2',
          transferTypes: ['orbitstack.L1ToL2Transfer'],
        },
        {
          label: 'L2 -> L1',
          transferTypes: ['orbitstack.L2ToL1Transfer'],
        },
      ],
    },
    plugins: [
      {
        chain: 'arbitrum',
        plugin: 'orbitstack',
        bridgeType: 'lockAndMint',
      },
      {
        chain: 'arbitrum',
        plugin: 'orbitstack-standardgateway',
        bridgeType: 'lockAndMint',
      },
      {
        chain: 'arbitrum',
        plugin: 'orbitstack-wethgateway',
        bridgeType: 'lockAndMint',
      },
      {
        chain: 'arbitrum',
        plugin: 'orbitstack-customgateway',
        bridgeType: 'lockAndMint',
      },
    ],
    type: 'canonical',
  },
  chainConfig: {
    name: 'arbitrum',
    chainId,
    explorerUrl: 'https://arbiscan.io',
    coingeckoPlatform: 'arbitrum-one',
    // ~ Timestamp of block number 0 on Arbitrum
    sinceTimestamp: UnixTime.fromDate(new Date('2021-05-28T22:15:00Z')),
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
    apis: [
      {
        type: 'rpc',
        url: 'https://arb1.arbitrum.io/rpc',
        callsPerMinute: 300,
      },
      { type: 'etherscan', chainId },
      { type: 'blockscoutV2', url: 'https://arbitrum.blockscout.com/api/v2' },
    ],
  },
  upgradesAndGovernance: {
    content: getNitroGovernance(
      l2CoreQuorumPercent,
      l2TimelockDelay,
      challengeWindowSeconds,
      l1TimelockDelay,
      treasuryTimelockDelay,
      l2TreasuryQuorumPercent,
      challengeGracePeriodSeconds,
    ),
    governanceInfo: {
      securityCouncil: {
        Composition: `**${securityCouncilStats}** — 12 members across two 6-seat cohorts, 1-year staggered terms. DAO-elected via Tally with Foundation eligibility screening.`,
        'Members public':
          '**Mapped** — 12 entities + addresses [published by the Arbitrum Foundation](https://docs.arbitrum.foundation/security-council-members). Mix of individuals (gzeon, zachxbt, Bartek, Yoav, Griff Green, "fred", Emiliano, Michael Lewellen) and orgs (Gauntlet, Immunefi, Certora, OpenZeppelin).',
        Charter: `[Arbitrum DAO Constitution §3](https://docs.arbitrum.foundation/dao-constitution) — defines ${securityCouncilStats} threshold, transparency reports, conflict-of-interest, removal mechanics, ≤3-per-org cap.`,
        'Can bypass DAO?': `**Yes** — emergency (${securityCouncilStats}, instant) and non-emergency (${securityCouncilStats}, still subject to ${formatSeconds(l2TimelockDelay)} L2 + ${formatSeconds(l1TimelockDelay)} L1 timelocks). Non-emergency bypass skips AIP Phases 1–3 only.`,
        'DAO can override SC?': `**Constitutional + practical** — DAO Constitution §3 grants the power to modify or eliminate the SC, but the ${securityCouncilStats} SC holds Canceller on both L1 and L2 Timelocks and can execute emergency upgrades during the ~${exitWindowDays}d execution window.`,
      },
      upgrades: {
        'Normal upgrade path': `Forum temp-check → On-chain vote (${formatSeconds(coreVotingPeriodSeconds)}) → L2 Timelock (${formatSeconds(l2TimelockDelay)}) → L2→L1 outbox (~${outboxDays}d) → L1 Timelock (${formatSeconds(l1TimelockDelay)}) → execute. Total wall-clock ≈ ${constitutionalWallClockDays} days for Constitutional AIPs (≈ ${onchainEnforcedDays}d onchain-enforced), ≈ ${treasuryWallClockDays} days for Treasury AIPs.`,
        'Emergency upgrade path': `**${securityCouncilStats} SC, instant** — no timelock, no exit window. E.g. KelpDAO freeze (21 Apr 2026), Stylus stack-depth fix (13 Oct 2025).`,
        'Exit window': `**~${exitWindowDays}d** non-emergency · **0** emergency. L2 Timelock + L2→L1 outbox + L1 Timelock provide the non-emergency window; emergency actions skip all three.`,
      },
      tokenGovernance: {
        'Governance token':
          '`ARB` — 10,000,000,000 total · ~6.15B circulating · ~3.5B in DAO treasury. 1 token = 1 vote, delegated. Foundation tokens excluded from Votable Tokens.',
        'Voting venue':
          '[Tally](https://www.tally.xyz/gov/arbitrum) — two on-chain governors on Arbitrum One: Core (Constitutional) `0xf07DeD9d…` · Treasury (Non-Constitutional) `0x789fC990…`.',
        'Proposal threshold':
          '**1,000,000 ARB** delegated to submit on-chain. 500k ARB delegated to post a Snapshot temperature check.',
        Quorum: `**${l2CoreQuorumPercent}%** of Delegated Voting Power Constitutional · **${l2TreasuryQuorumPercent}%** Treasury, with floor/ceiling bounds of 150–450M ARB (Const) / 100–300M ARB (Treasury). Counts "For" + "Abstain".`,
        'Execution model':
          "**On-chain payload · Permissionless execute.** The Governor stores the proposal's `(targets[], values[], calldatas[])` at submission. Once the vote passes and the L2/L1 Timelocks expire, anyone can call `execute()` — the same bytes that were voted on are what runs. No multisig signing, no team discretion, no off-chain step between vote and effect.",
      },
    },
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
      address: ChainSpecificAddress(
        'eth:0xcEe284F754E854890e311e3280b767F80797180d',
      ),
      tokens: '*',
      excludedTokens: ['USDT', 'USDS', 'sUSDS'], // upgraded or tracked on L2
      premintedTokens: ['SQD'],
      description:
        'Main entry point for users depositing ERC20 tokens that require minting custom tokens on L2.',
      ...upgradeExecutorUpgradeability,
    }),
    discovery.getEscrowDetails({
      // ERC20 Gateway
      address: ChainSpecificAddress(
        'eth:0xa3A7B6F88361F48403514059F1F16C8E78d60EeC',
      ),
      tokens: '*',
      excludedTokens: [
        'SolvBTC',
        'SolvBTC.BBN',
        'PEPE',
        'rsETH',
        'USDS',
        'sUSDS',
      ],
      premintedTokens: ['LOGX', 'AIUS', 'YBR', 'FFM'],
      description:
        'Main entry point for users depositing ERC20 tokens. Upon depositing, on L2 a generic, "wrapped" token will be minted.',
      ...upgradeExecutorUpgradeability,
    }),
    discovery.getEscrowDetails({
      address: ChainSpecificAddress(
        'eth:0xA10c7CE4b876998858b1a9E12b10092229539400',
      ),
      tokens: ['DAI'],
      description:
        'Maker/Sky-controlled vault for DAI bridged with canonical messaging.',
    }),
    discovery.getEscrowDetails({
      address: ChainSpecificAddress(
        'eth:0x0F25c1DC2a9922304f2eac71DCa9B07E310e8E5a',
      ),
      tokens: ['wstETH'],
      description:
        'wstETH Vault for custom wstETH Gateway. Fully controlled by Lido governance.',
    }),
    discovery.getEscrowDetails({
      // LPT L1 Escrow
      address: ChainSpecificAddress(
        'eth:0x6A23F4940BD5BA117Da261f98aae51A8BFfa210A',
      ),
      tokens: ['LPT'],
      description: 'LPT Vault for custom Livepeer Token Gateway.',
    }),
    {
      // This bridge is inactive, but we keep it
      // in case we have to gather historic data
      address: EthereumAddress('0x011B6E24FfB0B5f5fCc564cf4183C5BBBc96D515'),
      chain: 'ethereum',
      sinceTimestamp: UnixTime(1622243344),
      tokens: ['ETH'],
      isHistorical: true,
    },
  ],
  scopeOfAssessment: {
    inScope: [
      SOA.l1Contracts,
      SOA.l2Contracts,
      SOA.gasToken,
      SOA.derivationSpec,
      SOA.sourceCodeToProgramHash,
    ],
    notInScope: [SOA.specToSourceCode, SOA.sequencerPolicy, SOA.nonGasTokens],
  },

  nonTemplateRiskView: {
    exitWindow: RISK_VIEW.EXIT_WINDOW_PERMISSIONLESS_BOLD(
      l2TimelockDelay,
      selfSequencingDelay,
      l1TimelockDelay,
    ),
    stateValidation: {
      ...RISK_VIEW.STATE_FP_INT(
        challengeWindowSeconds,
        challengeGracePeriodSeconds,
        'if-challenged',
      ),
      initialBond: {
        value: formatEther(
          discovery.getContractValue<number>('RollupProxy', 'baseStake'),
        ),
      },
      permissioned: false,
      defenderAdvantage: computeBoldDefenderAdvantage(
        discovery.getContractValue<number>('RollupProxy', 'baseStake'),
        discovery.getContractValue<number[]>(
          'EdgeChallengeManager',
          'stakeAmounts',
        ),
      ),
    },
  },
  isNodeAvailable: true,
  nodeSourceLink: 'https://github.com/OffchainLabs/nitro/',
  stage: getRollupStage(
    {
      stage0: {
        callsItselfRollup: true,
        stateRootsPostedToL1: true,
        dataAvailabilityOnL1: true,
        rollupNodeSourceAvailable: true,
        stateVerificationOnL1: true,
        fraudProofSystemAtLeast5Outsiders: true,
      },
      stage1: {
        principle: true,
        usersHave7DaysToExit: true,
        usersCanExitWithoutCooperation: true,
        securityCouncilProperlySetUp: true,
        noRedTrustedSetups: null,
        programHashesReproducible: null,
        proverSourcePublished: null,
        verifierContractsReproducible: null,
      },
      stage2: {
        proofSystemOverriddenOnlyInCaseOfABug: false,
        fraudProofSystemIsPermissionless: true,
        delayWith30DExitWindow: false,
      },
    },
    {
      rollupNodeLink: 'https://github.com/OffchainLabs/nitro/',
    },
  ),
  nonTemplateProofSystem: {
    type: 'Optimistic',
    name: 'BoLD',
    challengeProtocol: 'Interactive',
  },
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
        challengeGracePeriodSeconds,
      ),
    ],
  },
  milestones: [
    {
      title: 'Bridge emergency upgrade',
      url: 'https://forum.arbitrum.foundation/t/security-council-emergency-action-24-05-2026/30910',
      date: '2026-05-24T00:00:00Z',
      description:
        'Security Council patches L2->L1 governance-DoS (Bridge renounces PROPOSER_ROLE). No funds at risk.',
      type: 'incident',
    },
    {
      title: 'Security Council recovers KelpDAO exploiter funds',
      url: 'https://x.com/arbitrum/status/2046435443680346189',
      date: '2026-04-21T00:00:00Z',
      description:
        'Security Council emergency action recovers ~30,766 ETH from KelpDAO exploiter on Arbitrum.',
      type: 'general',
    },
    {
      title: 'KelpDAO bridge exploit',
      url: 'https://forum.arbitrum.foundation/t/security-council-emergency-action-21-04-2026/30803',
      date: '2026-04-18T00:00:00Z',
      description:
        'KelpDAO rsETH bridge exploit drains 116,500 rsETH across 11 chains including Arbitrum.',
      type: 'incident',
    },
    {
      title: 'Activate ArbOS 51 (Dia) and Gas Pricing Updates',
      url: 'https://www.tally.xyz/gov/arbitrum/proposal/53154361738756237993090798888616593723057470462495169047773178676976253908001?govId=eip155:42161:0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9',
      date: '2026-01-05T00:00:00Z',
      description:
        'Arbitrum One upgraded to ArbOS 51 with Fusaka EVM support and new gas pricing.',
      type: 'general',
    },
    {
      title: 'ArbOS 40, Callisto Upgrade',
      url: 'https://www.tally.xyz/gov/arbitrum/proposal/13108804573775967668959825241666341617107666532012387058509418598838035461528?govId=eip155:42161:0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9',
      date: '2025-06-18T00:00:00Z',
      type: 'general',
    },
    {
      title: 'Timeboost transaction ordering policy introduced',
      url: 'https://www.tally.xyz/gov/arbitrum/proposal/14881197137069494959448952699217598923721993392617887469969318742509097999570?govId=eip155:42161:0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9',
      date: '2025-04-29T00:00:00Z',
      type: 'general',
    },
    {
      title: 'BoLD, permissionless proof system, deployed',
      url: 'https://x.com/arbitrum/status/1889710151332245837',
      date: '2025-02-15T00:00:00Z',
      type: 'general',
    },
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
        'Due to the heavy load being put on the chain, Odyssey program got paused.',
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
})
