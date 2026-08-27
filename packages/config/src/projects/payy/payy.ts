import {
  ChainSpecificAddress,
  EthereumAddress,
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
} from '../../common'
import { BADGES } from '../../common/badges'
import { PRIVACY_ATTRIBUTES } from '../../common/privacyAttributes'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'

const discovery = new ProjectDiscovery('payy')

const upgradesAndGovernanceContent = `All privileged functions are ultimately controlled by the PayyMultisig (${discovery.getMultisigStats('PayyMultisig')}). It owns the ProxyAdmin, which can instantly upgrade the Rollup proxy, and it is the owner of the Rollup contract, allowing it to manage provers, validators, ZK verifiers, supported tokens and burn substitutors, and to directly overwrite the state root via setRoot(). There is no timelock or exit window on any of these actions.`

export const payy: ScalingProject = {
  type: 'layer2',
  id: ProjectId('payy'),
  capability: 'appchain',
  addedAt: UnixTime(1787616000), // 2026-08-25T00:00:00Z
  badges: [BADGES.VM.AppChain, BADGES.DA.Celestia, BADGES.Other.Privacy],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.NO_DA_ORACLE],
  display: {
    name: 'Payy',
    slug: 'payy',
    description:
      'Payy is a payments-focused ZK network for private stablecoin transfers, settled on Ethereum with aggregated validity proofs and validator signatures, while transaction data is kept offchain.',
    purposes: ['Payments', 'Privacy'],
    links: {
      websites: ['https://payy.network'],
      explorers: ['https://payy.network/explorer'],
      documentation: ['https://docs.payy.network'],
      repositories: ['https://github.com/polybase/payy'],
      socialMedia: ['https://x.com/payy_link'],
    },
    liveness: {
      explanation:
        'Payy is a ZK network that periodically settles its state on Ethereum. Each verifyRollup() call both submits the aggregated validity proof and updates the state root, so state updates and proof submissions are tracked as the same transactions.',
    },
  },
  proofSystem: {
    type: 'Validity',
    zkCatalogIds: [ProjectId('barretenberg')],
  },
  dataAvailability: {
    layer: DA_LAYERS.NONE,
    bridge: DA_BRIDGES.NONE,
    mode: DA_MODES.TRANSACTION_DATA,
  },
  chainConfig: {
    name: 'payy',
    chainId: undefined,
    apis: [
      {
        type: 'payy',
        url: 'https://validators.mainnet.payy.network',
        callsPerMinute: 300,
      },
    ],
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0x367C1eAF14AA06b78ce76bd0243297de79d85270',
        ),
        // only USDC is whitelisted so far, but the owner can whitelist more
        // tokens via addToken() which emits no event and the tokens mapping
        // is not enumerable onchain, so all tokens are tracked
        tokens: '*',
      }),
    ],
    trackedTxs: [
      {
        uses: [
          {
            type: 'liveness',
            subtype: 'stateUpdates',
          },
          {
            type: 'l2costs',
            subtype: 'stateUpdates',
          },
        ],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0x367C1eAF14AA06b78ce76bd0243297de79d85270',
          ),
          selector: '0xb8cdbd27',
          functionSignature:
            'function verifyRollup(uint256 height, bytes32 verificationKeyHash, bytes aggrProof, bytes32[] publicInputs, bytes32 otherHashFromBlockHash, tuple(bytes32 r, bytes32 s, uint256 v)[] signatures)',
          sinceTimestamp: 1771324355, // rollup proxy deployment, 2026-02-17T10:32:35Z
        },
      },
    ],
    liveness: {
      // verifyRollup() both submits the proof and updates the state root
      duplicateData: {
        from: 'stateUpdates',
        to: 'proofSubmissions',
      },
    },
    // TODO: activityConfig - daily tx counts are available from the Payy node
    // RPC (https://validators.mainnet.payy.network/v0/stats and /v0/blocks),
    // but a Payy day provider needs to be implemented in the backend first
    // (analogous to LighterDayProvider), otherwise the activity module crashes
  },
  riskView: {
    stateValidation: {
      ...RISK_VIEW.STATE_ZKP_SN,
      executionDelay: 0, // state root immediately finalized when proven
    },
    dataAvailability: RISK_VIEW.DATA_EXTERNAL,
    exitWindow: RISK_VIEW.EXIT_WINDOW(0, 0),
    sequencerFailure: RISK_VIEW.SEQUENCER_NO_MECHANISM(),
    proposerFailure: RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
  },
  stage: { stage: 'NotApplicable' },
  technology: {
    dataAvailability: {
      name: 'Data is not stored on chain',
      description:
        'Transaction data and the private note tree are kept offchain by the Payy network. Only state roots and public deposit (mint) and withdrawal (burn) messages are posted to Ethereum with each state update. Although each update includes a data commitment hash, the onchain function intended to assert its availability on Celestia (`verifyCommitHash()`) is an empty placeholder, so Ethereum does not verify data availability.',
      risks: [
        {
          category: 'Funds can be lost if',
          text: 'the external data becomes unavailable.',
          isCritical: true,
        },
      ],
      references: [
        {
          title: 'RollupV1.sol - empty verifyCommitHash() placeholder',
          url: 'https://etherscan.io/address/0x7d8837b547F4FEa0053571CB149e845FC58e9B2D#code',
        },
      ],
    },
    operator: {
      ...OPERATOR.CENTRALIZED_OPERATOR,
      description:
        OPERATOR.CENTRALIZED_OPERATOR.description +
        ' Payy blocks are produced by validators running the Solid BFT consensus protocol, and state updates are settled on Ethereum by a whitelisted prover. Onchain, the current validator set consists of a single address, and a single prover address has been whitelisted since initialization.',
      references: [
        {
          title: 'Payy docs - Rollup',
          url: 'https://docs.payy.network/payy-network/04_rollup',
        },
      ],
    },
    forceTransactions: {
      ...FORCE_TRANSACTIONS.SEQUENCER_NO_MECHANISM,
      description:
        FORCE_TRANSACTIONS.SEQUENCER_NO_MECHANISM.description +
        ' Deposits (mints) can be made permissionlessly on Ethereum, but they only become spendable once the Payy network includes them in a proven state update.',
    },
    exitMechanisms: [
      {
        ...EXITS.REGULAR_WITHDRAWAL('zk'),
        description:
          'Users can withdraw by burning notes on the Payy network. The burn is included as a public message in the next proven state update, upon which the Rollup contract transfers the escrowed tokens to the specified Ethereum address. Whitelisted burn substitutors can front withdrawals from their own funds before settlement and are refunded when the original burn is processed. There is no mechanism for users to exit independently of the operators.',
        risks: [
          {
            category: 'Funds can be frozen if',
            text: 'the operators fail to include withdrawals in state updates, as there is no forced exit mechanism.',
          },
        ],
      },
    ],
    otherConsiderations: [
      {
        name: 'Private transfers with public entries and exits',
        description:
          'Funds on Payy are represented as UTXO-like notes: the chain state only contains note commitments and nullifiers, and transfers are proven in zero knowledge, hiding sender, recipient and amount. Deposits to and withdrawals from the Ethereum escrow are public, so activity can potentially be correlated at the boundaries.',
        risks: [],
        references: [
          {
            title: 'Payy docs',
            url: 'https://docs.payy.network',
          },
        ],
      },
      {
        name: 'Owner can overwrite the state root',
        description:
          'The Rollup contract owner can directly overwrite the current state root via `setRoot()` without providing a validity proof or validator signatures, and can replace the ZK verifier contracts referenced by state updates.',
        risks: [
          {
            category: 'Funds can be stolen if',
            text: 'the owner overwrites the state root or registers a malicious verifier.',
          },
        ],
        references: [],
      },
    ],
  },
  stateValidation: {
    description:
      'Each state update submitted via `verifyRollup()` must include a ZK proof that is verified by the registered verifier contract, and signatures from more than 2/3 of the current validator set. The proof attests to the correct state transition of the private note tree, and public deposit (mint) and withdrawal (burn) messages are checked against the public inputs.',
    categories: [
      {
        title: 'ZK Circuits',
        description:
          'Payy transactions are proven with [Noir](https://noir-lang.org/) circuits: individual UTXO transaction proofs are recursively aggregated (`utxo` → `agg_utxo` → `agg_agg` → `agg_final`) into a single proof per state update. The circuits are published in the [payy repository](https://github.com/polybase/payy/tree/main/noir). The final proof is verified onchain by a Barretenberg-generated UltraHonk verifier.',
        references: [
          {
            title: 'HonkVerifier - Etherscan',
            url: 'https://etherscan.io/address/0x14DACD534ddc676601B27f41Eb541a7951524a2F#code',
          },
        ],
      },
      {
        title: 'Verification Keys Generation',
        description:
          'The Rollup contract maps verification key hashes to verifier contracts. Each state update references one of the registered keys. The owner can add, replace and remove verifiers at any time without delay.',
        references: [
          {
            title: 'RollupV1.sol - addZkVerifier()',
            url: 'https://etherscan.io/address/0x7d8837b547F4FEa0053571CB149e845FC58e9B2D#code',
          },
        ],
      },
      {
        title: 'State root proposals',
        description:
          'In addition to the validity proof, each state update requires signatures from more than 2/3 of the current validator set, which reflects finalization by the Solid BFT consensus of the Payy network. The current validator set registered onchain consists of a single address, making the effective threshold 1-of-1.',
        references: [],
      },
    ],
  },
  upgradesAndGovernance: {
    content: upgradesAndGovernanceContent,
  },
  privacyInfo: {
    // TODO: privacy flow tracking is not configured yet. Deposits could be
    // tracked via the Rollup's `MintAdded(bytes32 indexed mint_hash, uint256
    // value, bytes32 note_kind)` event, but the `Burned(address indexed token,
    // bytes32 indexed burn_hash, address indexed recipient, bool substitute,
    // bool success)` event carries no amount, so withdrawals cannot be
    // extracted from logs alone. Tracking requires new payy extractors in the
    // backend (extractPrivacyFlow) plus the extractor union in types.ts, and a
    // solution for withdrawal amounts. Until then Payy is shown as untracked.
    tokens: [],
    exitWindow: {
      value: 'None',
      sentiment: 'bad',
      orderHint: 0,
      description:
        'The PayyMultisig can instantly upgrade the Rollup contract, replace ZK verifiers and directly overwrite the state root, so users have no time to exit before a malicious change takes effect.',
      walkawayTest: {
        passed: false,
        reason:
          'Withdrawals must be included in a proven state update by the permissioned Payy operators. There is no mechanism for users to exit on Ethereum if the operators halt.',
      },
    },
    reproducibility: {
      // TODO: verify that the published repository (contracts, circuits, node)
      // is complete and can actually be built and run locally
      value: 'Reproducible',
      sentiment: 'good',
      description:
        'The contracts, Noir circuits and node software are published in the payy repository and can be built and run locally.',
    },
    privacy: {
      // TODO: verify whether Payy has any compliance mechanism, privileged
      // view keys or selective disclosure feature, and adjust the value and
      // description accordingly
      value: 'Private transfers',
      sentiment: 'good',
      description:
        'Transfers within the Payy network are proven in zero knowledge, hiding sender, recipient and amount. Deposits (mints) and withdrawals (burns) are public on Ethereum, so activity can potentially be correlated at the boundaries.',
    },
    // TODO: noteDiscovery - describe how the Payy wallet discovers the user's
    // notes and what the validators / RPC provider learn about the user from
    // the queries
    attributes: [
      PRIVACY_ATTRIBUTES.zk,
      PRIVACY_ATTRIBUTES.transfers,
      PRIVACY_ATTRIBUTES.anyAmount,
    ],
    // TODO: riskSummary - add a riskSummary.md for the privacy project page
    // (see e.g. privacy-pools or umbra for reference)
    upgradesAndGovernance: {
      content: upgradesAndGovernanceContent,
    },
  },
  contracts: {
    addresses: {
      ...discovery.getDiscoveredContracts(),
    },
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
    zkVerifiers: getVerifiers(),
  },
  permissions: {
    ...discovery.getDiscoveredPermissions(),
  },
  milestones: [
    {
      title: 'Payy Network is live on Ethereum',
      url: 'https://payy.network/blog/payy-network-is-live-on-ethereum',
      date: '2026-02-19T00:00:00Z',
      description:
        'Payy launches its rollup on Ethereum, migrating from its previous deployment on Polygon.',
      type: 'general',
    },
    {
      title: 'Critical circuit vulnerability disclosed',
      url: 'https://github.com/polybase/payy/security/advisories/GHSA-fhxc-63vg-9gwr',
      date: '2026-06-10T00:00:00Z',
      description:
        'An aggregation circuit bug allowed forged burn messages, was patched by the team.',
      type: 'incident',
    },
  ],
  discoveryInfo: getDiscoveryInfo([discovery]),
}

function getVerifiers(): ChainSpecificAddress[] {
  const zkVerifiers = discovery.getContractValue<
    { verificationKey: string; zkVerifierAddress: string }[]
  >('RollupV1', 'zkVerifiers')
  return zkVerifiers.map((v) => ChainSpecificAddress(v.zkVerifierAddress))
}
