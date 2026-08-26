import {
  assert,
  ChainSpecificAddress,
  EthereumAddress,
  formatSeconds,
  UnixTime,
} from '@l2beat/shared-pure'
import { formatEther } from 'ethers/lib/utils'
import { DERIVATION } from '../../common'
import { PROGRAM_HASHES } from '../../common/programHashes'
import { getRollupStage } from '../../common/stages/getRollupStage'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { HARDCODED } from '../../discovery/values/hardcoded'
import type { ScalingProject } from '../../internalTypes'
import {
  getOpStackCentralizedSequencingCommon,
  getOpStackDaTracking,
  getSP1Verifiers,
  opStackL2,
} from '../../templates/opStack'

const discovery = new ProjectDiscovery('base')
const genesisTimestamp = UnixTime(1686074603)
const chainId = 8453
const l2BlockTimeSeconds = HARDCODED.BASE.L2_BLOCK_TIME_SECONDS
const flashblockIntervalMilliseconds =
  HARDCODED.BASE.FLASHBLOCK_INTERVAL_MILLISECONDS
const sequencingWindowBlocks = HARDCODED.BASE.SEQUENCING_WINDOW_BLOCKS
const sequencingWindowSeconds = HARDCODED.BASE.SEQUENCING_WINDOW_SECONDS
const maxDepositCalldataBytes = HARDCODED.BASE.MAX_DEPOSIT_CALLDATA_BYTES
const proofMaturityDelaySeconds = discovery.getContractValue<number>(
  'OptimismPortal2',
  'proofMaturityDelaySeconds',
)
const disputeGameFinalityDelaySeconds = discovery.getContractValue<number>(
  'OptimismPortal2',
  'disputeGameFinalityDelaySeconds',
)
const respectedGameType = discovery.getContractValue<number>(
  'OptimismPortal2',
  'respectedGameType',
)
assert(
  respectedGameType === 621,
  'Update Base exit economics for the new respected game type',
)
const aggregateVerifierSlowFinalizationDelaySeconds =
  discovery.getContractValue<number>(
    'AggregateVerifier',
    'SLOW_FINALIZATION_DELAY',
  )
const aggregateVerifierBlockInterval = discovery.getContractValue<number>(
  'AggregateVerifier',
  'BLOCK_INTERVAL',
)
const aggregateVerifierCheckpointIntervalSeconds =
  aggregateVerifierBlockInterval * l2BlockTimeSeconds
const aggregateVerifierInitialBond = discovery.getContractValue<string>(
  'DisputeGameFactory',
  `initBondGame${respectedGameType}`,
)
const aggregateVerifierInitialBondEther = Number(
  formatEther(aggregateVerifierInitialBond),
)
const aggregateVerifierFinalizationDelaySeconds =
  aggregateVerifierSlowFinalizationDelaySeconds +
  disputeGameFinalityDelaySeconds
const stateFinalizationDelaySeconds = Math.max(
  proofMaturityDelaySeconds,
  aggregateVerifierFinalizationDelaySeconds,
)
const worstCaseExitDelaySeconds =
  sequencingWindowSeconds +
  aggregateVerifierCheckpointIntervalSeconds +
  stateFinalizationDelaySeconds

const securityCouncilStats = discovery.getMultisigStats('Base Security Council')
const coordinatorStats = discovery.getMultisigStats('Base Coordinator Multisig')
const governanceStats = discovery.getMultisigStats('Base Governance Multisig')
const incidentResponderStats = discovery.getMultisigStats('Base Multisig 1')

