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
  FRONTRUNNING_RISK,
  OPERATOR,
  REASON_FOR_BEING_OTHER,
  RISK_VIEW,
  TECHNOLOGY_DATA_AVAILABILITY,
} from '../../common'
import { BADGES } from '../../common/badges'
import { PROGRAM_HASHES } from '../../common/programHashes'
import { getAltDaStage } from '../../common/stages/getAltDaStage'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import {
  generateDiscoveryDrivenContracts,
  generateDiscoveryDrivenPermissions,
} from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import { getSP1Verifiers } from '../../templates/opStack'

const discovery = new ProjectDiscovery('derivev3')

const VERIFIABLE_APP = EthereumAddress(
  '0xd330145C17fB6EF2a21ACf1275Ce683A305F58BB',
)

const submitterStallTimeout = discovery.getContractValue<number>(
  'VerifiableApp',
  'submitterStallTimeout',
)
const maxDaHeaderAge = discovery.getContractValue<number>(
  'VerifiableApp',
  'MAX_DA_HEADER_AGE',
)
const timelockDelay = discovery.getContractValue<number>(
  'DeriveTimelock',
  'getMinDelay',
)
const programVKey = discovery.getContractValue<string>(
  'VerifiableApp',
  'programVKey',
)

export const derivev3: ScalingProject = {
  type: 'layer2',
  id: ProjectId('derivev3'),
  capability: 'appchain',
  // The Celestia header and inclusion checks are claimed to run inside the zkVM program,
  // whose source is not public, so they do not count as a DA bridge.
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.NO_DA_ORACLE],
  addedAt: UnixTime(1791504000), // 2026-10-09T00:00:00Z
  badges: [BADGES.VM.AppChain, BADGES.DA.Celestia],
  display: {
    name: 'Derive V3',
    slug: 'derivev3',
    description:
      'Derive V3 is an options, perpetuals and spot exchange with offchain matching, whose margin and settlement logic runs in an SP1 zkVM program. Batches are proven to Ethereum and their data is posted to Celestia.',
    purposes: ['Exchange'],
    links: {
      websites: ['https://derive.xyz/'],
      bridges: ['https://app.derive.xyz/'],
      documentation: ['https://docs.derive.xyz/'],
      repositories: ['https://github.com/derivexyz'],
      socialMedia: [
        'https://x.com/derivexyz',
        'https://discord.gg/Derive',
        'https://t.me/Derive_Announcements',
      ],
    },
  },
  proofSystem: {
    type: 'Validity',
    zkCatalogIds: [ProjectId('sp1hypercube')],
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0x2e7dF4fAf35a1599979C7E764444e112d936ec42',
        ),
        tokens: '*',
      }),
    ],
    trackedTxs: [
      {
        uses: [
          { type: 'liveness', subtype: 'stateUpdates' },
          { type: 'l2costs', subtype: 'stateUpdates' },
          { type: 'liveness', subtype: 'proofSubmissions' },
          { type: 'l2costs', subtype: 'proofSubmissions' },
        ],
        query: {
          formula: 'functionCall',
          address: VERIFIABLE_APP,
          selector: '0xcaf85453',
          functionSignature:
            'function submitBatch(bytes32 oldRoot, bytes32 newRoot, uint128 oldPublicAccIndex, uint128 newPublicAccIndex, uint128 oldAdminAccIndex, uint128 newAdminAccIndex, (bytes32 oldPublic, bytes32 newPublic, bytes32 oldAdmin, bytes32 newAdmin) submittedAccs, bytes32 withdrawalDigest, uint64 minOpTimestamp, uint64 maxOpTimestamp, (uint64 prevHeight, bytes32 prevHash, uint64 newHeight, bytes32 newHash, bytes32 prevLastCommitment, bytes32 newLastCommitment, uint64 oldestHeaderTime) da, (uint8 source, uint64 nonceOrActionId, uint64 accountId, address asset, address recipient, uint128 amount)[] withdrawals, bytes proofBytes)',
          sinceTimestamp: UnixTime(1791311591), // first batch, block 26135150
        },
      },
    ],
  },
  dataAvailability: {
    layer: DA_LAYERS.CELESTIA,
    bridge: DA_BRIDGES.NONE,
    mode: DA_MODES.STATE_DIFFS,
  },
  riskView: {
    stateValidation: {
      ...RISK_VIEW.STATE_ZKP_SN,
      executionDelay: 0,
    },
    dataAvailability: {
      value: 'External',
      description: `Proof construction and state reconstruction rely on data posted to Celestia. Each proof commits to a Celestia header range chained from an anchor stored onchain and to a hash-chain of the batch's Celestia blobs; the oldest referenced Celestia block must be at most ${formatSeconds(maxDaHeaderAge)} old. The zkVM program that checks Celestia signatures and data inclusion is not public.`,
      sentiment: 'bad',
    },
    exitWindow: RISK_VIEW.EXIT_WINDOW(0, submitterStallTimeout),
    sequencerFailure: RISK_VIEW.SEQUENCER_FORCE_VIA_L1(submitterStallTimeout),
    proposerFailure: {
      value: 'Self propose',
      description: `If an L1 action stays unprocessed for ${formatSeconds(submitterStallTimeout)}, anyone can remove the batch submitter and submit batches. However, the zkVM program is not public, so no one other than the operator can currently produce valid proofs.`,
      sentiment: 'bad',
      orderHint: submitterStallTimeout,
    },
  },
  stage: getAltDaStage({
    stage0: {
      callsItselfValidiumOrOptimium: false,
      stateRootsPostedToL1: true,
      stateVerificationOnL1: true,
      daAttestedByIndependentParty: 'UnderReview',
      nodeSourceAvailable: false,
      fraudProofSystemAtLeast5Outsiders: null,
    },
    stage1: {
      principle: false,
      usersCanExitWithoutCooperation: false,
      usersHave7DaysToExit: false,
      securityCouncilProperlySetUp: false,
      daVerifierSecureOnL1: false,
      daVerifier7DayExitWindow: false,
      daCommitteeDecentralized: true,
      noRedTrustedSetups: true,
      proverSourcePublished: false,
      verifierContractsReproducible: true,
      programHashesReproducible: false,
    },
    stage2: {
      fraudProofSystemIsPermissionless: null,
      delayWith30DExitWindow: false,
      proofSystemOverriddenOnlyInCaseOfABug: false,
      daVerifier30DayExitWindow: false,
      daMechanismEconomicSecurity: false,
    },
  }),
  technology: {
    dataAvailability: {
      ...TECHNOLOGY_DATA_AVAILABILITY.CELESTIA_OFF_CHAIN(false),
      description: `Batch data is posted to Celestia as a chain of blobs in which every blob starts with the commitment of the previous one. The VerifiableApp stores the latest proven Celestia header and blob commitment, and each proof must chain from them to a newer Celestia block at most ${formatSeconds(maxDaHeaderAge)} old. The program is meant to prove the Celestia header transition and the inclusion of the batch's blobs, but its source is not public. The owner can re-point the stored Celestia anchor at any time.`,
      references: [
        {
          title: 'VerifiableApp - submitBatch and Celestia anchor',
          url: 'https://etherscan.io/address/0x3d35ca539242a2b5f7a08340f8b96006edeb91cb#code',
        },
      ],
    },
    operator: {
      ...OPERATOR.CENTRALIZED_OPERATOR,
      description:
        OPERATOR.CENTRALIZED_OPERATOR.description +
        ' Orders are matched offchain by a centralized engine, and only the designated batch submitter can submit batches unless it is removed through the stall timeout.',
      risks: [FRONTRUNNING_RISK],
    },
    forceTransactions: {
      name: 'Users can force withdrawals through L1',
      description: `Deposits and withdrawal requests submitted on L1 are appended to an onchain queue that each proven batch must consume in order. If the oldest queued action stays unprocessed for ${formatSeconds(submitterStallTimeout)}, anyone can remove the designated batch submitter and submit batches themselves. Since the zkVM program is not public, no third party can currently produce the proofs needed to do so.`,
      risks: [
        {
          category: 'Users can be censored if',
          text: 'the operator refuses to process their L1 withdrawal request, as no one else can currently generate valid proofs.',
        },
      ],
      references: [],
    },
    exitMechanisms: [
      {
        ...EXITS.REGULAR_WITHDRAWAL('zk'),
        risks: [
          {
            category: 'Funds can be frozen if',
            text: 'a single pauser or the guardian pauses the WithdrawalOutbox. Only the owner can unpause.',
          },
          {
            category: 'Withdrawals can be delayed if',
            text: 'they exceed the USD-denominated withdrawal rate limits, in which case they are queued until the limit refills.',
          },
        ],
      },
    ],
    otherConsiderations: [
      {
        name: 'Forwarded withdrawals',
        description:
          'Users can withdraw to a deterministic escrow deployed by the WithdrawFactory, from which keepers bridge the funds to another chain via LayerZero OFT or CCIP. Funds waiting in these escrows are not protected by the validity proofs.',
        risks: [
          {
            category: 'Funds can be stolen if',
            text: 'the WithdrawFactory owner moves funds out of a withdraw escrow, or sets a malicious bridge route.',
          },
        ],
        references: [
          {
            title: 'Derive docs - Transfers & Withdrawals',
            url: 'https://docs.derive.xyz/trading/transfers-withdrawals',
          },
        ],
      },
      {
        name: 'Prices are provided by an offchain oracle',
        description:
          'Margin, liquidation and option settlement use spot, forward, perpetual, volatility and rate feeds provided by Block Scholes. These feeds are consumed inside the zkVM program, whose source is not public.',
        risks: [
          {
            category: 'Funds can be lost if',
            text: 'the oracle reports incorrect prices.',
          },
        ],
        references: [
          {
            title: 'Derive docs - Oracles',
            url: 'https://docs.derive.xyz/oracles',
          },
        ],
      },
    ],
  },
  stateValidation: {
    description:
      'Each batch is proven with an SP1 validity proof that is verified onchain through the SP1VerifierGateway. The proof commits to the old and new state roots, the consumed L1 action queue, the withdrawals to pay out, and the Celestia data used for the batch.',
    categories: [
      {
        title: 'Validity proofs',
        description: `Margin, settlement, deposits and withdrawals are executed inside an SP1 zkVM program identified onchain by its verification key (${programVKey}). The program source is not public, so the verification key cannot be independently regenerated and what the program enforces cannot be verified.`,
        risks: [
          {
            category: 'Funds can be stolen if',
            text: 'the zkVM program does not enforce the protocol rules, as its source is not public.',
          },
          {
            category: 'Funds can be stolen if',
            text: 'the owner replaces the state root, the program verification key or the verifier.',
          },
          {
            category: 'Funds can be stolen if',
            text: 'the zkVM program does not check that admin actions, which anyone can queue on L1, come from an authorized sender.',
          },
        ],
        references: [
          {
            title: 'DIP: Launch Derive V3',
            url: 'https://forums.derive.xyz/t/dip-launch-derive-v3/322',
          },
        ],
      },
    ],
  },
  upgradesAndGovernance: {
    content: `All contracts are upgradeable and owned by a multisig with two members: a timelock with a ${formatSeconds(timelockDelay)} delay, whose transactions are proposed by the Derive Multisig, and the Derive Bypass Multisig, which can act without delay. The owner can replace the state root, the program verification key, the verifier and the trusted Celestia anchor, set the batch submitter and the stall timeout, register or re-point the vaults of assets, and move funds held in forwarded-withdrawal escrows. The Derive Guardian Multisig can refill the withdrawal rate limits and pause withdrawals, and each of a set of individual pausers can pause withdrawals as well.`,
  },
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
    programHashes: [PROGRAM_HASHES(programVKey)],
    zkVerifiers: getSP1Verifiers(discovery),
  },
  permissions: generateDiscoveryDrivenPermissions([discovery]),
  discoveryInfo: getDiscoveryInfo([discovery]),
  milestones: [
    {
      title: 'Derive V3 launch',
      url: 'https://x.com/DeriveXYZ/status/2108069298673758548',
      date: '2026-10-06T00:00:00Z',
      description:
        'Derive V2 balances and positions are migrated into Derive V3, which settles on Ethereum.',
      type: 'general',
    },
  ],
}
