import {
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
  REASON_FOR_BEING_OTHER,
  RISK_VIEW,
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
  },
  stage: {
    stage: 'NotApplicable',
  },
  config: {
    associatedTokens: ['BLEND'],
    escrows: [
      {
        // L1FluentBridge holds bridged ETH (gateways forward ETH here on deposit).
        chain: 'ethereum',
        address: EthereumAddress('0x9CAcf613fC29015893728563f423fD26dCdB8Ddc'),
        sinceTimestamp: UnixTime(1775739227), // L1FluentBridge proxy deploy 2026-04-09
        tokens: ['ETH'],
      },
      {
        // ERC20Gateway custodies all ERC-20 deposits.
        chain: 'ethereum',
        address: EthereumAddress('0xFD4C62647A34FF6d6802092F5fbe176099223B61'),
        sinceTimestamp: UnixTime(1775739563), // ERC20Gateway proxy deploy 2026-04-09
        tokens: '*',
      },
    ],
    trackedTxs: [
      {
        uses: [
          { type: 'liveness', subtype: 'batchSubmissions' },
          { type: 'l2costs', subtype: 'batchSubmissions' },
        ],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0x1cF53Fd9CD0b713be29F2b41cA17A943f138727f',
          ),
          selector: '0xec0f2437',
          functionSignature:
            'function commitBatch(bytes32 batchRoot, bytes32 fromBlockHash, bytes32 toBlockHash, uint24 numberOfBlocks, (bytes32 depositRoot, uint16 depositCount)[] blockDeposits, uint8 expectedBlobsCount)',
          sinceTimestamp: UnixTime(1777161600), // mainnet activation 2026-04-24
        },
      },
      {
        uses: [
          { type: 'liveness', subtype: 'batchSubmissions' },
          { type: 'l2costs', subtype: 'batchSubmissions' },
        ],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0x1cF53Fd9CD0b713be29F2b41cA17A943f138727f',
          ),
          selector: '0xf4405170',
          functionSignature:
            'function submitBlobs(uint256 batchIndex, uint256 numBlobs)',
          sinceTimestamp: UnixTime(1777161600),
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
            '0x1cF53Fd9CD0b713be29F2b41cA17A943f138727f',
          ),
          selector: '0x94abf0e7',
          functionSignature:
            'function finalizeBatches(uint256 toBatchIndex)',
          sinceTimestamp: UnixTime(1777161600),
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
          address: EthereumAddress(
            '0x1cF53Fd9CD0b713be29F2b41cA17A943f138727f',
          ),
          selector: '0x279a71f5',
          functionSignature:
            'function finalizeWithProofs(uint256 batchIndex, (bytes32 previousBlockHash, bytes32 blockHash, bytes32 withdrawalRoot, bytes32 depositRoot, uint16 depositCount)[] blockHeaders)',
          sinceTimestamp: UnixTime(1777161600),
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
        'Currently a single whitelisted address holds the PROVER role.',
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
        description: `Fluent batches go through five stages: (1) the sequencer commits a batch root via \`commitBatch\`; (2) EIP-4844 blob hashes are pinned via \`submitBlobs\`; (3) an AWS Nitro Enclave preconfirms the batch via an ECDSA signature whose key is bound to PCR0 measurements verified by SP1; (4) participants can dispute via \`challengeBatchRoot\` or \`challengeBlock\` and resolution requires SP1 proofs of the state transition function, blob membership and EIP-4844 commitments; (5) batches finalize either after a ${formatSeconds(finalizationDelay)} delay (\`finalizeBatches\`) or immediately after all blocks are proven (\`finalizeWithProofs\`). At launch a single whitelisted address holds the \`PROVER\` and \`EMERGENCY\` roles on the Rollup.`,
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
            text: 'a malicious sequencer manages to bypass the proof system, since the EMERGENCY role can revert finalized batches.',
          },
          {
            category: 'Withdrawals can be delayed if',
            text: 'the sole address with the PROVER role stops submitting proofs, in which case batches still finalize through the time-based path.',
          },
        ],
      },
    ],
  },
  technology: {
    dataAvailability: {
      name: 'Data is posted to Ethereum as blobs',
      description:
        'Fluent posts transaction data to Ethereum L1 as EIP-4844 blobs. Blob hashes are pinned on the Rollup contract via `submitBlobs` and SP1 proofs verify that block data matches both the pinned hashes and the EIP-4844 commitments.',
      references: [
        {
          title: 'Fluent Rollup Architecture - Blob Publication',
          url: 'https://docs.fluent.xyz/system-architecture/rollup-architecture',
        },
      ],
      risks: [],
    },
    operator: {
      name: 'The system is operated by a centralized sequencer',
      description:
        'Fluent currently runs a single sequencer that posts batches to L1, and a single whitelisted prover. There is no documented mechanism for permissionless self-sequencing or self-proposing. The same EOA holds the SEQUENCER, PROVER and EMERGENCY roles on the Rollup contract and DEFAULT_ADMIN_ROLE on L1FluentBridge — the contract that custodies bridged ETH and gates its own UUPS upgrades on that role. The ERC20Gateway and NativeGateway proxies are Ownable and are owned by a 4/5 Safe, so ERC-20 escrow is gated by the multisig rather than the EOA. The DEFAULT_ADMIN_ROLE on the Rollup contract itself is held by the same 4/5 Safe.',
      references: [
        {
          title: 'Fluent Security Invariants',
          url: 'https://docs.fluent.xyz/system-architecture/security-invariants',
        },
      ],
      risks: [
        {
          category: 'Funds can be frozen if',
          text: 'the sequencer fails to post batches and no other operator is granted the SEQUENCER role.',
        },
      ],
    },
    forceTransactions: {
      name: 'No mechanism to force transactions',
      description:
        'Fluent does not provide a documented forced-inclusion mechanism on L1. Users cannot force their transactions through the L1 contracts if the sequencer censors them.',
      references: [],
      risks: [
        {
          category: 'Users can be censored if',
          text: 'the sequencer refuses to include their transactions.',
        },
      ],
    },
    exitMechanisms: [
      {
        name: 'Regular withdrawals',
        description: `Users initiate withdrawals on L2 by calling a gateway. The message hash enters the block's withdrawal root which becomes part of the next batch root. After the batch is preconfirmed (TEE-signed) or finalized, anyone can call \`receiveMessageWithProof\` on L1 with two Merkle proofs (block-against-batch and message-against-block).`,
        references: [
          {
            title: 'Fluent Bridge Architecture',
            url: 'https://docs.fluent.xyz/system-architecture/bridge',
          },
        ],
        risks: [],
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
    sinceTimestamp: UnixTime(1777161600), // 2026-04-24, mainnet activation
    gasTokens: ['ETH'],
    apis: [{ type: 'rpc', url: 'https://rpc.fluent.xyz', callsPerMinute: 120 }],
  },
  discoveryInfo: getDiscoveryInfo([discovery]),
  milestones: [
    {
      title: 'Fluent mainnet launch',
      url: 'https://www.fluent.xyz/',
      date: '2026-04-24T00:00:00Z',
      description:
        'Fluent activates its Ethereum L2 mainnet alongside the BLEND token launch.',
      type: 'general',
    },
  ],
}