const securityCouncilThreshold = discovery.getContractValue<number>(
  'Base Security Council',
  '$threshold',
)
const securityCouncilSize = discovery.getContractValue<string[]>(
  'Base Security Council',
  '$members',
).length
// the Security Council sits in a 2/2 alongside the Coinbase-controlled
// Coordinator Multisig, so an upgrade needs the Council threshold + Coinbase
const upgradeApprovingEntities = securityCouncilSize + 1
const upgradeRequiredApprovals = securityCouncilThreshold + 1
const upgradeQuorumPercent = Math.round(
  (upgradeRequiredApprovals / upgradeApprovingEntities) * 100,
)
const councilOnlyPercent = (
  (securityCouncilThreshold / securityCouncilSize) *
  100
).toFixed(1)
const pauseExpiry = formatSeconds(
  discovery.getContractValue<number>('SuperchainConfig', 'pauseExpiry'),
)

export const base: ScalingProject = opStackL2({
  addedAt: UnixTime(1689206400), // 2023-07-13T00:00:00Z
  discovery,
  genesisTimestamp,
  display: {
    name: 'Base Chain',
    aliases: ['Coinbase'],
    slug: 'base',
    stateValidationImage: 'aggverifier',
    stacks: ['OP Stack'],
    description:
      'Base is an Optimistic Rollup built with the OP Stack. It offers a low-cost and builder-friendly way for anyone, anywhere, to build onchain.',
    links: {
      websites: ['https://base.org/'],
      bridges: ['https://superbridge.app/base'],
      documentation: ['https://docs.base.org/', 'https://docs.optimism.io/'],
      explorers: [
        'https://basescan.org/',
        'https://basedscan.io/',
        'https://base.blockscout.com/',
      ],
      repositories: ['https://github.com/base'],
      socialMedia: [
        'https://twitter.com/BuildOnBase',
        'https://discord.com/invite/buildonbase',
        'https://base.mirror.xyz/',
        'https://farcaster.xyz/base',
        'https://reddit.com/r/BASE/',
      ],
      other: [
        'https://rollup.codes/base',
        'https://growthepie.com/chains/base',
      ],
    },
  },
  interopConfig: {
    name: 'Base Canonical',
    durationSplit: {
      lockAndMint: [
        {
          label: 'L1 -> L2',
          transferTypes: [
            'opstack.L1ToL2Transfer',
            'opstack-standardbridge.L1ToL2Transfer',
            'beefy-bridge.L1ToL2Transfer',
            'maker-bridge.L1ToL2Transfer',
            'sorare-base.L1ToL2Transfer',
            'lido-wsteth.L1ToL2Transfer',
            'sky-bridge.L1ToL2Transfer',
          ],
        },
        {
          label: 'L2 -> L1',
          transferTypes: [
            'opstack.L2ToL1Transfer',
            'opstack-standardbridge.L2ToL1Transfer',
            'maker-bridge.L2ToL1Transfer',
            'lido-wsteth.L2ToL1Transfer',
            'sky-bridge.L2ToL1Transfer',
          ],
        },
      ],
    },
    plugins: [
      {
        chain: 'base',
        plugin: 'opstack',
        bridgeType: 'lockAndMint',
      },
      {
        chain: 'base',
        plugin: 'opstack-standardbridge',
        bridgeType: 'lockAndMint',
      },
      {
        chain: 'base',
        plugin: 'beefy-bridge',
        bridgeType: 'lockAndMint',
      },
      {
        chain: 'base',
        plugin: 'maker-bridge',
        bridgeType: 'lockAndMint',
      },
      {
        chain: 'base',
        plugin: 'sorare-base',
        bridgeType: 'lockAndMint',
      },
      {
        chain: 'base',
        plugin: 'lido-wsteth',
        bridgeType: 'lockAndMint',
      },
      {
        chain: 'base',
        plugin: 'sky-bridge',
        bridgeType: 'lockAndMint',
      },
    ],
    type: 'canonical',
  },
  nonTemplateExcludedTokens: ['SolvBTC', 'SolvBTC.BBN', 'rsETH'], // TODO: check
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: ChainSpecificAddress(
        'eth:0x9de443AdC5A411E83F1878Ef24C3F52C61571e72',
      ),
      tokens: ['wstETH'],
      description:
        'wstETH Vault for custom wstETH Gateway. Fully controlled by Lido governance.',
    }),
  ],
  activityConfig: {
    type: 'block',
    startBlock: 1,
    adjustCount: { type: 'SubtractOneSinceBlock', blockNumber: 1 },
  },
  daTracking: [
    getOpStackDaTracking(discovery, {
      sinceBlock: 0, // Edge Case: config added @ DA Module start
    }),
  ],
  nonTemplateTrackedTxs: [
    {
      uses: [
        { type: 'liveness', subtype: 'batchSubmissions' },
        { type: 'l2costs', subtype: 'batchSubmissions' },
      ],
      query: {
        formula: 'transfer',
        from: ChainSpecificAddress.address(
          discovery.getContractValue<ChainSpecificAddress>(
            'SystemConfig',
            'batcherHash',
          ),
        ),
        to: ChainSpecificAddress.address(
          discovery.getContractValue<ChainSpecificAddress>(
            'SystemConfig',
            'sequencerInbox',
          ),
        ),
        sinceTimestamp: genesisTimestamp,
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'stateUpdates' },
        { type: 'l2costs', subtype: 'stateUpdates' },
      ],
      query: {
        formula: 'functionCall',
        address: EthereumAddress('0x56315b90c40730925ec5485cf004d835058518A0'),
        selector: '0x9aaab648',
        functionSignature:
          'function proposeL2Output(bytes32 _outputRoot, uint256 _l2BlockNumber, bytes32 _l1Blockhash, uint256 _l1BlockNumber)',
        sinceTimestamp: UnixTime(1686793895), // before proofs
        untilTimestamp: UnixTime(1730303471),
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'stateUpdates' },
        { type: 'l2costs', subtype: 'stateUpdates' },
      ],
      query: {
        formula: 'functionCall',
        address: ChainSpecificAddress.address(
          discovery.getContract('DisputeGameFactory').address,
        ),
        selector: '0x82ecf2f6',
        functionSignature:
          'function create(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) payable returns (address proxy_)',
        sinceTimestamp: UnixTime(1730303471), // after proofs
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'stateUpdates' },
        { type: 'l2costs', subtype: 'stateUpdates' },
      ],
      query: {
        formula: 'functionCall',
        address: ChainSpecificAddress.address(
          discovery.getContract('DisputeGameFactory').address,
        ),
        selector: '0x1011f377',
        functionSignature:
          'function createWithInitData(uint32 _gameType, bytes32 _rootClaim, bytes _extraData, bytes _initData) payable returns (address proxy_)',
        sinceTimestamp: UnixTime(1779825599), // Azul AggregateVerifier activation
      },
    },
  ],

  isNodeAvailable: true,
  chainConfig: {
    name: 'base',
    chainId,
    explorerUrl: 'https://basescan.org',
    // ~ Timestamp of block number 0 on Base
    // https://basescan.org/block/0
    sinceTimestamp: UnixTime.fromDate(new Date('2023-06-15T12:35:47Z')),
    gasTokens: ['ETH'],
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 5022,
        version: '3',
      },
    ],
    coingeckoPlatform: 'base',
    apis: [
      {
        type: 'rpc',
        url: 'https://developer-access-mainnet.base.org',
        callsPerMinute: 300,
      },
      { type: 'etherscan', chainId },
      { type: 'blockscoutV2', url: 'https://base.blockscout.com/api/v2' },
    ],
  },
  stateDerivation: DERIVATION.OPSTACK('BASE'),
  nonTemplateTechnology: {
    sequencing: {
      name: 'Transactions are ordered by a centralized sequencer',
      description:
        'Base uses a single centralized sequencer for fast confirmations. Users can bypass it with one Ethereum transaction to the OptimismPortal. Base nodes derive the deposited transaction from Ethereum, including it after at most one sequencing window.',
      sequencingSpec: {
        type: 'centralized',
        ...getOpStackCentralizedSequencingCommon({
          discovery,
          l2BlockTimeSeconds,
          flashblockIntervalMilliseconds,
          sequencingWindowSeconds,
          sequencingWindowBlocks,
          maxDepositCalldataBytes,
          trustedPreconfirmationDescription: `The centralized builder streams cumulative Flashblock preconfirmations about every ${flashblockIntervalMilliseconds} ms while sealing regular L2 blocks every ${l2BlockTimeSeconds} seconds. Flashblocks are out of protocol: the promise has no protocol enforcement or slashing, and a preconfirmation can be absent or reorged.`,
          sequencer: {
            value: 'Centralized',
            secondLine: '5-instance Raft HA',
            sentiment: 'bad',
            description:
              'The Base operator controls real-time ordering. They document five sequencer instances coordinated by op-conductor using Raft leader election, with only the leader producing blocks. The replicas improve availability but do not create independent operators or censorship resistance.',
            orderHint: 1,
          },
        }),
        exitDelay: {
          value: formatSeconds(worstCaseExitDelaySeconds, {
            fullUnit: true,
          }),
          secondLine: `${formatSeconds(sequencingWindowSeconds)} inclusion + ${formatSeconds(aggregateVerifierCheckpointIntervalSeconds)} + ${formatSeconds(stateFinalizationDelaySeconds)} state`,
          description: `After successful L2 inclusion (forced or sequencer), a permissionless ZK proof is needed to finalize the state and exit on L1. Without the centralized TEE proof, the game waits ${formatSeconds(aggregateVerifierSlowFinalizationDelaySeconds, { fullUnit: true })}, followed by the currently ${formatSeconds(disputeGameFinalityDelaySeconds, { fullUnit: true })} finality air gap. The ${formatSeconds(proofMaturityDelaySeconds, { fullUnit: true })} withdrawal-proof maturity period runs concurrently.`,
          orderHint: worstCaseExitDelaySeconds,
        },
        exitEconomics: {
          value: `${aggregateVerifierInitialBondEther.toLocaleString('en-US')} ETH`,
          secondLine: 'ZK proof required',
          description: `Self-proposing the state needed for an exit requires a valid ZK proof and a ${aggregateVerifierInitialBondEther.toLocaleString('en-US')} ETH bond for one ${aggregateVerifierBlockInterval.toLocaleString('en-US')}-block checkpoint.`,
        },
      },
      censorshipResistance:
        'The centralized sequencer provides no real-time censorship resistance. The Ethereum deposit path provides eventual censorship resistance, assuming the deposit is included on Ethereum.',
      references: [
        {
          title: 'Base documentation - Flashblocks',
          url: 'https://docs.base.org/base-chain/flashblocks/faq',
        },
        {
          title: 'Base engineering - Sequencer architecture',
          url: 'https://blog.base.dev/flashblocks-deep-dive',
        },
        {
          title: 'Base source code - Mainnet chain configuration',
          url: 'https://github.com/base/base/blob/5761d838af8ae52e4904a74af2f3d8b490f56fec/crates/common/chains/src/config.rs#L402-L409',
        },
        {
          title: 'Base Beryl - Reduced withdrawal delay',
          url: 'https://blog.base.dev/introducing-base-beryl',
        },
        {
          title: 'OptimismPortal2 - source code',
          url: 'https://etherscan.io/address/0x66d94eE8F529b683ED6013729784e8bb44697A64#code',
        },
        {
          title: 'AggregateVerifier - source code',
          url: 'https://etherscan.io/address/0xeE303bA054c5F1E14A8EF87f1C7E285af45A1ba2#code',
        },
      ],
      risks: [],
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
        fraudProofSystemAtLeast5Outsiders: true,
      },
      stage1: {
        principle: true,
        usersHave7DaysToExit: true,
        usersCanExitWithoutCooperation: true,
        securityCouncilProperlySetUp: true,
        noRedTrustedSetups: true,
        programHashesReproducible: true,
        proverSourcePublished: true,
        verifierContractsReproducible: true,
      },
      stage2: {
        proofSystemOverriddenOnlyInCaseOfABug: false,
        fraudProofSystemIsPermissionless: true,
        delayWith30DExitWindow: false,
      },
    },
    {
      rollupNodeLink: 'https://github.com/base-org/node',
      proverSourceLink: 'https://github.com/succinctlabs/op-succinct',
    },
  ),
  milestones: [
    {
      title: 'Base Azul: multi-proof',
      url: 'https://blog.base.dev/introducing-base-azul',
      date: '2026-05-26T00:00:00Z',
      description:
        'Base activates the multiproof system combining TEE attestations and SP1 ZK proofs.',
      type: 'general',
    },
    {
      title: 'Base leaves the Superchain',
      url: 'https://blog.base.dev/next-chapter-for-base-chain-1',
      date: '2026-03-04T00:00:00Z',
      description:
        'Base decouples from Optimism Superchain governance with its own upgrade path.',
      type: 'general',
    },
    {
      title: 'Base halts block production for 33mins',
      url: 'https://status.base.org/incidents/kdq3t8s13gfs',
      date: '2025-08-05T00:00:00Z',
      type: 'incident',
    },
    {
      title: 'Base achieves Stage 1',
      url: 'https://base.mirror.xyz/tWDMlGp48fF0MeADcLQruUBq1Qxkou4O5x3ax8Rm3jA',
      date: '2025-04-29T00:00:00Z',
      description:
        'Through an upgrade in their governance process and a Security Council, Base is now stage 1.',
      type: 'general',
    },
    {
      title: 'Fault proofs!',
      url: 'https://base.mirror.xyz/eOsedW4tm8MU5OhdGK107A9wsn-aU7MAb8f3edgX5Tk',
      date: '2024-10-30T00:00:00Z',
      description: 'Base upgrades to OP stack fault proofs for state proving.',
      type: 'general',
    },
    {
      title: 'Chain stall',
      url: 'https://status.base.org/incidents/n3q0q4z24b7h',
      date: '2023-09-05T00:00:00Z',
      description:
        'Due to an RPC issue, the sequencer stops producing blocks for ~30 minutes.',
      type: 'incident',
    },
    {
      title: 'Base starts using blobs',
      url: 'https://twitter.com/Optimism/status/1768235284494450922',
      date: '2024-03-14T00:00:00Z',
      description: 'Base starts publishing data to blobs.',
      type: 'general',
    },
    {
      title: 'Mainnet Launch',
      url: 'https://base.mirror.xyz/hwNwqXHVoLlO8s4DZppog4DfGvM34tigaDjOWuEJQfY',
      date: '2023-07-13T00:00:00.00Z',
      description: 'Base is live on mainnet.',
      type: 'general',
    },
  ],
  upgradesAndGovernance: {
    content:
      'All contracts are upgradable by a `ProxyAdmin` contract controlled by a nested 2/2 `Base Governance Multisig` composed of the `Base Coordinator Multisig` and the `Base Security Council`. Upgrades require approval from both parties. There is no delay on upgrades. The Guardian role for the SuperchainConfig is assigned to the Base Governance Multisig, which can pause and unpause withdrawals. `Base Multisig 1` serves as Incident Responder and can pause withdrawals but cannot unpause or extend pauses. Each pause automatically expires after 3 months if not extended by the Guardian. The single Sequencer actor can be modified by `Base Multisig 1` via the SystemConfig contract. The Base Governance multisig can also recover dispute bonds in case of bugs that would distribute them incorrectly.\n\nState validation runs through the `AggregateVerifier` game type (621), which accepts either an AWS Nitro TEE attestation or an SP1 ZK proof. The TEE prover allowlist in the `TEEProverRegistry` is managed solely by the `Base Coordinator Multisig` (without Base Security Council approval), and a separate Manager EOA can register or deregister enclave signers. The ZK arm routes through a Base-owned SP1 verifier gateway; the Base Governance Multisig can add or freeze verifier routes. The Base Governance Multisig can swap the AggregateVerifier implementation, change the respected game type, blacklist individual games, or retire all in-flight games via the AnchorStateRegistry.',
    governanceInfo: {
      securityCouncil: {
        Composition: `**${securityCouncilStats}**, nested as one of two signers in the ${governanceStats} \`Base Governance Multisig\` alongside Coinbase's ${coordinatorStats} \`Base Coordinator Multisig\`. Base counts this as ${upgradeRequiredApprovals} of ${upgradeApprovingEntities} entities, or ${upgradeQuorumPercent}%; the Council Safe on its own is ${councilOnlyPercent}%. Members serve staggered cohort terms and are appointed against published criteria, not elected.`,
        'Members public': `**Mapped (${securityCouncilSize - 1} of ${securityCouncilSize})** — [Base publishes](https://docs.base.org/base-chain/security/security-council) Aerodrome (JP), Moonwell (BR), Blackbird (US), ChainSafe (CA), Talent Protocol (PT) and Moshicam (US) as entities, plus Seneca (US), Juan Suarez (US), Toady Hawk (CA), Roberto Bayardo (US) and Yele Bademosi (UK) as individuals. One address is unpublished, as are the people who sign for each entity. Five of the six entities are Base-ecosystem projects and two of the individuals are former Coinbase or Base contributors.`,
        Charter: `**None** — the [docs page](https://docs.base.org/base-chain/security/security-council) sets out selection criteria, cohort terms and member duties, but no removal procedure, quorum-loss fallback or conflict-of-interest enforcement. Coinbase's [Neutrality Principles](https://www.coinbase.com/blog/coinbases-neutrality-principles-for-base) cover transaction ordering, user assets and exit rights, and do not bind the Council.`,
        'Can Coinbase bypass the Council?': `**Not for upgrades** — every \`ProxyAdmin\` action needs the ${governanceStats}. Elsewhere Coinbase acts alone: the ${incidentResponderStats} \`Base Multisig 1\` owns \`SystemConfig\` (sequencer, gas configuration) and is Incident Responder, and the Coordinator Multisig owns \`TEEProverRegistry\` and \`NitroEnclaveVerifier\`, so it can change the TEE prover allowlist, one of the two proof arms, without the Council.`,
        'Who can override the Council?': `**Nobody — it administers itself.** Seats are changed by the Council Safe calling itself, so ${securityCouncilThreshold} of the ${securityCouncilSize} sitting members decide who joins or leaves. There is no token, DAO or veto body. The ${governanceStats} blocks both ways: neither side can upgrade alone. Below ${securityCouncilThreshold} available signers upgrades stall, and there is no liveness module handing control to a fallback.`,
      },
      upgrades: {
        'Normal upgrade path': `Task published in [base/contract-deployments](https://github.com/base/contract-deployments) → **${securityCouncilStats} Security Council approval** → **${coordinatorStats} Coordinator Multisig approval** → execution through the ${governanceStats} \`Base Governance Multisig\`. No timelock, and no Safe carries a delay module. Beryl verifier-hash update, June 2026: Council approved 22 Jun, Coinbase 23 Jun, executed 43 minutes later.`,
        'Emergency upgrade path': `**None** — the normal path executes as soon as both Safes sign, so there is no lower emergency threshold. The fastest lever is a pause: the ${incidentResponderStats} \`Base Multisig 1\` can pause withdrawals alone as Incident Responder, but only once per identifier, since the pause expires after ${pauseExpiry} and it cannot pause again until the Guardian unpauses. The Guardian is the ${governanceStats} \`Base Governance Multisig\` itself, which can also blacklist dispute games, set the respected game type and retire all in-flight games.`,
        'Exit window':
          '**None** — nothing separates the second signature from the upgrade taking effect, so users cannot withdraw ahead of an unwanted change. Tasks are published before signing and Base targets six hard forks a year, but neither is enforced onchain.',
      },
      tokenGovernance: {
        'Governance token':
          '**None** — Base has no token, so no token-weighted vote enters the upgrade path. Coinbase has said it is exploring one.',
        'Voting venue':
          '**None** — no DAO, governor contract, Snapshot space or forum vote gates an upgrade. Coordination happens in [base/contract-deployments](https://github.com/base/contract-deployments).',
        'Proposal rights':
          '**Coinbase only** — upgrade tasks are Coinbase-authored, and no route exists for a third party to put an upgrade to the Council.',
        'Execution model':
          '**Two Safes sign, a facilitator executes.** No permissionless `execute()`, and no delay for the public to act inside.',
      },
    },
  },
  nonTemplateContractRisks: {
    category: 'Funds can be stolen if',
    text: 'a contract receives a malicious code upgrade. Upgrades must be approved by 2 parties: the Base Coordinator Multisig and the Base Security Council. There is no delay on upgrades.',
  },
  nonTemplateRiskView: {
    exitWindow: {
      value: 'None',
      description:
        'There is no window for users to exit in case of an unwanted upgrade since contracts are instantly upgradable. Upgrades need to be approved by 2 parties: the Base Coordinator Multisig and the Base Security Council.',
      sentiment: 'bad',
      orderHint: 0, // 0-7 days
    },
  },
  nonTemplateZkVerifiers: getBaseVerifiers(),
  nonTemplateProgramHashes: getBaseProgramHashes().map((el) =>
    PROGRAM_HASHES(el),
  ),
})

