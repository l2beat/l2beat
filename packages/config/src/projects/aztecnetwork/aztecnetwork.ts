import {
  ChainSpecificAddress,
  formatLargeNumber,
  formatSeconds,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import {
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
  EXITS,
  OPERATOR,
  RISK_VIEW,
  SOA,
  STATE_VALIDATION,
} from '../../common'
import { BADGES } from '../../common/badges'
import { getRollupStage } from '../../common/stages/getRollupStage'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import {
  generateDiscoveryDrivenContracts,
  generateDiscoveryDrivenPermissions,
} from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import { readProjectMarkdown } from '../../utils/readMarkdown'
import stakeDistribution from './stake-distribution.json'

const discovery = new ProjectDiscovery('aztecnetwork')

const governanceConfiguration = discovery.getContractValue<{
  proposeConfig: { lockDelay: number; lockAmount: string }
  votingDelay: number
  votingDuration: number
  executionDelay: number
  gracePeriod: number
  quorum: string
  requiredYeaMargin: string
  minimumVotes: string
}>('Governance', 'getConfiguration')

const launchExitSimulationTime = 20 * UnixTime.DAY // https://sekuba.github.io/crsim/?max_horizon_days=100&target_inclusion_percent=99&max_new_sequencers_per_epoch=0&honest_add_success_rate=0.5

const activeSequencerCount = discovery.getContractValue<number>(
  'Rollup',
  'getActiveAttesterCount',
)

const activationThreshold = discovery.getContractValueBigInt(
  'Rollup',
  'getActivationThreshold',
)
const escapeHatchBond = discovery.getContractValueBigInt(
  'EscapeHatch',
  'getBondSize',
)
const targetCommitteeSize = discovery.getContractValue<number>(
  'Rollup',
  'getTargetCommitteeSize',
)
const slotDuration = discovery.getContractValue<number>(
  'Rollup',
  'getSlotDuration',
)
const l2BlockTime = 6 // this is set in the node software and is demand-driven
const epochSlots = discovery.getContractValue<number>(
  'Rollup',
  'getEpochDuration',
)
const entryQueueFlushSize = discovery.getContractValue<number>(
  'Rollup',
  'getEntryQueueFlushSize',
)
const epochDuration = epochSlots * slotDuration
const proofWindow =
  epochDuration *
  (discovery.getContractValue<number>('Rollup', 'getProofSubmissionEpochs') + 1)
const escapeHatchFrequency =
  discovery.getContractValue<number>('EscapeHatch', 'getFrequency') *
  epochDuration
const governanceSignalQuorumSize = discovery.getContractValue<number>(
  'GovernanceProposer',
  'QUORUM_SIZE',
)
const governanceSignalRoundSize = discovery.getContractValue<number>(
  'GovernanceProposer',
  'ROUND_SIZE',
)
const bonusInstanceAddress = ChainSpecificAddress.address(
  discovery.getContractValue<ChainSpecificAddress>(
    'GSE',
    'BONUS_INSTANCE_ADDRESS',
  ),
)
const slashingDisableDuration = discovery.getContractValue<number>(
  'Slasher',
  'SLASHING_DISABLE_DURATION',
)
const coinIssuerNominalAnnualPercentageCap = discovery.getContractValue<string>(
  'CoinIssuer',
  'NOMINAL_ANNUAL_PERCENTAGE_CAP',
)
const protocolTreasuryGatedUntil = discovery.getContractValue<number>(
  'ProtocolTreasury',
  'GATED_UNTIL',
)
const aztecTotalSupply = discovery.getContractValueBigInt(
  'AZTEC Token',
  'totalSupply',
)

const epochsPerRound = discovery.getContractValue<number>(
  'SlashingProposer',
  'ROUND_SIZE_IN_EPOCHS',
)

const slotsPerRound = discovery.getContractValue<number>(
  'SlashingProposer',
  'ROUND_SIZE',
)

const slashOffsetRounds = discovery.getContractValue<number>(
  'SlashingProposer',
  'SLASH_OFFSET_IN_ROUNDS',
)

const slashPayloadExecutionDelayRounds = discovery.getContractValue<number>(
  'SlashingProposer',
  'EXECUTION_DELAY_IN_ROUNDS',
)

const slashQuorum = discovery.getContractValue<number>(
  'SlashingProposer',
  'QUORUM',
)

const slashLifetimeRounds = discovery.getContractValue<number>(
  'SlashingProposer',
  'LIFETIME_IN_ROUNDS',
)

const slashAmount = {
  large: formatAztecAmount(
    discovery.getContractValueBigInt('SlashingProposer', 'SLASH_AMOUNT_LARGE'),
  ),
  medium: formatAztecAmount(
    discovery.getContractValueBigInt('SlashingProposer', 'SLASH_AMOUNT_MEDIUM'),
  ),
  small: formatAztecAmount(
    discovery.getContractValueBigInt('SlashingProposer', 'SLASH_AMOUNT_SMALL'),
  ),
}

const slashVetoStats = discovery.getMultisigStats('SlashVeto Council')

const feeJuicePortal = discovery.getContract('FeeJuicePortal')
const governance = discovery.getContract('Governance')
const honkVerifier = discovery.getContract('HonkVerifier')
const outbox = discovery.getContract('Outbox')
const registry = discovery.getContract('Registry')
const rollup = discovery.getContract('Rollup')
const escapeHatch = discovery.getContract('EscapeHatch')
const slasher = discovery.getContract('Slasher')
const slashingProposer = discovery.getContract('SlashingProposer')

const rollupAddress = ChainSpecificAddress.address(rollup.address)
const verifierAddress = ChainSpecificAddress.address(honkVerifier.address)
const outboxAddress = ChainSpecificAddress.address(outbox.address)
const governanceAddress = ChainSpecificAddress.address(governance.address)
const registryAddress = ChainSpecificAddress.address(registry.address)
const escapeHatchAddress = ChainSpecificAddress.address(escapeHatch.address)

const v5ActivationTimestamp = UnixTime(1784060567) // 14 July 2026 20:22:47 UTC

function formatAztecAmount(amount: bigint): string {
  return `${formatLargeNumber(Number(amount / 10n ** 18n))} AZTEC`
}

function formatPercentage(value: string): string {
  const tenthsOfPercent = (BigInt(value) * 1000n) / 10n ** 18n
  const whole = tenthsOfPercent / 10n
  const tenths = tenthsOfPercent % 10n
  return tenths === 0n ? `${whole}%` : `${whole}.${tenths}%`
}

function formatFractionAsPercentage(
  numerator: bigint,
  denominator: bigint,
): string {
  const tenthsOfPercent = (numerator * 1000n) / denominator
  const whole = tenthsOfPercent / 10n
  const tenths = tenthsOfPercent % 10n
  return tenths === 0n ? `${whole}%` : `${whole}.${tenths}%`
}

function formatMonthYear(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    month: 'short',
    timeZone: 'UTC',
    year: 'numeric',
  })
}

