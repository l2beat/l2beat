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
import { getStage } from '../../common/stages/getStage'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import {
  generateDiscoveryDrivenContracts,
  generateDiscoveryDrivenPermissions,
} from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import type { Sentiment } from '../../types'

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

const hardCodedExitSimTime = 20 * UnixTime.DAY // https://sekuba.github.io/crsim/?max_horizon_days=100&target_inclusion_percent=99&max_new_sequencers_per_epoch=0&honest_add_success_rate=0.5
const exitWindow = governanceConfiguration.executionDelay - hardCodedExitSimTime
const exitWindowObject = {
  value: formatSeconds(exitWindow),
  sentiment: 'warning' as Sentiment,
  description: `Users have ${formatSeconds(exitWindow)} to exit funds in case of an unwanted regular upgrade. There is a ${formatSeconds(governanceConfiguration.executionDelay)} delay before a regular upgrade is applied, and withdrawal inclusion via the decentralized sequencer set is probabilistic and simulated to take up to ${formatSeconds(hardCodedExitSimTime)} to be processed. Although core contracts are immutable, the onchain Governance system can designate a new 'canonical' rollup with a ${formatSeconds(governanceConfiguration.executionDelay)} delay and has access to critical configuration permissions that can freeze or compromise the Rollup system, counting as an upgrade for the exit window.`,
}

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
const epochDuration =
  discovery.getContractValue<number>('Rollup', 'getEpochDuration') *
  slotDuration
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
  'TallySlashingProposer',
  'ROUND_SIZE_IN_EPOCHS',
)

const slotsPerRound = discovery.getContractValue<number>(
  'TallySlashingProposer',
  'ROUND_SIZE',
)

const slashOffsetRounds = discovery.getContractValue<number>(
  'TallySlashingProposer',
  'SLASH_OFFSET_IN_ROUNDS',
)

const slashPayloadExecutionDelayRounds = discovery.getContractValue<number>(
  'TallySlashingProposer',
  'EXECUTION_DELAY_IN_ROUNDS',
)

const tallySlashQuorum = discovery.getContractValue<number>(
  'TallySlashingProposer',
  'QUORUM',
)