function getBaseProgramHashes(): string[] {
  const result = []
  result.push(
    discovery.getContractValue<string>(
      'AggregateVerifier',
      'ZK_AGGREGATE_HASH',
    ),
  )
  result.push(
    discovery.getContractValue<string>('AggregateVerifier', 'ZK_RANGE_HASH'),
  )
  // risc0 set verifier program
  result.push(
    discovery.getContractValue<string[]>('RiscZeroSetVerifier', 'imageInfo')[0],
  )
  // TEE image hash
  result.push(
    discovery.getContractValue<string>(
      'TEEProverRegistry',
      'getExpectedImageHash',
    ),
  )
  // TEE verification programs
  const zkConfigRiscZero = discovery.getContractValue<{
    verifierId: string
    aggregatorId: string
    zkVerifier: string
  }>('NitroEnclaveVerifier', 'zkConfigRiscZero')
  const zkConfigSuccinct = discovery.getContractValue<{
    verifierId: string
    aggregatorId: string
    zkVerifier: string
  }>('NitroEnclaveVerifier', 'zkConfigSuccinct')
  result.push(zkConfigRiscZero.aggregatorId)
  result.push(zkConfigRiscZero.verifierId)
  result.push(zkConfigSuccinct.aggregatorId)
  result.push(zkConfigSuccinct.verifierId)
  return result.filter(
    (h) =>
      h !==
      '0x0000000000000000000000000000000000000000000000000000000000000000',
  )
}

function getBaseVerifiers(): ChainSpecificAddress[] {
  const sp1Verifiers = getSP1Verifiers(discovery)
  const router = discovery.getContract('RiscZeroVerifierRouter')
  const wrappers = Object.entries(router.values ?? {})
    .filter(([key]) => key.startsWith('verifier_'))
    .map(([, value]) => value as ChainSpecificAddress)

  // get all risc zero verifiers via verifier_... on the router
  const riscZeroVerifiers = wrappers
    .map((wrapper) =>
      discovery.getContractValue<ChainSpecificAddress>(wrapper, 'verifier'),
    )
    .filter(
      // RiscZeroSetVerifier is not actually a verifier, it redirects zk verification to other contracts
      (verifier) =>
        discovery.getContract(verifier).name === 'RiscZeroGroth16Verifier',
    )

  return [...sp1Verifiers, ...riscZeroVerifiers]
}
