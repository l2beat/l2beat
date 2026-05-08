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
  REASON_FOR_BEING_OTHER,
  RISK_VIEW,
  TECHNOLOGY_DATA_AVAILABILITY,
} from '../../common'
import { BADGES } from '../../common/badges'
import { PROGRAM_HASHES } from '../../common/programHashes'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import {
  generateDiscoveryDrivenContracts,
  generateDiscoveryDrivenPermissions,
} from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import { getSP1Verifiers } from '../../templates/opStack'

const discovery = new ProjectDiscovery('fluent')

// L1 PoS slot time, used to convert block-count windows into seconds.
const L1_BLOCK_TIME = 12

// Fluent's Rollup measures both windows in L1 blocks, not seconds.
const finalizationDelayBlocks = discovery.getContractValue<number>(
  'FluentRollup',
  'finalizationDelay',
)
const challengeWindowBlocks = discovery.getContractValue<number>(
  'FluentRollup',
  'challengeWindow',
)
const finalizationDelay = finalizationDelayBlocks * L1_BLOCK_TIME
const challengeWindow = challengeWindowBlocks * L1_BLOCK_TIME
const timelockDelay = discovery.getContractValue<number>(
  'FluentTimeLock',
  'getMinDelay',
)

const ROLLUP = EthereumAddress('0x1cF53Fd9CD0b713be29F2b41cA17A943f138727f')