const activationThresholdString = formatAztecAmount(activationThreshold)
const escapeHatchBondString = formatAztecAmount(escapeHatchBond)
const governanceLockAmount = BigInt(
  governanceConfiguration.proposeConfig.lockAmount,
)
const governanceLockString = formatAztecAmount(governanceLockAmount)
const governanceSignalQuorumSizeString =
  governanceSignalQuorumSize.toLocaleString('en-US')
const governanceSignalRoundSizeString =
  governanceSignalRoundSize.toLocaleString('en-US')
const governanceVotingDelayString = formatSeconds(
  governanceConfiguration.votingDelay,
)
const governanceVotingDurationString = formatSeconds(
  governanceConfiguration.votingDuration,
)
const governanceExecutionDelayString = formatSeconds(
  governanceConfiguration.executionDelay,
)
const governanceGracePeriodString = formatSeconds(
  governanceConfiguration.gracePeriod,
)
const governanceLockDelayString = formatSeconds(
  governanceConfiguration.proposeConfig.lockDelay,
)
const governanceQuorumString = formatPercentage(governanceConfiguration.quorum)
const governanceRequiredYeaMarginString = formatPercentage(
  governanceConfiguration.requiredYeaMargin,
)
const governanceApprovalThresholdString = formatPercentage(
  (
    (10n ** 18n + BigInt(governanceConfiguration.requiredYeaMargin) + 1n) /
    2n
  ).toString(),
)
const governanceMinimumTotalPowerString = formatAztecAmount(
  BigInt(governanceConfiguration.minimumVotes),
)
const governanceTotalDelayString = formatSeconds(
  governanceConfiguration.votingDelay +
    governanceConfiguration.votingDuration +
    governanceConfiguration.executionDelay,
)
const governanceLockShareOfSupplyString = formatFractionAsPercentage(
  governanceLockAmount,
  aztecTotalSupply,
)
const coinIssuerNominalAnnualPercentageCapString = formatPercentage(
  coinIssuerNominalAnnualPercentageCap,
)
const protocolTreasuryGatedUntilString = formatMonthYear(
  protocolTreasuryGatedUntil,
)
const proofWindowString = formatSeconds(proofWindow)
const escapeHatchFrequencyString = formatSeconds(escapeHatchFrequency)
const slashingDisableDurationString = formatSeconds(slashingDisableDuration)
const validatorExitDelayString = formatSeconds(
  discovery.getContractValue<number>('Rollup', 'getExitDelay'),
)
const slasherExecutionDelayString = formatSeconds(
  discovery.getContractValue<number>('Rollup', 'getSlasherExecutionDelay'),
)
const legacySlasherDrainWindowString = formatSeconds(
  discovery.getContractValue<number>('Rollup', 'getLegacySlasherDrainWindow'),
)

