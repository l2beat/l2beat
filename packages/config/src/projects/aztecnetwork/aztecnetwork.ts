import {
  ChainSpecificAddress,
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
import { formatEther } from 'ethers/lib/utils'

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

const executionDelay = governanceConfiguration.executionDelay

const feeJuicePortal = discovery.getContract('FeeJuicePortal')
const governance = discovery.getContract('Governance')
const honkVerifier = discovery.getContract('HonkVerifier')
const inbox = discovery.getContract('Inbox')
const outbox = discovery.getContract('Outbox')
const registry = discovery.getContract('Registry')
const rollup = discovery.getContract('Rollup')
const escapeHatch = discovery.getContract('EscapeHatch')

const rollupAddress = ChainSpecificAddress.address(rollup.address)
const verifierAddress = ChainSpecificAddress.address(honkVerifier.address)
const inboxAddress = ChainSpecificAddress.address(inbox.address)
const outboxAddress = ChainSpecificAddress.address(outbox.address)
const governanceAddress = ChainSpecificAddress.address(governance.address)
const registryAddress = ChainSpecificAddress.address(registry.address)
const escapeHatchAddress = ChainSpecificAddress.address(escapeHatch.address)

const alphaGenesisTimestamp = UnixTime(1774839144) // Monday, 30 March 2026 04:52 GMT+2

function formatAztecAmount(amount: bigint): string {
  return `${formatEther(amount)} AZTEC`
}

const activationThresholdString = formatAztecAmount(activationThreshold)
const escapeHatchBondString = formatAztecAmount(escapeHatchBond)
const governanceLockString = formatAztecAmount(
  BigInt(governanceConfiguration.proposeConfig.lockAmount),
)
const currentExecutionDelayString = formatSeconds(executionDelay)
const proofWindowString = formatSeconds(proofWindow)
const escapeHatchFrequencyString = formatSeconds(escapeHatchFrequency)
const safeThreshold = discovery.getMultisigStats('Safe')

export const aztecnetwork: ScalingProject = {
  type: 'layer2',
  id: ProjectId('aztecnetwork'),
  capability: 'universal',
  addedAt: UnixTime(1773405732),
  badges: [BADGES.VM.AztecVM, BADGES.DA.EthereumBlobs, BADGES.Other.Governance],
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
      explorers: ['https://aztecscan.xyz', 'https://aztecexplorer.xyz', 'https://dashtec.xyz/', 'https://slashveto.me/'],
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
    name: 'Honk',
    // zkCatalogId: // TODO Sergey
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
    notInScope: [
      SOA.l2Contracts,
      SOA.nonGasTokens,
      SOA.trustedSetup,
      SOA.specToSourceCode,
    ],
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
  dataAvailability: {
    layer: DA_LAYERS.ETH_BLOBS,
    bridge: DA_BRIDGES.ENSHRINED,
    mode: DA_MODES.TRANSACTION_DATA, // uses SpongeBlob for cryptographic commitments and packing, no compression
  },
  riskView: {
    stateValidation: {
      ...RISK_VIEW.STATE_ZKP_SN, // UltraHonk and CHONK (Client-side Highly Optimized ploNK)
      executionDelay: 0, // a proposed checkpoint can be immediately proven
    },
    dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
    exitWindow: {
      value: formatSeconds(executionDelay),
      sentiment: 'good',
      orderHint: executionDelay,
      description: `Any upgrade is delayed by ${formatSeconds(
        executionDelay,
      )} before being executed. During that time, users can exit through 1) regular withdrawals initiated privately on L2 via the decentralized, permissionless sequencer set and 2) proposing and proving their own withdrawal via the escape hatch.`,
    },
    sequencerFailure: {
      value: 'Decentralized Sequencer Set',
      sentiment: 'good',
      description: `Users can permissionlessly become a sequencer by staking ${activationThresholdString} to join the queue and wait to obtain committee-based block production rights. If the committees censor, anyone can bond ${escapeHatchBondString} to join the escape hatch candidate set, which opens every ${escapeHatchFrequencyString}.`,
    },
    proposerFailure: {
      value: 'Self Propose',
      sentiment: 'good',
      description:
        'Anyone can submit epoch root proofs for pending checkpoints. Checkpoint proposals themselves come from the open sequencer set, with the escape hatch providing a bonded fallback if the committees are censoring or unavailable.',
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
        principle: true,
        usersHave7DaysToExit: true,
        usersCanExitWithoutCooperation: true,
        securityCouncilProperlySetUp: true,
        noRedTrustedSetups: true, // TODO: ?
        programHashesReproducible: true, // TODO: ?
        proverSourcePublished: true,
        verifierContractsReproducible: true, // TODO: ?
      },
      stage2: {
        proofSystemOverriddenOnlyInCaseOfABug: true,
        fraudProofSystemIsPermissionless: null,
        delayWith30DExitWindow: true,
      },
    },
    {
      rollupNodeLink:
        'https://docs.aztec.network/operate/operators/setup/running_a_node',
    },
  ),
  technology: {
    dataAvailability: {
      name: 'All transaction data is published in Ethereum blobs',
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
      description: `There is no privileged sequencer. Anyone can stake ${activationThresholdString} to join the validator queue, and anyone can call flushEntryQueue() to activate queued validators once the queue rules allow it.`,
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
    },
    sequencing: {
      name: 'Transactions are ordered by a staked committee',
      description: `For each epoch, the rollup samples a ${targetCommitteeSize}-member committee from the active validator set and selects one proposer per slot. The committe and regular sequencer set can be circumvented via the escape hatch, which designates a bonded proposer (via RANDAO) who can publish checkpoints without committee attestations.`,
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
    forceTransactions: {
      name: 'Decentralized Sequencers, Escape Hatch',
      description: `Aztec does not expose an L1 forced-transaction queue for arbitrary L2 transactions. Instead, users can permissionlessly join the validator set by staking ${activationThresholdString}. Transactions can be submitted for the private execution environment, preventing potential censorship based on transaction content. To circumvent the committees formed from the active sequencer set, anyone can join the escape hatch candidate set by bonding ${escapeHatchBondString}.`,
      references: [
        {
          title: 'Inbox.sol - sendL2Message() on Etherscan',
          url: `https://etherscan.io/address/${inboxAddress.toString()}#code`,
        },
        {
          title: 'Rollup.sol - deposit() on Etherscan',
          url: `https://etherscan.io/address/${rollupAddress.toString()}#code`,
        },
        {
          title: 'EscapeHatch.sol - joinCandidateSet() on Etherscan',
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
          ' Once the epoch root proof is verified, the rollup inserts the epoch root into the Outbox, from which withdrawals and other L2->L1 messages can be consumed on Ethereum.',
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
    ],
  },
  stateValidation: {
    description:
      'Each epoch root proof is verified on Ethereum before the proven checkpoint number is advanced and the epoch outbox root is inserted into the Outbox.',
    categories: [
      {
        title: 'State root proposals',
        description:
          'The rollup only advances the proven chain after submitEpochRootProof() succeeds. That call verifies the epoch proof and then inserts the epoch outbox root for L2->L1 messaging.',
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
    ],
  },
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [], // 30d delay for the canonical rollup pointer but main contracts are immutable
  },
  permissions: generateDiscoveryDrivenPermissions([discovery]),
  upgradesAndGovernance: `
# Standard Path (Signaling)
Because sequencers stake AZTEC tokens to secure the L2 network, they are also the primary governors of the system. Any governance proposal must be encoded and deployed as a smart contract payload on Ethereum.

## 1. The Signaling Phase (`GovernanceProposer`)
Aztec uses an onchain "Empire" signaling system. Active sequencers call `signal(payloadAddress)` on the L1 `GovernanceProposer` contract during their designated L2 slots to support a specific upgrade payload. 
*   A voting round consists of `ROUND_SIZE` slots
*   To win a round and become a formal proposal, a payload must receive signals from at least `QUORUM_SIZE` slots.
*   Once quorum is reached, the payload is submitted to the L1 `Governance` contract.

## 2. The Voting Phase (`Governance`)
Once submitted, the proposal enters a delay and voting flow:
*   **Pending (`votingDelay`):** At the end of this delay, voting power is snapshotted.
*   **Active (`votingDuration`):** AZTEC token holders can vote. To pass, a proposal must reach a XX% Quorum of all staked power, and the `yea` votes must exceed a required margin of XX.
*   **Queued (`executionDelay`):** If successful, the proposal enters an execution delay. This acts as an exit window, allowing dissenting validators to initiate a withdrawal of their staked tokens before the malicious/disagreed-upon code is executed.
*   Executable (`gracePeriod`): The proposal enters a grace period where anyone can call `execute()`. If not executed, it expires.

Total standard delay from proposal to execution: **XX Days**.

### Emergency Path (Circumvent Signaling)
If the L2 sequencer set is offline, censoring, or acting maliciously, the `GovernanceProposer` cannot be used. To ensure liveness, anyone can bypass the Sequencer signaling phase using the `proposeWithLock` function directly on the `Governance` contract.
*   An actor must lock 258.75 Million AZTEC**, roughly 2.5% of total supply
*   These funds are locked for an extended `lockDelay` of 90 Days.
*   Once proposed, the payload enters the exact same 17-day Voting Phase (Pending -> Active -> Queued -> Executable) as the standard path.

### Validator Governance & The GSE (Governance Staking Escrow)
The system relies on the `GSE.sol` contract to bridge L2 network security with L1 governance.
*   To become an L2 validator, an entity deposits **`ACTIVATION_THRESHOLD` AZTEC** into the GSE.
*   The GSE takes all validator deposits and stakes them directly into the L1 `Governance` contract, aggregating the voting power.
*   When a proposal is Active on L1, validators call `vote()` on the GSE, which calculates their specific share of the staked power and forwards the vote to the main Governance contract.
*   If a proposal upgrades the system to a new canonical rollup, validators do not need to manually unstake and restake. The GSE can automatically migrate the voting power and stake of all active validators to the new rollup version if they staked to a special `BONUS_INSTANCE_ADDRESS` instead of a specific immutable rollup.

### Slashing and the SlashVeto Council
Aztec features onchain slashing for equivocation or missing attestations, managed by `Slasher` and `TallySlashingProposer`. 

There is a protective **Vetoer** role held by the SlashVeto Council. The Council cannot upgrade the protocol, alter governance, or steal funds. Instead it is limited to two permissions:
*   call `vetoPayload()` to stop a specific slashing event.
*   call `setSlashingEnabled(false)`, which pauses all slashing in the protocol for a period of `SLASHING_DISABLE_DURATION`.

### Economics & Treasury
*   **Coin Issuer:** The `CoinIssuer` contract is owned by Governance and is authorized to mint new AZTEC tokens up to a cap of `NOMINAL_ANNUAL_PERCENTAGE_CAP`.
*   **Protocol Treasury:** Funds owned by the DAO sit in the `ProtocolTreasury`. The Treasury has a hardcoded `GATED_UNTIL` timestamp (approx. Dec 2026). Before this date, the DAO cannot spend Treasury funds. After this date, Treasury funds can only be moved with a Governance Proposal.`,
  discoveryInfo: getDiscoveryInfo([discovery]),
}