export const fluent: ScalingProject = {
  type: 'layer2',
  id: ProjectId('fluent'),
  capability: 'universal',
  addedAt: UnixTime(1721218971), // 2024-07-17, original entry as upcoming
  badges: [BADGES.VM.EVM, BADGES.VM.WasmVM],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.NO_PROOFS],
  display: {
    name: 'Fluent',
    slug: 'fluent',
    description:
      'Fluent is an Ethereum L2 that blends Wasm and EVM smart contracts into a unified execution environment (with SVM planned). Batches are preconfirmed by an AWS Nitro Enclave and finalize after a delay; challenges are resolved by SP1 ZK proofs.',
    purposes: ['Universal'],
    links: {
      websites: ['https://fluent.xyz/'],
      documentation: ['https://docs.fluent.xyz/'],
      explorers: ['https://fluentscan.xyz/'],
      bridges: ['https://portal.fluent.xyz/user/bridge'],
      repositories: ['https://github.com/fluentlabs-xyz'],
      socialMedia: [
        'https://x.com/fluentxyz',
        'https://linkedin.com/company/fluentxyz',
        'https://discord.com/invite/fluentxyz',
      ],
    },
  },
  proofSystem: {
    type: 'Optimistic',
    name: 'SP1',
    zkCatalogId: ProjectId('sp1turbo'),
    challengeProtocol: 'Single-step',
  },
  stage: {
    stage: 'NotApplicable',
  },
  config: {
    associatedTokens: ['BLEND'],
    escrows: [
      // L1FluentBridge holds bridged ETH (gateways forward ETH here on deposit).
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0x9CAcf613fC29015893728563f423fD26dCdB8Ddc',
        ),
        tokens: ['ETH'],
      }),
      // ERC20Gateway custodies all ERC-20 deposits.
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0xFD4C62647A34FF6d6802092F5fbe176099223B61',
        ),
        tokens: '*',
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
          address: ROLLUP,
          selector: '0xec0f2437',
          functionSignature:
            'function commitBatch(bytes32 batchRoot, bytes32 fromBlockHash, bytes32 toBlockHash, uint24 numberOfBlocks, (bytes32 depositRoot, uint16 depositCount)[] blockDeposits, uint8 expectedBlobsCount)',
          sinceTimestamp: UnixTime(1776599267), // first onchain commitBatch, block 24913732
        },
      },
      {
        uses: [
          { type: 'liveness', subtype: 'batchSubmissions' },
          { type: 'l2costs', subtype: 'batchSubmissions' },
        ],
        query: {
          formula: 'functionCall',
          address: ROLLUP,
          selector: '0xf4405170',
          functionSignature:
            'function submitBlobs(uint256 batchIndex, uint256 numBlobs)',
          sinceTimestamp: UnixTime(1776599267),
        },
      },
      {
        uses: [
          { type: 'liveness', subtype: 'stateUpdates' },
          { type: 'l2costs', subtype: 'stateUpdates' },
        ],
        query: {
          formula: 'functionCall',
          address: ROLLUP,
          selector: '0x94abf0e7',
          functionSignature: 'function finalizeBatches(uint256 toBatchIndex)',
          sinceTimestamp: UnixTime(1776599267),
        },
      },
      {
        uses: [
          { type: 'liveness', subtype: 'proofSubmissions' },
          { type: 'l2costs', subtype: 'proofSubmissions' },
          { type: 'liveness', subtype: 'stateUpdates' },
          { type: 'l2costs', subtype: 'stateUpdates' },
        ],
        query: {
          formula: 'functionCall',
          address: ROLLUP,
          selector: '0x279a71f5',
          functionSignature:
            'function finalizeWithProofs(uint256 batchIndex, (bytes32 previousBlockHash, bytes32 blockHash, bytes32 withdrawalRoot, bytes32 depositRoot, uint16 depositCount)[] blockHeaders)',
          sinceTimestamp: UnixTime(1776599267),
        },
      },
    ],
  },
  dataAvailability: {
    layer: DA_LAYERS.ETH_BLOBS,
    bridge: DA_BRIDGES.ENSHRINED,
    mode: DA_MODES.TRANSACTION_DATA,
  },
  riskView: {
    stateValidation: {
      ...RISK_VIEW.STATE_NONE,
      value: 'TEE attestations',
      description:
        "Fluent ships an optimistic-with-SP1 design: batches are preconfirmed by an AWS Nitro Enclave (whose signing key is authorized onchain only after an SP1 proof verifies AWS's attestation document for that key and that the document's PCR0 — a fingerprint of the enclave image — matches the expected audited value), and SP1 ZK proofs are accepted as responses to disputes raised by holders of the CHALLENGER_ROLE. " +
        `In practice the role currently has no holders: challengeBatchRoot and challengeBlock are gated by onlyRole(CHALLENGER_ROLE), and the only path that flips a block to proven is resolveBlockChallenge (which itself requires an active challenge). With no challenger, no SP1 proof can be submitted onchain and finalizeWithProofs reverts, so every batch finalizes purely on the time-based path after ${formatSeconds(finalizationDelay)}. Effective security reduces to trust the TEE and wait the delay until the admin grants the role.`,
    },
    dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
    exitWindow: RISK_VIEW.EXIT_WINDOW(timelockDelay, 0),
    sequencerFailure: RISK_VIEW.SEQUENCER_NO_MECHANISM(false),
    proposerFailure: RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
  },
  stateValidation: {
    categories: [
      {
        title: 'Challenges',
        description: `Fluent runs an optimistic batch lifecycle backed by SP1 ZK proofs for dispute resolution. (1) the sequencer commits a batch root via \`commitBatch\`; (2) EIP-4844 blob hashes are pinned via \`submitBlobs\`; (3) an AWS Nitro Enclave preconfirms the batch with an ECDSA signature whose key was admitted onchain only after an SP1 proof verified AWS's attestation document for that key and that the document's PCR0 (a fingerprint of the enclave image) matches the expected (audited) value; (4) within ${formatSeconds(challengeWindow)} of acceptance, addresses with the \`CHALLENGER_ROLE\` can dispute via \`challengeBatchRoot\` or \`challengeBlock\` and the prover must resolve each challenge with an SP1 proof before the same window closes; (5) batches finalize either after a ${formatSeconds(finalizationDelay)} L1 delay (\`finalizeBatches\`, no proof needed in the happy path) or immediately once all challenged blocks are proven (\`finalizeWithProofs\`). The \`PROVER\`, \`EMERGENCY\`, and \`CHALLENGER\` roles on the Rollup are gated by access control; see the Permissions section for the current holders.`,
        references: [
          {
            title: 'Fluent Rollup Architecture',
            url: 'https://docs.fluent.xyz/system-architecture/rollup-architecture',
          },
          {
            title: 'Fluent Bridge Architecture',
            url: 'https://docs.fluent.xyz/system-architecture/bridge',
          },
        ],
        risks: [
          {
            category: 'Funds can be stolen if',
            text: 'an invalid batch is preconfirmed by a compromised AWS Nitro Enclave and no permissioned challenger disputes it before the challenge window closes.',
          },
        ],
      },
    ],
  },
  technology: {
    dataAvailability: {
      ...TECHNOLOGY_DATA_AVAILABILITY.ON_CHAIN_BLOB_OR_CALLDATA,
      description:
        TECHNOLOGY_DATA_AVAILABILITY.ON_CHAIN_BLOB_OR_CALLDATA.description +
        ' Fluent posts transaction data to Ethereum L1 as EIP-4844 blobs. Blob hashes are pinned on the Rollup contract via `submitBlobs` and SP1 proofs verify that block data matches both the pinned hashes and the EIP-4844 commitments.',
      references: [
        {
          title: 'Fluent Rollup Architecture - Blob Publication',
          url: 'https://docs.fluent.xyz/system-architecture/rollup-architecture',
        },
      ],
    },
    operator: {
      ...OPERATOR.CENTRALIZED_OPERATOR,
      description:
        OPERATOR.CENTRALIZED_OPERATOR.description +
        ' Sequencing and proof submission are also permissioned at launch: only allowlisted addresses can submit batches and SP1 proofs to the Rollup. See the Permissions section for current role holders.',
      references: [
        {
          title: 'Fluent Security Invariants',
          url: 'https://docs.fluent.xyz/system-architecture/security-invariants',
        },
      ],
    },
    forceTransactions: FORCE_TRANSACTIONS.SEQUENCER_NO_MECHANISM,
    exitMechanisms: [
      {
        ...EXITS.REGULAR_WITHDRAWAL('zk', finalizationDelay),
        description:
          EXITS.REGULAR_WITHDRAWAL('zk', finalizationDelay).description +
          " On Fluent, the message hash enters the block's withdrawal root which becomes part of the next batch root; once the batch is preconfirmed (TEE-signed) or finalized, an address with RELAYER_ROLE delivers the message on L1 via receiveMessageWithProof with two Merkle proofs (block-against-batch and message-against-block). First delivery is permissioned, so withdrawals progress only when the relayer acts; if a delivered message's L1-side execution reverts, anyone can retry via the permissionless receiveFailedMessage. For L1->L2 deposits there is no user-initiated refund path: only PAUSER_ROLE can clear expired deposits via skipExpiredDeposits, and rollbackMessageWithProof is declared but reverts with NOT_IMPLEMENTED.",
        references: [
          {
            title: 'Fluent Bridge Architecture',
            url: 'https://docs.fluent.xyz/system-architecture/bridge',
          },
        ],
        risks: [
          {
            category: 'Funds can be frozen if',
            text: 'the RELAYER_ROLE holder stops delivering L2->L1 messages on L1, since first delivery is permissioned and there is no user-initiated bypass.',
          },
          {
            category: 'Funds can be frozen if',
            text: 'an L1->L2 deposit expires before inclusion: only PAUSER_ROLE can clear it (which does not refund), and the user-initiated rollback path is unimplemented.',
          },
        ],
      },
      {
        name: 'Optimistic (preconfirmed) fast withdrawals',
        description:
          'After a batch is preconfirmed by the AWS Nitro Enclave, withdrawals can be released without waiting for finalization, subject to per-token hourly and daily caps enforced by the FastWithdrawalList registry. ETH and WETH share a bucket to prevent cap evasion.',
        references: [],
        risks: [
          {
            category: 'Funds can be stolen if',
            text: 'the AWS Nitro Enclave attestation key is compromised and the operator preconfirms an invalid batch within the rate-limited window.',
          },
        ],
      },
    ],
  },
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
    programHashes: getFluentVKeys().map((el) => PROGRAM_HASHES(el)),
    zkVerifiers: getSP1Verifiers(discovery),
  },
  permissions: generateDiscoveryDrivenPermissions([discovery]),
  chainConfig: {
    name: 'fluent',
    chainId: 25363,
    sinceTimestamp: UnixTime(1776599267), // first onchain commitBatch 2026-04-19
    gasTokens: ['ETH'],
    apis: [{ type: 'rpc', url: 'https://rpc.fluent.xyz', callsPerMinute: 120 }],
  },
  discoveryInfo: getDiscoveryInfo([discovery]),
  milestones: [
    {
      title: 'Fluent mainnet launch',
      url: 'https://x.com/fluentxyz/status/2047662772658622465',
      date: '2026-04-24T00:00:00Z',
      description:
        'Fluent activates its Ethereum L2 mainnet alongside the BLEND token launch.',
      type: 'general',
    },
  ],
}

function getFluentVKeys(): string[] {
  const vKeys = new Set<string>()
  const zeroVKey =
    '0x0000000000000000000000000000000000000000000000000000000000000000'

  vKeys.add(discovery.getContractValue<string>('FluentRollup', 'programVKey'))

  const nitroVerifiers = discovery.getContractValue<string[]>(
    'FluentRollup',
    'nitroVerifiers',
  )
  for (const nitroVerifier of nitroVerifiers) {
    const nitroProgramVKey = discovery.getContractValue<string>(
      nitroVerifier,
      'getProgramVKey',
    )
    if (nitroProgramVKey !== zeroVKey) {
      vKeys.add(nitroProgramVKey)
    }
  }

  return Array.from(vKeys)
}
