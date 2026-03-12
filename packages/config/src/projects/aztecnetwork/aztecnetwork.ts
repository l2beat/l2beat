import {
  ChainSpecificAddress,
  EthereumAddress,
  formatLargeNumber,
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

const discovery = new ProjectDiscovery('aztecnetwork-alphapayload')

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
const slotDuration = discovery.getContractValue<number>('Rollup', 'getSlotDuration')
const epochDuration =
  discovery.getContractValue<number>('Rollup', 'getEpochDuration') * slotDuration
const proofWindow =
  epochDuration *
  (discovery.getContractValue<number>('Rollup', 'getProofSubmissionEpochs') + 1)
const escapeHatchFrequency =
  discovery.getContractValue<number>('EscapeHatch', 'getFrequency') * epochDuration

const currentExecutionDelay = governanceConfiguration.executionDelay
// AlphaPayload.getActions() updates Governance.executionDelay to 30 days.
const postAlphaExecutionDelay = 30 * 24 * 60 * 60
const exitWindow = postAlphaExecutionDelay - proofWindow

const rollupSinceTimestamp = UnixTime(
  discovery.getContract('Rollup').sinceTimestamp ?? 1772654159,
)

function formatAztecAmount(amount: bigint): string {
  return `${formatLargeNumber(Number(amount / 10n ** 18n))} AZTEC`
}

const activationThresholdString = formatAztecAmount(activationThreshold)
const escapeHatchBondString = formatAztecAmount(escapeHatchBond)
const governanceLockString = formatAztecAmount(
  BigInt(governanceConfiguration.proposeConfig.lockAmount),
)
const currentExecutionDelayString = formatSeconds(currentExecutionDelay)
const postAlphaExecutionDelayString = formatSeconds(postAlphaExecutionDelay)
const proofWindowString = formatSeconds(proofWindow)
const escapeHatchFrequencyString = formatSeconds(escapeHatchFrequency)
const safeThreshold = discovery.getMultisigStats('Safe')

const rollupAddress = EthereumAddress('0xAe2001f7e21d5EcABf6234E9FDd1E76F50F74962')
const verifierAddress = EthereumAddress(
  '0x70aEDda427f26480D240bc0f4308ceDec8d31348',
)
const inboxAddress = EthereumAddress('0x8Dbf0b6ed495baAb6062f5D5365aF3C1B2ed4578')
const outboxAddress = EthereumAddress('0xc9698B7AdEf9ee63F3Bf5cFF38086e4E836579f0')
const governanceAddress = EthereumAddress(
  '0x1102471Eb3378FEE427121c9EfcEa452E4B6B75e',
)
const registryAddress = EthereumAddress(
  '0x35b22e09Ee0390539439E24f06Da43D83f90e298',
)

export const aztecnetwork: ScalingProject = {
  type: 'layer2',
  id: ProjectId('aztecnetwork'),
  capability: 'universal',
  addedAt: UnixTime(1773273600), // 2026-03-12T00:00:00Z
  badges: [
    BADGES.VM.AztecVM,
    BADGES.DA.EthereumBlobs,
    BADGES.Other.Governance,
  ],
  display: {
    name: 'Aztec Network',
    shortName: 'Aztec',
    slug: 'aztec-network',
    description:
      'Aztec Network is a privacy-preserving ZK rollup that uses the AztecVM and Noir to support private and public smart contracts on Ethereum.',
    purposes: ['Universal', 'Privacy'],
    links: {
      websites: ['https://aztec.network/', 'https://aztec.network/noir'],
      documentation: ['https://docs.aztec.network/'],
      explorers: ['https://aztecscan.xyz', 'https://aztecexplorer.xyz'],
      repositories: ['https://github.com/AztecProtocol/aztec-packages'],
      socialMedia: [
        'https://twitter.com/aztecnetwork',
        'https://medium.com/aztec-protocol',
        'https://t.me/aztecprotocol',
        'https://youtube.com/@aztecnetwork',
        'https://discord.com/invite/aztec',
      ],
    },
    liveness: {
      warnings: {
        batchSubmissions:
          'Checkpoints that are posted to Ethereum but not yet proven can be pruned once the proof submission window expires.',
      },
      explanation:
        'Aztec posts checkpoint data to Ethereum blobs and finalizes checkpoints once an epoch root proof is verified on Ethereum. Transactions should be considered final only after the corresponding epoch proof is accepted on L1.',
    },
  },
  proofSystem: {
    type: 'Validity',
    name: 'Honk',
  },
  scopeOfAssessment: {
    inScope: [SOA.l1Contracts, SOA.gasToken],
    notInScope: [
      SOA.l2Contracts,
      SOA.nonGasTokens,
      SOA.derivationSpec,
      SOA.sourceCodeToProgramHash,
      SOA.sourceCodeToVerificationKeys,
      SOA.trustedSetup,
    ],
  },
  config: {
    associatedTokens: ['AZTEC'],
    escrows: [
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0x2891F8b941067F8B5a3F34545A30Cf71E3E23617',
        ),
        tokens: ['AZTEC'],
        includeInTotal: false,
        description:
          'One-way fee bridge for the AZTEC gas token. Deposits are minted on L2 via the Inbox, while L1 withdrawals from this escrow are reserved for paying sequencers and provers.',
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
          sinceTimestamp: rollupSinceTimestamp,
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
          sinceTimestamp: rollupSinceTimestamp,
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
      ...RISK_VIEW.STATE_ZKP_SN, // HONK and stuff
      executionDelay: 0,
    },
    dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
    exitWindow: {
      value: formatSeconds(exitWindow),
      sentiment: 'warning',
      orderHint: exitWindow,
      description: `The Alpha payload raises the governance execution delay from ${currentExecutionDelayString} to ${postAlphaExecutionDelayString}. This leaves a nominal ${formatSeconds(
        exitWindow,
      )} between a regular upgrade and the roughly ${proofWindowString} needed to prove a checkpoint. In practice, users still need a validator or escape hatch proposer to include the withdrawal transaction because Aztec does not expose an L1 forced-inclusion queue for arbitrary L2 transactions.`,
    },
    sequencerFailure: {
      value: 'Become validator',
      sentiment: 'warning',
      description: `Aztec does not offer a direct L1 forced-inclusion queue for arbitrary L2 transactions. Instead, users must stake ${activationThresholdString} to join the validator queue and wait to obtain committee-based block production rights. If the committee stalls entirely, anyone can bond ${escapeHatchBondString} to join the escape hatch candidate set, which opens every ${escapeHatchFrequencyString}.`,
    },
    proposerFailure: {
      value: 'Permissionless',
      sentiment: 'good',
      description:
        'Anyone can submit epoch root proofs for pending checkpoints. Checkpoint proposals themselves come from the open validator set, with the escape hatch providing a bonded fallback if the committee is unavailable.',
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
        principle: false,
        usersHave7DaysToExit: false,
        usersCanExitWithoutCooperation: false,
        securityCouncilProperlySetUp: null,
        noRedTrustedSetups: null,
        programHashesReproducible: null,
        proverSourcePublished: null,
        verifierContractsReproducible: null,
      },
      stage2: {
        proofSystemOverriddenOnlyInCaseOfABug: false,
        fraudProofSystemIsPermissionless: null,
        delayWith30DExitWindow: false,
      },
    },
    {
      rollupNodeLink: 'https://github.com/AztecProtocol/aztec-packages',
      stage1PrincipleDescription: `This assessment assumes the Alpha payload has executed, increasing the governance execution delay to ${postAlphaExecutionDelayString}. Although validator entry and the escape hatch are permissionless, Aztec does not expose an L1 forced-inclusion path for arbitrary L2 transactions. A censored user must first obtain block production rights through validator entry or the periodic escape hatch, so withdrawals are not treated as censorship resistant for Stage 1.`,
      additionalConsiderations: {
        short:
          'Aztec is a privacy-focused universal rollup using Ethereum blobs and a permissionless validator set, but without direct L1 forced inclusion for arbitrary transactions.',
        long: 'Aztec is a privacy-focused universal rollup using Ethereum blobs and a permissionless validator set, but without direct L1 forced inclusion for arbitrary transactions.',
      },
    },
  ),
  technology: {
    dataAvailability: {
      name: 'All transaction data is published on Ethereum blobs',
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
      description: `For each epoch, the rollup samples a ${targetCommitteeSize}-member committee from the active validator set and selects one proposer per slot. If the committee becomes unavailable, the escape hatch designates a bonded proposer who can publish checkpoints without committee attestations.`,
      references: [
        {
          title: 'Rollup.sol - getProposerAt() on Etherscan',
          url: `https://etherscan.io/address/${rollupAddress.toString()}#code`,
        },
        {
          title: 'EscapeHatch.sol - selectCandidates() on Etherscan',
          url: 'https://etherscan.io/address/0x8c189ead28D5987A48e522162f9225124D50AD1B#code',
        },
      ],
      risks: [
        {
          category: 'MEV can be extracted if',
          text: 'the slot proposer abuses its temporary ordering privilege.',
        },
      ],
    },
    forceTransactions: {
      name: 'Users can become validators',
      description: `Aztec does not expose an L1 forced-transaction queue for arbitrary L2 transactions. Instead, users can permissionlessly join the validator set by staking ${activationThresholdString}. If the active committee stalls entirely, anyone can join the escape hatch candidate set by bonding ${escapeHatchBondString}.`,
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
          url: 'https://etherscan.io/address/0x8c189ead28D5987A48e522162f9225124D50AD1B#code',
        },
      ],
      risks: [
        {
          category: 'Users can be censored if',
          text: 'they cannot join the validator or escape hatch sets themselves and the active validators collude to ignore their transactions.',
        },
      ],
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
        risks: [
          {
            category: 'Funds can be stolen if',
            text: 'Governance approves a malicious new canonical rollup implementation.',
          },
        ],
      },
    ],
  },
  stateValidation: {
    description:
      'Each epoch root proof is verified on Ethereum before the proven checkpoint number is advanced and the epoch outbox root is inserted into the Outbox.',
    categories: [
      {
        title: 'Proof verification',
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
    risks: [CONTRACTS.UPGRADE_WITH_DELAY_RISK(postAlphaExecutionDelayString)],
  },
  permissions: generateDiscoveryDrivenPermissions([discovery]),
  upgradesAndGovernance: `Aztec uses immutable contracts for the active rollup version, but Governance can promote a newly deployed rollup to canonical by calling Registry.addRollup() and GSE.addRollup() through a successful governance proposal. At the discovery snapshot, Governance uses a ${currentExecutionDelayString} execution delay together with a ${formatSeconds(
    governanceConfiguration.votingDelay,
  )} voting delay and a ${formatSeconds(
    governanceConfiguration.votingDuration,
  )} voting period. The pending Alpha payload at \`0x780523FBa95e4Be0Fa09DA0fff5Fab3aBAE7B58e\` is itself a governance payload: it registers the new rollup, enables rewards, activates the escape hatch, migrates flush rewards, and updates the governance execution delay to ${postAlphaExecutionDelayString}. Formal proposals can also be submitted with a ${governanceLockString} lock for ${formatSeconds(
    governanceConfiguration.proposeConfig.lockDelay,
  )}.

There is no Security Council with instant upgrade power. The ${safeThreshold} Safe only acts as the slashing vetoer and does not control rollup upgrades.`,
  discoveryInfo: getDiscoveryInfo([discovery]),
}