export const aztecnetwork: ScalingProject = {
  type: 'layer2',
  id: ProjectId('aztecnetwork'),
  capability: 'universal',
  addedAt: UnixTime(1773405732),
  badges: [
    BADGES.VM.AztecVM,
    BADGES.DA.EthereumBlobs,
    BADGES.Other.Privacy,
    BADGES.Other.Governance,
  ],
  display: {
    name: 'Aztec Network',
    shortName: 'Aztec',
    slug: 'aztecnetwork',
    description:
      'Aztec Network is a privacy-preserving ZK rollup that uses the AztecVM and Noir to support private and public smart contracts on Ethereum.',
    purposes: ['Universal', 'Privacy'],
    links: {
      websites: ['https://aztec.network/', 'https://aztec.network/noir'],
      documentation: ['https://docs.aztec.network/'],
      explorers: [
        'https://aztecscan.xyz',
        'https://aztecexplorer.xyz',
        'https://dashtec.xyz/',
        'https://slashveto.me/',
      ],
      bridges: [], // TODO
      repositories: ['https://github.com/AztecProtocol/aztec-packages'],
      socialMedia: [
        'https://x.com/aztecnetwork',
        'https://aztec.network/blog',
        'https://t.me/AztecAnnouncements_Official',
        'https://forum.aztec.network/',
        'https://youtube.com/@aztecnetwork',
        'https://discord.com/invite/aztec',
      ],
    },
    liveness: {
      warnings: {
        batchSubmissions: `Checkpoints posted to Ethereum remain pending until proven and can be pruned after their epoch proof deadline. With the current configuration, the maximum window is ${proofWindowString}; the effective window ranges from roughly one to two epochs depending on a checkpoint's position in its epoch.`,
      },
      explanation:
        'Aztec posts checkpoint data to Ethereum blobs and finalizes checkpoints once an epoch root proof is verified on Ethereum. Transactions should be considered final only after the corresponding epoch proof is accepted on L1.',
    },
  },
  proofSystem: {
    type: 'Validity',
    zkCatalogId: ProjectId('barretenberg'),
  },
  scopeOfAssessment: {
    inScope: [
      SOA.l1Contracts,
      SOA.gasToken,
      SOA.derivationSpec,
      SOA.sourceCodeToProgramHash,
      SOA.sourceCodeToVerificationKeys,
      SOA.sequencerPolicy,
      SOA.trustedSetup,
    ],
    notInScope: [SOA.l2Contracts, SOA.nonGasTokens, SOA.specToSourceCode],
  },
  config: {
    associatedTokens: ['AZTEC'],
    activityConfig: {
      type: 'block',
      startBlock: 1,
      // The indexer range is inclusive; 49 produces one 50-block RPC request.
      batchSize: 49,
    },
    escrows: [
      discovery.getEscrowDetails({
        address: feeJuicePortal.address,
        tokens: ['AZTEC'],
      }),
    ],
    trackedTxs: [
      {
        uses: [
          { type: 'liveness', subtype: 'batchSubmissions' },
          { type: 'l2costs', subtype: 'batchSubmissions' },
        ],
        query: {
          formula: 'functionCall',
          address: rollupAddress,
          selector: '0x72636df9',
          functionSignature:
            'function propose((bytes32,(int256),(bytes32,bytes32,bytes32,bytes32,bytes32,uint256,uint256,address,bytes32,(uint128,uint128),uint256,uint256)),(bytes,bytes),address[],(uint8,bytes32,bytes32),bytes)',
          topics: [
            '0x6ff492bf2b4ca1b93a175167d14b3e46085b935cab3f39ca94013000799b93a0', // CheckpointProposed
          ],
          sinceTimestamp: v5ActivationTimestamp,
        },
      },
      {
        uses: [
          { type: 'liveness', subtype: 'stateUpdates' },
          { type: 'l2costs', subtype: 'stateUpdates' },
        ],
        query: {
          formula: 'functionCall',
          address: rollupAddress,
          selector: '0x069d1525',
          functionSignature:
            'function submitEpochRootProof((uint256,uint256,(bytes32,bytes32,bytes32,address),(bytes32,bytes32,bytes32,bytes32,bytes32,uint256,uint256,address,bytes32,(uint128,uint128),uint256,uint256)[],(bytes,bytes),bytes,bytes))',
          sinceTimestamp: v5ActivationTimestamp,
        },
      },
    ],
  },
  chainConfig: {
    gasTokens: ['AZTEC'],
    name: 'aztecnetwork',
    chainId: 677868, // on chainlist, but aztec is not evm
    apis: [
      {
        type: 'aztec-rpc',
        url: 'https://aztec-mainnet.drpc.org',
        callsPerMinute: 60,
      },
    ],
  },
  dataAvailability: {
    layer: DA_LAYERS.ETH_BLOBS,
    bridge: DA_BRIDGES.ENSHRINED,
    mode: DA_MODES.STATE_DIFFS, // uses SpongeBlob for cryptographic commitments and packing, no compression
  },
  riskView: {
    stateValidation: {
      ...RISK_VIEW.STATE_ZKP_SN, // UltraHonk and CHONK (Client-side Highly Optimized ploNK)
      executionDelay: 0, // a proposed checkpoint can be immediately proven
      permissioned: false,
    },
    dataAvailability: {
      ...RISK_VIEW.DATA_ON_CHAIN_STATE_DIFFS,
      description:
        'State diffs needed to reconstruct the L2 state are published in Ethereum blobs. Public transaction bodies and client CHONK proofs propagate offchain, so withholding them can prevent permissionless proving; the affected pending checkpoints expire and are pruned rather than finalized.',
    },
    exitWindow: {
      ...RISK_VIEW.EXIT_WINDOW_NON_UPGRADABLE,
      description:
        RISK_VIEW.EXIT_WINDOW_NON_UPGRADABLE.description +
        ' Governance can register a new canonical rollup and bonus-instance validators automatically follow the latest version, but this does not mutate the current instance, its verifier, messaging contracts, or already-installed EscapeHatch. Governance can change bounded validator-entry parameters and can set the GSE proof-of-possession gas limit too low for new deposits; validators explicitly bound to this instance remain on it.',
    },
    sequencerFailure: {
      value: 'Decentralized Sequencer Set',
      sentiment: 'good',
      description: `Users can permissionlessly become a sequencer by staking ${activationThresholdString} to join the queue and wait to obtain committee-based block production rights. If the pseudo-randomly sampled committees censor proposals, anyone who bonds ${escapeHatchBondString} will join the escape hatch candidate set. Every ${escapeHatchFrequencyString}, a candidate is pseudo-randomly selected to propose and prove checkpoints fully autonomously. A candidate remains in the set until they are selected or leave voluntarily.`,
    },
    proposerFailure: {
      value: 'Self Propose',
      sentiment: 'good',
      description:
        'Checkpoint proposals come from the open sequencer set, with the escape hatch providing a bonded fallback if the sampled committees are censoring or unavailable. Anyone with access to the required hardware can submit epoch root proofs which finalize the proven checkpoints.',
    },
  },
  stage: getRollupStage(
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
        noRedTrustedSetups: true,
        programHashesReproducible: null,
        proverSourcePublished: true,
        verifierContractsReproducible: true,
      },
      stage2: {
        proofSystemOverriddenOnlyInCaseOfABug: null, // there is no SC, rollup immutable
        fraudProofSystemIsPermissionless: null,
        delayWith30DExitWindow: {
          satisfied: true,
          message:
            'The Rollup, verifier, Inbox and Outbox are immutable. Selecting a new canonical rollup does not mutate this deployed instance or its installed bonded EscapeHatch, although validator migration can affect normal proposer availability and inclusion remains probabilistic.',
          mode: 'replace',
        },
      },
    },
    {
      rollupNodeLink:
        'https://github.com/AztecProtocol/aztec-packages/tree/v5.0.0',
    },
  ),
  technology: {
    dataAvailability: {
      name: 'All transaction results (state diffs) are published in Ethereum blobs',
      description:
        'Each checkpoint proposal includes EIP-4844 blob commitments for state diffs, checked against the blob hashes in the proposing transaction. The epoch proof revalidates the accumulated commitments before finalization. Public transaction bodies and client CHONK proofs propagate offchain; withholding them can prevent permissionless proving, causing the pending checkpoint to expire and be pruned rather than finalized.',
      references: [
        {
          title: 'Rollup.sol - propose() on Etherscan',
          url: `https://etherscan.io/address/${rollupAddress.toString()}#code`,
        },
        {
          title: 'Rollup.sol - validateBlobs() on Etherscan',
          url: `https://etherscan.io/address/${rollupAddress.toString()}#code`,
        },
      ],
      risks: [],
    },
    operator: {
      ...OPERATOR.DECENTRALIZED_OPERATOR,
      description: `There is no privileged sequencer. Anyone can stake ${activationThresholdString} to join the sequencer queue, and anyone can call flushEntryQueue() to activate queued sequencers once the queue rules allow it.`,
      references: [
        {
          title: 'Rollup.sol - deposit() on Etherscan',
          url: `https://etherscan.io/address/${rollupAddress.toString()}#code`,
        },
        {
          title: 'Rollup.sol - flushEntryQueue() on Etherscan',
          url: `https://etherscan.io/address/${rollupAddress.toString()}#code`,
        },
      ],
      risks: [],
    },
    sequencing: {
      name: 'Transactions are ordered by a staked validator committee',
      description: readProjectMarkdown('aztecnetwork', 'technologySequencing', {
        activationThresholdString,
        targetCommitteeSize,
        activeSequencerCount,
      }),
      sequencerSetSpec: {
        blockTime: {
          value: `${formatSeconds(l2BlockTime)}`,
          description:
            'Current expected interval between L2 block proposals. Multiple blocks can be produced by the same proposer within one slot, so this interval can differ from the proposer rotation interval.',
        },
        proposerRotationTime: { value: formatSeconds(slotDuration) },
        committeeRotationTime: {
          value: formatSeconds(epochDuration),
          description:
            'A random committee is sampled from the sequencer set for each epoch, a random block producer is sampled from the committee for each slot in the epoch',
        },
        sequencerCount: { value: `${activeSequencerCount} sequencers` },
        blockProductionAccess: { value: 'Open', sentiment: 'good' },
        stakePerValidator: { value: activationThresholdString + ', constant' },
        rateLimit: {
          value: `Up to ${entryQueueFlushSize} sequencers per epoch (current)`,
          description:
            'Can be changed by onchain Governance, but the contract requires nonzero minimum, divisor, and maximum queue-flush parameters.',
        },
        deterministicCrGadget: { value: 'No', sentiment: 'warning' },
        additionalCrGadgets: {
          value: 'Bonded escape hatch, private transactions',
          sentiment: 'good',
        },
      },
      inclusionDelayChart: {
        type: 'committeelike',
        validatorCount: activeSequencerCount,
        committeeSize: targetCommitteeSize,
        epochSlots,
        slotSeconds: slotDuration,
        blockingThreshold: Math.floor((targetCommitteeSize - 1) / 3),
        target: 0.99,
        maxCensorFraction: 0.5,
        stakeDistribution,
      },
      inclusionDelayChartDescription:
        'The chart models live-chain selective censorship only. It does not model the escape hatch, validator-set changes, validator-set lag, and blanket-censorship resistance gadgets.',
      censorshipResistance: readProjectMarkdown(
        'aztecnetwork',
        'censorshipResistance',
        { escapeHatchBondString, escapeHatchFrequencyString },
      ),
      references: [
        {
          title: 'Aztec docs - Privacy considerations',
          url: 'https://github.com/AztecProtocol/aztec-packages/blob/next/docs/docs-developers/docs/resources/considerations/privacy_considerations.md#function-fingerprints-and-tx-fingerprints',
        },
        {
          title: 'Rollup.sol - getProposerAt() on Etherscan',
          url: `https://etherscan.io/address/${rollupAddress.toString()}#code`,
        },
        {
          title: 'EscapeHatch.sol - selectCandidates() on Etherscan',
          url: `https://etherscan.io/address/${escapeHatchAddress.toString()}#code`,
        },
      ],
      risks: [],
    },
    forceTransactions: {
      name: 'Bonded, probabilistic self-sequencing',
      description:
        'There is no L1 forced-transaction queue. A censored user must wait for an honest regular committee or for an honest, sufficiently capitalized escape-hatch candidate to enroll, become eligible, be selected, include the transaction, and produce a valid proof.',
      risks: [
        {
          category: 'Users can be censored if',
          text: 'no honest regular proposer or eligible bonded escape-hatch proposer includes and proves their transactions.',
        },
      ],
      references: [
        {
          title: 'EscapeHatch.sol on Etherscan',
          url: `https://etherscan.io/address/${escapeHatchAddress.toString()}#code`,
        },
      ],
    },
    exitMechanisms: [
      {
        ...EXITS.REGULAR_MESSAGING('zk'),
        description:
          EXITS.REGULAR_MESSAGING('zk').description +
          ' Once the epoch root proof has been verified, the rollup inserts the epoch root into the Outbox, from which withdrawals and other L2->L1 messages can be consumed on Ethereum. Withdrawals can be initiated privately on L2, revealing only the L1-facing portion of the transaction. There is no canonical bridge escrow: only the canonical messaging layer is immutable, while each token bridged through a locking escrow may introduce additional trust assumptions tied to that specific escrow.',
        references: [
          {
            title: 'Rollup.sol - submitEpochRootProof() on Etherscan',
            url: `https://etherscan.io/address/${rollupAddress.toString()}#code`,
          },
          {
            title: 'Outbox.sol - consume() on Etherscan',
            url: `https://etherscan.io/address/${outboxAddress.toString()}#code`,
          },
        ],
        risks: [],
      },
    ],
    otherConsiderations: [
      {
        name: 'Upgrades replace the canonical rollup',
        description:
          'The core contracts are immutable, but Governance owns the Registry and GSE and can register a new rollup version as canonical after the governance delay.',
        references: [
          {
            title: 'Registry.sol - addRollup() on Etherscan',
            url: `https://etherscan.io/address/${registryAddress.toString()}#code`,
          },
          {
            title: 'Governance.sol - execute() on Etherscan',
            url: `https://etherscan.io/address/${governanceAddress.toString()}#code`,
          },
        ],
        risks: [],
      },
      {
        name: 'No canonical bridge escrow',
        description:
          'There is no default canonical escrow. The rollup is deployed only with an immutable canonical messaging bridge, which can be used by any escrow. As a result, each token bridged to Aztec via Ethereum lock-mint must be assessed individually by examining its specific locking escrow. The trust assumptions of a given escrow may differ from those of the immutable rollup itself. Gas tokens are bridged through the FeeJuicePortal, an immutable one-way portal that only supports bridging to public L2 addresses. Although the rollup and its canonical messaging bridge are immutable, an upgradeable escrow could migrate its funds to a new rollup version without requiring users to migrate, effectively trading immutability for convenience.',
        references: [
          {
            title: 'FeeJuicePortal.sol - on Etherscan',
            url: `https://etherscan.io/address/${feeJuicePortal.address.toString()}#code`,
          },
          {
            title: 'Outbox.sol - on Etherscan',
            url: `https://etherscan.io/address/${outboxAddress.toString()}#code`,
          },
        ],
        risks: [],
      },
      {
        name: 'Inclusion is probabilistic',
        description: readProjectMarkdown(
          'aztecnetwork',
          'technologyOtherConsiderations3',
          { launchExitSimulationTime: formatSeconds(launchExitSimulationTime) },
        ),
        references: [
          {
            title: 'CRsim - Simulated inclusion probability on Aztec',
            url: 'https://sekuba.github.io/crsim',
          },
        ],
        risks: [],
      },
    ],
  },
  stateValidation: {
    description: `Each epoch root proof is verified by the HonkVerifier smart contract on Ethereum before the proven checkpoint number is advanced and the epoch outbox state root is inserted into the Outbox. Proving is permissionless, and a single proof can cover one Checkpoint (${formatSeconds(slotDuration)}) to one epoch (${formatSeconds(epochDuration)}). The current maximum proof window is ${proofWindowString}; checkpoints later in an epoch have less time, and unproven checkpoints are pruned.`,
    categories: [
      {
        title: 'State root proposals',
        description:
          'The rollup only advances the proven chain after submitEpochRootProof() succeeds. That call verifies the epoch proof and then inserts the epoch outbox state root for L2->L1 messaging.',
        references: [
          {
            title: 'Rollup.sol - submitEpochRootProof() on Etherscan',
            url: `https://etherscan.io/address/${rollupAddress.toString()}#code`,
          },
        ],
        risks: [],
      },
      {
        ...STATE_VALIDATION.VALIDITY_PROOFS,
        references: [
          {
            title: 'Rollup.sol - submitEpochRootProof() on Etherscan',
            url: `https://etherscan.io/address/${rollupAddress.toString()}#code`,
          },
          {
            title: 'HonkVerifier.sol - verify() on Etherscan',
            url: `https://etherscan.io/address/${verifierAddress.toString()}#code`,
          },
        ],
      },
      {
        title: 'Slashing',
        description: readProjectMarkdown(
          'aztecnetwork',
          'stateValidationSlashing',
          {
            activationThresholdString,
            epochsPerRound,
            roundDuration: formatSeconds(epochsPerRound * epochDuration),
            slashOffsetRounds,
            slashQuorum,
            slotsPerRound,
            slashPayloadExecutionDelayRounds,
            slashLifetimeRounds,
            slashExecutionWindowRounds:
              slashLifetimeRounds - slashPayloadExecutionDelayRounds,
            slashExecutionDelay: formatSeconds(
              slashPayloadExecutionDelayRounds * epochsPerRound * epochDuration,
            ),
            slashAmountLarge: slashAmount.large,
            slashAmountMedium: slashAmount.medium,
            slashAmountSmall: slashAmount.small,
            slashVetoStats,
            slashingDisableDurationString,
          },
        ),
        references: [
          {
            title: 'SlashingProposer.sol on Etherscan',
            url: `https://etherscan.io/address/${slashingProposer.address.toString()}#code`,
          },
          {
            title: 'Slasher.sol on Etherscan',
            url: `https://etherscan.io/address/${slasher.address.toString()}#code`,
          },
          {
            title: 'SlashVeto Council - Github',
            url: 'https://github.com/aztec-slash-veto/council',
          },
          {
            title: 'slashveto.me - Monitor Slashing',
            url: 'https://slashveto.me',
          },
        ],
        risks: [],
      },
    ],
  },
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    zkVerifiers: [honkVerifier.address],
    risks: [],
  },
  permissions: generateDiscoveryDrivenPermissions([discovery]),
  upgradesAndGovernance: {
    content: readProjectMarkdown('aztecnetwork', 'upgradesAndGovernance', {
      governanceExecutionDelayString,
      governanceSignalRoundSizeString,
      governanceSignalQuorumSizeString,
      governanceVotingDelayString,
      governanceVotingDurationString,
      governanceQuorumString,
      governanceRequiredYeaMarginString,
      governanceApprovalThresholdString,
      governanceMinimumTotalPowerString,
      governanceGracePeriodString,
      governanceTotalDelayString,
      governanceLockString,
      governanceLockShareOfSupplyString,
      governanceLockDelayString,
      validatorExitDelayString,
      bonusInstanceAddress: bonusInstanceAddress.toString(),
      slashingDisableDurationString,
      slasherExecutionDelayString,
      legacySlasherDrainWindowString,
      coinIssuerNominalAnnualPercentageCapString,
      protocolTreasuryGatedUntilString,
    }),
  },
  discoveryInfo: getDiscoveryInfo([discovery]),
  milestones: [
    {
      title: 'Aztec v5 Upgrade',
      url: 'https://etherscan.io/tx/0xff2db4e4bba583f2451478bfe4703e16afc79f0b463fb60615ebe3494142437b',
      date: '2026-07-14T00:00:00Z',
      description:
        'Governance makes v5 canonical which hardens the immutability and fixes vulnerabilities.',
      type: 'general',
    },
    {
      title: 'Cut the Leash',
      url: 'https://github.com/AztecProtocol/governance/pull/7',
      date: '2026-06-22T00:00:00Z',
      description:
        'Ownership of the v4 Rollup is revoked, promoting it to Stage 2 (immutable).',
      type: 'general',
    },
    {
      title: 'v4 Vulnerabilities',
      url: 'https://aztec.network/blog/critical-vulnerability-in-alpha-v4',
      date: '2026-03-31T00:00:00Z',
      description:
        'Aztec warns about critical security vulnerabilities that can lead to theft of funds.',
      type: 'incident',
    },
    {
      title: 'Aztec Alpha (v4) Launch',
      url: 'https://aztec.network/blog/announcing-the-alpha-network',
      date: '2026-03-30T00:00:00Z',
      description:
        'Aztec launches its feature-complete Alpha network, allowing developers to deploy the first apps.',
      type: 'general',
    },
  ],
}