const slashAmount = {
  large: formatAztecAmount(
    discovery.getContractValueBigInt(
      'TallySlashingProposer',
      'SLASH_AMOUNT_LARGE',
    ),
  ),
  medium: formatAztecAmount(
    discovery.getContractValueBigInt(
      'TallySlashingProposer',
      'SLASH_AMOUNT_MEDIUM',
    ),
  ),
  small: formatAztecAmount(
    discovery.getContractValueBigInt(
      'TallySlashingProposer',
      'SLASH_AMOUNT_SMALL',
    ),
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

const rollupAddress = ChainSpecificAddress.address(rollup.address)
const verifierAddress = ChainSpecificAddress.address(honkVerifier.address)
const outboxAddress = ChainSpecificAddress.address(outbox.address)
const governanceAddress = ChainSpecificAddress.address(governance.address)
const registryAddress = ChainSpecificAddress.address(registry.address)
const escapeHatchAddress = ChainSpecificAddress.address(escapeHatch.address)

const alphaGenesisTimestamp = UnixTime(1774839144) // Monday, 30 March 2026 04:52 GMT+2

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
        batchSubmissions: `Checkpoints that are posted to Ethereum but not yet proven can be pruned once the proof submission window of ${proofWindowString} expires.`,
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
          selector: '0x85b98fd8',
          functionSignature:
            'function propose((bytes32,(int256),(bytes32,bytes32,bytes32,bytes32,bytes32,uint256,uint256,address,bytes32,(uint128,uint128),uint256)),(bytes,bytes),address[],(uint8,bytes32,bytes32),bytes)',
          sinceTimestamp: alphaGenesisTimestamp,
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
          selector: '0xd8ea4277',
          functionSignature:
            'function submitEpochRootProof((uint256,uint256,(bytes32,bytes32,bytes32,address),bytes32[],(bytes,bytes),bytes,bytes))',
          sinceTimestamp: alphaGenesisTimestamp,
        },
      },
    ],
  },
  chainConfig: {
    gasTokens: ['AZTEC'],
    name: 'aztecnetwork',
    chainId: 677868, // TODO: verify
    apis: [], // TODO: add
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
    },
    dataAvailability: RISK_VIEW.DATA_ON_CHAIN_STATE_DIFFS,
    exitWindow: exitWindowObject,
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
        principle: true, // assuming the probabilistic inclusion provides the 7d exit window, also there is no SC
        usersHave7DaysToExit: true,
        usersCanExitWithoutCooperation: true,
        securityCouncilProperlySetUp: null,
        noRedTrustedSetups: true,
        programHashesReproducible: null,
        proverSourcePublished: true,
        verifierContractsReproducible: true,
      },
      stage2: {
        proofSystemOverriddenOnlyInCaseOfABug: null, // there is no SC
        fraudProofSystemIsPermissionless: null,
        delayWith30DExitWindow: false, // 30d gov delay means <30d exit window due to inclusion delay
      },
    },
    {
      rollupNodeLink:
        'https://docs.aztec.network/operate/operators/setup/running_a_node',
    },
  ),
  technology: {
    dataAvailability: {
      name: 'All transaction results (state diffs) are published in Ethereum blobs',
      description:
        'Each checkpoint proposal includes EIP-4844 blob commitments that are checked against the blob hashes in the proposing transaction. The epoch proof revalidates the accumulated blob commitments before the epoch is finalized.',
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
      name: 'Transactions are ordered by a staked committee',
      description: `Joining the sequencer set is permissionless and requires staking ${activationThresholdString}. For each epoch, the rollup samples a ${targetCommitteeSize}-member committee from the active sequencer set of ${activeSequencerCount} and selects one proposer per slot. The committee and regular sequencer set can be circumvented via the escape hatch, which designates a bonded proposer (via RANDAO) who can publish checkpoints without committee attestations.`,
      references: [
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
          'The core contracts are immutable, but Governance owns the Registry and GSE and can register a new rollup version as canonical after the governance delay. Governance also owns critical config parameters that can freeze or compromise the Rollup system.',
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
        description: `All censorship resistance tools that are part of the protocol rely on probabilistic inclusion. In contrast to "forced transactions", there is no simple deterministic inclusion after some maximum delay, but rather different inclusion probabilities after different time horizons. The "time needed to exit" of ${formatSeconds(hardCodedExitSimTime)} for the exit window was simulated by using a simple model of the decentralized sequencer set at launch. The escape hatch and private transactions can give additional inclusion guarantees.`,
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
    description: `Each epoch root proof is verified by the HonkVerifier smart contract on Ethereum before the proven checkpoint number is advanced and the epoch outbox state root is inserted into the Outbox. Proving is permissionless, and a single proof can cover one Checkpoint (${formatSeconds(slotDuration)}) to one epoch (${formatSeconds(epochDuration)}). Unproven checkpoints are pruned after the proof submission window of ${proofWindowString} expires.`,
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
        description: `
Each stake of ${activationThresholdString} that is locked to join the sequencer set and vote in governance can be slashed under certain conditions. Slashing is voted on by sequencers each time they propose a checkpoint and is grouped in rounds that span ${epochsPerRound} epochs (${formatSeconds(epochsPerRound * epochDuration)}) each.

Slashing conditions are programmed into each sequencer node and can be changed by node operators by updating or editing their node software. Nodes usually submit votes to slash automatically on L1. The \`TallySlashingProposer\` contract only enforces the formalities of the slashing system:
* A given slashing round's votes always target the checkpoint proposals from ${slashOffsetRounds} rounds ago.
* As soon as a round's votes have reached a quorum of ${tallySlashQuorum}/${slotsPerRound}, it enters an execution delay of ${slashPayloadExecutionDelayRounds} rounds (${formatSeconds(slashPayloadExecutionDelayRounds * epochsPerRound * epochDuration)})
* An automatically generated slashing payload is executable by anyone on L1 after the execution delay, applying the slashing penalties defined by the sequencer votes.

Slashing penalties are defined onchain in three levels: large (${slashAmount.large}), medium (${slashAmount.medium}), and small (${slashAmount.small}). Offenses that lead to slashing usually include:
* Inactivity: A sequencer fails to attest or propose when selected.
* Data Withholding: A sequencer proposes a checkpoint including state diff data availability on L1 but withholds the public transaction bodies and/or CHONK proofs required for permissionless proving.
* Invalidity: A sequencer attests to invalid proposals, multiple conflicting proposals, with invalid signatures, or proposes a block that is not proven in time.

The above offense list is not exhaustive and not defined onchain but usually in the software the sequencers decide to run. This is also where the mapping of offenses to the slashing penalty levels can be defined.

The SlashVeto Council is a ${slashVetoStats} Multisig that can veto specific proposals and/or all slashing for ${slashingDisableDurationString} at a time.`,
        references: [
          {
            title: 'Slashing - Aztec Docs',
            url: 'https://docs.aztec.network/operate/operators/sequencer-management/slashing_and_offenses',
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
    risks: [], // 30d delay for the canonical rollup pointer and config but main contracts are immutable
  },
  permissions: generateDiscoveryDrivenPermissions([discovery]),
  upgradesAndGovernance: `
# Standard Path (Signaling)
Because sequencers stake AZTEC tokens to secure the L2 network, they are also the primary governors of the system. Any governance proposal must be encoded and deployed as a smart contract payload on Ethereum. While core contracts are immutable, the onchain Governance system can designate a new 'canonical' rollup with a ${governanceExecutionDelayString} delay and has access to critical configuration permissions that can freeze or compromise the Rollup system. These permissions can only be accessed through the process described below.

## 1. The Signaling Phase (\`GovernanceProposer\`)
Aztec uses an onchain "Empire" signaling system. Active sequencers operating on the 'canonical rollup' (as defined by the Registry) call \`signal(payloadAddress)\` on the L1 \`GovernanceProposer\` contract during their designated L2 slots to support a specific upgrade payload. A voting round consists of ${governanceSignalRoundSizeString} slots. To win a round and become a formal proposal, a payload must receive signals from at least ${governanceSignalQuorumSizeString} slots. Once quorum is reached, the payload is submitted to the L1 \`Governance\` contract.

## 2. The Voting Phase (\`Governance\`)
Once submitted, the proposal enters a delay and voting flow:
*   **Pending (${governanceVotingDelayString}):** At the end of this delay, voting power is snapshotted.
*   **Active (${governanceVotingDurationString}):** AZTEC token holders can vote. To pass, a proposal must reach a ${governanceQuorumString} Quorum of all staked power, and the \`yea\` votes must exceed a required margin of ${governanceRequiredYeaMarginString}.
*   **Queued (${governanceExecutionDelayString}):** If successful, the proposal enters an execution delay. This acts as an exit window, allowing dissenting sequencers to initiate a withdrawal of their staked tokens before the malicious/disagreed-upon code is executed.
*   Executable (${governanceGracePeriodString}): The proposal enters a grace period where anyone can call \`execute()\`. If not executed, it expires.

Total standard delay from proposal to execution: **${governanceTotalDelayString}**.

### Emergency Path (Circumvent Signaling)
If the L2 sequencer set is offline, censoring, or acting maliciously, the \`GovernanceProposer\` cannot be used. To ensure liveness, anyone can bypass the Sequencer signaling phase using the \`proposeWithLock()\` function directly on the \`Governance\` contract.
*   An actor must lock **${governanceLockString}**, roughly ${governanceLockShareOfSupplyString} of total supply
*   These funds are locked for an extended ${governanceLockDelayString}.
*   Once proposed, the payload enters the exact same ${governanceTotalDelayString} Voting Phase (Pending -> Active -> Queued -> Executable) as the standard path.

### Rollup Immutability
The smart contract code of \`Rollup\`, its verifier and its canonical messaging contracts cannot be changed. However, \`Governance\` owns critical permissions for configuration parameters that can freeze the L2 indefinitely. 'Upgrading' a Rollup contract involves a \`Governance\` action that designates a new \`Rollup\` contract address as canonical. The \`GSE\` (Governance Staking Escrow) automatically migrates the voting power and stake of all active sequencers to the new rollup version if they staked to the default magic address \`${bonusInstanceAddress.toString()}\` instead of a specific immutable rollup. Importantly, \`Governance\` retains ownership of the old rollup, with the permissions to freeze it in the same or any future governance proposal. In summary and practice, the current Aztec rollup system is not immutable and prone to governance changes with the configured ${governanceExecutionDelayString} delay.

### Slashing and the SlashVeto Council
Aztec features onchain slashing for equivocation or missing attestations, managed by \`Slasher\` and \`TallySlashingProposer\`. 

There is a protective **Vetoer** role held by the SlashVeto Council. The Council cannot upgrade the protocol, alter governance, or steal funds. Instead it is limited to two permissions:
*   call \`vetoPayload()\` to stop a specific slashing event.
*   call \`setSlashingEnabled(false)\`, which pauses all slashing in the protocol for a period of ${slashingDisableDurationString}.

### Economics & Treasury
*   **Coin Issuer:** The \`CoinIssuer\` contract is owned by Governance and is authorized to mint new AZTEC tokens up to a cap of ${coinIssuerNominalAnnualPercentageCapString}.
*   **Protocol Treasury:** Funds owned by the DAO sit in the \`ProtocolTreasury\`. The Treasury has a hardcoded timestamp (approx. ${protocolTreasuryGatedUntilString}). Before this date, the DAO cannot spend Treasury funds. After this date, Treasury funds and token ownership can be moved with a Governance Proposal.`,
  discoveryInfo: getDiscoveryInfo([discovery]),
}
