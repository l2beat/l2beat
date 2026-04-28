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
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import {
  generateDiscoveryDrivenContracts,
  generateDiscoveryDrivenPermissions,
} from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'

const discovery = new ProjectDiscovery('fluent')

const finalizationDelay = discovery.getContractValue<number>(
  'FluentRollup',
  'finalizationDelay',
)
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
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.CLOSED_PROOFS],
  display: {
    name: 'Fluent',
    slug: 'fluent',
    description:
      'Fluent is an Ethereum L2 that blends Wasm, EVM and SVM-based smart contracts into a unified execution environment. It uses an optimistic-ZK hybrid: AWS Nitro Enclave preconfirmations and SP1 ZK proofs for finalization.',
    purposes: ['Universal'],
    links: {
      websites: ['https://fluent.xyz/'],
      documentation: ['https://docs.fluent.xyz/'],
      explorers: ['https://fluentscan.xyz/'],
      bridges: ['https://portal.fluent.xyz/'],
      repositories: ['https://github.com/fluentlabs-xyz'],
      socialMedia: [
        'https://x.com/fluentxyz',
        'https://linkedin.com/company/fluentxyz',
        'https://discord.com/invite/fluentxyz',
      ],
    },
  },
  proofSystem: {
    type: 'Validity',
    name: 'SP1',
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
          sinceTimestamp: UnixTime(1776988800), // mainnet activation 2026-04-24
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
          sinceTimestamp: UnixTime(1776988800),
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
          sinceTimestamp: UnixTime(1776988800),
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
          sinceTimestamp: UnixTime(1776988800),
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
      ...RISK_VIEW.STATE_ZKP_SN,
      description:
        RISK_VIEW.STATE_ZKP_SN.description +
        ' Fluent uses SP1 (Succinct) STARK proofs wrapped to PLONK for onchain verification. ' +
        'Before proofs are posted, batches can be preconfirmed by an AWS Nitro Enclave whose attestation is verified against expected PCR0 measurements via SP1. ' +
        `Withdrawals on the proof-accelerated path require a finalization delay of ${formatSeconds(finalizationDelay)}; alternatively, batches finalize after the same delay even without a proof. ` +
        'Proof submission is permissioned; see the Permissions section for current role holders.',
      sentiment: 'warning',
    },
    dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
    exitWindow: RISK_VIEW.EXIT_WINDOW(timelockDelay, 0),
    sequencerFailure: RISK_VIEW.SEQUENCER_NO_MECHANISM(false),
    proposerFailure: RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
  },
  stateValidation: {
    categories: [
      {
        title: 'Validity proofs',
        description: `Fluent batches go through five stages: (1) the sequencer commits a batch root via \`commitBatch\`; (2) EIP-4844 blob hashes are pinned via \`submitBlobs\`; (3) an AWS Nitro Enclave preconfirms the batch via an ECDSA signature whose key is bound to PCR0 measurements verified by SP1; (4) participants can dispute via \`challengeBatchRoot\` or \`challengeBlock\` and resolution requires SP1 proofs of the state transition function, blob membership and EIP-4844 commitments; (5) batches finalize either after a ${formatSeconds(finalizationDelay)} delay (\`finalizeBatches\`) or immediately after all blocks are proven (\`finalizeWithProofs\`). The \`PROVER\`, \`EMERGENCY\`, and \`CHALLENGER\` roles on the Rollup are gated by access control; see the Permissions section for the current holders.`,
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
            text: 'an actor with the EMERGENCY role reverts finalized batches before users withdraw.',
          },
          {
            category: 'Withdrawals can be delayed if',
            text: 'no address with the PROVER role submits proofs; in that case batches still finalize through the time-based path.',
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
          " On Fluent, the message hash enters the block's withdrawal root which becomes part of the next batch root; once the batch is preconfirmed (TEE-signed) or finalized, anyone can call `receiveMessageWithProof` on L1 with two Merkle proofs (block-against-batch and message-against-block).",
        references: [
          {
            title: 'Fluent Bridge Architecture',
            url: 'https://docs.fluent.xyz/system-architecture/bridge',
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
  },
  permissions: generateDiscoveryDrivenPermissions([discovery]),
  chainConfig: {
    name: 'fluent',
    chainId: 25363,
    sinceTimestamp: UnixTime(1776988800), // 2026-04-24, mainnet activation
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
